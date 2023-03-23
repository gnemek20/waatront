<template>
  <div>
    <h1>Workbench</h1>
    <div class="list">
      <button v-for="workspace in workspaces" v-bind:key="workspace">{{ workspace.name }}</button>
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