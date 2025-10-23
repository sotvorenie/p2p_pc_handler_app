<script setup>
import {computed, onMounted, reactive, ref} from "vue";

import {onSubmit} from "@/composables/useFormValidation.js";

import Messages from "@/components/Messages.vue";

import Button from "@/components/common/Button.vue";
import Message from "@/components/common/Message.vue";
import AppInput from "@/components/common/AppInput.vue";
import LeftModal from "@/components/common/LeftModal.vue";
import Modal from "@/components/common/Modal.vue";

import Delete from "@/assets/icons/Delete.vue";

import useConnectionStore from "@/store/useConnectionStore.js";
const connectionStore = useConnectionStore();

//=========================================================//

//=========================================================//
//-- модальное окно --//
// видимость модального окнанастроек подключения (этого компонента)
const connectModalVisible = ref(false)
//=========================================================//


//=========================================================//
//-- для полей ввода IP-адреса --//
// маска для автоматического проставления точек в IP-адресе
const formatIp = (value) => {
  let digits = value.replace(/\D/g, '')

  let result = ''
  if (digits.length > 0) result += digits.slice(0, 3)
  if (digits.length > 3) result += '.' + digits.slice(3, 6)
  if (digits.length > 6) result += '.' + digits.slice(6, 7)
  if (digits.length > 7) result += '.' + digits.slice(7, 10)

  return result
}
//=========================================================//


//=========================================================//
//-- список IP-адресов --//
// список добавленных IP-адресов
const ipList = ref([])

// видимость блока сообщения "Скопировано" при выборе IP-адреса
const ipListMessageVisible = ref(false)


// выбор IP-адреса из списка
const handleCopyIp = (name) => {
  connectionStore.ipName = name
  ipListMessageVisible.value = true
}

// удаление IP-адреса из списка
const handleDeleteIp = (index) => {
  if (!confirm('Вы действительно хотите удалить IP-адрес?')) return

  ipList.value.splice(index, 1)

  setToLocStore()
}

// запись в localStorage списка добавленных IP-адресов
const setToLocStore = () => {
  localStorage.setItem('ipList', JSON.stringify(ipList.value))
}

// получение из localStorage списка добавленных IP-адресов
const getFromLocStore = () => {
  ipList.value = JSON.parse(localStorage.getItem('ipList') ?? '[]')
}

// добавление в localStorage информации о последнем запущенном IP-адресе
const setToLocStoreLastIP = () => {
  localStorage.setItem('lastIP', connectionStore.ipName ?? '')
}

// получение из localStorage информации о последнем запущенном IP-адресе
const getFromLocStoreLastIP = () => {
  const ip = localStorage.getItem('lastIP') ?? ''

  if (ip) {
    connectionStore.ipName = ip
  }
}
//=========================================================//


//=========================================================//
//-- добавление нового IP-адреса --//
// видимость блока добавления нового IP-адреса
const isRedactIpList = ref(false)

// данные для полей ввода нового IP-адреса
const newIpData = reactive({
  name: '',
  ip: '',
})


// открытие/закрытие блока добавления нового IP-адреса
const handleIsRedactIpList = () => {
  isRedactIpList.value = !isRedactIpList.value
}

// при нажатии на кнопку "Готово" для добавления нового IP-адреса
const handleAddIpToList = (event) => {
  const check = onSubmit(event)

  if (!check) return

  let obj = {
    name: newIpData.name,
    ip: newIpData.ip,
  }

  ipList.value.push(obj)

  setToLocStore()

  handleCancelAddIpList()
}

// нажатие на кнопку "Отмена" при создании нового IP-адреса
const handleCancelAddIpList = () => {
  newIpData.name = ''
  newIpData.ip = ''

  handleIsRedactIpList()
}
//=========================================================//


//=========================================================//
//-- подключение --//
// текст-статус подключенияы
const connectionStatusText = computed(() => {
  if (connectionStore.isConnecting) return '🔄 Подключение...'
  if (connectionStore.isConnected) return '✅ Подключено'
  if (connectionStore.connectionError) return `❌ ${connectionStore.connectionError}`
  return '🔴 Не подключено'
})


