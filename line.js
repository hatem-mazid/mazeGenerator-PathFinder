function Line(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.len = dist(p1.x, p1.y, p2.x, p2.y);
    //for detect wall
    this.cpoint = createVector();

    this.display = () => {

        stroke(255);
        strokeWeight(2);
        line(p1.x, p1.y, p2.x, p2.y);

    }

    this.getcpoint = (moverPos) => {
        let k1 = ((this.p2.y - this.p1.y) * (moverPos.x - this.p1.x) -
            (this.p2.x - this.p1.x) * (moverPos.y - this.p1.y));
        let k2 = ((this.p2.y - this.p1.y) * (this.p2.y - this.p1.y) +
            (this.p2.x - this.p1.x) * (this.p2.x - this.p1.x));
        let k = k1 / k2;
        this.cpoint.x = moverPos.x - k * (this.p2.y - this.p1.y);
        this.cpoint.y = moverPos.y + k * (this.p2.x - this.p1.x);
        if ((this.cpoint.x < Math.max(this.p1.x, this.p2.x) && this.cpoint.x > Math.min(this.p1.x, this.p2.x)) ||
            (this.cpoint.y < Math.max(this.p1.y, this.p2.y) && this.cpoint.y > Math.min(this.p1.y, this.p2.y))) {
            // strokeWeight(5)
            // stroke(0, 255, 255)
            // point(this.cpoint.x, this.cpoint.y)
            return this.cpoint;
        }

    }
}