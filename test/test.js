'use strict';

var path = require('path');
var assert = require('assert');
var should = require('should');
var generate = require('markdown-it-testgen');

describe('markdown-it-responsive', function() {
  var option = { responsive: {
    'srcset': {
      'header-*': [ {       // <= files matching this wildcard pattern
        width: 320,         // will be assigned this width
        rename: {           // provide either this OR nf_resize (nf_resize wins)
          suffix: '-small'  // <= and renamed with this suffix
        },
        nf_resize: 'smartcrop' // use netlify transformations: https://docs.netlify.com/large-media/transform-images/
      }, {
        width: 640,         // and this width
        rename: {           // provide either this OR nf_resize (nf_resize wins)
          suffix: '-medium' // will be renamed with this suffix
        },
        nf_resize: 'fit'    // use netlify transformations: https://docs.netlify.com/large-media/transform-images/
      }
                            // more widths can go here
    ],
    'netlify-*': [ {       // <= files matching this wildcard pattern
      width: 320,         // will be assigned this width
      rename: {           // provide either this OR nf_resize (nf_resize wins)
        suffix: '-small'  // <= and renamed with this suffix
      },
      nf_resize: 'smartcrop' // use netlify transformations: https://docs.netlify.com/large-media/transform-images/
    }, {
      width: 640,         // and this width
      rename: {           // provide either this OR nf_resize (nf_resize wins)
        suffix: '-medium' // will be renamed with this suffix
      },
      nf_resize: 'fit'    // use netlify transformations: https://docs.netlify.com/large-media/transform-images/
    }
                          // more widths can go here
  ],
  'netlify-missing-params-*': [ {       // <= files matching this wildcard pattern
    width: 320,         // will be assigned this width
    nf_resize: 'smartcrop' // use netlify transformations: https://docs.netlify.com/large-media/transform-images/
  }, {
    width: 640,         // and this width
    rename: {           // provide either this OR nf_resize (nf_resize wins)
      suffix: '-medium' // will be renamed with this suffix
    }
  }
                        // more widths can go here
]
    },
    'sizes': {
      'header-*': '(min-width: 36em) 33.3vw, 100vw' // this list must match above
    }
  } };

  var md = require('markdown-it')({
    html: true,
    linkify: true,
    typography: true
  }).use(require('../lib'), option);
  generate(path.join(__dirname, 'fixtures/markdown-it-responsive/responsive.txt'), md);
});

describe('Invalid operations', function() {
  it('No option', function() {
    (function() {
      var md = require('markdown-it')({
        html: true,
        linkify: true,
        typography: true
      }).use(require('../lib'));
    }).should.throw();
  });

  it('No responsive field', function() {
    (function() {
      var md = require('markdown-it')({
        html: true,
        linkify: true,
        typography: true
      }).use(require('../lib', { autofill: true }));
    }).should.throw();
  });
});

describe('Wildcard to RegExp converter', function() {
  var wc2reg = require('../lib/wildcardToRegex.js');

  it('Convert star (*)', function() {
    assert.deepEqual(wc2reg('test-*.png'), /test\-([\s\S]+?)\.png/);
  });

  it('Convert question mark (?)', function() {
    assert.deepEqual(wc2reg('test-??.png'), /test\-(.)(.)\.png/);
  });
});
