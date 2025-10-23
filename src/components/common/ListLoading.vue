<script setup>

</script>

<template>

  <ul class="list-loading">
    <li class="list-loading__item position-relative"
        v-for="i in [0, 1, 2, 3, 4]"
        :key="i"
    ></li>
  </ul>

</template>