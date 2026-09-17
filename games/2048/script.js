Game();let board = [];
let score = 0;
let isGameOver = false;

const gridElement = document.getElementById('grid');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

function initGame() {
    board = Array(16).fill(0);
    score = 0;
    isGameOver = false;
    gameOverElement.classList.add('hidden');

    addRandomTile();
    addRandomTile();
    updateUI();
}

function addRandomTile() {
    let emptyCells = [];
    for (let i = 0; i < 16; i++) {
        if (board[i] === 0) emptyCells.push(i);
    }
    if (emptyCells.length === 0) return;
    
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
}

function updateUI() {
    gridElement.innerHTML = '';
    scoreElement.textContent = score;

    for (let i = 0; i < 16; i++) {
        let value = board[i];
        let tile = document.createElement('div');
        tile.className = `tile tile-${value}`; 
        tile.textContent = value === 0 ? '' : value; 
        gridElement.appendChild(tile);
    }
}

function moveLeft(row) {
    let arr = row.filter(val => val);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            arr[i + 1] = 0;
        }
    }
    arr = arr.filter(val => val); 
    while (arr.length < 4) arr.push(0);
    return arr;
}

function getMatrix() {
    let matrix = [];
    for (let i = 0; i < 4; i++) {
        matrix.push(board.slice(i * 4, i * 4 + 4));
    }
    return matrix;
}

function setMatrix(matrix) {
    board = [];
    for (let i = 0; i < 4; i++) {
        board = board.concat(matrix[i]);
    }
}

function rotateMatrix(matrix) {
    let newMatrix = Array.from({ length: 4 }, () => Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            newMatrix[j][3 - i] = matrix[i][j];
        }
    }
    return newMatrix;
}

function move(direction) {
    if (isGameOver) return;

    let matrix = getMatrix();
    let moved = false;

    if (direction === 'right') {
        matrix = matrix.map(row => row.reverse());
    } else if (direction === 'up') {
        matrix = rotateMatrix(rotateMatrix(rotateMatrix(matrix))); 
    } else if (direction === 'down') {
        matrix = rotateMatrix(matrix); 
    }

    let newMatrix = [];
    for (let i = 0; i < 4; i++) {
        let newRow = moveLeft(matrix[i]);
        if (matrix[i].join('') !== newRow.join('')) moved = true;
        newMatrix.push(newRow);
    }
    
    if (direction === 'right') {
        newMatrix = newMatrix.map(row => row.reverse());
    } else if (direction === 'up') {
        newMatrix = rotateMatrix(newMatrix); 
    } else if (direction === 'down') {
        newMatrix = rotateMatrix(rotateMatrix(rotateMatrix(newMatrix)));
    }

    if (moved) {
        setMatrix(newMatrix);
        addRandomTile();
        updateUI();
        checkGameOver();
    }
}

function checkGameOver() {
    if (board.includes(0)) return; 

    let matrix = getMatrix();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let val = matrix[i][j];
            if (j < 3 && val === matrix[i][j + 1]) return; 
            if (i < 3 && val === matrix[i + 1][j]) return; 
        }
    }
    isGameOver = true;
    gameOverElement.classList.remove('hidden');
}

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const key = e.key.toLowerCase();
    if (['w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        if (key === 'w') move('up');
        if (key === 's') move('down');
        if (key === 'a') move('left');
        if (key === 'd') move('right');
    }
});
let touchStartX = 0, touchStartY = 0;
let touchEndX = 0, touchEndY = 0;
let isSwiping = false;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].screenX;
    touchStartY = e.touches[0].screenY;
    touchEndX = touchStartX;
    touchEndY = touchStartY;
    isSwiping = true;
}, { passive: false });

// 监听 touchmove，及时阻止页面滚动
document.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    
    touchEndX = e.touches[0].screenX;
    touchEndY = e.touches[0].screenY;
    
    let diffX = Math.abs(touchEndX - touchStartX);
    let diffY = Math.abs(touchEndY - touchStartY);
    
    // 只要滑动距离超过 10px，就认为是游戏操作，阻止页面滚动
    if (diffX > 10 || diffY > 10) {
        if (e.cancelable) {
            e.preventDefault(); // 阻止浏览器下拉刷新
        }
    }
}, { passive: false });

document.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    isSwiping = false;
    
    // 用 changedTouches 获取最后离开屏幕的位置
    let endX = e.changedTouches[0].screenX;
    let endY = e.changedTouches[0].screenY;
    
    handleSwipe(touchStartX, touchStartY, endX, endY);
}, { passive: false });

function handleSwipe(startX, startY, endX, endY) {
    let diffX = endX - startX;
    let diffY = endY - startY;
    
    let minSwipeDistance = 15; 

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) move('right');
            else move('left');
        }
    } else {
        if (Math.abs(diffY) > minSwipeDistance) {
            if (diffY > 0) move('down');
            else move('up');
        }
    }
}



restartBtn.addEventListener('click', initGame);

initGame();