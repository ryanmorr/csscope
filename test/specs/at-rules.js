import expectCSS from '../setup';

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

    it('should not transform an @keyframes at-rule', () => {
        expectCSS('data-css-foo', `
            @keyframes foo {
                from {
                    margin-left: 100%;
                    width: 300%;
                }

                to {
                    margin-left: 0%;
                    width: 100%;
                }
            }
        `, `
            @keyframes foo{
                from{
                    margin-left:100%;
                    width:300%;
                }
                to{
                    margin-left:0%;
                    width:100%;
                }
            }
        `);

        expectCSS('data-css-foo', `
            @keyframes foo {
                0% {
                    top: 0;
                    left: 0;
                }
                30% {
                    top: 50px;
                }
                68%, 72% {
                    left: 50px;
                }
                100% {
                    top: 100px;
                    left: 100%;
                }
            }
        `, `
            @keyframes foo{
                0%{
                    top:0;
                    left:0;
                }
                30%{
                    top:50px;
                }
                68%, 72%{
                    left:50px;
                }
                100%{
                    top:100px;
                    left:100%;
                }
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

    it('should transform nested at-rules', () => {
        expectCSS('data-css-foo', `
            @supports (animation-name: foo) {
                @keyframes bar {
                    from {
                        width: 300%;
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
                    div {
                        color: red;
                    }

                    @keyframes baz {
                        from {
                            height: 0;
                        }
                        to {
                            height: 100px;
                        }
                    }
                }
            }
        `, `
            @supports (animation-name:foo){
                @keyframes bar{
                    from{
                        width:300%;
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
                    div[data-css-foo]{
                        color:red;
                    }
                    @keyframes baz{
                        from{
                            height:0;
                        }
                        to{
                            height:100px;
                        }
                    }
                }
            }
        `);
    });
});
