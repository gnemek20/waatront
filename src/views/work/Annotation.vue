<template>
  <div id="Annotation">
    <div class="title">
      <h1>Annotation</h1>
      <hr>
    </div>
    <div class="board">
      <canvas ref="imageCanvas" width="798" height="798"></canvas>
      <canvas :ref="`annotationCanvas${index}`" v-for="(count, index) in annotationCanvasCount" v-bind:key="index" width="798" height="798"></canvas>
      <canvas ref="dragCanvas" width="798" height="798"></canvas>
    </div>
    <div class="side">
      <div class="left">
        <div class="area" v-if="side.left">
          <div class="type">
            <h3>카테고리</h3>
          </div>
          <div class="list">
            <div class="item" v-for="(category, index) in categories" v-bind:key="index">
              <div class="form" :ref="`categoryForm${index}`" @click="clickCategory(category, index)">
                <div class="index">
                  <p>{{ index + 1 }}</p>
                </div>
                <div class="content">
                  <input type="text" v-model="category.name">
                </div>
              </div>
              <div class="remove" @click="removeCategory(index)">
                <img src="@/assets/icon/trash.svg" width="15">
              </div>
            </div>
            <div class="add" @click="addCategory">
              <img src="@/assets/icon/add.svg" width="12">
            </div>
          </div>
        </div>
        <div class="arrow" @click="side.left = !side.left">
          <img v-if="side.left" src="@/assets/icon/leftArrow.svg" width="20">
          <img v-else src="@/assets/icon/rightArrow.svg" width="20">
        </div>
      </div>
      <div class="right">
        <div class="arrow" @click="side.right = !side.right">
          <img v-if="side.right" src="@/assets/icon/rightArrow.svg" width="20">
          <img v-else src="@/assets/icon/leftArrow.svg" width="20">
        </div>
        <div class="area" v-if="side.right">
          <div class="type annotation">
            <h3>어노테이션</h3>
          </div>
          <div class="list upper">
            <div class="item" v-for="(annotation, index) in annotations" v-bind:key="index">
              <div class="form" :ref="`annotationForm${index}`" @click="clickAnnotation(annotation, index)">
                <div class="index">
                  <p>{{ index + 1 }}</p>
                </div>
                <div class="content">
                  <p>{{ annotation.name }}</p>
                </div>
              </div>
              <div class="remove" @click="removeAnnotation(index)">
                <img src="@/assets/icon/trash.svg" width="15">
              </div>
            </div>
          </div>
          <div class="type attribute">
            <h3>속성</h3>
          </div>
          <div class="list lower" v-if="side.attribute">
            <div class="property">
              <div class="name">
                <p>이름</p>
              </div>
              <div class="detail">
                <input type="text" v-model="selected.annotation.content">
              </div>
            </div>
            <div class="property">
              <div class="name">
                <p>색깔</p>
              </div>
              <div class="detail">
                <input type="text" v-model="selected.annotation.dummy">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: {
        imageCanvas: null,
        dragCanvas: null
      },
      context: {
        imageContext: null,
        dragContext: null
      },
      side: {
        left: true,
        right: true,
        attribute: false
      },
      selected: {
        category: null,
        annotation: null,
        categoryRef: null,
        annotationRef: null
      },
      mouse: {
        x: null,
        y: null
      },
      annotations: [],
      annotationCanvasCount: 0,
      categories: [],
      updated: true
    }
  },
  mounted() {
    let id = '';
    const query = this.$route.query.image;
    const images = this.$session.get('images');
    for (let image of images) {
      if (image.name === query) {
        id = image.id;
        break;
      }
    }

    const categories = this.$session.get('categories');
    categories?.forEach((category) => {
      this.categories.push({
        name: category.name
      });
    })

    const annotations = this.$session.get('annotations');
    annotations?.forEach((annotation) => {
      if (annotation.image === query) {
        this.annotationCanvasCount++;
        this.annotations.push(annotation);
      }
    });

    this.canvas.imageCanvas = this.$refs['imageCanvas'];
    this.context.imageContext = this.canvas.imageCanvas.getContext('2d');

    let getImage = new Image();
    getImage.src = `https://drive.google.com/uc?export=view&id=${id}`;
    getImage.onload = () => {
      this.context.imageContext.drawImage(getImage, 0, 0, this.canvas.imageCanvas.width, this.canvas.imageCanvas.height);
    }

    this.canvas.dragCanvas = this.$refs['dragCanvas'];
    this.context.dragContext = this.canvas.dragCanvas.getContext('2d');

    this.canvas.dragCanvas.addEventListener('mousedown', this.mouseDown);
    this.canvas.dragCanvas.addEventListener('mouseup', this.mouseUp);
  },
  updated() {
    if (this.updated) {
      this.updated = false;
      for (let i = 0; i < this.annotations.length; i++) {
        const canvas = this.$refs[`annotationCanvas${i}`][0];
        const context = canvas.getContext('2d');
        this.drawAnnotation(context, this.annotations[i].x, this.annotations[i].y, this.annotations[i].dx, this.annotations[i].dy);
      }
    }
  },
  beforeRouteLeave(from, to, next) {
    for (let i = 0; i < this.annotations.length; i++) {
      this.annotations[i].canvasIndex = i;
    }

    const annotations = [];
    annotations.push(...this.annotations);
    this.$session.get('annotations')?.forEach((annotation) => {
      if (annotation.image !== this.$route.query.image) {
        annotations.push(annotation);
      }
    });

    this.$session.set('categories', this.categories);
    this.$session.set('annotations', annotations);
    next();
  },
  methods: {
    dragAnnotation(x, y, dx, dy) {
      this.context.dragContext.setLineDash([10]);
      this.context.dragContext.clearRect(0, 0, this.canvas.dragCanvas.width, this.canvas.dragCanvas.height);
      this.drawAnnotation(this.context.dragContext, x, y, dx, dy);
    },
    drawAnnotation(context, x, y, dx, dy) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(dx, y);
      context.lineTo(dx, dy);
      context.lineTo(x, dy);
      context.closePath();
      context.stroke();
    },
    addCategory() {
      this.categories.push({
        name: ''
      });
    },
    removeCategory(index) {
      this.categories.splice(index, 1);

      if (this.selected.category !== null) {
        this.selected.categoryRef.style.backgroundColor = '#f0f0f0';
        this.selected.categoryRef = null;
        this.selected.category = null;
      }
    },
    clickCategory(category, index) {
      if (this.selected.categoryRef === this.$refs[`categoryForm${index}`][0]) {
        this.selected.categoryRef.style.backgroundColor = '#f0f0f0';
        this.selected.categoryRef = null;
        this.selected.category = null;
      }
      else {
        Object.keys(this.$refs).forEach((key) => {
          if (key.includes('categoryForm') && this.$refs[key].length !== 0) {
            this.$refs[key][0].style.backgroundColor = '#f0f0f0'
          }
        });

        this.selected.category = category
        this.selected.categoryRef = this.$refs[`categoryForm${index}`][0];
        this.selected.categoryRef.style.backgroundColor = '#c9c9c9';
      }
    },
    removeAnnotation(index) {
      this.$refs[`annotationCanvas${this.annotations[index].canvasIndex}`][0].remove();
      this.annotations.splice(index, 1);

      if (this.selected.annotation !== null) {
        this.side.attribute = false;
        this.selected.annotationRef.style.backgroundColor = '#f0f0f0';
        this.selected.annotationRef = null;
        this.selected.annotation = null;
      }
    },
    clickAnnotation(annotation, index) {
      if (this.selected.annotationRef === this.$refs[`annotationForm${index}`][0]) {
        this.side.attribute = false;
        this.selected.annotationRef.style.backgroundColor = '#f0f0f0';
        this.selected.annotationRef = null;
        this.selected.annotation = null;
      }
      else {
        Object.keys(this.$refs).forEach((key) => {
          if (key.includes('annotationForm') && this.$refs[key].length !== 0) {
            this.$refs[key][0].style.backgroundColor = '#f0f0f0'
          }
        });

        this.selected.annotation = annotation;
        this.selected.annotationRef = this.$refs[`annotationForm${index}`][0];
        this.selected.annotationRef.style.backgroundColor = '#c9c9c9';
        this.side.attribute = true;
      }
    },

    /* Drag Event */
    mouseDown(event) {
      this.annotationCanvasCount++;

      this.mouse.x = event.offsetX;
      this.mouse.y = event.offsetY;

      this.canvas.dragCanvas.addEventListener('mousemove', this.mouseMove);
    },
    mouseMove(event) {
      this.dragAnnotation(this.mouse.x, this.mouse.y, event.offsetX, event.offsetY);
    },
    mouseUp(event) {
      this.canvas.dragCanvas.removeEventListener('mousemove', this.mouseMove);
      this.context.dragContext.clearRect(0, 0, this.canvas.dragCanvas.width, this.canvas.dragCanvas.height);

      this.annotations.push({
        image: this.$route.query.image,
        canvasIndex: this.annotationCanvasCount - 1,
        name: this.selected.category === null ? '' : this.selected.category.name,
        x: Math.min(this.mouse.x, event.offsetX),
        y: Math.min(this.mouse.y, event.offsetY),
        dx: Math.max(this.mouse.x, event.offsetX),
        dy: Math.max(this.mouse.y, event.offsetY)
      });

      const canvas = this.$refs[`annotationCanvas${this.annotationCanvasCount - 1}`][0];
      const context = canvas.getContext('2d');

      this.drawAnnotation(context, this.mouse.x, this.mouse.y, event.offsetX, event.offsetY);
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
.board {
  display: flex;
  justify-content: center;
  canvas {
    position: absolute;
    border: 1px solid dimgray;
  }
}
.side {
  position: absolute;
  top: 0;
  .left {
    position: fixed;
    left: 0;
    display: flex;
    .arrow {
      border-right: 1px solid dimgray;
      border-bottom: 1px solid dimgray;
    }
    .area {
      height: 50vh;
      border-right: 1px solid dimgray;
      border-bottom: 1px solid dimgray;
    }
  }
  .right {
    position: fixed;
    right: 0;
    display: flex;
    .area {
      height: 100vh;
      border-left: 1px solid dimgray;
      .upper {
        flex: 2.5;
      }
      .lower {
        flex: 1;
        .property {
          display: flex;
          height: 20px;
          border-bottom: 1px solid dimgray;
          font-size: 15px;
          .name {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            border-right: 1px solid dimgray;
          }
          .detail {
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
            padding: 0px 3px;
          }
          input {
            width: 100%;
            background-color: inherit;
            outline: none;
            border: none;
          }
        }
      }
    }
    .arrow {
      border-left: 1px solid dimgray;
      border-bottom: 1px solid dimgray;
    }
    .attribute {
      border-top: 1px solid dimgray;
    }
  }
  .area {
    display: flex;
    flex-direction: column;
    width: 300px;
    background-color: #f0f0f0;
  }
  .arrow {
    display: flex;
    height: 20px;
    padding: 5px;
    background-color: #f0f0f0;
  }
  .arrow:hover {
    cursor: pointer;
    background-color: #c9c9c9;
  }
  .type {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 2.5px 0px;
    border-bottom: 1px solid dimgray;
  }
  .list {
    width: 100%;
    height: 100%;
    overflow: scroll;
    overflow-x: hidden;
    box-shadow: inset 0px 0px 3px 0px dimgray;
    .item {
      display: flex;
      align-items: center;
      height: 20px;
      border-bottom: 1px solid dimgray;
      font-size: 15px;
      .form {
        display: flex;
        width: 100%;
        height: 100%;
        .index {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 35px;
          height: 100%;
          padding: 0px 3px;
          border-right: 1px solid dimgray;
        }
        .content {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          padding: 0px 3px;
          input {
            width: 100%;
            background-color: inherit;
            outline: none;
            border: none;
          }
        }
      }
      .form:hover {
        cursor: pointer;
        background-color: #c9c9c9;
      }
      .remove {
        display: flex;
        height: 100%;
        padding: 0px 3px;
        border-left: 1px solid dimgray;
      }
      .remove:hover {
        cursor: pointer;
        background-color: #c9c9c9;
      }
    }
    .add {
      display: flex;
      justify-content: center;
      margin: 3px;
      padding: 3px;
      border: 1px solid #f0f0f0;
    }
    .add:hover {
      cursor: pointer;
      border: 1px dashed dimgray;
    }
  }
}
</style>