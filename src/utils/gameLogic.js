// gameLogic.js

// 地图生成函数
export const generateMap = () => {
    const map = Array.from({ length: 16 }, () => Array(16).fill(1)); // 初始化为空（1）
    const resources = [
        { type: 3, count: 2 }, // 岩浆
        { type: 2, count: 3 }, // 炸弹
        { type: 4, count: 64 }, // 木头
        { type: 6, count: 32 }, // 煤矿
        { type: 7, count: 16 }, // 铁矿
        { type: 8, count: 8 }, // 金矿
        { type: 9, count: 3 }, // 钻石
        { type: 10, count: 5 }, // 红宝石
        { type: 11, count: 5 }, // 绿宝石
        { type: 12, count: 5 }, // 蓝宝石
    ];

    resources.forEach(({ type, count }) => {
        let placed = 0;
        while (placed < count) {
            if(type===2)
            {
                const x = Math.floor(Math.random() * 12+2);
                const y = Math.floor(Math.random() * 12+2);
                if (map[x][y] === 1&&(x===0||map[x-1][y]!==3)&&(x===15||map[x+1][y]!==3)&&(y===0||map[x][y-1]!==3)&&(y===15||map[x][y+1]!==3)) {
                    map[x][y] = type;
                    placed++;
                }
            }
            else if(type===4)
            {
                const x = Math.floor(Math.random() * 16);
                const y = Math.floor(Math.random() * 16);
                if (map[x][y] === 1&&(x===0||map[x-1][y]!==3)&&(x===15||map[x+1][y]!==3)&&(y===0||map[x][y-1]!==3)&&(y===15||map[x][y+1]!==3)) {
                    map[x][y] = type;
                    placed++;
                }
            }
            else
            {
                const x = Math.floor(Math.random() * 16);
                const y = Math.floor(Math.random() * 16);
                if (map[x][y] === 1) {
                    map[x][y] = type;
                    placed++;
                }
            }
        }
    });

    for(var i=0;i<16;i++)
    for(var j=0;j<16;j++)
    if(map[i][j]===1)
        map[i][j]=5;

    return map;
};

// 炸弹爆炸函数
export const triggerBomb = (map, x, y) => {
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1], // 上下左右
        [-1, -1], [-1, 1], [1, -1], [1, 1], // 对角线
        [-2,0],[2,0],[0,-2],[0,2],//上下左右，距离为2
    ];

    map[x][y] = 1; // 清除炸弹
    directions.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < 16 && ny >= 0 && ny < 16) {
            if (map[nx][ny] === 2) {
                triggerBomb(map, nx, ny); // 连锁反应
            } else if (map[nx][ny] >= 4) {
                map[nx][ny] = 1; // 清除资源
            }
        }
    });
};

// 岩浆扩散函数
export const spreadLava = (map) => {
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1], // 上下左右
    ];

    const lavaCells = [];
    for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
            if (map[x][y] === 3) {
                lavaCells.push([x, y]);
            }
        }
    }

    lavaCells.forEach(([x, y]) => {
        directions.forEach(([dx, dy]) => {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < 16 && ny >= 0 && ny < 16) {
                if (map[nx][ny] === 1 || map[nx][ny] === 4) {
                    map[nx][ny] = 3; // 扩散岩浆
                } else if (map[nx][ny] === 2) {
                    triggerBomb(map, nx, ny); // 触发炸弹
                }
            }
        });
    });
};

// 检查玩家是否触发危险
export const checkDanger = (map, x, y, player) => {
    const cell = map[x][y];
    if (cell === 2) {
        // 触发炸弹
        if (Math.random() * 100 >= player.ign) {
            player.health = Math.max(0, player.health - 2);
            triggerBomb(map, x, y);
            return "你触发了炸弹，生命值 -2！";
        } else {
            return "你闪避了炸弹！";
        }
    } else if (cell === 3) {
        // 触发岩浆
        if (Math.random() * 100 >= player.ign) {
            player.health = Math.max(0, player.health - 1);
            return "你掉入了岩浆，生命值 -1！";
        } else {
            return "你闪避了岩浆！";
        }
    }
    return null;
};

// 处理玩家挖掘资源
export const mineResource = (map, x, y, player) => {
    const cell = map[x][y];
    let message = "";
    switch (cell) {
        case 4: // 木头
            player.score += Math.floor(player.mul / 10);
            message = "你挖到了木头，得分增加！";
            break;
        case 5: // 石头
            message = "你挖到了石头，但没有收获。";
            break;
        case 6: // 煤矿
            player.score += Math.floor(3 * (player.mul / 10));
            message = "你挖到了煤矿，得分增加！";
            break;
        case 7: // 铁矿
            player.score += Math.floor(8 * (player.mul / 10));
            message = "你挖到了铁矿，得分增加！";
            break;
        case 8: // 金矿
            player.score += Math.floor(24 * (player.mul / 10));
            message = "你挖到了金矿，得分增加！";
            break;
        case 9: // 钻石
            player.score += Math.floor(64 * (player.mul / 10));
            message = "你挖到了钻石，得分增加！";
            break;
        case 10: // 红宝石
            const healthBonus = Math.floor(Math.random() * 5) + 1;
            player.health += healthBonus;
            message = `你挖到了红宝石，生命值 +${healthBonus}！`;
            break;
        case 11: // 绿宝石
            const mulBonus = Math.floor(Math.random() * 10) + 1;
            player.mul += mulBonus;
            message = `你挖到了绿宝石，倍率 +${Math.floor(mulBonus / 10)}.${mulBonus % 10}！`;
            break;
        case 12: // 蓝宝石
            const ignBonus = Math.floor(Math.random() * 30) + 1;
            player.ign = Math.min(90, player.ign + ignBonus);
            message = `你挖到了蓝宝石，闪避率 +${ignBonus}%！`;
            break;
        default:
            message = "什么都没有发生。";
            break;
    }
    map[x][y] = 1; // 清除格子
    return message;
};

// 检查游戏是否结束
export const checkGameOver = (players) => {
    return players.every((player) => player.health <= 0);
};