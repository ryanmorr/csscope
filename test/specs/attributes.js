import expectCSS from '../setup.js';

describe('attributes', () => {
    it('should transform [attr] attribute selector', () => {
        expectCSS('data-css-foo', `
            [foo] {
                color: red;
            }
        `, `
            [data-css-foo][foo]{
                color:red;
            }
        `);
    });

    it('should transform [attr="value"] attribute selector', () => {
        expectCSS('data-css-foo', `
            [foo="bar"] {
                color: red;
            }
        `, `
            [data-css-foo][foo="bar"]{
                color:red;
            }
        `);
    });

    it('should transform [attr~="value"] attribute selector', () => {
        expectCSS('data-css-foo', `
            [foo~="bar"] {
                color: red;
            }
        `, `
            [data-css-foo][foo~="bar"]{
                color:red;
            }
        `);
    });

    it('should transform [attr|="value"] attribute selector', () => {
        expectCSS('data-css-foo', `
            [foo|="bar"] {
                color: red;
            }
        `, `
            [data-css-foo][foo|="bar"]{
                color:red;
            }
        `);
    });

    it('should transform [attr^="value"] attribute selector', () => {
        expectCSS('data-css-foo', `
            [foo^="bar"] {
                color: red;
            }
        `, `
            [data-css-foo][foo^="bar"]{
                color:red;
            }
        `);
    });

    it('should transform [attr$="value"] attribute selector', () => {
        expectCSS('data-css-foo', `
            [foo$="bar"] {
                color: red;
            }
        `, `
            [data-css-foo][foo$="bar"]{
                color:red;
            }
        `);
    });

    it('should transform [attr*="value"] attribute selector', () => {
        expectCSS('data-css-foo', `
            [foo*="bar"] {
                color: red;
            }
        `, `
            [data-css-foo][foo*="bar"]{
                color:red;
            }
        `);
    });

    it('should transform an unquoted attribute selector', () => {
        expectCSS('data-css-foo', `
            [foo=bar] {
                color: red;
            }
        `, `
            [data-css-foo][foo=bar]{
                color:red;
            }
        `);
    });

    it('should transform a case-insensitive attribute selector', () => {
        expectCSS('data-css-foo', `
            [foo="bar" i] {
                color: red;
            }
        `, `
            [data-css-foo][foo="bar" i]{
                color:red;
            }
        `);
    });

    it('should transform spaces in attribute selectors', () => {
        expectCSS('data-css-foo', `
            [foo ~=  "bar"] {
                color: red;
            }
        `, `
            [data-css-foo][foo ~= "bar"]{
                color:red;
            }
        `);
    });

    it('should transform a multiple attribute selector', () => {
        expectCSS('data-css-foo', `
            [foo][foo=bar][foo |= "bar"] {
                color: red;
            }
        `, `
            [data-css-foo][foo][foo=bar][foo |= "bar"]{
                color:red;
            }
        `);
    });
});
