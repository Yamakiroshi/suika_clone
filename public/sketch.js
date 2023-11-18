let fruitsGroup;
let deathGroup;

var height = 0
var width = 0
var fScale = 2
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
    
    fruitsGroup = new Group();
    deathGroup = new Group();
    height = windowHeight - 100
    width = (windowWidth / 3) - 100
    createCanvas(width,height)
    world.gravity.y = 10;
    

    floor = new Sprite();
    floor.y = height - 5;
    floor.w = width
    floor.h = 5;
    floor.collider = 'static';
    floor.color = 'black';

    wall_l = new Sprite();
    wall_l.x=2.5;
    wall_l.w=5;
    wall_l.h=height;
    wall_l.collider = 'static';
    wall_l.color = 'black;'
    
    wall_r = new Sprite();
    wall_r.x=width - 2.5;
    wall_r.w=5;
    wall_r.h=height;
    wall_r.collider = 'static'; 
    wall_r.color = 'black';

    death_wall = new Sprite();
    death_wall.w = width - 10
    death_wall.h = 5;
    death_wall.collider = 'static'
    death_wall.y = 150;

    activeFruit = createFruit(fruitObjs['cherries'])
}

function createFruit(fruitObj){
    var fruit = new fruitsGroup.Sprite();
    fruit.uuid = crypto.randomUUID();
    fruit.diameter = fruitObj.dia * fScale;
    fruit.y = 75 ;
    fruit.bounciness = 0.2
    fruit.collider = 'dynamic'
    fruit.velocity.y = 100 * fScale
    fruit.sleeping = true;
    fruit.color = fruitObj.color;
    fruit.points = fruitObj.points;
    fruit.merge = fruitObj.merge;
    fruit.evolve = fruitObj.evolve;
    fruit.resetMass();
    return fruit;
}


function draw() {
    clear();
    textSize(32)
    text(playerScore, 25,25)
    if(mouseIsPressed == true) {
        activeFruit.x = getAllowedXPosition(activeFruit.diameter)
    }

	activeFruit.overlaps(death_wall);


    playedFruits.forEach(function(fruit){

        if(fruit.overlapping(death_wall)) {
            r = random(255); // r is a random number between 0 - 255
            g = random(255); // g is a random number betwen 100 - 200
            b = random(255); // b is a random number between 0 - 100
            death_wall.color = color(r,g,b)
        }

        if(fruit.overlapping(death_wall) > 250) {
            console.log(`Game Over - Final Score ${playerScore}`)
        }

        fruit.collided(fruitsGroup,checkMergeAndEvolve);
        fruit.colliding(fruitsGroup, checkMergeAndEvolve);
    }
    )
}

function checkMergeAndEvolve(currentFruit, newFruit) {
    if(checkMerge(currentFruit, newFruit)) {
        evolveFruit(currentFruit);
        newFruit.remove();
    }
}

function evolveFruit(fruit) {
    playerScore += (fruit.points *2)
    var newFruit = fruitObjs[fruit.evolve]
    fruit.diameter = newFruit.dia * fScale;
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

function touchEnded(event) {
    var eventTest = event;
    wakeFruit(eventTest.x)
    processFruit()
    sleep(1500).then(()=>{resetFruit();});
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function wakeFruit() {
    activeFruit.x = getAllowedXPosition(activeFruit.diameter);
}

function getAllowedXPosition(fruitDia) {
    var min_x = mouseX - (fruitDia / 2);
    var min_a_x = 0.00 + (fruitDia / 2);
    var max_x = mouseX + (fruitDia / 2);
    var max_a_x = width - (fruitDia / 2) - 2.5;
    if (min_x > 2.5 && max_x < width - 2.5) {
        return mouseX;
    } else if(min_x < 2.5) {
        return min_a_x;
    } else {
        return max_a_x;
    }
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