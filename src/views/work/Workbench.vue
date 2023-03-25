<template>
  <div id="Workbench">
    <div class="title">
      <h1>Workbench</h1>
      <hr>
    </div>
    <div class="list">
      <div class="workspace" @click="clickWorkspace(workspace)" v-for="(workspace, index) in workspaces" v-bind:key="index">
        <p>{{ workspace.name }}</p>
      </div>
      <div class="new" v-if="add">
        <textarea v-model="name" @keypress.enter="addWorkspace" />
        <div class="decision">
          <button @click="changeAddStatus(false)">취소</button>
          <button @click="addWorkspace()">확인</button>
        </div>
      </div>
      <div class="add" @click="changeAddStatus(true)">
        <img src="@/assets/icon/add.svg">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      workspaces: [],
      name: '',
      add: false
    }
  },
  async beforeCreate() {
    const { status, data } = await this.$post('/drive/workspaces', {
      workbench: this.$session.get('workbench')
    });

    if (status === 200) {
      data.forEach((data) => {
        this.workspaces.push({
          name: data.name,
          id: data.id
        });
      });
    }
  },
  methods: {
    changeAddStatus(bool) {
      this.add = bool;
    },
    async addWorkspace() {
      const { status, data } = await this.$post('/drive/addWorkspace', {
        workbench: this.$session.get('workbench'),
        name: this.name
      })

      if (status === 200) {
        this.workspaces.push({
          name: this.name,
          id: data
        });

        this.name = '';
        this.changeAddStatus(false);
      }
    },
    clickWorkspace(workspace) {
      this.$session.set('workspace', workspace.id);
      this.$push('/workspace');
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
  margin: 0px 200px;
  grid-template-columns: repeat(auto-fill, 350px);
  grid-auto-rows: 150px;
  gap: 20px;

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

  .add {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .add:hover {
    cursor: pointer;
    border: 1px solid dimgray;
    border-radius: 5px;
    border-style: dashed;
  }

  .new {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5px 10px;
    border: 1px solid dimgray;
    border-radius: 5px;

    textarea {
      width: 100%;
      height: 100%;
      outline: none;
      border: none;
      resize: none;
    }

    .decision {
      display: flex;
      justify-content: space-between;

      button {
        cursor: pointer;
        width: 100px;
      }
    }
  }
}

@media (max-width: 1024px) {
  .list {
    margin: 0px;
  }
}
</style>