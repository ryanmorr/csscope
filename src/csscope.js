const newLinesRe = /(\r\n|\r|\n)+/g;
const tabRe = /\t/g;
const extraSpacesRe = /\s{2,}/g;
const commentsRe = /\/\*[\W\w]*?\*\//g;
const trailingSeparatorSpacesRe = /\s*([:;{}])\s*/g;
const unnecessarySeparatorsRe = /\};+/g;
const trailingSeparatorsRe = /([^:;{}])}/g;

const cssRe = /([^{};]*)([;{}])/g;
const nameRe = /^(?:\\.|[\w\-\u00c0-\uFFFF])+/;
const pseudoRe = /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]?)((?:\([^)]+\)|[^()]*)+)\2\))?/;
const atttributeRe = /^\[((?:\\.|[\w\u00c0-\uFFFF-])+)\s*(?:(\S?=)\s*(?:(['"])([^]*?)\3|(#?(?:\\.|[\w\u00c0-\uFFFF-])*)|)|)\s*(i)?\]/;

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
    let index = 0;
    let hasWhitespace = false;
    let hasInsertedAttribute = false;
    const attribute = '[' + attributeName + ']';

    function incrementIndex(size) {
        index += size;
    }

    function insertAttributeAt(i) {
        selector = selector.slice(0, i) + attribute + selector.slice(i);
        incrementIndex(attribute.length);
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

    while (index < selector.length) {
        const char = selector.charAt(index);
        if (isWhitespace(char)) {
            hasWhitespace = true;
            skipWhitespace();
        } else if (char === '>' || char === '~' || char === '+') {
            if (!hasInsertedAttribute) {
                if (hasWhitespace) {
                    insertAttributeAt(index - 1);
                } else {
                    insertAttributeAt(index);
                }
            }
            incrementIndex(1);
            hasInsertedAttribute = false;
            hasWhitespace = false;
            skipWhitespace();
        } else if (char === ',') {
            if (!hasInsertedAttribute) {
                insertAttributeAt(index);
            }
            hasInsertedAttribute = false;
            hasWhitespace = false;
            skipWhitespace();
        } else {
            if (hasWhitespace) {
                if (!hasInsertedAttribute) {
                    insertAttributeAt(index - 1);
                }
                hasWhitespace = false;
            }
            if (char === '*') {
                incrementIndex(1);
            } else if (char === '#') {
                incrementIndex(1);
                skipPattern(nameRe);
            } else if (char === '.') {
                incrementIndex(1);
                skipPattern(nameRe);
            } else if (char === '[') {
                if (!hasInsertedAttribute) {
                    insertAttributeAt(index);
                    hasInsertedAttribute = true;
                }
                skipPattern(atttributeRe);
            } else if (char === ':') {
                if (!hasInsertedAttribute) {
                    insertAttributeAt(index);
                    hasInsertedAttribute = true;
                }
                if(selector.charAt(1) === ':'){
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
    if (!hasInsertedAttribute) {
        selector += attribute;
    }
    return selector;
}

export default function csscope(attr, css) {
    css = cleanCSS(css);
    let styles = '';
    cssRe.lastIndex = 0;
    for (let m; (m = cssRe.exec(css)) != null;) {
        if (m[2] == '{') {
            let rule = m[1];
            if (rule.charAt(0) === '@') {
                styles += rule;
            } else {
                styles += injectAttributeSelector(rule.trim(), attr);
            }
            styles += '{\n';
        } else if (m[2] == '}') {
            styles += '}\n';
        } else if (m[2] == ';') {
            styles += m[1] + ';\n';
        }
    }
    return styles;
}
