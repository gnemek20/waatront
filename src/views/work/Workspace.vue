<template>
  <div id="Workspace">
    <div class="title">
      <h1>Workspace</h1>
      <hr>
    </div>
    <div class="option">
      <button @click="getCoco">coco</button>
    </div>
    <div class="list">
      <div class="image" @click="$push(`/annotation?image=${image.name}`)" v-for="(image, index) in images" v-bind:key="index">
        <canvas :ref="image.name" width="148" height="148" />
      </div>
      <div class="add">
        <label for="input">
          <img src="@/assets/icon/add.svg">
        </label>
        <input id="input" type="file" @change="uploadImage" accept="image/*" multiple>
      </div>
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
  async beforeCreate() {
    const save = await this.$post('/drive/getSave', {
      workspace: this.$session.get('workspace')
    });

    const saveString = save.data;
    const categoriesString = saveString.split('\n')[0].split('|');
    const annotationsString = saveString.split('\n')[1].split('|');

    const categories = [];
    for (let i = 1; i < categoriesString.length; i++) {
      categories.push({
        name: categoriesString[i]
      });
    }
    this.$session.set('categories', categories);

    const annotations = [];
    for (let i = 1; i < annotationsString.length; i++) {
      const annotationString = annotationsString[i].split('@');
      annotations.push({
        image: annotationString[0],
        canvasIndex: annotationString[1],
        name: annotationString[2],
        x: annotationString[3],
        y: annotationString[4],
        dx: annotationString[5],
        dy: annotationString[6]
      });
    }
    this.$session.set('annotations', annotations);

    const images = await this.$post('/drive/images', {
      workspace: this.$session.get('workspace')
    });

    if (images.status === 200) {
      images.data.forEach((image) => {
        this.images.push({
          id: image.id,
          name: image.name,
          width: 0,
          height: 0
        });
      });
    }
  },
  updated() {
    for (let i = 0; i < this.images.length; i++) {
      const canvas = this.$refs[`${this.images[i].name}`][0];
      const context = canvas.getContext('2d');

      let getImage = new Image();
      getImage.src = `https://drive.google.com/uc?export=view&id=${this.images[i].id}`;
      getImage.onload = () => {
        context.drawImage(getImage, 0, 0, canvas.width, canvas.height);
        this.images[i].width = getImage.width;
        this.images[i].height = getImage.height;
        this.$session.set('images', this.images);
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.updateCoco();
    this.updateSave();

    if (to.name !== 'annotation') {
      this.$session.remove('workspace');
      this.$session.remove('images');
      this.$session.remove('categories');
      this.$session.remove('annotations');
    }
 
    next();
  },
  methods: {
    async uploadImage() {
      const input = document.getElementById('input');
      const files = input.files;

      if (files.length > 0) {
        const formData = new FormData();
        formData.append('workspace', this.$session.get('workspace'));
        for (let file of files) {
          formData.append('image', file);
        }

        const { status, data } = await this.$post('/drive/uploadImage', formData);
  
        if (status === 200) {
          data.forEach((data) => {
            this.images.push({
              id: data.id,
              name: data.name,
              width: 0,
              height: 0
            });
          });

          input.value = null;
        }
      }
    },
    async getCoco() {
      const { status, data } = await this.$post('/drive/getCoco', {
        workspace: this.$session.get('workspace')
      });

      if (status === 200) {
        window.open(`https://drive.google.com/file/d/${data}`);
      }
    },
    async updateCoco() {
      const images = this.$session.get('images');
      const categories = this.$session.get('categories');
      const annotations = this.$session.get('annotations');

      const { status, data } = await this.$post('/drive/updateCoco', {
        workspace: this.$session.get('workspace'),
        images: images,
        categories: categories,
        annotations: annotations
      });
    },
    async updateSave() {
      const categories = this.$session.get('categories');
      const annotations = this.$session.get('annotations');

      const { status, data } = await this.$post('/drive/updateSave', {
        workspace: this.$session.get('workspace'),
        categories: categories,
        annotations: annotations
      });
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
.option {
  display: flex;
  width: 800px;
  margin: 0px auto 20px;
  justify-content: end;
}
.list {
  display: grid;
  justify-content: center;
  margin: 0px 300px;
  grid-template-columns: repeat(auto-fill, 150px);
  grid-auto-rows: 150px;
  gap: 20px;
  canvas {
    border-radius: 5px;
  }
  .image {
    border: 1px solid dimgray;
    border-radius: 5px;
    background-image: linear-gradient(to right, #fbfcb9be, #ffcdf3aa, #65d3ffaa);
    background-origin: border-box;
    background-clip: content-box, border-box;
  }
  .image:hover {
    cursor: pointer;
    box-shadow: 0px 0px 5px 0px dimgray;
  }
  .add {
    display: flex;
    justify-content: center;
    align-items: center;
    label {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    input {
      width: 0px;
    }
  }
  .add:hover {
    border: 1px solid dimgray;
    border-radius: 5px;
    border-style: dashed;
  }
}
@media (max-width: 1024px) {
  .list {
    margin: 0px 100px;
  }
}
</style>