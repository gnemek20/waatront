<template>
  <div id="Annotation">
    <div class="title">
      <h1>Annotation</h1>
      <hr>
    </div>
    <div class="canvas">
      <canvas ref="image" width="800" height="800"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    const canvas = this.$refs['image'];
    const context = canvas.getContext('2d');

    let getImage = new Image();
    getImage.src = `https://drive.google.com/uc?export=view&id=${this.$session.get('image')}`;
    getImage.onload = () => {
      context.drawImage(getImage, 0, 0, canvas.width, canvas.height);
      console.log(getImage.width)
      console.log(getImage.height)
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

.canvas {
  display: flex;
  justify-content: center;

  canvas {
    border: 1px solid dimgray;
  }
}
</style>