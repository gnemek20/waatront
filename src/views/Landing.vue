<template>
  <div id="Landing">
    <h1>WAAT</h1>
    <button @click="$push('/login')">시작하기</button>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    this.$session.destroy();
  }
}
</script>