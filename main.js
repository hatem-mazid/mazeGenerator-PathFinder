let mover;
let fieldSys;

function setup() {
    createCanvas(600, 600);
    fieldSys = new FieldSystem(10, 59);
    mover = new Mover(15, 15, 15);
}

function draw() {
    background(0);

    fieldSys.display();
    fieldSys.update(mover);

    mover.update();
    mover.display();
}

function mousePressed() {
    fieldSys.fieldsClear();
    fieldSys.setTarget(createVector(mouseX, mouseY));

    let index = Math.floor(mouseX / fieldSys.fieldSize) + Math.floor(mouseY / fieldSys.fieldSize) * fieldSys.size;

    fieldSys.fields[index].forceSet(createVector());
}