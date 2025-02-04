# Miner Game Website

本项目是 <a href="https://github.com/GTaibodsg/Miner-Game">该项目</a> 的网页实现版本，复刻的是经典模式地图，目前还有些许不完善的地方，包括：

1. 岩浆的扩散逻辑：原项目是每次玩家操作后使用 BFS 算法扩散岩浆，而本项目目前使用每次仅扩散相邻的一格的形式进行扩散。可能 $\cdots\space\cdots$ 可以当做一个特性？
2. 没有好看的 UI 界面。
3. 游戏过程尚没有足够的文本交互信息。

项目运行方法：

1. 首先克隆本地项目

```
git clone https://github.com/GTaibodsg/Miner_Game_Website
```

2. 在终端执行如下命令

```
cd Miner_Game_Website
```

```
npm install
```

```
npm run dev
```