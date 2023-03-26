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
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: {
        imageCanvas: Object,
        dragCanvas: Object
      },
      context: {
        imageContext: Object,
        dragContext: Object
      },
      boxes: [],
      boxesLength: Number
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
</style>