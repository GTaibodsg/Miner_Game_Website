<template>
  <div class="player-info">
    <h3>{{ player.name }}</h3>
    <p>得分: {{ player.score }} | 生命值: {{ player.health }} | 倍率: {{ Math.floor(player.mul / 10) }}.{{ player.mul % 10 }} | 闪避率: {{ player.ign }}% | 回合数: {{ player.Round }}</p>
  </div>
</template>

<script>
export default {
  props: {
    player: Object,
  },
};
</script>