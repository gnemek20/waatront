<template>
  <div id="Workbench">
    <div class="title">
      <h1>Workbench</h1>
      <hr>
    </div>
    <div class="list">
      <div class="workspace" v-for="(workspace, index) in workspaces" v-bind:key="index">
        <p>{{ workspace.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      workspaces: []
    }
  },
  async created() {
    const { status, data } = await this.$post('/drive/workspaces', {
      workbench: this.$session.get('workbench')
    });

    if (status === 200) {
      for (let i = 0; i < data.length; i++) {
        this.workspaces.push({
          name: data[i].name,
          id: data[i].id
        });
      }

      console.log(this.workspaces);
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
  margin: 0px 50px;
  grid-template-columns: repeat(auto-fill, 350px);
  grid-auto-rows: 150px;
  gap: 20px;
}

.workspace {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid dimgray;
  border-radius: 5px;
}

.workspace:hover {
  cursor: pointer;
  box-shadow: 0px 0px 10px 0px dimgray;
}
</style>