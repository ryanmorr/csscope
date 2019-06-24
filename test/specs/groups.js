import expectCSS from '../setup';

describe('groups', () => {
    it('should transform selector groups', () => {
        expectCSS('data-css-foo', `
            div, #foo, .bar.baz, [attr], :pseudo {
                color: red;
            }
        `, `
            div[data-css-foo], #foo[data-css-foo], .bar.baz[data-css-foo], [data-css-foo][attr],[data-css-foo]:pseudo{
                color:red;
            }
        `);
    });

    it('should transform selector groups with no whitespace', () => {
        expectCSS('data-css-foo', `
            div,#foo,.bar.baz,[attr],:pseudo {
                color: red;
            }
        `, `
            div[data-css-foo],#foo[data-css-foo],.bar.baz[data-css-foo],[data-css-foo][attr],[data-css-foo]:pseudo{
                color:red;
            }
        `);
    });

    it('should transform selector groups with different whitespace', () => {
        expectCSS('data-css-foo', `
            div, #foo ,     .bar.baz,[attr],
            :pseudo {
                color: red;
            }
        `, `
            div[data-css-foo], #foo[data-css-foo] , .bar.baz[data-css-foo],[data-css-foo][attr],[data-css-foo]:pseudo{
                color:red;
            }
        `);
    });
});
