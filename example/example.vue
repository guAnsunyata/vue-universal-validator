<template>
  <div class="Example">
    <table>
      <thead>
        <tr>
          <td>Quantity</td>
          <td>Limitation</td>
        </tr>
      </thead>
      <tr 
        v-for="item in list"
        :key="item.id"
      >
        <td>
          <input
            type="number"
            v-model="item.qty"
            @change="onInputChange(item)"
          >
          <label>
            Quantity:
          </label>
          <!-- take error status by accessing property `validator_state[${id}]`. -->
          <span
            v-show="validator_state[item.id].qty.error"
            class="error"
          >
            {{ validator_state[item.id].qty.errorMsg }}
          </span>
        </td>
        <td>
          {{ item.limit }}
        </td>
      </tr>
    </table>

    <!-- submit -->
    <button @click="submit">submit</button>
  </div>
</template>

<script>
import validator from 'validator.mixin.js'

// step1. define your rule object
// apply your customize rules to any field you want.
const rule1 = {
  propertyName: 'qty', // property name of target field
  validationFn: (item, list) => item.qty <= item.limit,
  errorMsg: () => `the qty must be under the ${item.limit}`,
}

const rule2 = {
  propertyName: 'limit',
  validationFn: (item, list) => item.limit > 0,
  errorMsg: 'the limitation must be larger than 0',
}

export default {
  name: 'Example',
  mixins: [
    validator,
  ],
  data() {
    return {
      // target list
      list: [
        {
          id: 0,
          qty: 10,
          limit: 5,
        },
        {
          id: 1,
          qty: 5,
          limit: 10,
        },
      ],
    }
  },
  created() {
    // step 2. Apply your rule objects.
    this.validator_rules = [
      rule1,
      rule2,
    ]
  },
  computed: {
    // step 3. Set your target list as computed property `validator_list` to be the portal of validator
    validator_list() {
      return this.list
    },
  },
  methods: {
    // step 4. Call `this.validateAll()` to validate target list whenever you want.
    onInputChange(item) {
      this.validator_validate(item)
    },

    // or calling `this.validator_validateAll()` to validate whole list
    submit() {
      const isFormValid = this.validator_validateAll() // `validator_validateAll` return a boolean additionally
      if (!isFormValid) {
        return
      }
      // ...
    },
  },
}
</script>

<style scoped>

.error {
  color: red;
}
</style>
