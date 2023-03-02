import { expect } from 'chai';
import csscope from '../src/csscope.js';

function normalizeWhitespace(str) {
    return str.trim()
        .replace(/(\r\n|\r|\n)+/g, ' ')
        .replace(/\t/g, ' ')
        .replace(/\s{2,}/g, ' ');
}

export default function expectCSS(attr, css, expected) {
    expect(normalizeWhitespace(csscope(attr, css))).to.equal(normalizeWhitespace(expected));
}
