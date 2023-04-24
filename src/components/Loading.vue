<template>
  <div class="mask">
    <div class="wrapper">
      <div class="container">
        <div class="area">
          <p>지금은 로딩중!</p>
          <p>잠시만 기다려주세요</p>
          <spinner />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import spinner from './Spinner.vue'

export default {
  components: {
    spinner
  }
}
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  z-index: 1234;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba($color: #000000, $alpha: 0.5);
  display: table;
  .wrapper {
    display: table-cell;
    vertical-align: middle;
    .container {
      width: 200px;
      margin: auto;
      border-radius: 5px;
      background-color: white;
      .area {
        padding: 5px;
      }
    }
  }
}
</style>