<template>
  <div id="Workspace">
    <div class="title">
      <h1>Workspace</h1>
      <hr>
    </div>
    <div class="list">
      <p>chick</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: []
    }
  },
  async created() {
    const { status, data } = await this.$post('/drive/images', {
      workspace: this.$session.get('workspace')
    });

    if (status === 200) {
      for (let i = 0; i < data.length; i++) {
        this.images.push({
          id: data[i].id,
          name: data[i].name
        })
      }
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

.list {
  display: grid;
  justify-content: center;
  margin: 0px 300px;
  grid-template-columns: repeat(auto-fill, 150px);
  grid-auto-rows: 150px;
  gap: 20px;
}

@media (max-width: 1024px) {
  .list {
    margin: 0px 100px;
  }
}
</style>