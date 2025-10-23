<script setup >
import Loading from "@/components/common/Loading.vue";
import Button from "@/components/common/Button.vue";

defineProps({
  isSubmit: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isFullWidth: {
    type: Boolean,
    default: false,
  },
  isRelative: {
    type: Boolean,
    default: true,
  },
})

</script>

<template>
  <button :class="{
            'button': true,
            'position-relative': isRelative,
            'button-w-100': isFullWidth,
          }"
          :type="isSubmit ? 'submit' : 'button'"
          :disabled="isDisabled"
  >
    <span :style="{opacity: isLoading ? '0' : '100'}">
      <slot/>
    </span>
    <Loading v-if="isLoading"/>
  </button>
</template>