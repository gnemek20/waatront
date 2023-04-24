<template>
  <div id="Login">
    <div class="title">
      <h1>WAAT</h1>
      <hr>
    </div>
    <div class="form">
      <div class="input" @keydown.enter="login">
        <input type="text" v-model="id" placeholder="아이디">
        <div class="divider" />
        <input type="password" v-model="pwd" placeholder="비밀번호">
      </div>
      <button @click="login">로그인</button>
    </div>
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

<style lang="scss" scoped>
.title {
  width: 800px;
  margin: 10px auto 20px;
  h1 {
    margin-bottom: 10px;
  }
}
.form {
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 0px auto;
  .input {
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    border: 1px solid dimgray;
    margin-bottom: 10px;
    input {
      padding: 10px;
      border-radius: 5px;
      border: none;
      outline: none;
    }
    .divider {
      height: 1px;
      background-color: dimgray;
    }
  }
  button {
    cursor: pointer;
  }
}
</style>