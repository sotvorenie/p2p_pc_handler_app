<script setup>
import {ref, watch} from "vue";

defineProps({
  text: String,
})

const visible = defineModel()

const timer = ref(null)

watch(
    () => visible.value,
    (newVal) => {
      if (newVal) {
        if (timer.value) {
          clearTimeout(timer.value)
        }
        timer.value = setTimeout(() => {
          visible.value = false
        }, 2000)
      }
    }
)
</script>

<template>

  <Teleport to="body">
    <Transition name="top">
      <div class="message-wrapper" v-if="visible">
        <div class="message">
          {{text}}
        </div>
      </div>
    </Transition>
  </Teleport>

</template>