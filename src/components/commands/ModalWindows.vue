<script setup>
import {ref} from "vue";

import {onCheckSubmit} from "@/composables/useFormValidation.js";

import Button from "@/components/common/Button.vue";
import AppInput from "@/components/common/AppInput.vue";

import Arrow from "@/assets/icons/Arrow.vue";

import useConnectionStore from "@/store/useConnectionStore.js";
const connectionStore = useConnectionStore();

//=========================================================//

//=========================================================//
//-- табы --//
// индекс активного таба
const modalActiveTab = ref(0)


// при клике на таб (выбор активного таба)
const handleModalTab = (index) => {
  modalActiveTab.value = index
}
//=========================================================//


//=========================================================//
//-- синий экран --//
// сообщение для синего экрана
const blueScreenMessage = ref('')


// клик на "Отправить" для синего окна
const handleBlueScreen = (event) => {
  onCheckSubmit(event, showBlueScreen)
}

// отправка команды для показа синего экрана
const showBlueScreen = () => {
  connectionStore?.sendCommand('show_blue_screen', blueScreenMessage.value)
  blueScreenMessage.value = ''
}
//=========================================================//


//=========================================================//
//-- модальные окна --//
// сообщение для модального окна
const modalMessage = ref('')

// тип модального окна
const modalWindowType = ref('info')


// клик на кнопку "Отправить" для модального окна
const handleModalWindow = (event) => {
  onCheckSubmit(event, showModalMessage)
}

// отправка команды для показа модального окна
const showModalMessage = () => {
  const messageData = {
    type: modalWindowType.value,
    text: modalMessage.value
  }

  connectionStore?.sendCommand('show_custom_message', messageData)
  modalMessage.value = ''
}
//=========================================================//
</script>

<template>

  <div class="main__item">
    <h4 class="main__title">Модальные окна:</h4>
    <div class="main__btn-tabs row">
      <Button :class="{
                      'main__btn col': true,
                      'is-active': modalActiveTab === 0
                    }"
              @click="handleModalTab(0)"
      >
        Синий экран
      </Button>
      <Button :class="{
                      'main__btn col': true,
                      'is-active': modalActiveTab === 1
                    }"
              @click="handleModalTab(1)"
      >
        Модальное окно
      </Button>
    </div>
    <form class="main__form flex flex-column"
          novalidate
          method="post"
          @submit.prevent="handleBlueScreen"
          data-js-form
          v-if="modalActiveTab === 0"
    >
      <AppInput v-model="blueScreenMessage"
                title="Синий экран"
                name="blue-screen"
                :is-dark="false"
      />
      <Button is-submit :is-disabled="!connectionStore?.isConnected">Отправить</Button>
    </form>

    <form class="main__form flex flex-column"
          novalidate
          method="post"
          @submit.prevent="handleModalWindow"
          data-js-form
          v-if="modalActiveTab === 1"
    >
      <div class="main__select position-relative">
        <select v-model="modalWindowType">
          <option value="info">ℹ️ Информация</option>
          <option value="warning">⚠️ Предупреждение</option>
          <option value="error">❌ Ошибка</option>
        </select>

        <i class="recolor-svg i-svg position-absolute">
          <Arrow/>
        </i>
      </div>

      <AppInput v-model="modalMessage"
                title="Модальное окно"
                name="modal-window"
                :is-dark="false"
      />
      <Button is-submit :is-disabled="!connectionStore?.isConnected">Отправить</Button>
    </form>
  </div>

</template>