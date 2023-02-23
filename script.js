// 获取 HTML 元素
const gridContainer = document.querySelector(".grid-container");
const resetButton = document.querySelector("#reset-button");

// 初始化游戏
let grid = [];

function init() {
  try {
    // 清空格子
    gridContainer.innerHTML = "";
  } catch (error) {}

  // 创建空格子
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(null);
      let cell = document.createElement("div");
      cell.classList.add("grid-cell");
      gridContainer.appendChild(cell);
    }
    grid.push(row);
  }
  console.log('查看grid', grid);

  // 随机生成两个数字
  addNumber();
  addNumber();
}

function addNumber() {
  // 随机选择一个空格子
  let emptyCells = getEmptyCells();
  console.log('emptyCells', emptyCells);
  if (emptyCells.length > 0) {
    let cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // 随机选择一个数字
    let number = Math.random() < 0.9 ? 2 : 4;
    // 在格子中显示数字
		console.log(cell.row, cell.col,grid[cell.row][cell.col]);
    grid[cell.row][cell.col] = number;
    displayNumber(cell.row, cell.col, number);
  }
}

function getEmptyCells() {
  let emptyCells = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === null) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }
  return emptyCells;
}

function displayNumber(row, col, number) {
  let cell = gridContainer.children[row * 4 + col];
  cell.innerHTML = number;
  cell.classList.add(`number-${number}`);
}

function moveLeft() {
  let hasMoved = false;
  for (let i = 0; i < 4; i++) {
    let row = grid[i];
    let newRow = [null, null, null, null];
    let k = 0;
    for (let j = 0; j < 4; j++) {
      if (row[j] !== null) {
        if (newRow[k] === null) {
          newRow[k] = row[j];
          if (k != j) {
            hasMoved = true;
          }
        } else if (newRow[k] === row[j]) {
          newRow[k] *= 2;
          hasMoved = true;
          k++;
        } else {
          k++;
          newRow[k] = row[j];
          if (k < j) {
            hasMoved = true;
          }
        }
      }
    }
    grid[i] = newRow;
  }
  console.log('移动111111', hasMoved, grid);
  return hasMoved;
}

// 获取新的数据之后重新填充页面数据
function fillViewNum () {
  for (let i = 0; i < 4; i++) {
    let row = grid[i];
    for (let j = 0; j < 4; j++) {
      if (row[j]) {
        displayNumber(i, j, row[j])
      } else {
        displayNumber(i, j, '')
      }
    }
  }
}

function moveRight() {
  // 左右翻转
  flipGrid();
  // 向左移动
  let hasMoved = moveLeft();
  // 再次左右翻转
  flipGrid();
  return hasMoved;
}

function moveUp() {
  // 转置
  transposeGrid();
  // 向左移动
  let hasMoved = moveLeft();
  // 再次转置
  transposeGrid();
  return hasMoved;
}

function moveDown() {
  // 转置
  transposeGrid();
  // 左右翻转
  flipGrid();
  // 向左移动
  let hasMoved = moveLeft();
  // 再次左右翻转
  flipGrid();
  // 再次转置
  transposeGrid();
  return hasMoved;
}

function transposeGrid() {
  for (let i = 0; i < 4; i++) {
    for (let j = i; j < 4; j++) {
      let temp = grid[i][j];
      grid[i][j] = grid[j][i];
      grid[j][i] = temp;
    }
  }
}

function flipGrid() {
  for (let i = 0; i < 4; i++) {
    grid[i].reverse();
  }
}

function isGameOver() {
  // 游戏结束的条件：没有空格子，也不能继续移动
  return (
    getEmptyCells().length === 0 &&
    !canMoveLeft() &&
    !canMoveRight() &&
    !canMoveUp() &&
    !canMoveDown()
  );
}

function canMoveLeft() {
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      if (
        grid[i][j] !== null &&
        (grid[i][j - 1] === null || grid[i][j - 1] === grid[i][j])
      ) {
        return true;
      }
    }
  }
  return false;
}

function canMoveRight() {
  flipGrid();
  let canMove = canMoveLeft();
  flipGrid();
  return canMove;
}

function canMoveUp() {
  transposeGrid();
  let canMove = canMoveLeft();
  transposeGrid();
  return canMove;
}

function canMoveDown() {
  transposeGrid();
  flipGrid();
  let canMove = canMoveLeft();
  flipGrid();
  transposeGrid();
  return canMove;
}

function updateScore() {
  let score = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] !== null) {
        score += grid[i][j];
      }
    }
  }
  document.querySelector("#score").innerHTML = score;
}

// 绑定事件
document.addEventListener("keydown", (event) => {
  let hasMoved = false;
  console.log('keydown',event);
  switch (event.key) {
    case "ArrowLeft":
      hasMoved = moveLeft();
      break;
    case "ArrowRight":
      hasMoved = moveRight();
      break;
    case "ArrowUp":
      hasMoved = moveUp();
      break;
    case "ArrowDown":
      hasMoved = moveDown();
      break;
  }
  console.log('keydang hasMoved', hasMoved, 'event.key', event.key, 'grid',grid);
  if (hasMoved) {
    fillViewNum();
    addNumber();
    updateScore();
  }
  if (isGameOver()) {
    alert("Game over!");
  }
});

resetButton.addEventListener("click", (event) => {
  grid = [];
  init();
  updateScore();
});

// 启动游戏
init();
updateScore();
