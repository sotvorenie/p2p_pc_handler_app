<script setup>
import {onBlur, onInput} from "@/composables/useFormValidation.js";

const value = defineModel()

defineProps({
  title: String,
  name: String,
  maxLength: Number,
  minLength: Number,
  isDark: {
    type: Boolean,
    default: true,
  },
})

</script>

<template>

  <label class="label position-relative">
    <span :class="{
            'label__text position-absolute cursor-text user-select-none': true,
            'is-dark': isDark
          }"
          @click.stop
    >
      {{title}}
    </span>
    <input :class="{
              'input': true,
              'is-dark': isDark
            }"
           :aria-describedby="`${name}-error`"
           @blur="onBlur"
           @input="onInput"
           v-model="value"
           :minlength="minLength"
           :maxlength="maxLength"
           required
    >
    <span class="fields_error label__error position-absolute"
          :id="`${name}-error`"
          data-js-form-field-errors
          @click.stop></span>
  </label>

</template>