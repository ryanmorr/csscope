import expectCSS from '../setup';

describe('simple', () => {
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
            .foo.bar{
                color:red;
            }
        `, `
            .foo.bar[data-css-foo]{
                color:red;
            }
        `);

        expectCSS(`
            .foo.bar.baz.qux{
                color:red;
            }
        `, `
            .foo.bar.baz.qux[data-css-foo]{
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

    it('should transform a mix of simple selectors', () => {
        expectCSS(`
            *, div#foo.bar.baz{
                color:red;
            }
        `, `
            *[data-css-foo], div#foo.bar.baz[data-css-foo]{
                color:red;
            }
        `);
    });
});
