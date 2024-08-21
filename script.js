const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let blocks = [];
let ball = null;
let isBallActive = false;

const blockWidth = 80;
const blockHeight = 20;
const rows = 5;
const cols = 7;
const blockHealth = 3;
const gravity = 0.2;
const ballRadius = 10;

class Block {
    constructor(x, y, health) {
        this.x = x;
        this.y = y;
        this.health = health;
        this.width = blockWidth;
        this.height = blockHeight;
    }

    draw() {
        if (this.health > 0) {
            ctx.fillStyle = `rgba(255, 0, 0, ${this.health / blockHealth})`;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    hit() {
        if (this.health > 0) {
            ball.value += this.health;
            this.health--;
        }
    }
}

class Ball {
    constructor(x) {
        this.x = x;
        this.y = 0;
        this.radius = ballRadius;
        this.vx = Math.random() * 4 - 2;
        this.vy = 0;
        this.value = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#007bff';
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    update() {
        this.vy += gravity;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
            this.vx = -this.vx;
        }

        if (this.y + this.radius > canvas.height) {
            isBallActive = false;
        }

        blocks.forEach(block => {
            if (this.y + this.radius > block.y && 
                this.y - this.radius < block.y + block.height && 
                this.x > block.x && 
                this.x < block.x + block.width &&
                block.health > 0) {
                    block.hit();
                    this.vy = -this.vy;
                    if (block.health <= 0) {
                        block.health = 0;
                    }
            }
        });

        this.draw();
    }
}

function createBlocks() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const blockX = c * (blockWidth + 10) + 35;
            const blockY = r * (blockHeight + 10) + 50;
            blocks.push(new Block(blockX, blockY, blockHealth));
        }
    }
}

function resetGame() {
    blocks = [];
    ball = null;
    isBallActive = false;
    createBlocks();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blocks.forEach(block => block.draw());

    if (isBallActive && ball) {
        ball.update();
    }

    requestAnimationFrame(animate);
}

canvas.addEventListener('click', (e) => {
    if (!isBallActive) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        ball = new Ball(x);
        isBallActive = true;
    }
});

document.getElementById('reset-button').addEventListener('click', resetGame);

resetGame();
animate();
