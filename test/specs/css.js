import expectCSS from '../setup';

describe('css', () => {
    it('should transform different block formats', () => {
        expectCSS('data-css-foo', `
            div{
                color:red;
            }
        `, `
            div[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div  {
                color:   red;
            }
        `, `
            div[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div { color:red; }
        `, `
            div[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div
            {
                color: red;
            }
        `, `
            div[data-css-foo]{
                color:red;
            }
        `);

        expectCSS('data-css-foo', `
            div,
            span {
                color: red;
            }
        `, `
            div[data-css-foo], span[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should transform multiple blocks', () => {
        expectCSS('data-css-foo', `
            div {
                color: red;
            }
            span {
                color: blue;
            }
            em {
                color: green;
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
        expectCSS('data-css-foo', `
            /**
             * Donec convallis dictum felis eget ultricies. Quisque at nulla lacinia, bibendum diam. 
             * Quisque non enim pretium, interdum nisl quis, lacinia libero. In eu odio.
             */
            div {
                color: red; /* foo */
            }
        `, `
            div[data-css-foo]{
                color:red;
            }
        `);
    });

    it('should not transform properties', () => {
        expectCSS('data-css-foo', `
            div {
                --main-bg-color: brown;
                background-color: var(--main-bg-color, hsla(30, 100%, 50%, .3));
                color: rgba(255,0,0,.5);
                transition: color .3s linear 1s, background .2s ease-in 1s, opacity .3s;
                background-image: url("foo.jpg"), url("bar.jpg"), url("baz.jpg");
                font-family: Times, "Times New Roman", serif;
                width: calc(30% * 20em - 2vh / 2pt);
                box-shadow: inset 0 0 10px rgba(0,0,0,.5) !important;
                transform: rotate(-45deg) skew(20deg, 40deg) scale(2);
            }
        `, `
            div[data-css-foo]{
                --main-bg-color:brown;
                background-color:var(--main-bg-color, hsla(30, 100%, 50%, .3));
                color:rgba(255,0,0,.5);
                transition:color .3s linear 1s, background .2s ease-in 1s, opacity .3s;
                background-image:url("foo.jpg"), url("bar.jpg"), url("baz.jpg");
                font-family:Times, "Times New Roman", serif;
                width:calc(30% * 20em - 2vh / 2pt);
                box-shadow:inset 0 0 10px rgba(0,0,0,.5) !important;
                transform:rotate(-45deg) skew(20deg, 40deg) scale(2);
            }
        `);
    });

    it('should transform a stylesheet', () => {
        expectCSS('data-css-foo', `
            /**
             * Proin ut iaculis eros, sed viverra leo. Maecenas et consequat dui. Nunc. 
             */
            #foo {
                width: 100px;
            }

            /**
             * Pellentesque feugiat est nec laoreet volutpat. Mauris augue justo, tincidunt ut tempor. 
             */
            .bar.baz {
                width: 200px;
                background-color: red;
            }

            /**
             * Cras pulvinar tempor dolor in pretium. Donec at sapien sem. Proin id. 
             */
            ol ol,
            ul ul {
                margin: 0.4em 0;
            }

            /**
             * Morbi maximus nibh massa, quis tempor eros tempor nec. Nunc est risus. 
             */
            #foo > [attr=val]:empty + div.foo.bar,
            :not(span[attr]:contains("foo")) {
                display: block;
            }

            @media screen and (max-width: 480px) {
                /**
                 * Nullam ut mauris quam. Aliquam leo mi, ultricies at justo non, pharetra. 
                 */
                #foo {
                    width: 200px;
                    height: 300px;
                }

                /**
                 * Praesent ac arcu a libero faucibus auctor eu vitae elit. Nam vulputate. 
                 */
                div#foo.bar[attr=val]:empty,
                :not(#foo.bar[attr]:empty) {
                    display: flex;
                }

                /**
                 * Proin quis ipsum efficitur, aliquam dui vel, ultrices enim. Aliquam eget ligula. 
                 */
                ol ol,
                ul + ul {
                    margin: 1.4em 1em;
                }
            }
        `, `
            #foo[data-css-foo]{
                width:100px;
            }
            .bar.baz[data-css-foo]{
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
                #foo[data-css-foo]{
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
