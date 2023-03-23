<template>
  <div class="logo">
    <h1>WAAT</h1>
    <input class="button" type="button" value="시작하기" @click="$push('/login')">
  </div>
</template>

<style lang="scss" scoped>
.logo {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
}
</style>