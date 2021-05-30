function Field(size, pos, force) {
    this.visited = false;
    this.current = false;
    this.index;

    this.size = size;
    this.pos = pos;
    this.force = force;
    this.maxforce = 0.1;

    //					top ,right,bottom,left
    this.dir = [true, true, true, true];
    this.lines = [];

    this.display = () => {

        //for force vector

        // strokeWeight(2);
        // stroke(255, 100);
        // let x1 = this.pos.x + this.size / 2;
        // let y1 = this.pos.y + this.size / 2;
        // let x2 = this.force.mag() * this.force.x * 1000 + x1;
        // let y2 = this.force.mag() * this.force.y * 1000 + y1;
        // line(x1, y1, x2, y2)

        this.lines.map(l => l.display());
    }

    this.update = () => {
        let tempwalls = [];
        for (let i = 0; i < this.dir.length; i++) {
            if (this.dir[i]) {
                let p1;
                let p2;
                if (i == 0) {
                    p1 = createVector(this.pos.x, this.pos.y);
                    p2 = createVector(this.pos.x + this.size, this.pos.y);
                } else if (i == 1) {
                    p1 = createVector(this.pos.x + this.size, this.pos.y);
                    p2 = createVector(this.pos.x + this.size, this.pos.y + this.size);
                } else if (i == 2) {
                    p1 = createVector(this.pos.x + this.size, this.pos.y + this.size);
                    p2 = createVector(this.pos.x, this.pos.y + this.size);
                } else if (i == 3) {
                    p1 = createVector(this.pos.x, this.pos.y + this.size);
                    p2 = createVector(this.pos.x, this.pos.y);
                }
                tempwalls.push(new Line(p1, p2));
            }

            this.lines = tempwalls;
        }
    }


    this.setWall = (d) => {
        if (d < 4)
            this.dir[d] = true;
    }

    this.removeWall = (d) => {
        //0 for up
        //1 for right
        //2 for down
        //3 for left

        this.dir[d] = false;
    }

    this.forceSet = (f) => {
        this.force = f;
        this.force.limit(this.maxforce);
    }

    //appley force to mover
    this.moverDetact = (m) => {
        if (m.pos.x > this.pos.x && m.pos.x < this.pos.x + this.size &&
            m.pos.y > this.pos.y && m.pos.y < this.pos.y + this.size) {
            if (this.force.mag() == 0) {
                m.stop();
            } else
                m.applyforce(this.force);
        }
    }
}