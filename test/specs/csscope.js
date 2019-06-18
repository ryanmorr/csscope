import { expect } from 'chai';
import csscope from '../../src/csscope';

describe('csscope', () => {
    function normalizeWhitespace(str) {
        return str.trim()
            .replace(/(\r\n|\r|\n)+/g, ' ')
            .replace(/\t/g, ' ')
            .replace(/\s{2,}/g, ' ');
    }

    function expectCSS(css, expected) {
        expect(normalizeWhitespace(csscope('data-css-foo', css))).to.equal(normalizeWhitespace(expected));
    }

    it('should transform the universal selector', () => {
        expectCSS(`
            *{
                color:red;
            }
        `, `
            *[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform a tag selector', () => {
        expectCSS(`
            div{
                color:red;
            }
        `, `
            div[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform an ID selector', () => {
        expectCSS(`
            #foo{
                color:red;
            }
        `, `
            #foo[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform a class selector', () => {
        expectCSS(`
            .foo{
                color:red;
            }
        `, `
            .foo[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform a multiple class selector', () => {
        expectCSS(`
            .foo.bar.baz{
                color:red;
            }
        `, `
            .foo.bar.baz[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform [attr] attribute selector', () => {
        expectCSS(`
            [foo]{
                color:red;
            }
        `, `
            [data-css-foo][foo]{
                color:red;
            }
        `);
    });

    it('should transform [attr="value"] attribute selector', () => {
        expectCSS(`
            [foo="bar"]{
                color:red;
            }
        `, `
            [data-css-foo][foo="bar"]{
                color:red;
            }
        `);
    });

    it('should transform [attr~="value"] attribute selector', () => {
        expectCSS(`
            [foo~="bar"]{
                color:red;
            }
        `, `
            [data-css-foo][foo~="bar"]{
                color:red;
            }
        `);
    });

    it('should transform [attr|="value"] attribute selector', () => {
        expectCSS(`
            [foo|="bar"]{
                color:red;
            }
        `, `
            [data-css-foo][foo|="bar"]{
                color:red;
            }
        `);
    });

    it('should transform [attr^="value"] attribute selector', () => {
        expectCSS(`
            [foo^="bar"]{
                color:red;
            }
        `, `
            [data-css-foo][foo^="bar"]{
                color:red;
            }
        `);
    });

    it('should transform [attr$="value"] attribute selector', () => {
        expectCSS(`
            [foo$="bar"]{
                color:red;
            }
        `, `
            [data-css-foo][foo$="bar"]{
                color:red;
            }
        `);
    });

    it('should transform [attr*="value"] attribute selector', () => {
        expectCSS(`
            [foo*="bar"]{
                color:red;
            }
        `, `
            [data-css-foo][foo*="bar"]{
                color:red;
            }
        `);
    });

    it('should transform an unquoted attribute selector', () => {
        expectCSS(`
            [foo=bar]{
                color:red;
            }
        `, `
            [data-css-foo][foo=bar]{
                color:red;
            }
        `);
    });

    it('should transform a case-insensitive attribute selector', () => {
        expectCSS(`
            [foo="bar" i]{
                color:red;
            }
        `, `
            [data-css-foo][foo="bar" i]{
                color:red;
            }
        `);
    });

    it('should transform spaces in attribute selectors', () => {
        expectCSS(`
            [foo ~=  "bar"]{
                color:red;
            }
        `, `
            [data-css-foo][foo ~= "bar"]{
                color:red;
            }
        `);
    });

    it('should transform a multiple attribute selector', () => {
        expectCSS(`
            [foo][foo=bar][foo |= "bar"]{
                color:red;
            }
        `, `
            [data-css-foo][foo][foo=bar][foo |= "bar"]{
                color:red;
            }
        `);
    });

    it('should transform a pseudo-class selector', () => {
        expectCSS(`
            :empty{
                color:red;
            }
        `, `
            [data-css-foo]:empty{
                color:red;
            }
        `);
    });

    it('should transform a pseudo-class selector with a value', () => {
        expectCSS(`
            :nth-child(even){
                color:red;
            }
        `, `
            [data-css-foo]:nth-child(even){
                color:red;
            }
        `);
    });

    it('should transform a pseudo-class selector with a quoted value', () => {
        expectCSS(`
            :contains("foo"){
                color:red;
            }
        `, `
            [data-css-foo]:contains("foo"){
                color:red;
            }
        `);
    });

    it('should transform a pseudo-class selector with an embedded selector string', () => {
        expectCSS(`
            :not(div#foo.bar[attr = value]:empty){
                color:red;
            }
        `, `
            [data-css-foo]:not(div#foo.bar[attr = value]:empty){
                color:red;
            }
        `);
    });

    it('should transform a multiple pseudo-class selector', () => {
        expectCSS(`
            :empty:contains("foo"):not(:first){
                color:red;
            }
        `, `
            [data-css-foo]:empty:contains("foo"):not(:first){
                color:red;
            }
        `);
    });

    it('should transform a pseudo-element selector', () => {
        expectCSS(`
            ::before{
                color:red;
            }
        `, `
            [data-css-foo]::before{
                color:red;
            }
        `);
    });

    it('should transform a descendant combinator', () => {
        expectCSS(`
            div span em{
                color:red;
            }
        `, `
            div[data-css-foo] span[data-css-foo] em[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform a child combinator', () => {
        expectCSS(`
            div > span > em{
                color:red;
            }
        `, `
            div[data-css-foo] > span[data-css-foo] > em[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform an adjacent sibling combinator', () => {
        expectCSS(`
            div + span + em{
                color:red;
            }
        `, `
            div[data-css-foo] + span[data-css-foo] + em[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform a general sibling combinator', () => {
        expectCSS(`
            div ~ span ~ em{
                color:red;
            }
        `, `
            div[data-css-foo] ~ span[data-css-foo] ~ em[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform a deep combinator', () => {
        expectCSS(`
            div >>> em{
                color:red;
            }
        `, `
            div[data-css-foo] em{
                color:red;
            }
        `);

        expectCSS(`
            div span >>> em{
                color:red;
            }
        `, `
            div[data-css-foo] span[data-css-foo] em{
                color:red;
            }
        `);

        expectCSS(`
            div >>> em, a i{
                color:red;
            }
        `, `
            div[data-css-foo] em, a[data-css-foo] i[data-css-foo]{
                color:red;
            }
        `);

        expectCSS(`
            div >>> em a, p >>> a i{
                color:red;
            }
        `, `
            div[data-css-foo] em a, p[data-css-foo] a i{
                color:red;
            }
        `);
    });

    it('should transform combinators with no whitespace', () => {
        expectCSS(`
            div span>em+strong~i>>>p{
                color:red;
            }
        `, `
            div[data-css-foo] span[data-css-foo]>em[data-css-foo]+strong[data-css-foo]~i[data-css-foo] p{
                color:red;
            }
        `);
    });

    it('should transform selector groups', () => {
        expectCSS(`
            div, span, em{
                color:red;
            }
        `, `
            div[data-css-foo], span[data-css-foo], em[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform selector groups with no whitespace', () => {
        expectCSS(`
            div,span,em{
                color:red;
            }
        `, `
            div[data-css-foo],span[data-css-foo],em[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform multiple blocks', () => {
        expectCSS(`
            div{
                color:red;
            }
            span{
                color:blue;
            }
            em{
                color:green;
            }
        `, `
            div[data-css-foo]{
                color:red;
            }
            span[data-css-foo]{
                color:blue;
            }
            em[data-css-foo]{
                color:green;
            }
        `);
    });

    it('should remove comments', () => {
        expectCSS(`
            /**
             * foo
             */
            div{
                color:red; /* bar */
            }
        `, `
            div[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform a media query', () => {
        expectCSS(`
            @media screen and (max-width:480px){
                div{
                    color:red;
                }
            }
        `, `
            @media screen and (max-width:480px){
                div[data-css-foo]{
                    color:red;
                }
            }
        `);
    });

    it('should not transform properties', () => {
        expectCSS(`
            div{
                color:rgba(255,0,0,.5);
                transition:color .3s linear 1s, background .2s ease-in 1s, opacity .3s;
                background-image:url("foo.jpg"), url("bar.jpg"), url("baz.jpg");
                font-family:Times, "Times New Roman", serif;
                width:calc(30% * 20em - 2vh / 2pt);
                box-shadow:inset 0 0 10px rgba(0,0,0,.5);
                transform:rotate(-45deg) skew(20deg, 40deg) scale(2);
            }
        `, `
            div[data-css-foo]{
                color:rgba(255,0,0,.5);
                transition:color .3s linear 1s, background .2s ease-in 1s, opacity .3s;
                background-image:url("foo.jpg"), url("bar.jpg"), url("baz.jpg");
                font-family:Times, "Times New Roman", serif;
                width:calc(30% * 20em - 2vh / 2pt);
                box-shadow:inset 0 0 10px rgba(0,0,0,.5);
                transform:rotate(-45deg) skew(20deg, 40deg) scale(2);
            }
        `);
    });

    it('should transform a stylesheet', () => {
        expectCSS(`
            .foo {
                width: 100px;
            }

            .bar {
                width: 200px;
                background-color: red;
            }

            ol ol,
            ul ul {
                margin: 0.4em 0;
            }

            #foo > [attr=val]:empty + div.foo.bar,
            :not(span[attr]:contains("foo")) {
                display: block;
            }

            @media screen and (max-width: 480px) {
                .foo {
                    width: 200px;
                    height: 300px;
                }

                div#foo.bar[attr=val]:empty,
                :not(#foo.bar[attr]:empty) {
                    display: flex;
                }

                ol ol,
                ul + ul {
                    margin: 1.4em 1em;
                }
            }
        `, `
            .foo[data-css-foo]{
                width:100px;
            }
            .bar[data-css-foo]{
                width:200px;
                background-color:red;
            }
            ol[data-css-foo] ol[data-css-foo], ul[data-css-foo] ul[data-css-foo]{
                margin:0.4em 0;
            }
            #foo[data-css-foo] > [data-css-foo][attr=val]:empty + div.foo.bar[data-css-foo],[data-css-foo]:not(span[attr]:contains("foo")){
                display:block;
            }
            @media screen and (max-width:480px){
                .foo[data-css-foo]{
                    width:200px;
                    height:300px;
                }
                div#foo.bar[data-css-foo][attr=val]:empty,[data-css-foo]:not(#foo.bar[attr]:empty){
                    display:flex;
                }
                ol[data-css-foo] ol[data-css-foo], ul[data-css-foo] + ul[data-css-foo]{
                    margin:1.4em 1em;
                }
            }
        `);
    });
});
