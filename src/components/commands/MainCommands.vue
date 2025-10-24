<script setup>
import {ref} from "vue";

import Button from "@/components/common/Button.vue";
import Modal from "@/components/common/Modal.vue";
import ListLoading from "@/components/common/ListLoading.vue";

import useConnectionStore from "@/store/useConnectionStore.js";
const connectionStore = useConnectionStore();

//=========================================================//

//=========================================================//
//-- команды --//
// список команд
const quickCommands = ref([
  { emoji: '🟢', label: 'Запущенные программы', command: 'get_running_programs' },
  { emoji: '📦', label: 'Установленные программы', command: 'find_installed_programs' },
  { emoji: '🖥️', label: 'Информация о системе', command: 'get_system_info' },
  { emoji: '🏓', label: 'Пинг', command: 'ping' },
  { emoji: '🗑️', label: 'Удалить скрипт', command: 'remove_program' },
])


// при клике на команду
const handleQuickCommand = (cmd) => {
  if (cmd.command === 'get_system_info') {

    if (!connectionStore.PCInfo) {
      connectionStore.sendCommand(cmd.command)
    }
  } else if (cmd.command === 'get_installed_programs') {

    if (!connectionStore.allPrograms) {
      connectionStore.sendCommand(cmd.command)
    }
  }

  connectionStore.lastCommand = cmd.command
  connectionStore.sendCommand(cmd.command)
}
//=========================================================//
</script>

<template>

  <div class="main__item">
    <h4 class="main__title">Основные команды:</h4>
    <div class="main__commands flex flex-wrap">
      <Modal>
        <template #activator="{open}">
          <Button class="main__item-btn"
                  v-for="cmd in quickCommands"
                  :key="cmd.command"
                  :is-loading="connectionStore?.isConnecting"
                  :is-disabled="!connectionStore?.isConnected"
                  @click="() => {
                        if (cmd.command !== 'ping') {
                          connectionStore.showInModalInfo = ''

                          open()
                        }

                        handleQuickCommand(cmd)
                      }"
          >
            {{ cmd.emoji }} {{ cmd.label }}
          </Button>
        </template>

        <template #default>
          <ListLoading v-if="connectionStore.modalLoadingVisible"/>

          <div v-else>
            <div class="main__modal-info"
                 v-if="connectionStore.lastCommand === 'get_system_info'"
            >
              {{connectionStore.PCInfo}}
            </div>

            <div class="main__modal-info"
                 v-else-if="connectionStore.lastCommand === 'find_installed_programs'"
            >
              {{connectionStore.allPrograms}}
            </div>

            <div class="main__modal-info" v-else>
              {{connectionStore.showInModalInfo}}
            </div>
          </div>
        </template>
      </Modal>
    </div>
  </div>

</template>