# vue-universal-validator
A light, universal, interchangeable validator for all purposes including form validation with fully control.

### Usage

*rules.js*
```js
// step 1. Define your rule objects
// apply your customize rules to any field you want.

const rule1 = {
  propertyName: 'qty', // property name of target field
  validationFn: (item, list) => item.qty <= item.limit, // function for validation returning a boolean to indicate the result
  errorMsg: () => `the qty must be under the ${item.limit}`, // errorMsg can be a string or function
}

const rule2 = {
  propertyName: 'limit',
  validationFn: (item, list) => item.limit > 0,
  errorMsg: 'the limitation must be larger than 0',
}
```

*MyComponent.vue*
```js
// ...

// step 2. Apply your rule objects to array `validator_rules`.
created() {
    this.validator_rules = [
      rule1,
      rule2,
    ]
},

// step 3. Set your target list as computed property `validator_list` to be the portal of validator
computed: {
  validator_list() {
    return this.list
  },
},

// step 4. Call `this.validator_validate()` to validate target tuple whenever you want.
methods: {
  onInputChange(item) {
    this.validator_validate(item)
  },

  // or calling `this.validator_validateAll()` to validate whole list which return boolean
  submit() {
      const isFormValid = this.validator_validateAll() // validateAll also return a boolean additionally
      if (!isFormValid) {
          return
      }
      // ...
  },
},
```

```html
<!-- step 5. Enjoy your handy error status -->
<template>
  <!-- ... -->

  <tr 
    v-for="item in list"
    :key="item.id"
  >
    <td>
        <label>
            Quantity:
        </label>
        <input
            type="number"
            v-model="item.qty"
            @change="onInputChange(item)"
        >

        <!-- Enjoy your handy error status by accessing property `validator_state[${id}]`. -->
        <span
            v-show="validator_state[item.id].qty.error"
            class="error"
            >
            {{ validator_state[item.id].qty.errorMsg }}
        </span>
    </td>
  </tr>

  <!-- ... -->
</template>
```
