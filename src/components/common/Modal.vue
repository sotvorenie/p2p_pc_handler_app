<script setup>
import Button from "@/components/common/Button.vue";

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

</script>

<template>

  <slot name="activator" :open="open" :close="close" />

  <Teleport to="body">
    <Transition name="fade">
      <div class="modal position-absolute z-10000 flex-center" v-if="visible" @click="close">
        <div class="modal__content flex flex-column" @click.stop>
          <slot :close="close" />

          <Button class="modal__close"
                  @click="close"
                  type="button"
                  title="Закрыть"
                  aria-label="Закрыть"
                  v-if="closeVisible"
          >
            Закрыть
          </Button>
        </div>
      </div>
    </Transition>
  </Teleport>

</template>