<template>
  <div id="Login">
    <h1>시작하기</h1>
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
    async login() {
      this.$store.state.loading = true;

      const { status, data } = await this.$post('/drive/login', {
        id: this.id,
        pwd: this.pwd
      });

      if (status === 200) {
        this.$session.set('workbench', data);
        this.$push('/workbench');
      }
      else {
        alert('에러가 발생했습니다. 잠시 후에 다시 시도해주세요.');
      }
      
      this.$store.state.loading = false;
    }
  }
}
</script>