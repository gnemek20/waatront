<template>
  <div>
    <h1>login</h1>
    <div class="id-form">
      <p>아이디</p>
      <input type="text" v-model="id">
    </div>
    <div class="pwd-form">
      <p>비밀번호</p>
      <input type="password" v-model="pwd">
    </div>
    <input type="button" value="로그인" @click="login">
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      pwd: ''
    }
  },
  methods: {
    login() {
      console.log(this.id, this.pwd)
    }
  }
}
</script>