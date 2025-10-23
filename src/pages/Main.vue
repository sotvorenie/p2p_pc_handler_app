<script setup>
import {onUnmounted, ref} from "vue";

import {Swiper, SwiperSlide} from "swiper/vue";
import 'swiper/css'
import {FreeMode} from "swiper/modules";

import MainCommands from "@/components/commands/MainCommands.vue";
import ProgrammsCommands from "@/components/commands/SystemCommands.vue";
import ModalWindows from "@/components/commands/ModalWindows.vue";
import SystemCommands from "@/components/commands/ProgrammsCommands.vue";

import Messages from "@/components/Messages.vue";

import useConnectionStore from "@/store/useConnectionStore.js";
import Connection from "@/components/Connection.vue";
const connectionStore = useConnectionStore();

//=========================================================//

//=========================================================//
//-- табы --//
// названия табов для переключения между компонентами-командами
const tabs = [
    'Основные',
    'Программные',
    'Модальные',
    'Системные',
]

// индекс активного таба
const activeTab = ref(0)


// при клике на таб (чтобы сделать его активным табом)
const handleTab = (index) => {
  activeTab.value = index
}
//=========================================================//


//=========================================================//
//-- компоненты команд --//
// компоненты-команды для <Component :is=".." />
const commandComponents = [
    MainCommands,
    SystemCommands,
    ModalWindows,
    ProgrammsCommands,
]
//=========================================================//


//=========================================================//
//-- хуки --//
// отключаемся от ПК
onUnmounted(() => {
  connectionStore?.disconnect()
})
//=========================================================//
</script>

<template>

  <div class="main">
    <div class="main__inner container">
      <Connection/>

      <Swiper :modules="[FreeMode]"
              :free-mode="true"
              :space-between="20"
              slides-per-view="auto"
              class="main__tabs"
              v-if="connectionStore.isConnected"
      >
        <SwiperSlide v-for="(tab, index) in tabs"
                     :key="index"
                     :class="{
                       'main__tab': true,
                       'is-active': activeTab === index
                     }"
                     @click="handleTab(index)"
        >
          {{tab}}
        </SwiperSlide>
      </Swiper>

      <div class="main__commands" v-if="connectionStore.isConnected">
        <Component :is="commandComponents[activeTab]"/>
      </div>

      <img src="../assets/icons/дианочка.webp"
           alt="Not Connected"
           v-if="!connectionStore.isConnected"
      />

      <Messages is-dark v-model="connectionStore.mainMessages" v-if="connectionStore.isConnected"/>
    </div>
  </div>

</template>