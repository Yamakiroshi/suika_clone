var activeFruit, floor,wall_l, wall_r;
var playedFruits = []
var playerScore = 0;
var fruitObjs = {
    cherries: {dia:20, color:'pink', merge:'cherries', evolve:'strawberries', points:1},
    strawberries:{dia:30, color:'red', merge:'strawberries', evolve:'grapes', points:2},
    grapes:{dia:35, color:'purple', merge:'grapes', evolve:'dekopon', points:3},
    dekopon:{dia:40, color:'yellow', merge:'dekopon', evolve:'orange', points:4},
    orange:{dia:50, color:'orange', merge:'orange', evolve:'apple', points:5},
    apple:{dia:60, color:'red', merge:'apple', evolve:'pear', points:6},
    pear:{dia:70, color:'yellow', merge:'pear', evolve:'peach', points:7},
    peach:{dia:80, color:'pink', merge:'peach', evolve:'pineapple', points:8},
    pineapple:{dia:90, color:'yellow', merge:'pineapple', evolve:'melon', points:9},
    melon:{dia:100, color:'green', merge:'melon', evolve:'watermelon', points:10},
    watermelon:{dia:110, color:'blue', merge:'watermelon', evolve:'cherries', points:11}
}
var fruitIndexes = [];
for (var x in fruitObjs) {
    fruitIndexes.push(x);
}

function setup() {
    createCanvas(400,400)
    world.gravity.y = 1;
    activeFruit = createFruit(fruitObjs['cherries'])

    floor = new Sprite();
    floor.y = 397.5;
    floor.w = 400
    floor.h = 5;
    floor.collider = 'static';
    floor.color = 'black';

    wall_l = new Sprite();
    wall_l.x=2.5;
    wall_l.w=5;
    wall_l.h=400;
    wall_l.collider = 'static';
    wall_l.color = 'black;'
    
    wall_r = new Sprite();
    wall_r.x=397.5;
    wall_r.w=5;
    wall_r.h=400;
    wall_r.collider = 'static'; 
    wall_r.color = 'black';
}

function createFruit(fruitObj){
    console.log(fruitObj)
    var fruit = createSprite();
    fruit.uuid = crypto.randomUUID();
    fruit.diameter = fruitObj.dia;
    fruit.y = 30;
    fruit.bounciness = 0.2
    fruit.collider = 'dynamic'
    fruit.velocity.y = 3
    fruit.sleeping = true;
    fruit.color = fruitObj.color;
    fruit.points = fruitObj.points;
    fruit.merge = fruitObj.merge;
    fruit.evolve = fruitObj.evolve;
    return fruit;
}


function draw() {
    clear();
    textSize(32)
    text(playerScore, 25,25)
    if(mouseIsPressed == true) {
        activeFruit.x = mouseX
    }

    playedFruits.forEach(function(fruit){
    
        if(fruit.collided(activeFruit) == true) {
            
        }
        for(var i = 0; i < playedFruits.length; i++){
            
            if(fruit.collided(playedFruits[i]) || fruit.colliding(playedFruits[i]) > 10) {
                if(checkMerge(fruit, playedFruits[i])){
                    evolveFruit(fruit);
                    removeFruit(i);
                }
            }
        }
    }
    )
}

function evolveFruit(fruit) {
    playerScore += (fruit.points *2)
    var newFruit = fruitObjs[fruit.evolve]
    fruit.diameter = newFruit.dia;
    fruit.color = newFruit.color;
    fruit.points = newFruit.points;
    fruit.merge = newFruit.merge;
    fruit.evolve = newFruit.evolve;
    fruit.resetMass();

}

function removeFruit(fruitIndex) {
    playedFruits[fruitIndex].remove()
    playedFruits.splice(fruitIndex,1)
}

function checkMerge(fruit, otherFruit){
    if(fruit.merge == otherFruit.merge) {
        return true;
    }
    return false;
}

/*function mouseClicked(event) {
    console.log(event)
    wakeFruit()
    processFruit()
    sleep(1500).then(()=>{resetFruit();});
}*/

function touchEnded(event) {
    console.log(event)
    wakeFruit()
    processFruit()
    sleep(1500).then(()=>{resetFruit();});
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function wakeFruit() {
    activeFruit.sleeping = false;
}

function processFruit() {
    playedFruits.push(activeFruit);
}

function resetFruit(){
    activeFruit = createFruit(fruitObjs[fruitIndexes[randomFruit()]]);
}

function randomFruit() {
    return Math.floor(Math.random() * (5))
}