var andPrior = require ('./../')
var assert = require ('assert')

testBasics ()
testPromise ()
testCustomization ()

function sum (a, b) {
  return a + b
}

function promiseSum (a, b) {
  return Promise.resolve (sum (a + b))
}

function testBasics () {
  var sumAP = andPrior (sum)
  var value_ap = sumAP (1, 1)

  assert (
      value_ap.sameAsPrior () === false
    , 'sameAsPrior() should return false for the first computed value'
  )

  value_ap = sumAP (1.1, 1.1)

  assert (
      value_ap.sameAsPrior () === false
    , 'sameAsPrior() should return false when the prior computed value is different'
  )

  value_ap = sumAP (1.1, 1.1)

  assert (
      value_ap.sameAsPrior () === true
    , 'sameAsPrior() should return true when the prior computed value is the same'
  )
}

function testPromise () {
  var promiseSumAP = andPrior (promiseSum)

  promiseSumAP (1, 1).then (function (value_ap) {
    assert (
        value_ap.sameAsPrior () === false
      , 'sameAsPrior() should return false for the first fulfilled promise value'
    )
  })

  promiseSumAP (1, 1).then (function (value_ap) {
    assert (
        value_ap.sameAsPrior () === true
      , 'sameAsPrior() should return true for a fulfilled promise value that that is the same as the prior promise fulfillment'
    )
  })

  promiseSumAP (1, 2).then (function (value_ap) {
    assert (
        value_ap.sameAsPrior () === false
      , 'sameAsPrior() should return false for a fulfilled promise value that is different from the prior promise fulfillment'
    )
  })

}

function testCustomization () {
  var customConfig = {
    sameAsPrior: function (value, prior) {
      var value_rounded = Math.round (value)
      var prior_rounded = Math.round (prior)
      return value_rounded === prior_rounded
    }
  }

  var sumAPCustom = andPrior (sum, customConfig)

  var value_ap = sumAPCustom (1, 1)
  value_ap = sumAPCustom (1.1, 1.1)

  assert (
      value_ap.sameAsPrior () === true
    , 'sameAsPrior() should be able to be customized'
  )

  delete customConfig.sameAsPrior

  assert (
      value_ap.sameAsPrior () === false
    , 'sameAsPrior() should be able to be uncustomized'
  )
}

