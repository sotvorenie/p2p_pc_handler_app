<script setup>

import Button from "@/components/common/Button.vue";
import Delete from "@/assets/icons/Delete.vue";

defineProps({
  isDark: {
    type: Boolean,
    default: false,
  },
})

const messages = defineModel()

const handleDelete = () => {
  messages.value = []
}
</script>

<template>

  <div :class="{
          'messages position-relative': true,
          'is-dark': isDark
        }"
  >
    <Button class="messages__delete button-width-svg button-ball recolor-svg position-sticky"
            @click="handleDelete"
    >
      <Delete/>
    </Button>

    <ul class="messages__list flex flex-column">
      <li class="messages__item flex flex-column"
          v-for="message in messages"
      >
        <span class="messages__time">{{message.time}}</span>
        <span class="messages__text">{{message.text}}</span>
      </li>
    </ul>
  </div>

</template>