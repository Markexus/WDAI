const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();


let lives = 3;
let score = 20;
let zombies = [];
let mouse = { x: 0, y: 0 };


const images = {
    bg: loadImage("board-bg.jpg"),
    aim: loadImage("aim.png"),
    heartFull: loadImage("full_heart.png"),
    heartEmpty: loadImage("empty_heart.png"),
    zombie: loadImage("walkingdead.png"), 
};


const sadMusic = new Audio("sad-music.mp3");


const zombieAnimation = {
    frameWidth: 200,
    frameHeight: 300, 
    frameCount: 8,
    animationSpeed: 0.2, 
};


function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}


class Zombie {
    constructor() {
        this.x = canvas.width;
        this.y = getRandom(50, canvas.height - 150);
        this.width = getRandom(50, 450);
        this.height = this.width;
        this.speed = getRandom(2, 6);
        this.frame = 0;
        this.frameTimer = 0;
    }

    draw() {
        const frameX = Math.floor(this.frame) * zombieAnimation.frameWidth;
        ctx.drawImage(
            images.zombie,
            frameX, 0,
            zombieAnimation.frameWidth, zombieAnimation.frameHeight,
            this.x, this.y,
            this.width, this.height
        );
    }

    update() {
        this.x -= this.speed;
        if (this.x + this.width < 0) {
            lives--; 
            removeZombie(this);

            if (lives === 0) {
                drawLives(); 
                setTimeout(endGame, 500); 
            }
        }


        this.frameTimer += zombieAnimation.animationSpeed;
        if (this.frameTimer >= 1) {
            this.frame = (this.frame + 1) % zombieAnimation.frameCount;
            this.frameTimer = 0;
        }
    }
}


function gameLoop() {
    ctx.drawImage(images.bg, 0, 0, canvas.width, canvas.height); 

    drawLives();
    drawScore();
    zombies.forEach(zombie => {
        zombie.update();
        zombie.draw();
    });

    ctx.drawImage(images.aim, mouse.x - 35, mouse.y - 35, 70, 70); 

    if (lives > 0) {
        requestAnimationFrame(gameLoop);
    } else {
        endGame();
    }
}

function drawLives() {
    const heartSize = 60;
    for (let i = 0; i < 3; i++) {
        const img = i < lives ? images.heartFull : images.heartEmpty;
        ctx.drawImage(img, 10 + i * (heartSize + 10), 10, heartSize, heartSize);
    }
}

function drawScore() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${score}`, canvas.width - 150, 40);
}

function spawnZombie() {
    zombies.push(new Zombie());
}

function removeZombie(zombie) {
    zombies = zombies.filter(z => z !== zombie);
}

function handleShoot(e) {
    if (score <= 0) {
        return;
    }

    const hit = zombies.find(z => isHit(e, z));
    if (hit) {
        score += 20; 
        removeZombie(hit);
    } else {
        score = Math.max(0, score - 5); 
    }
}

function isHit(e, zombie) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return (
        x >= zombie.x &&
        x <= zombie.x + zombie.width &&
        y >= zombie.y &&
        y <= zombie.y + zombie.height
    );
}

function endGame() {
    ctx.font = "50px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    sadMusic.play();

    setTimeout(() => {
        if (confirm("Chcesz zagrać ponownie?")) {
            location.reload();
        }
    }, 1000);
}


function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("click", handleShoot);


setInterval(spawnZombie, 1000);
gameLoop();
