var andPrior = require ('./../')
var assert = require ('assert')
var error_count = 0

testBasics ()
testPromise ()
testCustomization ()

function sum (a, b) {
  return a + b
}

function promiseSum (a, b) {
  return Promise.resolve (sum (a, b))
}

function assertWithInfo (value, message) {
  process.stdout.write (message)
  try {
    assert (value, message)
    console.log (' ... OK')
  }
  catch (error) {
    console.log (' ... FAIL')
    console.error (error)
    error_count += 1
  }
}

process.once ('exit', function (code) {
  process.exit (Math.min (1, error_count))
})

function testBasics () {
  var sumAP = andPrior (sum)
  var value_ap = sumAP (1, 1)

  assertWithInfo (
      value_ap.sameAsPrior () === false
    ,'sameAsPrior() should return false for the first computed value'
  )

  value_ap = sumAP (1.1, 1.1)

  assertWithInfo (
      value_ap.sameAsPrior () === false
    , 'sameAsPrior() should return false when the prior computed value is different'
  )

  value_ap = sumAP (1.1, 1.1)

  assertWithInfo (
      value_ap.sameAsPrior () === true
    , 'sameAsPrior() should return true when the prior computed value is the same'
  )
}

function testPromise () {
  var promiseSumAP = andPrior (promiseSum)

  promiseSumAP (1, 1).then (function (value_ap) {
    assertWithInfo (
        value_ap.sameAsPrior () === false
      , 'sameAsPrior() should return false for the first fulfilled promise value'
    )
  })

  promiseSumAP (1, 1).then (function (value_ap) {
    assertWithInfo (
        value_ap.sameAsPrior () === true
      , 'sameAsPrior() should return true for a fulfilled promise value that that is the same as the prior promise fulfillment'
    )
  })

  promiseSumAP (1, 2).then (function (value_ap) {
    assertWithInfo (
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

  assertWithInfo (
      value_ap.sameAsPrior () === true
    , 'sameAsPrior() should be able to be customized'
  )

  delete customConfig.sameAsPrior

  assertWithInfo (
      value_ap.sameAsPrior () === false
    , 'sameAsPrior() should be able to be uncustomized'
  )
}

