<script setup>
import {ref} from "vue";

import {onCheckSubmit} from "@/composables/useFormValidation.js";

import Button from "@/components/common/Button.vue";
import AppInput from "@/components/common/AppInput.vue";

import useConnectionStore from "@/store/useConnectionStore.js";
const connectionStore = useConnectionStore();

//=========================================================//

//=========================================================//
//-- табы --//
// индекс активного таба
const programActiveTab = ref(0)


// клик на таб (для выбора активного таба)
const handleProgramTab = (index) => {
  programActiveTab.value = index
}
//=========================================================//


//=========================================================//
//-- запуск программ --//
// название запускаемой программы
const startProgramName = ref('')


// клик на "Отправить" для запуска программы
const handleStartProgram = (event) => {
  onCheckSubmit(event, startProgram)
}

// отправка команды для запуска программы
const startProgram = () => {
  connectionStore?.sendCommand('start_program', startProgramName.value)
  startProgramName.value = ''
}
//=========================================================//


//=========================================================//
//-- закрытие программ --//
// название закрываемой программы
const closeProgramName = ref('')


// клик на "Отправить" для закрытия программы
const handleCloseProgram = (event) => {
  onCheckSubmit(event, closeProgram)
}

// отправка команды для закрытия программы
const closeProgram = () => {
  connectionStore?.sendCommand('close_program', closeProgramName.value)
  closeProgramName.value = ''
}
//=========================================================//


//=========================================================//
//-- убийство программ --//
// название убиваемой программы
const killProgramName = ref('')


// клик на "Отправить" для убийства программы
const handleKillProgram = (event) => {
  onCheckSubmit(event, killProgram)
}

// отправка команды для убийства программы
const killProgram = () => {
  connectionStore?.sendCommand('kill_program', killProgramName.value)
  killProgramName.value = ''
}
//=========================================================//
</script>

<template>

  <div class="main__item">
    <h4 class="main__title">Программный контроль:</h4>
    <div class="main__btn-tabs row">
      <Button :class="{
                      'main__btn col': true,
                      'is-active': programActiveTab === 0
                    }"
              @click="handleProgramTab(0)"
      >
        Запустить
      </Button>
      <Button :class="{
                      'main__btn col': true,
                      'is-active': programActiveTab === 1
                    }"
              @click="handleProgramTab(1)"
      >
        Закрыть
      </Button>
      <Button :class="{
                      'main__btn col': true,
                      'is-active': programActiveTab === 2
                    }"
              @click="handleProgramTab(1)"
      >
        Убить
      </Button>
    </div>

    <form class="main__form flex flex-column"
          novalidate
          method="post"
          @submit.prevent="handleStartProgram"
          data-js-form
          v-if="programActiveTab === 0"
    >
      <AppInput v-model="startProgramName"
                title="Название программы"
                name="start-program"
                :is-dark="false"
      />
      <Button is-submit :is-disabled="!connectionStore?.isConnected">Отправить</Button>
    </form>

    <form class="main__form flex flex-column"
          novalidate
          method="post"
          @submit.prevent="handleCloseProgram"
          data-js-form
          v-if="programActiveTab === 1"
    >
      <AppInput v-model="closeProgramName"
                title="Название программы"
                name="kill-program"
                :is-dark="false"
      />
      <Button is-submit :is-disabled="!connectionStore?.isConnected">Отправить</Button>
    </form>

    <form class="main__form flex flex-column"
          novalidate
          method="post"
          @submit.prevent="handleKillProgram"
          data-js-form
          v-if="programActiveTab === 2"
    >
      <AppInput v-model="killProgramName"
                title="Название программы"
                name="kill-program"
                :is-dark="false"
      />
      <Button is-submit :is-disabled="!connectionStore?.isConnected">Отправить</Button>
    </form>
  </div>

</template>