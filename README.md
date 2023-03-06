# csscope

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> A simple and lightweight scoped CSS solution

## Install

Download the [CJS](https://github.com/ryanmorr/csscope/raw/master/dist/cjs/csscope.js), [ESM](https://github.com/ryanmorr/csscope/raw/master/dist/esm/csscope.js), [UMD](https://github.com/ryanmorr/csscope/raw/master/dist/umd/csscope.js) versions or install via NPM:

``` sh
npm install @ryanmorr/csscope
```

## Usage

Provide a unique ID and CSS as a string and get a transformed CSS string with the unique ID inserted as an attribute selector for each CSS selector sequence. It supports media queries, including prefixing keyframe and animation names, and deep combinators (`>>>`) to add styles targeting child components. For example:

```javascript
import csscope from '@ryanmorr/csscope';

const css = csscope('foo', `
    .foo {
        animation: grow 3s linear 1s infinite running;
    }

    .bar + [attr=value], :empty {
        background-color: red;
    }

    .component >>> .sub-component {
        margin-bottom: 1em;
    }

    @media screen and (max-width: 480px) {
        .foo {
            color: red;
        }
    }

    @keyframes grow {
        from {
            width: 0;
            height: 0
        }

        to {
            width: 100px;
            height: 100px
        }
    }
`);
```

Generates the following CSS as a string:

```css
.foo[foo] {
    animation: foo-grow 3s linear 1s infinite running;
}

.bar[foo] + [foo][attr=value], [foo]:empty {
    background-color: red;
}

.component[foo] .sub-component {
    margin-bottom: 1em;
}

@media screen and (max-width: 480px) {
    div[foo] {
        color: red;
    }
}

@keyframes foo-grow {
    from {
        width: 0;
    }

    to {
        width: 100%;
    }
}
```

Use the transformed CSS string to create a stylesheet client-side or server-side. To apply those styles to a DOM tree (component), add the unique ID as an attribute to every element in a DOM tree that should be influenced by the scoped styles.

**Beware of descandant selectors for recursive components!** For a CSS rule with the selector ".foo .bar", if the ".foo" element contains a recursive child component, than all ".bar" elements in that child component will be matched by the rule.

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/csscope
[version-image]: https://img.shields.io/github/package-json/v/ryanmorr/csscope?color=blue&style=flat-square
[build-url]: https://github.com/ryanmorr/csscope/actions
[build-image]: https://img.shields.io/github/actions/workflow/status/ryanmorr/csscope/node.js.yml?style=flat-square
[license-image]: https://img.shields.io/github/license/ryanmorr/csscope?color=blue&style=flat-square
[license-url]: UNLICENSE