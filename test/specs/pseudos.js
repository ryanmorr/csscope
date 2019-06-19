import expectCSS from '../setup';

describe('pseudos', () => {
    it('should transform a pseudo-class selector', () => {
        expectCSS('data-css-foo', `
            :empty {
                color: red;
            }
        `, `
            [data-css-foo]:empty{
                color:red;
            }
        `);
    });

    it('should transform a pseudo-class selector with a value', () => {
        expectCSS('data-css-foo', `
            :nth-child(even) {
                color: red;
            }
        `, `
            [data-css-foo]:nth-child(even){
                color:red;
            }
        `);
    });

    it('should transform a pseudo-class selector with a quoted value', () => {
        expectCSS('data-css-foo', `
            :contains("foo") {
                color: red;
            }
        `, `
            [data-css-foo]:contains("foo"){
                color:red;
            }
        `);
    });

    it('should transform a pseudo-class selector with an embedded selector string', () => {
        expectCSS('data-css-foo', `
            :not(div#foo.bar[attr = value]:empty) {
                color: red;
            }
        `, `
            [data-css-foo]:not(div#foo.bar[attr = value]:empty){
                color:red;
            }
        `);
    });

    it('should transform a multiple pseudo-class selector', () => {
        expectCSS('data-css-foo', `
            :empty:contains("foo"):not(:first) {
                color: red;
            }
        `, `
            [data-css-foo]:empty:contains("foo"):not(:first){
                color:red;
            }
        `);
    });

    it('should transform a pseudo-element selector', () => {
        expectCSS('data-css-foo', `
            ::before {
                color: red;
            }
        `, `
            [data-css-foo]::before{
                color:red;
            }
        `);
    });
});
