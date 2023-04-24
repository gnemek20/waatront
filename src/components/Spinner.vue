<template>
  <div class="spinner">
    <div class="frame">
      <div class="object" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes spinner {
  100% {
    transform: rotate(1turn);
  }
}
.spinner {
  display: inline-block;
  .frame {
    overflow: hidden;
    width: 20px;
    height: 20px;
    background-color: gray;
    border-radius: 50%;
    border: 1px solid gray;
    animation: spinner 3s linear infinite;
  }
  .object {
    width: 10px;
    height: 10px;
    background-color: white;
  }
}
</style>