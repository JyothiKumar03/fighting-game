const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');//context in canvas
canvas.width = 1024//1284;//screen.width;
canvas.height = 576//653;//screen.height;
c.fillRect(0,0,canvas.width,canvas.height);
const gravity = 0.6;

const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './img/background.png'
})
const shop = new Sprite({
    position:{
        x:600,
        y:128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})
const player1 = new Fighter({
    position:{
    x: 0,
    y:0
    },
    velocity:{
        x:0,
        y:0
    },
    offset:{
        x:0,
        y:0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax:8,
    scale: 2.5,
    offset:{
        x:215,
        y:157
    },
    sprites:{
        idle:{
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run:{
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump:{
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit:{
            imageSrc : './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax:4
        },
        death:{
            imageSrc : './img/samuraiMack/Death.png',
            framesMax:6
        } 
    },
    attackBox:{
        offset:{
            x:100,
            y:50
        },
        width:160 ,
        height:50
    }
})
const player2 = new Fighter({
    position:{
    x: 400,
    y: 100
    },
    velocity:{
        x:0,
        y:0},
        color:'blue',
        offset:{
            x:-50,
            y:0
        },
        imageSrc: './img/kenji/Idle.png',
        framesMax:4,
        scale: 2.5,
        offset:{
            x:215,
            y:167
        },
        sprites:{
            idle:{
                imageSrc: './img/kenji/Idle.png',
                framesMax: 4
            },
            run:{
                imageSrc: './img/kenji/Run.png',
                framesMax: 8
            },
            jump:{
                imageSrc: './img/kenji/Jump.png',
                framesMax: 2
            },
            fall:{
                imageSrc: './img/kenji/Fall.png',
                framesMax: 2
            },
            attack1:{
                imageSrc: './img/kenji/Attack1.png',
                framesMax: 4
            },
            takeHit:{
                imageSrc : './img/kenji/Take hit.png',
                framesMax:3
            },
            death:{
                imageSrc : './img/kenji/Death.png',
                framesMax:7
            }
        },
        attackBox:{
            offset:{
                x:-170,
                y:50
            },
            width:170,
            height:50
        }
    })
player1.draw();//player
player2.draw();//enemy
console.log(player1); 
console.log(player2);

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    ArrowUp:{
        pressed: false
    }
}

decreaseTimer();
function animate(){ 
    window.requestAnimationFrame(animate);
    //console.log('animation called');
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width,canvas.height);
    background.update();
    c.fillStyle = 'rgba(255,255,255,0.2)'
    c.fillRect(0,0,canvas.width,canvas.height);
    shop.update();
    c.fillStyle = 'rgba(255,255,255,0.1)'
    c.fillRect(0,0,canvas.width,canvas.height);
    player1.update();
    player2.update();
    player1.velocity.x = 0;
    //player1 movement
    if(keys.a.pressed && player1.lastKey==='a'){
        player1.velocity.x = -3;
        player1.switchSprites('run');
    }
    else if(keys.d.pressed && player1.lastKey === 'd'){
        player1.velocity.x=3;
        player1.switchSprites('run');
    }
    else{
        player1.switchSprites('idle');
    }
    if(player1.velocity.y < 0){
        player1.switchSprites('jump');
    }
    else if(player1.velocity.y > 0){
        player1.switchSprites('fall');
    }
    player2.velocity.x=0;
    //player2.movement
    if(keys.ArrowLeft.pressed && player2.lastKey=='ArrowLeft'){
        player2.switchSprites('run');
        player2.velocity.x = -3;
    }
    else if(keys.ArrowRight.pressed && player2.lastKey == 'ArrowRight'){
        player2.velocity.x=3;
        player2.switchSprites('run');
    }
    else{
        player2.switchSprites('idle');
    }
    if(player2.velocity.y < 0){
        player2.switchSprites('jump');
    }
    else if(player2.velocity.y > 0){
        player2.switchSprites('fall');
    }
    // else if(keys.w.pressed && lastKey == 'w'){
    //     player1.velocity.y = -1;
    // }
    //detect collision
    //if right side is colliding with the left side of enemy then its a hit
    if(rectangularCollision({rectangle1: player1,rectangle2: player2})&& player1.isAttacking && player1.framesCurrent === 4){
        player2.takeHit();
        player1.isAttacking = false;
        //player2.health-=20;
        //document.querySelector('#player2Health').style.width = player2.health+'%';
        gsap.to('#player2Health',{
            width:player2.health+'%'
        })
        console.log('player1 hit');
    }
    //if player misses the other player
    if(player1.isAttacking && player1.framesCurrent === 4){
        player1.isAttacking = false;
    }
    //player1 gets hit
    if(rectangularCollision({rectangle1: player2,rectangle2: player1})&& player2.isAttacking && player2.framesCurrent === 2){
        player1.takeHit();
        player2.isAttacking = false;
        //player1.health-=20;
        //document.querySelector('#player1Health').style.width = player1.health+'%';
        gsap.to('#player1Health',{
            width:player1.health+'%'
        })
        console.log('player2 hit');
    }
    if(player2.isAttacking && player2.framesCurrent === 2){
        player2.isAttacking = false;
    }
    //end game based on health
    if(player1.health <=0 || player2.health<=0){
        determineWinner({player1,player2,timerId});
    }
}


animate()

window.addEventListener('keydown',(event)=>{
    if(!player1.dead){
        switch(event.key){
            case 'd':
                keys.d.pressed = true;
                player1.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player1.lastKey = 'a';
                break;
            case 'w':
                keys.w.pressed = true;
                player1.velocity.y = -15;
                break;
            case ' ':
                player1.attack();
                break;
        }
    }
    if(!player2.dead){
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                player2.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                player2.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                keys.ArrowUp.pressed = true;
                player2.velocity.y = -15;
                break;
            case 'ArrowDown':
                player2.attack();
                //player2.isAttacking = true;
                break;
        }
    }
    console.log(event.key);
})
window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;

    }
    console.log(event.key);
})