const newLinesRe = /(\r\n|\r|\n)+/g;
const tabRe = /\t/g;
const extraSpacesRe = /\s{2,}/g;
const commentsRe = /\/\*[\W\w]*?\*\//g;
const trailingSeparatorSpacesRe = /\s*([:;{}])\s*/g;
const unnecessarySeparatorsRe = /\};+/g;
const trailingSeparatorsRe = /([^:;{}])}/g;

const cssRe = /([^{};]*)([;{}])/g;
const nameRe = /^(?:\\.|[\w\-\u00c0-\uFFFF])+/;
const pseudoRe = /^:((?:\\.|[\w\u00c0-\uFFFF-])+)(?:\((['"]?)((?:\([^)]+\)|[^()]*)+)\2\))?/;
const atttributeRe = /^\[((?:\\.|[\w\u00c0-\uFFFF-])+)\s*(?:(\S?=)\s*(?:(['"])([^]*?)\3|(#?(?:\\.|[\w\u00c0-\uFFFF-])*)|)|)\s*(i)?\]/;
const keyframeNameRe = /@keyframes\s*((?:\\.|[\w\-\u00c0-\uFFFF])+)/ig;
const animationDeclarationRe = /^(animation(?:-name)?)\s*:\s*(.*)$/;

function cleanCSS(css) {
    return css
        .replace(newLinesRe, ' ')
        .replace(tabRe, ' ')
        .replace(extraSpacesRe, ' ')
        .replace(commentsRe, '')
        .trim()
        .replace(trailingSeparatorSpacesRe, '$1')
        .replace(unnecessarySeparatorsRe, '}')
        .replace(trailingSeparatorsRe, '$1;}');
}

function injectAttributeSelector(selector, attributeName) {
    const attribute = '[' + attributeName + ']';
    let index = 0, hasWhitespace = false, hasInsertedAttribute = false, hasDeepCombinator = false;

    function incrementIndex(size) {
        index += size;
    }

    function insertAttributeAt(i) {
        selector = selector.slice(0, i) + attribute + selector.slice(i);
        incrementIndex(attribute.length);
    }

    function peek(start, size) {
        start = index + start;
        return selector.substring(start, start + size);
    }

    function skipPattern(re) {
        const name = selector.substring(index).match(re)[0];
        incrementIndex(name.length);
    }

    function skipWhitespace() {
        let start = 1;
        while (isWhitespace(selector.charAt(index + start))) start++;
        incrementIndex(start);
    }

    function isWhitespace(c) {
        return c === ' ' || c === '\n' || c === '\t' || c === '\f' || c === '\r';
    }

    function shouldInsertAttribute() {
        return !hasInsertedAttribute && !hasDeepCombinator;
    }

    while (index < selector.length) {
        const char = selector.charAt(index);
        if (isWhitespace(char)) {
            hasWhitespace = true;
            skipWhitespace();
        } else if (char === '>' || char === '~' || char === '+') {
            if (shouldInsertAttribute()) {
                insertAttributeAt(hasWhitespace ? index - 1 : index);
            }
            if (peek(0, 3) === '>>>') {
                selector = selector.slice(0, (hasWhitespace ? index - 1 : index)) + (hasWhitespace ? '' : ' ') + selector.slice(index + 3);
                hasDeepCombinator = true;
            } else {
                incrementIndex(1);
            }
            hasInsertedAttribute = hasWhitespace = false;
            skipWhitespace();
        } else if (char === ',') {
            if (shouldInsertAttribute()) {
                insertAttributeAt(isWhitespace(peek(-1, 1)) ? index - 1 : index);
            }
            hasInsertedAttribute = hasDeepCombinator = hasWhitespace = false;
            skipWhitespace();
        } else {
            if (hasWhitespace) {
                if (shouldInsertAttribute()) {
                    insertAttributeAt(index - 1);
                }
                hasWhitespace = false;
            }
            if (char === '*') {
                incrementIndex(1);
            } else if (char === '#' || char === '.') {
                incrementIndex(1);
                skipPattern(nameRe);
            } else if (char === '[') {
                if (shouldInsertAttribute()) {
                    insertAttributeAt(index);
                    hasInsertedAttribute = true;
                }
                skipPattern(atttributeRe);
            } else if (char === ':') {
                if (shouldInsertAttribute()) {
                    insertAttributeAt(index);
                    hasInsertedAttribute = true;
                }
                if (peek(0, 2) === '::') {
                    incrementIndex(2);
                    skipPattern(nameRe);
                } else {
                    skipPattern(pseudoRe);
                }
            } else if (nameRe.test(selector.substring(index))) {
                skipPattern(nameRe);
            }
        }
    }
    if (shouldInsertAttribute()) {
        selector += attribute;
    }
    return selector;
}

function prefixKeyframes(css, prefix, keyframes) {
    return css.replace(keyframeNameRe, (all, name) => {
        keyframes.push(name);
        return '@keyframes ' + prefix + '-' + name;
    });
}

function prefixAnimationName(declaration, prefix, keyframes) {
    const parts = declaration.match(animationDeclarationRe);
    const prop = parts[1];
    const animation = parts[2];
    const animations = animation.split(',');
    for (let i = 0, len = animations.length; i < len; i++) {
        const animationParts = animations[i].trim().split(' ');
        const animationName = animationParts[0];
        if (keyframes.includes(animationName)) {
            animationParts[0] = prefix + '-' + animationName;
        }
        animations[i] = animationParts.join(' ');
    }
    return prop + ':' + animations.join(',');
}

export default function csscope(id, css) {
    const keyframes = [];
    css = prefixKeyframes(cleanCSS(css), id, keyframes);
    let styles = '';
    let isKeyframe = false;
    let depth = 0;
    cssRe.lastIndex = 0;
    for (let m; (m = cssRe.exec(css)) != null;) {
        if (m[2] == '{') {
            let rule = m[1];
            if (isKeyframe) {
                depth++;
            }
            if (rule.charAt(0) === '@') {
                if (rule.startsWith('@keyframes')) {
                    isKeyframe = true;
                    depth++;
                }
                styles += rule;
            } else if (isKeyframe) {
                styles += rule;
            } else {
                styles += injectAttributeSelector(rule.trim(), id);
            }
            styles += '{\n';
        } else if (m[2] == '}') {
            styles += '}\n';
            if (isKeyframe) {
                depth--;
                if (depth === 0) {
                    isKeyframe = false;
                }
            }
        } else if (m[2] == ';') {
            const declaration = m[1];
            if (declaration.startsWith('animation') && keyframes.length > 0) {
                styles += prefixAnimationName(declaration, id, keyframes) + ';\n';
            } else {
                styles += declaration + ';\n';
            }
        }
    }
    return styles;
}
