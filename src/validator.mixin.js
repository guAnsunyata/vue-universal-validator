// property below must be defined in main component of mixin
const REQUIRE_DATA_NAME = ['validator_list']

// @mixin
const validator = {
  created() {
    REQUIRE_DATA_NAME.forEach(propertyName => {
      if (typeof this[propertyName] === 'undefined') {
        throw new Error(
          `Validator.mixin Error: Required property '${propertyName}' is undefined`
        )
      }
    })

    this._initValidatorState()
  },
  data() {
    return {
      validator_state: [],
      validator_rules: [],
    }
  },
  methods: {
    // @return { Boolean } is all fields in every item valid.
    validator_validateAll() {
      this.$nextTick(() => {

        // iterate list to visit item to check if all fields valid
        return this.validator_list.reduce((acc, item, index, list) => {

          // check current item applying all rules
          const passAllRules = this.validator_rules.reduce((acc, rule) => {
            const isValid = rule.validationFn(item, list)
            this._checkResult(isValid, item, rule)
          }, true)

          return acc && passAllRules
        }, true)
      })
    },

    // @return { Boolean } is the field valid
    validator_validate(item) {
      const rule = this.validator_rules[item.id]
      const isValid = rule.validationFn(item, this.validator_list)
      this._checkResult(isValid, item, rule)
    },

    _checkResult(isValid, item, rule) {
      if (!isValid) {
        this._markFieldAsError(item, rule.propertyName, rule.errorMsg)
      } else {
        this._markFieldAsPass(item, rule.propertyName)
      }
    },
    _markFieldAsError(item, propertyName, errorMsg) {
      const field = this.validator_state[item.id][propertyName]
      field.error = true
      field.errorMsg = typeof errorMsg === 'function' ? errorMsg(item) : errorMsg
    },

    _markFieldAsPass(item, propertyName) {
      const field = this.validator_state[item.id][propertyName]
      field.error = false
    },

    _initValidatorState(list) {
      let arr = []

      this.list.map(item => {
        arr[item.id] = {}

        Object.keys(item).forEach(property => {
          arr[item.id][property] = {
            error: false,
            errorMsg: '',
          }
        })
      })

      return arr
    },
  },
  watch: {
    // generate `validatorState` data and ensure it will be synchronized with `validatorList`.
    validator_list: {
      immediate: true,
      handler(list) {
        const newList = this._initValidatorState(list)
        const currentList = this.validator_state

        // apply current state to new list
        const updatedList = newList.map((item, id) => {
          return currentList[id] ? currentList[id] : item
        })

        this.validator_state = updatedList
      },
    },
  },
}

export default validator
