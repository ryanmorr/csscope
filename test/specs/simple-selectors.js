import expectCSS from '../setup';

describe('simple selectors', () => {
    it('should transform the universal selector', () => {
        expectCSS('data-css-foo', `
            * {
                color: red;
            }
        `, `
            *[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform a tag selector', () => {
        expectCSS('data-css-foo', `
            div {
                color: red;
            }
        `, `
            div[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform an ID selector', () => {
        expectCSS('data-css-foo', `
            #foo {
                color: red;
            }
        `, `
            #foo[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform a class selector', () => {
        expectCSS('data-css-foo', `
            .foo {
                color: red;
            }
        `, `
            .foo[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform a multiple class selector', () => {
        expectCSS('data-css-foo', `
            .foo.bar {
                color: red;
            }
        `, `
            .foo.bar[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            .foo.bar.baz.qux {
                color: red;
            }
        `, `
            .foo.bar.baz.qux[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform selector groups', () => {
        expectCSS('data-css-foo', `
            div, span, em {
                color: red;
            }
        `, `
            div[data-css-foo], span[data-css-foo], em[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div,span,em {
                color: red;
            }
        `, `
            div[data-css-foo],span[data-css-foo],em[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div, span ,     em {
                color: red;
            }
        `, `
            div[data-css-foo], span[data-css-foo] , em[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform a mix of simple selectors', () => {
        expectCSS('data-css-foo', `
            *, div#foo.bar.baz {
                color: red;
            }
        `, `
            *[data-css-foo], div#foo.bar.baz[data-css-foo]{
                color:red;
            }
        `);
    });
});
