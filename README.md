# And Prior 

Wrap a function to return the current and prior computed value

## Access the value and prior value

```js
// make an "and prior" wrapped getEvent
var getEventAP = andPrior (getEvent)
// call the "and prior" wrapped getEvent
var event_ap = getEventAP ()
// access the value and prior value
if (event_ap.value === event_ap.prior) {
  // do stuff when value is same as prior
}
```

## sameAsPrior shortcut method

```js
// make an "and prior" wrapped getEvent
var getEventAP = andPrior (getEvent)

function logEvents () {
  // call the "and prior" wrapped getEvent
  var event_ap = getEventAP ()
  // check if the return value is the same as the prior
  if (event_ap.sameAsPrior ()) {
   // do nothing when value is same as prior
   return
  }
  // do stuff when value is different
}
``` 

## Customize sameAsPrior comparison

```js
function sum (a, b) {
  return a + b
}

// configuration for the custom sameAsPrior
var custom_config = {
  sameAsPrior: function (value, prior) {
    var value_rounded = Math.round (value)
    var prior_rounded = Math.round (prior)
    // compare value and prior after rounding
    return value_rounded === prior_rounded
  }
}

// make an "and prior" wrapped sum
// and use the custom configuration
var sumAP = andPrior (sum, custom_config)

var first_ap = sumAP (1.1, 1.2)
var second_ap = sumAP (1.1, 1.1)

// this will log: true
console.log (second_ap.sameAsPrior ())
```

In the code above, the return value of `first_ap.sameAsPrior ()` will be `false` assuming no prior computed value, by `sumAndPrior`. The return value of `second_ap.sameAsPrior ()` will be `true` because the custom "same as prior" function performs rounding before comparison. 

