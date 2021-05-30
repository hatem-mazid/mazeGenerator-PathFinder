function FieldSystem(size, fieldSize) {
    this.fields = [];
    this.stack = [];
    this.walls = [];

    this.size = size;
    this.fieldSize = fieldSize;


    this.next;
    this.current;
    this.inital;

    for (let i = 0; i < this.size; i++)
        for (let j = 0; j < this.size; j++) {
            this.fields[i + j * size] = new Field(fieldSize, createVector(i * fieldSize, j * fieldSize), createVector(0, 0));
            this.fields[i + j * size].index = i + j * size;
        }

    this.fields[0].visited = true;
    this.fields[0].current = true;
    this.inital = this.fields[0];
    this.stack.push(this.inital);

    //setup the maze
    let allChecked = true;
    while (allChecked) {
        if (this.stack.length != 0) {
            this.current = this.stack[this.stack.length - 1];
            this.current.current = true;
            let neighbours = [];

            //2- pick unvisited neighbours

            //up
            let upIndex = this.current.index - this.size;
            if (upIndex >= 0)
                if (!this.fields[upIndex].visited) {
                    neighbours.push(this.fields[upIndex]);
                }

                //right
            let rightIndex = this.current.index + 1;
            if (rightIndex <= (this.size * this.size) - 1 && rightIndex % (this.size) != 0)
                if (!this.fields[rightIndex].visited) {
                    neighbours.push(this.fields[rightIndex]);
                }

                //down
            let downIndex = this.current.index + this.size;
            if (downIndex <= (this.size * this.size) - 1)
                if (!this.fields[downIndex].visited) {
                    neighbours.push(this.fields[downIndex]);
                }

                //left
            let leftIndex = this.current.index - 1;
            if (leftIndex >= 0 && leftIndex % (this.size) != this.size - 1)
                if (!this.fields[leftIndex].visited) {
                    neighbours.push(this.fields[leftIndex]);
                }

                //select random neighbour
            if (neighbours.length != 0) {
                let randomIndex = Math.floor(random(neighbours.length));
                this.next = neighbours[randomIndex];

                //up
                if (this.current.index - this.next.index == this.size) {
                    this.current.removeWall(0);
                    this.next.removeWall(2);
                }
                //right
                if (this.current.index - this.next.index == -1) {
                    this.current.removeWall(1);
                    this.next.removeWall(3);
                }
                //down
                if (this.current.index - this.next.index == -this.size) {
                    this.current.removeWall(2);
                    this.next.removeWall(0);
                }
                //left
                if (this.current.index - this.next.index == 1) {
                    this.current.removeWall(3);
                    this.next.removeWall(1);
                }

                this.current.current = false;
                this.next.visited = true;
                this.current = this.next;
                this.current.current = true;
                this.stack.push(this.current);
            } else {
                this.stack[this.stack.length - 1].current = false;
                this.stack.pop();
                if (this.stack.length != 0) {
                    this.stack[this.stack.length - 1].current = true;
                }
            }
        } else {
            allChecked = false;
        }
        // end of setup maze
    }

    this.display = () => {
        this.fields.map(f => f.display());
    }

    this.update = (m) => {
        this.fields.map(f => f.moverDetact(m));
        this.fields.map(f => f.update());
        this.walls = [];

        this.fields.map(f => f.lines.map(l => this.walls.push(l)));

        m.wallDetact(this.walls);
    }


    this.setTarget = (t) => {
        let q = [];
        q.push(this.getnext(t));
        this.fieldforces(t);

        if (q.length - 1 >= 0) {
            while (q[q.length - 1].length != 0) {
                q.push([]);

                let beforelast = q[q.length - 2];
                let last = q[q.length - 1];

                for (let i = 0; i < beforelast.length; i++) {
                    last.push(...this.getnext(beforelast[i]));
                }
                for (let i = 0; i < beforelast.length; i++) {
                    this.fieldforces(beforelast[i]);
                }
            }
        }
        q = [];
    }

    //get open nieghbors
    this.getnext = (t) => {
        let q = [];

        let xfieldindex = Math.floor(t.x / this.fieldSize);
        let yfieldindex = Math.floor(t.y / this.fieldSize);

        let currentIndex = Math.floor(xfieldindex + yfieldindex * this.size);
        let upIndex = Math.floor(xfieldindex + (yfieldindex - 1) * this.size);
        let rightIndex = Math.floor(xfieldindex + (yfieldindex) * this.size + 1);
        let downIndex = Math.floor(xfieldindex + (yfieldindex + 1) * this.size);
        let leftIndex = Math.floor(xfieldindex + (yfieldindex) * this.size - 1);

        if (xfieldindex < this.size && yfieldindex < this.size) {
            //up
            if (yfieldindex - 1 >= 0) {
                if (!(this.fields[currentIndex].dir[0]) && !(this.fields[upIndex].dir[2])) {
                    if (this.fields[upIndex].force.mag() == 0) {
                        q.push(createVector(t.x, t.y - this.fieldSize));
                    }
                }
            }

            //right
            if (xfieldindex + 1 < size) {
                if (!(this.fields[currentIndex].dir[1]) && !(this.fields[rightIndex].dir[3])) {
                    if (this.fields[rightIndex].force.mag() == 0) {
                        q.push(createVector(t.x + this.fieldSize, t.y));
                    }
                }
            }

            //down
            if (yfieldindex + 1 < size) {
                if (!(this.fields[currentIndex].dir[2]) && !(this.fields[downIndex].dir[0])) {
                    if (this.fields[downIndex].force.mag() == 0) {
                        q.push(createVector(t.x, t.y + this.fieldSize));
                    }
                }
            }

            //left
            if (xfieldindex - 1 >= 0) {
                if (!(this.fields[currentIndex].dir[3]) && !(this.fields[leftIndex].dir[1])) {
                    if (this.fields[leftIndex].force.mag() == 0) {
                        q.push(createVector(t.x - this.fieldSize, t.y));
                    }
                }
            }
        }
        return q;
    }

    this.fieldforces = (t) => {
        let xfieldindex = Math.floor(t.x / this.fieldSize);
        let yfieldindex = Math.floor(t.y / this.fieldSize);

        let currentIndex = Math.floor(xfieldindex + yfieldindex * this.size);
        let upIndex = Math.floor(xfieldindex + (yfieldindex - 1) * this.size);
        let rightIndex = Math.floor(xfieldindex + (yfieldindex) * this.size + 1);
        let downIndex = Math.floor(xfieldindex + (yfieldindex + 1) * this.size);
        let leftIndex = Math.floor(xfieldindex + (yfieldindex) * this.size - 1);

        if (xfieldindex < this.size && yfieldindex < this.size) {
            //up
            if (yfieldindex - 1 >= 0) {
                if (!(this.fields[currentIndex].dir[0]) && !(this.fields[upIndex].dir[2])) {
                    if (this.fields[upIndex].force.mag() == 0) {
                        this.fields[upIndex].forceSet(createVector(0, 1));
                    }
                }
            }

            //right
            if (xfieldindex + 1 < this.size) {
                if (!(this.fields[currentIndex].dir[1]) && !(this.fields[rightIndex].dir[3])) {
                    if (this.fields[rightIndex].force.mag() == 0) {
                        this.fields[rightIndex].forceSet(createVector(-1, 0));
                    }
                }
            }

            //down
            if (yfieldindex + 1 < this.size) {
                if (!(this.fields[currentIndex].dir[2]) && !(this.fields[downIndex].dir[0])) {
                    if (this.fields[downIndex].force.mag() == 0) {
                        this.fields[downIndex].forceSet(createVector(0, -1));
                    }
                }
            }

            //left
            if (xfieldindex - 1 >= 0) {
                if (!(this.fields[currentIndex].dir[3]) && !(this.fields[leftIndex].dir[1])) {
                    if (this.fields[leftIndex].force.mag() == 0) {
                        this.fields[leftIndex].forceSet(createVector(1, 0));
                    }
                }
            }
        }
    }

    this.fieldsClear = () => {
        this.fields.map(f => f.forceSet(createVector()));
    }
}