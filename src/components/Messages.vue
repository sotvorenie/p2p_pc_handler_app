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
            :is-relative="false"
            @click="handleDelete"
    >
      <Delete/>
    </Button>

    <TransitionGroup class="messages__list flex flex-column"
                     tag="ul"
                     name="messages"
    >
      <li class="messages__item flex flex-column"
          v-for="(message, index) in messages"
          :key="message"
          :style="{ '--index': index }"
      >
        <span class="messages__time">{{message.time}}</span>
        <span class="messages__text">{{message.text}}</span>
      </li>
    </TransitionGroup>
  </div>

</template>