import expectCSS from '../setup';

describe('at-rules', () => {
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
});
