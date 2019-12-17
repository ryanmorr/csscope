const NEW_LINES_RE = /(\r\n|\r|\n)+/g;
const TAB_RE = /\t/g;
const EXTRA_SPACES_RE = /\s{2,}/g;
const COMMENTS_RE = /\/\*[\W\w]*?\*\//g;
const TRAILING_SEPARATOR_SPACES_RE = /\s*([:;{}])\s*/g;
const UNNECESSARY_SEPARATOR_RE = /\};+/g;
const TRAILING_SEPARATOR_RE = /([^:;{}])}/g;

const CSS_RE = /([^{};]*)([;{}])/g;
const NAME_RE = /^(?:\\.|[\w\-\u00c0-\uFFFF])+/;
const PSEUDO_RE = /^:((?:\\.|[\w\u00c0-\uFFFF-])+)(?:\((['"]?)((?:\([^)]+\)|[^()]*)+)\2\))?/;
const ATTRIBUTE_RE = /^\[((?:\\.|[\w\u00c0-\uFFFF-])+)\s*(?:(\S?=)\s*(?:(['"])([^]*?)\3|(#?(?:\\.|[\w\u00c0-\uFFFF-])*)|)|)\s*(i)?\]/;
const KEYFRAME_NAME_RE = /@keyframes\s*((?:\\.|[\w\-\u00c0-\uFFFF])+)/ig;
const ANIMATION_DECLARATION_RE = /^(animation(?:-name)?)\s*:\s*(.*)$/;

function cleanCSS(css) {
    return css
        .replace(NEW_LINES_RE, ' ')
        .replace(TAB_RE, ' ')
        .replace(EXTRA_SPACES_RE, ' ')
        .replace(COMMENTS_RE, '')
        .trim()
        .replace(TRAILING_SEPARATOR_SPACES_RE, '$1')
        .replace(UNNECESSARY_SEPARATOR_RE, '}')
        .replace(TRAILING_SEPARATOR_RE, '$1;}');
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
                skipPattern(NAME_RE);
            } else if (char === '[') {
                if (shouldInsertAttribute()) {
                    insertAttributeAt(index);
                    hasInsertedAttribute = true;
                }
                skipPattern(ATTRIBUTE_RE);
            } else if (char === ':') {
                if (shouldInsertAttribute()) {
                    insertAttributeAt(index);
                    hasInsertedAttribute = true;
                }
                if (peek(0, 2) === '::') {
                    incrementIndex(2);
                    skipPattern(NAME_RE);
                } else {
                    skipPattern(PSEUDO_RE);
                }
            } else if (NAME_RE.test(selector.substring(index))) {
                skipPattern(NAME_RE);
            }
        }
    }
    if (shouldInsertAttribute()) {
        selector += attribute;
    }
    return selector;
}

function prefixKeyframes(css, prefix, keyframes) {
    return css.replace(KEYFRAME_NAME_RE, (all, name) => {
        keyframes.push(name);
        return '@keyframes ' + prefix + '-' + name;
    });
}

function prefixAnimationName(declaration, prefix, keyframes) {
    const parts = declaration.match(ANIMATION_DECLARATION_RE);
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
    CSS_RE.lastIndex = 0;
    for (let m; (m = CSS_RE.exec(css)) != null;) {
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
