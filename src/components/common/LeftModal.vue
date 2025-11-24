<script setup>
import {watch} from "vue";

import Cross from "@/assets/icons/Cross.vue";

const visible = defineModel({default: false});

defineProps({
  closeVisible: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['close']);

const open = () => {
  visible.value = true;
}

const close = () => {
  emits('close');
  visible.value = false;
}

watch(
    () => visible.value,
    (newVal) => {
      document.documentElement.classList.toggle('is-lock', newVal)
    }
)
</script>

<template>

  <slot name="activator" :open="open" :close="close" />

  <Teleport to="body">
    <Transition name="left">
      <div class="left-modal position-absolute z-10000 flex-center" v-if="visible" @click="close">
        <div class="left-modal__content position-relative" @click.stop>
          <slot :close="close" />

          <button class="left-modal__close position-absolute button-width-svg recolor-svg"
                  @click="close"
                  type="button"
                  title="Закрыть"
                  aria-label="Закрыть"
                  v-if="closeVisible"
          >
            <Cross/>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>

</template>