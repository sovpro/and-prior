Object.defineProperties (
  ValueAndPriorComputedValue.prototype
, { value           : {
      configurable  : false
    , enumerable    : true
    , value         : null
    , writable      : true 
    }
  , prior           : {
      configurable  : false
    , enumerable    : true
    , value         : null
    , writable      : true 
    }
  , opts            : {
      configurable  : false
    , enumerable    : false
    , value         : null
    , writable      : true
    }
  , sameAsPrior     : {
      configurable  : false
    , enumerable    : false
    , value         : sameAsPrior
    , writable      : false
    }
  }
)

module.exports = andPriorComputedValue

function ValueAndPriorComputedValue (
    value
  , prior
  , opts
) {
  this.value = value
  this.prior = prior
  if (typeof opts === 'object' &&
      opts !== null) {
    this.opts = opts
  }
}

var when = 0
function sameAsPrior () {
  if (this.opts &&
      this.opts.sameAsPrior) {
    return this.opts.sameAsPrior (
        this.value
      , this.prior
    )
  }
  return this.value === this.prior
}

function andPriorComputedValue (fn, opts) {
  var computed_values = new WeakMap ()
  var andPCV = function () {
    var value = fn.apply (null, arguments)
    var is_promise = value &&
        value.constructor &&
        value.constructor.name === 'Promise'
    if (is_promise) {
      return value.then(function (value) {
        return priorComputedValue (
            computed_values
          , andPCV
          , value        
          , opts
        )
      })
    }
    return priorComputedValue (
        computed_values
      , andPCV
      , value        
      , opts
    )
  }
  return andPCV
}

function priorComputedValue (
    computed_values
  , andPCV
  , value        
  , opts
) {
  var value_and_prior = new ValueAndPriorComputedValue (
      value        
    , computed_values.get (andPCV)
    , opts
  )
  if (value_and_prior.sameAsPrior () === false) {
    computed_values.set (andPCV, value_and_prior.value)
  }
  return value_and_prior
}

