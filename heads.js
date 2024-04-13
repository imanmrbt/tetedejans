class Head {
    constructor(world, rannum) {

        this.level = headsdata[rannum].level
        this.size = headsdata[rannum].size
        this.image = headsdata[rannum].image

        this.isfixed = true
        this.radus = this.size
        this.x = handpos[0]
        this.y = handpos[1]
        this.body = Bodies.circle(this.x, this.y, this.radus);
        Composite.add(world, [this.body]);
    }


    display() {


        this.x = handpos[0]
        this.y = handpos[1]

        if (this.isfixed) {
            Matter.Body.setPosition(this.body, { x: this.x, y: this.y });
        }


        let pos = this.body.position;
        // Get the position and angle of the box
        const angle = this.body.angle;
        const radius = this.body.circleRadius;



        // const bodyWidth = this.body.bounds.max.x - this.body.bounds.min.x;

        // Draw the box using p5.js
        push();
        translate(pos.x, pos.y);
        rotate(angle); // Apply the rotation angle
        restitution(0.7)
        noStroke();
        // ellipse(0, 0, radius * 2);
        image(headsdata[this.level].image, - radius, - radius, radius * 2, radius * 2);

        pop();
    }
}