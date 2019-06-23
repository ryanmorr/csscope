import expectCSS from '../setup';

describe('combinators', () => {
    it('should transform a descendant combinator', () => {
        expectCSS('data-css-foo', `
            div span {
                color: red;
            }
        `, `
            div[data-css-foo] span[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div span em {
                color: red;
            }
        `, `
            div[data-css-foo] span[data-css-foo] em[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform a child combinator', () => {
        expectCSS('data-css-foo', `
            div > span {
                color: red;
            }
        `, `
            div[data-css-foo] > span[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div>span {
                color: red;
            }
        `, `
            div[data-css-foo]>span[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div > span >em {
                color: red;
            }
        `, `
            div[data-css-foo] > span[data-css-foo] >em[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform an adjacent sibling combinator', () => {
        expectCSS('data-css-foo', `
            div + span {
                color: red;
            }
        `, `
            div[data-css-foo] + span[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div+span {
                color: red;
            }
        `, `
            div[data-css-foo]+span[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div + span+em {
                color: red;
            }
        `, `
            div[data-css-foo] + span[data-css-foo]+em[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform a general sibling combinator', () => {
        expectCSS('data-css-foo', `
            div ~ span {
                color: red;
            }
        `, `
            div[data-css-foo] ~ span[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div~span {
                color: red;
            }
        `, `
            div[data-css-foo]~span[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div ~ span~ em {
                color: red;
            }
        `, `
            div[data-css-foo] ~ span[data-css-foo]~ em[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform a deep combinator', () => {
        expectCSS('data-css-foo', `
            div >>> em {
                color: red;
            }
        `, `
            div[data-css-foo] em{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div span >>> em {
                color: red;
            }
        `, `
            div[data-css-foo] span[data-css-foo] em{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div >>> em, a i {
                color: red;
            }
        `, `
            div[data-css-foo] em, a[data-css-foo] i[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div >>> em a, p >>> a i {
                color: red;
            }
        `, `
            div[data-css-foo] em a, p[data-css-foo] a i{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div >>> em, a >>> i, strong >>> p {
                color: red;
            }
        `, `
            div[data-css-foo] em, a[data-css-foo] i, strong[data-css-foo] p{
                color:red;
            }
        `);
    });

    it('should transform a leading deep combinator', () => {
        expectCSS('data-css-foo', `
            >>> div {
                color: red;
            }
        `, `
            [data-css-foo] div{
                color:red;
            }
        `);
    });

    it('should transform a mix of combinators', () => {
        expectCSS('data-css-foo', `
            div span > em + strong ~ i >>> p {
                color: red;
            }
        `, `
            div[data-css-foo] span[data-css-foo] > em[data-css-foo] + strong[data-css-foo] ~ i[data-css-foo] p{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div span>em+strong~i>>>p {
                color: red;
            }
        `, `
            div[data-css-foo] span[data-css-foo]>em[data-css-foo]+strong[data-css-foo]~i[data-css-foo] p{
                color:red;
            }
        `);
    });
});
