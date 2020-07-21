markdown-it-responsive
===

[![Build Status](https://travis-ci.org/tatsy/markdown-it-responsive.svg)](https://travis-ci.org/tatsy/markdown-it-responsive)
[![NPM version](https://img.shields.io/npm/v/markdown-it-responsive.svg?style=flat)](https://www.npmjs.org/package/markdown-it-responsive)
[![Coverage Status](https://coveralls.io/repos/tatsy/markdown-it-responsive/badge.svg)](https://coveralls.io/r/tatsy/markdown-it-responsive)

> A markdown-it plugin for responsive images. This plugin overloads original image renderer of markdown-it.

## Usage

### Enable plugin

```js
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typography: true
}).use(require('markdown-it-responsive'), options);  // <-- this use(package_name) is required
```

### How to specify options?

The notation to specify responsive sizes is as follows.

```js
// There are two ways to structure responsive image filenames:
// - by suffix eg: header-sample.jpg, sets setsrc files to
//      header-sample-small.jpg
//      header-sample-medium.jpg
// - by using netlify large media transformation querystrings eg: header-sample.jpg sets setsrc files to 
//      header-sample.jpg?nf_resize=fix?w=320
//      header-sample.jpg?nf_resize=fix?w=640
// - in either case the src filename is unchanged. This is problematic with automatically resized files such as
//   netlify transformations because usually the default file is huge. The problem could be solved if netlify
//   supported quality transformations, but they don't.

// BEWARE of overlapping wildcard patterns eg "example-*" and "example-1-*"
// The FIRST matching rule is used
describe('markdown-it-responsive', function () {
  var option = {
    responsive: {
      'srcset': {
        'header-*': [         // <= files matching this wildcard pattern
          {                   // rule 0
          width: 320,         // assign this width
          rename: {           // 
            suffix: '-small'  // file is renamed with this suffix
          }
        }, 
        {                     // rule 1
          width: 640,         // assign this width
          rename: {           // 
            suffix: '-medium' // and rename file with this suffix
          }
        }
          // more rules can go here
        ],
        'missing-params-*': [ // <= files matching this wildcard pattern
          {                     // rule 0
            width: 320,         // assign this width
            nf_resize: 'smartcrop' // use netlify transformations: https://docs.netlify.com/large-media/transform-images/
          },
          {                     // rule 1
            width: 640,         // assign this width
            rename: {           // and rename
              suffix: '-medium' // with this suffix
            }
          }
          // more rules can go here
        ],
        'netlify-*': [        // <= files matching this wildcard pattern (that did not match above)
          {                   // rule 0
            width: 320,         
            nf_resize: 'fit' 
          }, 
          {                     // rule 1
            width: 640,         // and this width
            nf_resize: 'fit'    // use netlify transformations: https://docs.netlify.com/large-media/transform-images/
          }
          // more rules can go here
        ]
      },
      'sizes': { // this list must match wildcard patterns above
        'header-*': '(min-width: 36em) 33.3vw, 100vw', 
        'missing-params-*': '(min-width: 36em) 33.3vw, 100vw', 
        'netlify-*': '(min-width: 36em) 33.3vw, 100vw', 
      }
    }
  };
```

### Example

With the options above, a markdown

```md
![test](header-test.png)
```

is rendered as

```html
<p><img src="header-test.png" srcset="header-test-small.png 320w, header-test-medium.png 640w" sizes="(min-width: 36em) 33.3vw, 100vw" alt="test"></p>
```


