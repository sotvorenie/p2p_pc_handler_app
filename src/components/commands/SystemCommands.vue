<script setup>
import {computed, ref} from "vue";

import Button from "@/components/common/Button.vue";
import Modal from "@/components/common/Modal.vue";

import useConnectionStore from "@/store/useConnectionStore.js";
import ListLoading from "@/components/common/ListLoading.vue";
const connectionStore = useConnectionStore();

//=========================================================//

//=========================================================//
//-- команды --//
const systemCommands = ref([
  { emoji: '💻', label: 'Состояние системы', command: 'get_system_resources' },
  { emoji: '💤', label: 'Сон', command: 'system_sleep' },
  { emoji: '⚡', label: 'Выключение', command: 'system_shutdown' },
  { emoji: '❌', label: 'Закрыть все программы', command: 'close_all_programs' },
])
//=========================================================//
</script>

<template>

  <div class="main__item flex flex-wrap">
    <h4 class="main__title">Системные команды:</h4>
    <div class="main__commands flex flex-wrap">
      <Modal>
        <template #activator="{open}">
          <Button class="main__item-btn"
                  v-for="cmd in systemCommands"
                  :key="cmd.command"
                  :is-loading="connectionStore?.isConnecting"
                  :is-disabled="!connectionStore.isConnected"
                  @click="() => {
                        if (cmd.command === 'get_system_resources') {
                          connectionStore.showInModalInfo = ''

                          open()
                        }

                        connectionStore.sendCommand(cmd.command)
                      }"
          >
            {{ cmd.emoji }} {{ cmd.label }}
          </Button>
        </template>

        <template #default>
          <ListLoading v-if="connectionStore.modalLoadingVisible"/>

          <div class="main__modal-info" v-else>
            {{connectionStore.showInModalInfo}}
          </div>
        </template>
      </Modal>
    </div>
  </div>

</template>