// подключение/отключение от ПК
const handleConnection = (event) => {
  const check = onSubmit(event);

  if (check) {

    if (connectionStore?.isConnected) {
      connectionStore?.disconnect()
    } else {
      connectionStore?.connectToPc()

      setToLocStoreLastIP()
    }
  }
}
//=========================================================//

//=========================================================//
//-- хуки --//
// получаем из localStorage: последний запущенный IP и список добавленных IP-адресов
onMounted(() => {
  getFromLocStoreLastIP()
  getFromLocStore()
})
//=========================================================//
</script>

<template>

  <LeftModal v-model="connectModalVisible">
    <template #activator="{open}">
      <Button class="main__open-left" is-full-width @click="open">
        Настройка подключения
      </Button>
    </template>

    <template #default>
      <div class="connection position-relative">
        <Modal :close-visible="!isRedactIpList">
          <template #activator="{open}">
            <Button class="connection__open position-absolute"
                    @click="open"
            >
              Список адресов
            </Button>
          </template>

          <template #default>
            <div v-if="!isRedactIpList">
              <h5 class="connection__title text-center">Список добавленных IP-адресов</h5>
              <ul class="connection__list flex flex-column" v-if="ipList?.length">
                <li v-for="(ip, index) in ipList"
                    :key="index"
                    :class="{
                      'connection__item flex flex-align-center flex-between': true,
                      'is-active': connectionStore?.ipName === ip.ip
                    }"
                    @click="handleCopyIp(ip.ip)"
                >
                  <div class="flex flex-column">
                    <span>{{ip.name}}</span>
                    <span>{{ip.ip}}</span>
                  </div>

                  <button class="connection__delete button-width-svg recolor-svg button-ball"
                          type="button"
                          @click.stop="handleDeleteIp(index)"
                  >
                    <Delete/>
                  </button>
                </li>
              </ul>
            </div>

            <div v-else>
              <form class="flex flex-column"
                    novalidate
                    method="post"
                    @submit.prevent="handleAddIpToList"
                    data-js-form
              >
                <h5 class="connection__title text-center">Добавление IP-адреса</h5>
                <AppInput title="Название адреса"
                          name="name-address"
                          v-model="newIpData.name"
                />
                <AppInput title="Адрес"
                          name="address"
                          v-model="newIpData.ip"
                          :max-length="13"
                          :min-length="11"
                          @input="newIpData.ip = formatIp($event.target.value)"
                />

                <Button class="connection__done" is-submit>Готово</Button>
                <Button @click="handleCancelAddIpList">Отмена</Button>
              </form>
            </div>

            <Button v-if="!isRedactIpList"
                    @click="handleIsRedactIpList"
            >
              Добавить +
            </Button>
          </template>
        </Modal>

        <Message text="Скопировано" v-model="ipListMessageVisible"/>

        <form class="connection__form flex flex-column"
              novalidate
              method="post"
              @submit.prevent="handleConnection"
              data-js-form
        >
          <AppInput class="connection__input"
                    v-model="connectionStore.ipName"
                    title="IP-адрес"
                    name="ip"
                    :max-length="13"
                    :min-length="11"
                    @input="connectionStore.ipName = formatIp($event.target.value)"
          />
          <AppInput class="connection__input"
                    v-model="connectionStore.portName"
                    title="Порт"
                    name="port"
                    :max-length="4"
                    :min-length="4"
          />

          <Button is-full-width
                  is-submit
                  :is-loading="connectionStore?.isConnecting"
                  :is-disabled="connectionStore?.isConnecting"
          >
            {{connectionStore.isConnected ? 'Отключиться' : 'Подключиться'}}
          </Button>
        </form>

        <div class="connection__status">
          {{connectionStatusText}}
        </div>

        <Messages v-model="connectionStore.connectionMessages"/>
      </div>
    </template>
  </LeftModal>

</template>