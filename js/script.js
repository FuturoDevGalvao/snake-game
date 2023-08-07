const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score-value");
const finalScore = document.querySelector(".final-score span");
const btnPlayAgain = document.getElementById("btn-play-again");
const menuScreen = document.querySelector(".menu-screen");

const audio = new Audio("../assets/audio.mp3");

const SIZE = 20;

let snake = [
    {x:100, y:240}
];

const incrementScore = () => {
    score.innerHTML = parseInt(score.innerHTML) + 10;
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

const randomPosition = () => {
    const number = randomNumber(0, 380);

    return Math.round(number / 20) * 20;
} 

const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);
    
    return `rgb(${red}, ${green}, ${blue})`;
}

const food = {
    x: randomPosition(),
    y: randomPosition(), 
    color: randomColor()
};

let direction, loopId;

const drawFood = () => {
    const { x, y, color } = food;

    /* Estilo para a fruta */
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, SIZE, SIZE);

    ctx.shadowBlur = 0; /*Zerando o blur para não afetar os outros elementos*/
}

/* Lógica de desenho da snake no canvas */
const drawSnake = () => {
    ctx.fillStyle = "#BFD149";
    snake.forEach( (position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "red";
        }

        ctx.fillRect(position.x, position.y, SIZE, SIZE);
    })
}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#202020";

    /* Percorrendo o canvas e desenhando */
    for (let index = SIZE; index < canvas.width; index += SIZE) {
        /* Desenho das colunas */
        ctx.beginPath(); /* Define um ponto de início para as linhas verticais, sem arrastar */
        ctx.lineTo(index, 0);
        ctx.lineTo(index, 400);
        ctx.stroke();

        /* Desenho das linhas */
        ctx.beginPath(); /* Define um ponto de início para as linhas horizontais, sem arrastar */
        ctx.lineTo(0, index);
        ctx.lineTo(400, index);
        ctx.stroke();
    }
}

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x == food.x && head.y == food.y) {
        snake.push(head);
        audio.play();
        incrementScore();

        /* Checando se a posição da nova comida é igual a alguma da snake */
        let x = randomPosition();
        let y = randomPosition();
        
        /* Executado enquanto as posições forem iguais */
        while (snake.find( position => position.x == x && position.y == y)) {
            x = randomPosition();
            y = randomPosition();    
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - SIZE;
    const neckIndex = snake.length - 2;

    const wallCollision = 
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;
    
    const selfCollision = snake.find( (position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    });

    if (wallCollision || selfCollision) {
        gameOver();
    }
}

const gameOver = () => {
    direction = undefined;
    menuScreen.style.display = "flex";
    finalScore.innerHTML = score.innerHTML;
}

/* Lógica para a movimentação da snake */
const moveSnake = () => {
    if (!direction) return;

    const head = snake[snake.length - 1];

    switch (direction) {
        case "right":
            snake.push({x: head.x + SIZE, y: head.y}); 
        break;
        case "left":
            snake.push({x: head.x - SIZE, y: head.y});
        break;
        case "down":
            snake.push({x: head.x, y: head.y + SIZE});
        break;
        case "up":
            snake.push({x: head.x, y: head.y - SIZE});
        break;
    }

    snake.shift();
}

const gameLoop = () => {
    clearInterval(loopId);
    ctx.clearRect(0, 0, 400, 400);

    drawFood();
    drawGrid();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();
    
    loopId = setInterval(() => {
        gameLoop();
    }, 300); 
}

gameLoop();

document.addEventListener("keydown", (event) => {
    let key = event.key; 
    const allowedKeys = ["w", "a", "s", "d", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

    if (allowedKeys.includes(key)) {
        switch (key) {
            case "w":
                if (direction != "down") direction = "up";
            break;
            case "a":
                if (direction != "right") direction = "left";
            break;
            case "s":
                if (direction != "up") direction = "down";
            break;
            case "d":
                if (direction != "left") direction = "right";
            break;
            case "ArrowUp":
                if (direction != "down") direction = "up";
            break;
            case "ArrowLeft":
                if (direction != "right") direction = "left";
            break;
            case "ArrowDown":
                if (direction != "up") direction = "down";
            break;
            case "ArrowRight":
                if (direction != "left") direction = "right";
            break;
        }
    }
});

/* Reset play again */
btnPlayAgain.addEventListener("click", () => {
    score.innerHTML = "00";
    menuScreen.style.display = "none";
    snake = [{x:100, y:240}];
});

const title = document.querySelector('#title');

const typeWriter = (elemento) => {
    const arrayTitle = elemento.innerHTML.split('');
    elemento.innerHTML = ' ';

    arrayTitle.forEach( (letra, index) => {
        setTimeout(() => elemento.innerHTML += letra, 100 * index);
    });
}

typeWriter(title);

/* Evita que as setas movimentem a página */
document.addEventListener("keydown", (event) => {
    const key = event.key;
    const keysNotAllowed = [ "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    
    if (keysNotAllowed.includes(key)) {
        event.preventDefault();
    }
});

