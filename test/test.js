'use strict';

var path = require('path');
var assert = require('assert');
var should = require('should');
var generate = require('markdown-it-testgen');

// There are two ways to structure responsive image filenames:
// - by suffix eg: header-sample.jpg, sets setsrc files to
//      header-sample-small.jpg
//      header-sample-medium.jpg
// - by using netlify large media transformation querystrings eg: header-sample.jpg sets setsrc files to 
//      header-sample.jpg?nf_resize=fix?w=320
//      header-sample.jpg?nf_resize=fix?w=640

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
        'footer-*': [         // <= files matching this wildcard pattern
          {                   // rule 0
            width: 320,         // assign this width
            rename: {           // 
              prefix: 'small_'  // file is renamed with this suffix
            }
          },
          {                     // rule 1
            width: 640,         // assign this width
            rename: {           // 
              prefix: 'medium_' // and rename file with this suffix
            }
          }
          // more rules can go here
        ],
        'mixed-*': [ // <= files matching this wildcard pattern
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
            nf_resize: 'fit',
          },
          {                     // rule 1
            width: 640,         // and this width
            nf_resize: 'fit'    // use netlify transformations: https://docs.netlify.com/large-media/transform-images/
          },

          // more rules can go here
        ]
      },
      'sizes': { // this list must match wildcard patterns above
        'header-*': '(min-width: 36em) 33.3vw, 100vw',
        'footer-*': '(min-width: 36em) 33.3vw, 100vw',
        'mixed-*': '(min-width: 36em) 33.3vw, 100vw',
        'netlify-*': '(min-width: 36em) 33.3vw, 100vw',
      }
    }
  };

  var md = require('markdown-it')({
    html: true,
    linkify: true,
    typography: true
  }).use(require('../lib'), option);
  generate(path.join(__dirname, 'fixtures/markdown-it-responsive/responsive.txt'), md);
});

describe('Invalid operations', function () {
  it('No option', function () {
    (function () {
      var md = require('markdown-it')({
        html: true,
        linkify: true,
        typography: true
      }).use(require('../lib'));
    }).should.throw();
  });

  it('No responsive field', function () {
    (function () {
      var md = require('markdown-it')({
        html: true,
        linkify: true,
        typography: true
      }).use(require('../lib', { autofill: true }));
    }).should.throw();
  });
});

describe('Wildcard to RegExp converter', function () {
  var wc2reg = require('../lib/wildcardToRegex.js');

  it('Convert star (*)', function () {
    assert.deepEqual(wc2reg('test-*.png'), /test\-([\s\S]+?)\.png/);
  });

  it('Convert question mark (?)', function () {
    assert.deepEqual(wc2reg('test-??.png'), /test\-(.)(.)\.png/);
  });
});
