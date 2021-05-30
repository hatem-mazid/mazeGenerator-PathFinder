function Mover(x, y, r) {
    this.r = r;

    this.acc = createVector();
    this.spd = createVector();
    this.pos = createVector(x, y);
    this.prevPos = createVector(x, y);

    this.maxforce = 0.5;
    this.maxspeed = 2;

    this.display = () => {
        fill(255);
        stroke(0);
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, this.r);
        line(this.pos.x, this.pos.y,
            this.pos.x + this.spd.copy().setMag(this.r).x / 2,
            this.pos.y + this.spd.copy().setMag(this.r).y / 2);
    }

    this.update = () => {
        this.prevPos = this.pos.copy()

        this.spd.add(this.acc);
        this.spd.limit(this.maxspeed);
        this.pos.add(this.spd);
    }

    this.applyforce = (f) => {
        this.acc.mult(0);

        this.acc.add(f);
        this.acc.limit(this.maxforce);
    }

    this.stop = () => {
        this.acc.mult(0)
        this.spd.mult(0.95)
    }

    //walls collision
    this.wallDetact = (ws) => {
        ws.map(w => {
            let p3 = this.pos;
            let p4 = w.getcpoint(this.pos);
            if (p4) {
                let d = dist(p3.x, p3.y, p4.x, p4.y);
                if (d < this.r) {
                    let a = p5.Vector.sub(p3, p4);
                    let overlap = abs(this.r - d);

                    this.pos.x += overlap * cos(a.heading());
                    this.pos.y += overlap * sin(a.heading());

                    w.p1.x == w.p2.x ?
                        this.spd.x *= -1 : this.spd.y *= -1

                }
            }
        });
    }
}