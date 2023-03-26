<template>
  <div id="Annotation">
    <div class="title">
      <h1>Annotation</h1>
      <hr>
    </div>
    <div class="board">
      <canvas ref="imageCanvas" width="798" height="798"></canvas>
      <canvas :ref="`boxCanvas${index}`" v-for="(box, index) in boxes" v-bind:key="index" width="798" height="798"></canvas>
      <canvas ref="dragCanvas" width="798" height="798"></canvas>
    </div>
    <div class="side">
      <div class="left">
        <div class="area" v-if="side.left">
          <div class="type">
            <h3>클래스</h3>
          </div>
          <div class="list">
            <div class="item" v-for="(_class, index) in classes" v-bind:key="index">
              <div class="form" :ref="`classForm${index}`" @click="clickClass(_class, index)">
                <div class="index">
                  <p>{{ index + 1 }}</p>
                </div>
                <div class="content">
                  <input type="text" v-model="_class.content">
                </div>
              </div>
              <div class="remove" @click="removeClass(index)">
                <img src="@/assets/icon/trash.svg" width="15">
              </div>
            </div>
            <div class="add" @click="addClass">
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
          <div class="type object">
            <h3>오브젝트</h3>
          </div>
          <div class="list">
            <p>오브젝트 리스트</p>
          </div>
          <div class="type attribute">
            <h3>속성</h3>
          </div>
          <div class="list" v-if="side.attribute">
            <p>속성 리스트</p>
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
        class: null,
        object: null,
        classRef: null,
        objectRef: null
      },
      boxes: [],
      boxesLength: Number,
      classes: []
    }
  },
  mounted() {
    this.canvas.imageCanvas = this.$refs['imageCanvas'];
    this.context.imageContext = this.canvas.imageCanvas.getContext('2d');

    let getImage = new Image();
    getImage.src = `https://drive.google.com/uc?export=view&id=${this.$session.get('image')}`;
    getImage.onload = () => {
      this.context.imageContext.drawImage(getImage, 0, 0, this.canvas.imageCanvas.width, this.canvas.imageCanvas.height);
    }

    this.canvas.dragCanvas = this.$refs['dragCanvas'];
    this.context.dragContext = this.canvas.dragCanvas.getContext('2d');

    this.canvas.dragCanvas.addEventListener('mousedown', this.mouseDown);
    this.canvas.dragCanvas.addEventListener('mouseup', this.mouseUp);
  },
  methods: {
    dragBox(x, y, dx, dy) {
      this.context.dragContext.setLineDash([10]);
      this.context.dragContext.clearRect(0, 0, this.canvas.dragCanvas.width, this.canvas.dragCanvas.height);
      this.drawBox(this.context.dragContext, x, y, dx, dy);
    },
    drawBox(context, x, y, dx, dy) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(dx, y);
      context.lineTo(dx, dy);
      context.lineTo(x, dy);
      context.closePath();
      context.stroke();
    },
    addClass() {
      this.classes.push({
        index: this.classes.length,
        content: ''
      })
    },
    removeClass(index) {
      this.classes.splice(index, 1);
    },
    clickClass(_class, index) {
      if (this.selected.classRef === this.$refs[`classForm${index}`][0]) {
        this.selected.classRef.style.backgroundColor = '#f0f0f0';
        this.selected.classRef = null;
        this.selected.class = null;
      }
      else {
        Object.keys(this.$refs).forEach((key) => {
          if (key.includes('classForm')) {
            this.$refs[key][0].style.backgroundColor = '#f0f0f0'
          }
        })

        this.selected.class = _class
        this.selected.classRef = this.$refs[`classForm${index}`][0];
        this.selected.classRef.style.backgroundColor = '#c9c9c9';
      }
    },

    /* Drag Event */
    mouseDown(event) {
      this.boxesLength = this.boxes.length;
      this.boxes.push({
        x: event.offsetX,
        y: event.offsetY,
        dx: Number,
        dy: Number
      });

      this.canvas.dragCanvas.addEventListener('mousemove', this.mouseMove);
    },
    mouseMove(event) {
      this.dragBox(this.boxes[this.boxesLength].x, this.boxes[this.boxesLength].y, event.offsetX, event.offsetY);
    },
    mouseUp(event) {
      this.canvas.dragCanvas.removeEventListener('mousemove', this.mouseMove);
      this.context.dragContext.clearRect(0, 0, this.canvas.dragCanvas.width, this.canvas.dragCanvas.height);

      this.boxes[this.boxesLength].dx = Math.max(this.boxes[this.boxesLength].x, event.offsetX);
      this.boxes[this.boxesLength].dy = Math.max(this.boxes[this.boxesLength].y, event.offsetY);
      this.boxes[this.boxesLength].x = Math.min(this.boxes[this.boxesLength].x, event.offsetX);
      this.boxes[this.boxesLength].y = Math.min(this.boxes[this.boxesLength].y, event.offsetY);

      const canvas = this.$refs[`boxCanvas${this.boxesLength}`][0];
      const context = canvas.getContext('2d');

      this.drawBox(context, this.boxes[this.boxesLength].x, this.boxes[this.boxesLength].y, this.boxes[this.boxesLength].dx, this.boxes[this.boxesLength].dy);
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