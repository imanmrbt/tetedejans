const canvasBox = document.getElementById("canvasbox");

let headsdata = [
{level: 0, size: 20}, {level: 1, size: 30}, {level: 2, size: 40}, {level: 3, size: 50}, {level: 4, size: 60},
{level: 5, size: 70}, {level: 6, size: 80}, {level: 7, size: 90}, {level: 8, size: 100}, {level: 9, size: 150}
]


// module aliases
var Engine = Matter.Engine,
    //   Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    //Detector = Matter.Detector,
    Query = Matter.Query,
    Composite = Matter.Composite;
var engine
let leftWall;
let rightWall;

var ground

let headinhand
let heads = []
let score = 0

let handpos = [canvasBox.offsetWidth / 2, 70]

let playing = true

circle.restitution = 0.4;


function preload() {

    headsdata[0].image = loadImage('./img/level0.png');
    headsdata[1].image = loadImage('./img/level1.png');
    headsdata[2].image = loadImage('./img/level2.png');
    headsdata[3].image = loadImage('./img/level3.png');
    headsdata[4].image = loadImage('./img/level4.png');
    headsdata[5].image = loadImage('./img/level5.png');
    headsdata[6].image = loadImage('./img/level6.png');
    headsdata[7].image = loadImage('./img/level7.png');
    headsdata[8].image = loadImage('./img/level8.png');
    headsdata[9].image = loadImage('./img/level9.png');

}

function setup() {

    const canvas = createCanvas(canvasBox.offsetWidth, canvasBox.offsetHeight);

    canvas.parent("canvasbox"); // Attach the canvas to the div


    engine = Engine.create();

    // add ground 
    ground = new Ground(width / 2, height, 60, engine.world)
    leftWall = Matter.Bodies.rectangle(0, height / 2, 10, height, { isStatic: true });
    rightWall = Matter.Bodies.rectangle(width, height / 2, 10, height, { isStatic: true });
    Composite.add(engine.world, [leftWall, rightWall]);


    // create one head in hand
    assignheadinhand()


    // create runner
    var runner = Runner.create();
 
    // run the engine
    Runner.run(runner, engine);

}

function draw() {
    background("#EAC696");

    ground.display()

    movehand()
    // display hand
    ellipse(handpos[0], handpos[1], 10, 10);

    // display head in hand
    if (headinhand) {
        headinhand.display()
    }

    // display heads in the game
    for (let index = 0; index < heads.length; index++) {
        heads[index].display()
    }

    // check for collisions
    if (heads.length >= 2) {
        checkCollisions(heads)
    }

    // display score
    displayscore()



    // if heads are getting closer draw the line
    if (findObjectWithLowestY(heads) < 200) {
        // draw line
        drawDashedLine()
    }
}

function movehand() {
    if (playing) {
        if (keyIsDown(LEFT_ARROW)) {
            handpos[0] -= 10
        }

        if (keyIsDown(RIGHT_ARROW)) {
            handpos[0] += 10
        }

        handpos[0] = constrain(handpos[0], 50, width - 50); // Adjust the 25 as needed
    }
}

function keyPressed() {
    var ow = document.getElementById("ow"); 
    
    if (playing) {
        if (key === ' ') {
            // release the inhand head
            headinhand.isfixed = false
            // move head in hand to heads array
            heads.push(headinhand)
            // assign new head in hand

            assignheadinhand()
            ow.play() 
        }
    }
}

function changeCoordinates(e) {
  handpos[0]  = `${e.touches[0].clientX}`;
}

document.body.addEventListener('touchstart', changeCoordinates);


document.body.addEventListener('touchend', function() {
    
var ow = document.getElementById("ow"); 
// release the inhand head
headinhand.isfixed = false
// move head in hand to heads array
heads.push(headinhand)
// assign new head in hand

assignheadinhand()
ow.play() 
 });


function assignheadinhand() {
    // choose a number beween 0 and 2
    let rannum = floor(random(4))
    //  console.log(rannum)
    headinhand = new Head(engine.world, rannum); // Replace head with your object

}

function checkCollisions(circles) {

    const headsToRemove = [];
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            const circleA = circles[i];
            const circleB = circles[j];

            // Check if the circles have the same type and are colliding
            if (circleA.level === circleB.level && circleA.level < headsdata.length - 1 && Query.collides(circleA.body, [circleB.body]).length > 0) {
                // Circles with the same type are touching each other
                console.log(`Circles ${i} and ${j} with type ${circleA.level} are touching.`);
                console.log(circleB);
                // if two objects of the same level group are touching

                // create a a new object with one level higher level in the position between two previous bodies


                let templevel = circleA.level

                let tempx = circleA.body.position.x
                let tempy = circleA.body.position.y

                let tempx2 = circleB.body.position.x
                let tempy2 = circleB.body.position.y

                

                
    if (circleB.body.position.y < 140){
        alert("try again tête de nouille <3 ", location.reload());}

                // update score
                score += circleA.level * 10


                headsToRemove.push(circleA, circleB);

                // Remove the colliding heads from the array
                for (const head of headsToRemove) {
                    const index = heads.indexOf(head);
                    if (index !== -1) {
                        heads.splice(index, 1);
                        Matter.World.remove(engine.world, head.body);
                    }

                }
                //sound
                var sound = document.getElementById("DoofenshmirtzEvilInc"); 

  

                let newhigherlevelhead = new Head(engine.world, templevel + 1);
                newhigherlevelhead.isfixed = false

                // find x and y of collision
                let middle = findMiddlePoint(tempx, tempy, tempx2, tempy2)

                Matter.Body.setPosition(newhigherlevelhead.body, { x: middle.x, y: middle.y });

                heads.push(newhigherlevelhead);
                sound.play(); 




            }
        }
    }

}


function findMiddlePoint(x1, y1, x2, y2) {
    const middleX = (x1 + x2) / 2;
    const middleY = (y1 + y2) / 2;
    return { x: middleX, y: middleY };
}


function displayscore() {
    stroke("#765827")
    strokeWeight(4);


    //  textFont(displayfont);
    textSize(40);
    // noStroke();
    fill("yellow");

    textAlign(LEFT, CENTER);
    text(score, 50, 70);
}


function drawDashedLine() {

    stroke("#D90631")
    strokeWeight(5)
    const y = 150; // Y-coordinate of the dashed line
    const dashLength = 20; // Length of each dash
    const gapLength = 20; // Length of each gap between dashes
    const lineLength = width; // Length of the entire line



    for (let x = 0; x < lineLength; x += dashLength + gapLength) {
        line(x, y, x + dashLength, y);
    }
}



function findObjectWithLowestY(heads) {
    if (heads.length === 0) {
        // Handle the case where the array is empty
        return null;
    }

    // Initialize with the first object in the array
    let lowestYObject = heads[0];

    for (let i = 1; i < heads.length; i++) {
        const currentObject = heads[i];

        // Compare the y values
        if (currentObject.body.position.y < lowestYObject.body.position.y) {
            lowestYObject = currentObject;
        }
    }

    return lowestYObject.body.position.y;
}