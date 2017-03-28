# Camda

A library for extensions of classic node callback functions

[![Build Status](https://travis-ci.org/JeffDownie/camda.svg?branch=master)](https://travis-ci.org/JeffDownie/camda)

## Examples

```
var request = require('request');

//Creating a simple CB for a http GET request
var get = CBify(request);

//mapping over the response
var getStatusCode = get.map(res => res.statusCode);

//execute normally!
getStatusCode('https://github.com/', (err, code) => {
  if(err) return console.error(err);
  console.log('Status code returned: ' + code);
});
```
