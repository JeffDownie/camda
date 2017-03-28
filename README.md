Camda<br/>[![Npm Version](https://img.shields.io/npm/v/camda.svg)](https://www.npmjs.com/package/camda) [![Build Status](https://travis-ci.org/JeffDownie/camda.svg?branch=master)](https://travis-ci.org/JeffDownie/camda) [![Coverage Status](https://coveralls.io/repos/github/JeffDownie/camda/badge.svg?branch=master)](https://coveralls.io/github/JeffDownie/camda?branch=master)
========================================================================================================================================================================================================================================================================================================================================================================================
A library for extensions of classic node callback functions

## Getting Started

Install it for use in node.js:
`npm install --save -E camda`

```javascript
var CB = require('camda').CB;
var request = require('request');

// Creating a simple CB for a http GET request
var get = CB(request);

// mapping over the response
var getStatusCode = get.map(res => res.statusCode);

// execute normally!
getStatusCode('https://github.com/', (err, code) => {
  if(err) return console.error(err);
  console.log('Status code returned: ' + code);
});
```

## License

MIT <https://github.com/JeffDownie/camda/raw/master/LICENSE.txt>