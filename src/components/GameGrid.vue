<template>
  <div class="game-grid">
    <div v-for="(row, x) in map" :key="x" class="row">
      <div v-for="(cell, y) in row" :key="y" class="cell">
        <img :src="getImageUrl(cell)" :alt="`cell-${cell}`" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    map: Array,
  },
  methods: {
    getImageUrl(cell) {
      // 根据方块编号获取图片路径
      return `src/img/${cell}.png`
    },
  },
};
</script>

<style>
.game-grid {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
}
.cell {
  width: 30px;
  height: 30px;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cell img {
  width: 100%;
  height: 100%;
}
</style>