import expectCSS from '../setup.js';

describe('at-rules', () => {
    it('should transform a media query at-rule with no conditions', () => {
        expectCSS('data-css-foo', `
            @media print {
                div {
                    color: red;
                }
            }
        `, `
            @media print{
                div[data-css-foo]{
                    color:red;
                }
            }
        `);

        expectCSS('data-css-foo', `
            @media screen, print {
                div {
                    color: red;
                }
            }
        `, `
            @media screen, print{
                div[data-css-foo]{
                    color:red;
                }
            }
        `);
    });

    it('should transform a media query at-rule with conditions', () => {
        expectCSS('data-css-foo', `
            @media screen and (max-width: 480px) {
                div {
                    color: red;
                }
            }
        `, `
            @media screen and (max-width:480px){
                div[data-css-foo]{
                    color:red;
                }
            }
        `);

        expectCSS('data-css-foo', `
            @media only screen 
              and (min-width: 320px) 
              and (max-width: 480px)
              and (resolution: 150dpi) {
                div {
                    color: red;
                }
            }
        `, `
            @media only screen and (min-width:320px) and (max-width:480px) and (resolution:150dpi){
                div[data-css-foo]{
                    color:red;
                }
            }
        `);
    });

    it('should not transform an @font-face at-rule', () => {
        expectCSS('data-css-foo', `
            @font-face {
                font-family: "Open Sans";
                src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
                     url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
            }
        `, `
            @font-face{
                font-family:"Open Sans";
                src:url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"), url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
            }
        `);
    });

    it('should transform an @supports at-rule', () => {
        expectCSS('data-css-foo', `
            @supports (display: grid) {
                div {
                    color: red;
                }
            }
        `, `
            @supports (display:grid){
                div[data-css-foo]{
                    color:red;
                }
            }
        `);
    });

    it('should transform an @supports at-rule with an operator', () => {
        expectCSS('data-css-foo', `
            @supports not (transform-origin: 10em 10em 10em) {
                div {
                    color: red;
                }
            }
        `, `
            @supports not (transform-origin:10em 10em 10em){
                div[data-css-foo]{
                    color:red;
                }
            }
        `);

        expectCSS('data-css-foo', `
            @supports (display: table-cell) and (display: list-item) {
                div {
                    color: red;
                }
            }
        `, `
            @supports (display:table-cell) and (display:list-item){
                div[data-css-foo]{
                    color:red;
                }
            }
        `);

        expectCSS('data-css-foo', `
            @supports (transform-style: preserve-3d) or ((-moz-transform-style: preserve-3d) or
                ((-o-transform-style: preserve-3d) or (-webkit-transform-style: preserve-3d))){
                div {
                    color: red;
                }
            }
        `, `
            @supports (transform-style:preserve-3d) or ((-moz-transform-style:preserve-3d) or ((-o-transform-style:preserve-3d) or (-webkit-transform-style:preserve-3d))){
                div[data-css-foo]{
                    color:red;
                }
            }
        `);

        expectCSS('data-css-foo', `
            @supports (display: grid) and (not (display: inline-grid)) {
                div {
                    color: red;
                }
            }
        `, `
            @supports (display:grid) and (not (display:inline-grid)){
                div[data-css-foo]{
                    color:red;
                }
            }
        `);
    });

    it('should transform an @keyframes at-rule', () => {
        expectCSS('data-css-foo', `
            @keyframes bar {
                from {
                    width: 0;
                }

                to {
                    width: 100%;
                }
            }
        `, `
            @keyframes data-css-foo-bar{
                from{
                    width:0;
                }
                to{
                    width:100%;
                }
            }
        `);

        expectCSS('data-css-foo', `
            @keyframes bar {
                0% {
                    top: 0;
                }
                50% {
                    top: 50px;
                }
                100% {
                    top: 100px;
                }
            }
        `, `
            @keyframes data-css-foo-bar{
                0%{
                    top:0;
                }
                50%{
                    top:50px;
                }
                100%{
                    top:100px;
                }
            }
        `);
    });

    it('should tranform an animation declaration', () => {
        expectCSS('data-css-foo', `
            .foo {
                animation: bar 3s linear 1s infinite running;
            }

            @keyframes bar {
                from {
                    width: 0;
                }

                to {
                    width: 100%;
                }
            }
        `, `
            .foo[data-css-foo]{
                animation:data-css-foo-bar 3s linear 1s infinite running;
            }
            @keyframes data-css-foo-bar{
                from{
                    width:0;
                }
                to{
                    width:100%;
                }
            }
        `);

        expectCSS('data-css-foo', `
            @keyframes bar {
                from {
                    width: 0;
                }

                to {
                    width: 100%;
                }
            }

            .foo {
                animation: bar 3s linear 1s infinite running;
            }
        `, `
            @keyframes data-css-foo-bar{
                from{
                    width:0;
                }
                to{
                    width:100%;
                }
            }
            .foo[data-css-foo]{
                animation:data-css-foo-bar 3s linear 1s infinite running;
            }
        `);
    });

    it('should tranform an animation-name declaration', () => {
        expectCSS('data-css-foo', `
            .foo {
                animation-name: bar;
            }

            @keyframes bar {
                from {
                    width: 0;
                }

                to {
                    width: 100%;
                }
            }
        `, `
            .foo[data-css-foo]{
                animation-name:data-css-foo-bar;
            }
            @keyframes data-css-foo-bar{
                from{
                    width:0;
                }
                to{
                    width:100%;
                }
            }
        `);

        expectCSS('data-css-foo', `
            @keyframes bar {
                from {
                    width: 0;
                }

                to {
                    width: 100%;
                }
            }

            .foo {
                animation-name: bar;
            }
        `, `
            @keyframes data-css-foo-bar{
                from{
                    width:0;
                }
                to{
                    width:100%;
                }
            }
            .foo[data-css-foo]{
                animation-name:data-css-foo-bar;
            }
        `);
    });

    it('should tranform a multiple animation declaration', () => {
        expectCSS('data-css-foo', `
            .foo {
                animation: bar 3s ease-in, baz 1s ease-out;
            }

            @keyframes bar {
                from {
                    width: 0;
                }

                to {
                    width: 100%;
                }
            }

            @keyframes baz {
                from {
                    height: 0;
                }

                to {
                    height: 100%;
                }
            }
        `, `
            .foo[data-css-foo]{
                animation:data-css-foo-bar 3s ease-in,data-css-foo-baz 1s ease-out;
            }
            @keyframes data-css-foo-bar{
                from{
                    width:0;
                }
                to{
                    width:100%;
                }
            }
            @keyframes data-css-foo-baz{
                from{
                    height:0;
                }
                to{
                    height:100%;
                }
            }
        `);

        expectCSS('data-css-foo', `
            @keyframes bar {
                from {
                    width: 0;
                }

                to {
                    width: 100%;
                }
            }

            @keyframes baz {
                from {
                    height: 0;
                }

                to {
                    height: 100%;
                }
            }

            .foo {
                animation: bar 3s ease-in, baz 1s ease-out;
            }
        `, `
            @keyframes data-css-foo-bar{
                from{
                    width:0;
                }
                to{
                    width:100%;
                }
            }
            @keyframes data-css-foo-baz{
                from{
                    height:0;
                }
                to{
                    height:100%;
                }
            }
            .foo[data-css-foo]{
                animation:data-css-foo-bar 3s ease-in,data-css-foo-baz 1s ease-out;
            }
        `);
    });

    it('should tranform a multiple animation-name declaration', () => {
        expectCSS('data-css-foo', `
            .foo {
                animation-name: bar, baz;
            }

            @keyframes bar {
                from {
                    width: 0;
                }

                to {
                    width: 100%;
                }
            }

            @keyframes baz {
                from {
                    height: 0
                }

                to {
                    height: 100%;
                }
            }
        `, `
            .foo[data-css-foo]{
                animation-name:data-css-foo-bar,data-css-foo-baz;
            }
            @keyframes data-css-foo-bar{
                from{
                    width:0;
                }
                to{
                    width:100%;
                }
            }
            @keyframes data-css-foo-baz{
                from{
                    height:0;
                }
                to{
                    height:100%;
                }
            }
        `);

        expectCSS('data-css-foo', `
            @keyframes bar {
                from {
                    width: 0;
                }

                to {
                    width: 100%;
                }
            }

            @keyframes baz {
                from {
                    height: 0
                }

                to {
                    height: 100%;
                }
            }

            .foo {
                animation-name: bar, baz;
            }
        `, `
            @keyframes data-css-foo-bar{
                from{
                    width:0;
                }
                to{
                    width:100%;
                }
            }
            @keyframes data-css-foo-baz{
                from{
                    height:0;
                }
                to{
                    height:100%;
                }
            }
            .foo[data-css-foo]{
                animation-name:data-css-foo-bar,data-css-foo-baz;
            }
        `);
    });

    it('should not tranform an animation declaration if the @keyframes animation does not exist', () => {
        expectCSS('data-css-foo', `
            .foo {
                animation: bar 3s linear 1s infinite running;
            }
        `, `
            .foo[data-css-foo]{
                animation:bar 3s linear 1s infinite running;
            }
        `);
    });

    it('should not tranform an animation-name declaration if the @keyframes animation does not exist', () => {
        expectCSS('data-css-foo', `
            .foo {
                animation-name: bar;
            }
        `, `
            .foo[data-css-foo]{
                animation-name:bar;
            }
        `);
    });

    it('should transform only the animation name for @keyframes that exist within a multiple animation declaration', () => {
        expectCSS('data-css-foo', `
            .foo {
                animation: bar 3s linear, baz 1s ease-in, qux 2s ease-out;
            }

            @keyframes baz {
                from {
                    width: 0;
                }

                to {
                    width: 100%;
                }
            }
        `, `
            .foo[data-css-foo]{
                animation:bar 3s linear,data-css-foo-baz 1s ease-in,qux 2s ease-out;
            }
            @keyframes data-css-foo-baz{
                from{
                    width:0;
                }
                to{
                    width:100%;
                }
            }
        `);

        expectCSS('data-css-foo', `
            @keyframes baz {
                from {
                    width: 0;
                }

                to {
                    width: 100%;
                }
            }

            .foo {
                animation: bar 3s linear, baz 1s ease-in, qux 2s ease-out;
            }
        `, `
            @keyframes data-css-foo-baz{
                from{
                    width:0;
                }
                to{
                    width:100%;
                }
            }
            .foo[data-css-foo]{
                animation:bar 3s linear,data-css-foo-baz 1s ease-in,qux 2s ease-out;
            }
        `);
    });

    it('should transform only the animation name for @keyframes that exist within a multiple animation-name declaration', () => {
        expectCSS('data-css-foo', `
            .foo {
                animation-name: bar, baz,   qux;
            }

            @keyframes qux {
                from {
                    width: 0;
                }

                to {
                    width: 100%;
                }
            }
        `, `
            .foo[data-css-foo]{
                animation-name:bar,baz,data-css-foo-qux;
            }
            @keyframes data-css-foo-qux{
                from{
                    width:0;
                }
                to{
                    width:100%;
                }
            }
        `);

        expectCSS('data-css-foo', `
            @keyframes qux {
                from {
                    width: 0;
                }

                to {
                    width: 100%;
                }
            }

            .foo {
                animation-name: bar, baz,   qux;
            }
        `, `
            @keyframes data-css-foo-qux{
                from{
                    width:0;
                }
                to{
                    width:100%;
                }
            }
            .foo[data-css-foo]{
                animation-name:bar,baz,data-css-foo-qux;
            }
        `);
    });

    it('should transform nested at-rules', () => {
        expectCSS('data-css-foo', `
            @supports (display: flex) {
                .foo {
                    color: blue;
                    animation: bar 1s linear;
                }

                @keyframes bar {
                    from {
                        width: 0;
                    }

                    to {
                        width: 100%;
                    }
                }

                @font-face {
                    font-family: MyHelvetica;
                    src: local("Helvetica Neue Bold"),
                         local("HelveticaNeue-Bold"),
                         url(MgOpenModernaBold.ttf);
                }

                @media screen and (max-width: 480px) {
                    .foo {
                        color: red;
                        animation: baz 1s linear;
                    }

                    @keyframes baz {
                        from {
                            height: 0;
                        }
                        to {
                            height: 100%;
                        }
                    }
                }
            }
        `, `
            @supports (display:flex){
                .foo[data-css-foo]{
                    color:blue;
                    animation:data-css-foo-bar 1s linear;
                }
                @keyframes data-css-foo-bar{
                    from{
                        width:0;
                    }
                    to{
                        width:100%;
                    }
                }
                @font-face{
                    font-family:MyHelvetica;
                    src:local("Helvetica Neue Bold"), local("HelveticaNeue-Bold"), url(MgOpenModernaBold.ttf);
                }
                @media screen and (max-width:480px){
                    .foo[data-css-foo]{
                        color:red;
                        animation:data-css-foo-baz 1s linear;
                    }
                    @keyframes data-css-foo-baz{
                        from{
                            height:0;
                        }
                        to{
                            height:100%;
                        }
                    }
                }
            }
        `);
    });
});
