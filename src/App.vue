<template>
  <div id="app">
    <Loading v-if="$store.state.loading" />
    <router-view />
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue';

export default {
  components: {
    Loading
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
* {
  margin: 0;
  padding: 0;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
::-webkit-scrollbar {
  width: 10px;
  background-color: gray;
}
::-webkit-scrollbar-thumb {
  background-color: #333333;
}
</style>
