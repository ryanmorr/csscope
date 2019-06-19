import expectCSS from '../setup';

describe('css', () => {
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
