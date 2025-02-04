<template>
  <div>
    <h1>Miner Game</h1>
    <div v-if="!gameStarted">
      <label for="playerCount">游戏人数（2-16）：</label>
      <input
          type="number"
          id="playerCount"
          v-model.number="playerCount"
          min="2"
          max="16"
      />
      <div v-if="playerCount>=2&&playerCount<=16">
        <div v-for="i in playerCount" :key="i">
          <label :for="`playerName${i}`">玩家 {{ i }} 昵称：</label>
          <input :id="`playerName${i}`" v-model="playerNames[i - 1]" />
        </div>
        <button @click="startGame">开始游戏</button>
      </div>
      <p v-else>请输入一个2~16之间的正整数</p>
    </div>
    <div v-else>
      <GameGrid :map="map" />
      <!--      <PlayerInfo :player="currentPlayer" />-->
      <div v-for="i in players" :key="i">
        <PlayerInfo :player="i"/>
      </div>
      <div v-if="roundResult">
        <h3>回合结果：</h3>
        <p>{{ roundResult }}</p>
      </div>
      <button v-if="!fin" @click="playerAct" :disabled="isGameOver">开始操作</button>
      <button v-else @click="nextTurn" :disabled="isGameOver">下一回合</button>
      <div>
        <p v-if="isGameOver">当前玩家：{{currentPlayer.name}}</p>
      </div>
      <div v-if="isGameOver">
        <h2>游戏结束！</h2>
<!--        <div v-for="i in players" :key="i">-->
<!--          <PlayerInfo :player="i"/>-->
<!--        </div>-->
        <button @click="restartGame">重新开始</button>
      </div>
    </div>
  </div>
</template>

<script>
import { generateMap, checkDanger, mineResource, checkGameOver, spreadLava } from "./utils/gameLogic";
import GameGrid from "./components/GameGrid.vue";
import PlayerInfo from "./components/PlayerInfo.vue";

export default {
  components: {
    GameGrid,
    PlayerInfo,
  },
  data() {
    return {
      gameStarted: false,
      playerCount: 2,
      playerNames: [],
      map: [],
      players: [],
      currentPlayerIndex: 0,
      roundResult: "",
      isGameOver: false,
      x:0,
      y:0,
      fin:false
    };
  },
  computed: {
    currentPlayer() {
      return this.players[this.currentPlayerIndex];
    },
  },
  methods: {
    startGame() {
      // 初始化玩家
      this.players = this.playerNames.map((name) => ({
        name,
        score: 0,
        health: 6,
        mul: 10,
        ign: 0,
        Round: 0,
      }));
      // 初始化地图
      this.map = generateMap();
      this.gameStarted = true;
      this.isGameOver = false;
      this.roundResult = "";
    },
    playerAct(){

      this.fin=true;

      if (this.isGameOver) return;

      const player = this.currentPlayer;
      player.Round++;

      // 随机选择一个格子
      this.x = Math.floor(Math.random() * 16);
      this.y = Math.floor(Math.random() * 16);

      const x=this.x;
      const y=this.y;

      const cell=this.map[x][y];

      // 处理格子内容
      let result = `玩家 ${player.name} 挖到了 (${x+1}, ${y+1})：`;
      if (cell === 1) {
        result += "什么都没有发生。";
      } else if (cell === 2 || cell === 3) {
        if(cell===2)
          result+="糟糕，你触发了炸弹！";
        else
          result+="糟糕，你掉进了岩浆！";
      } else {
        if(cell===4)
          result+="你挖掉了木头！";
        else if(cell===5)
          result+="你挖掉了石头！";
        else if(cell===6)
          result+="你挖掉了煤矿！";
        else if(cell===7)
          result+="你挖掉了铁矿！";
        else if(cell===8)
          result+="你挖掉了金矿！";
        else if(cell===9)
          result+="你挖掉了钻石！";
        else if(cell===10)
          result+="你挖掉了红宝石！";
        else if(cell===11)
          result+="你挖掉了绿宝石！";
        else
          result+="你挖掉了蓝宝石！";
      }

      // 更新回合结果
      this.roundResult = result;

    },
    nextTurn() {


      this.fin=false;

      const player = this.currentPlayer;

      const x=this.x;
      const y=this.y;
      const cell=this.map[x][y];

      let result = `玩家 ${player.name} 挖到了 (${x+1}, ${y+1})：`;
      if (cell === 1) {
        result += "什么都没有发生。";
      } else if (cell === 2 || cell === 3) {
        if(cell===3)
          result+=checkDanger(this.map, x, y, player);
      } else {
        const mineResult = mineResource(this.map, x, y, player);
        if(cell>=10)
          result += mineResult;
        else {
          if(cell===4)
            result+="你挖掉了木头！";
          else if(cell===5)
            result+="你挖掉了石头！";
          else if(cell===6)
            result+="你挖掉了煤矿！";
          else if(cell===7)
            result+="你挖掉了铁矿！";
          else if(cell===8)
            result+="你挖掉了金矿！";
          else if(cell===9)
            result+="你挖掉了钻石！";
        }
      }

      spreadLava(this.map);//检查岩浆扩散

      if(cell===2)
        result+=checkDanger(this.map, x, y, player);

      this.roundResult = result;

      // 检查游戏是否结束
      if (checkGameOver(this.players)) {
        this.isGameOver = true;
        this.roundResult = "所有玩家均已阵亡，游戏结束！";
        return;
      }

      // 切换到下一个玩家
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      while(this.players[this.currentPlayerIndex].health===0)
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    },
    restartGame() {
      this.gameStarted = false;
      this.playerNames = [];
      this.playerCount = 2;
    },
  },
};
</script>