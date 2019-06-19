import { expect } from 'chai';
import csscope from '../src/csscope';

function normalizeWhitespace(str) {
    return str.trim()
        .replace(/(\r\n|\r|\n)+/g, ' ')
        .replace(/\t/g, ' ')
        .replace(/\s{2,}/g, ' ');
}

export default function expectCSS(css, expected) {
    expect(normalizeWhitespace(csscope('data-css-foo', css))).to.equal(normalizeWhitespace(expected));
}
