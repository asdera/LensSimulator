focalLength = 150;

object = {};

object.position = -220;
object.width = 25;
object.height = 50;

image = {};

lens = {};

lens.width = 20;

function distance(x1, y1, x2, y2) {
    return sqrt((x1 - x2)**2 + (y1 - y2)**2)
}

function mark(x, colour="black", d=10) {
    stroke(colour);
    line(500-d+x, 250-d, 500+d+x, 250+d);
    line(500+d+x, 250-d, 500-d+x, 250+d);
}

function ray(x1, y1, x2, y2, v=true) {
    m = (y2-y1)/(x2-x1);
    stroke("yellow")
    line(x1, y1, x2+1000, y2+1000*m);
    if (v) {
        stroke("green");
        line(x1, y1, x1-1000, y1-1000*m);
    }
}

function setup() {
    createCanvas(1000, 500);
    textAlign(CENTER);
    strokeWeight(1);
    noLoop();
    redraw();
}

function draw() {
    background("lightgray");

    // Principal Axis
    stroke("red");
    line(0, 250, 1000, 250);

    // Optical Center
    stroke("blue");
    line(500, 0, 500, 500);

    mark(-focalLength);
    mark(-focalLength*2);
    mark(focalLength*2);
    mark(focalLength, "white");
    stroke("red")
    text(round(focalLength), 500+focalLength, 275);


    // Positioning
    image.position = 1/(1/focalLength+1/object.position);
    image.mag = -image.position/object.position;
    image.width = image.mag*object.width;
    image.height = image.mag*object.height;

    // Light Rays
    // Line 1 - Through F
    ray(500, 250-object.height, 500+focalLength, 250);
    stroke("yellow");
    line(500+object.position, 250-object.height, 500, 250-object.height);

    // Line 2 - Through O
    ray(500, 250, 500+image.position, 250+image.height);
    stroke("lime");
    line(500+object.position, 250-object.height, 500, 250);
    
    // Line 3 - Through F'
    ray(500, 250+image.height, 500+image.position, 250+image.height);
    stroke("yellow");
    line(500+object.position, 250-object.height, 500, 250+image.height);

    // Object
    fill("white");
    stroke("black");
    rectMode(CENTER);
    rect(500+object.position, 250-object.height/2, object.width, object.height);
    fill("red");
    stroke("red");
    text(round(object.position), 500+object.position, 250-object.height-object.height/abs(object.height)*50);
    text(abs(round(object.height)), 500+object.position, 250-object.height-object.height/abs(object.height)*25);

    // Image
    fill("darkgray");
    stroke("black");
    rect(500+image.position, 250+image.height/2, image.width, image.height);
    fill("red");
    stroke("red");
    text(round(image.position), 500+image.position, 250+image.height+image.height/abs(image.height)*50);
    text(abs(round(image.height*100)/100), 500+image.position, 250+image.height+image.height/abs(image.height)*25);

    // Lens
    noFill();
    
    if (object.position > 0) {
        lens.width = -lens.width;
        //focalLength = -focalLength;
    }

    if (focalLength > 0 ^ object.position > 0) {
        var angle = acos((focalLength*2)/(focalLength*2+lens.width));
        lens.dotY = sin(PI-angle)*(focalLength*2+lens.width)
        arc(500-focalLength*2, 250, focalLength*4+lens.width*2, focalLength*4+lens.width*2, (object.position > 0 ? PI : 0)-angle, (object.position > 0 ? PI : 0)+angle);
        arc(500+focalLength*2, 250, focalLength*4+lens.width*2, focalLength*4+lens.width*2, (object.position > 0 ? 0 : PI)-angle, (object.position > 0 ? 0 : PI)+angle);
    } else {
        lens.width /= 1.5;
        var angle = acos((focalLength*2)/(focalLength*2-lens.width));
        lens.dotX = cos(PI-angle)*(focalLength*2+lens.width)+focalLength*2
        lens.dotY = sin(PI-angle)*(focalLength*2+lens.width)
        line(500-lens.dotX, 250+lens.dotY, 500+lens.dotX, 250+lens.dotY);
        line(500-lens.dotX, 250-lens.dotY, 500+lens.dotX, 250-lens.dotY);
        arc(500-focalLength*2, 250, focalLength*4+lens.width*2, focalLength*4+lens.width*2, (object.position > 0 ? 0 : PI)-angle, (object.position > 0 ? 0 : PI)+angle);
        arc(500+focalLength*2, 250, focalLength*4+lens.width*2, focalLength*4+lens.width*2, (object.position > 0 ? PI : 0)-angle, (object.position > 0 ? PI : 0)+angle);
        lens.width *= 1.5;
    }
    
    if (object.position > 0) {
        lens.width = -lens.width;
        //focalLength = -focalLength;
    }

    // SALT Table
    if (image.height > object.height) { 
        $(".size").text("Size: Larger");
    } else {
        $(".size").text("Size: Smaller");
    }

    if (image.height > 0) { 
        $(".attitude").text("Attitude: Upright");
    } else { 
        $(".attitude").text("Attitude: Inverted");
    }

    if (abs(image.position) > focalLength*2) { 
        $(".location").text("Location: Past twice the focus");
    } else if (abs(image.position) > focalLength) { 
        $(".location").text("Location: Between the focus and twice the focus");
    } else { 
        $(".location").text("Location: Between optical centre and the focus");
    }

    if (image.position > 0) { 
        $(".type").text("Type: Real");
    } else { 
        $(".type").text("Type: Virtual");
    }
} 



function mouseDragged() {
    if (distance(500+object.position, 250-object.height, mouseX, mouseY) < 80) {
        object.position = mouseX-500;
        object.height = 250-mouseY;
        if (abs(250-mouseY) > abs(lens.dotY)) {
            object.height *= abs(lens.dotY)/abs(object.height);
        }
    }

    if (distance(500+focalLength, 250, mouseX, mouseY) < 40) {
        focalLength = mouseX-500;
    } 

    redraw();
}







