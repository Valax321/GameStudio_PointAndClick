const CANVAS_SIZE = {x: 640, y: 480}

var resolutionScale = 1;

var interactables = [];

// Any object that can interact with mouse clicks (hover, mouse down, mouse up etc.)
class Interactable
{
    constructor(x, y)
    {
        interactables.push(this);
        this.enabled = true;
        this.position = createVector(x, y);
        this.validHovered = false;
        this.hoverCached = false;
    }

    // Is the mouse currently over this interactable?
    isHovered()
    {
        //Use p5.collide
        if (!this.validHovered)
        {
            validHovered = true;
        }
    }

    update()
    {
        this.validHovered = false;
    }
}

class Howitzer extends Interactable
{
    constructor()
    {
        super(320, 380);
        this.sprites = [];
        this.sprites[0] = []; //Normal sprites
        this.sprites[1] = [];

        this.angle = 20; //Idle angle
        this.yaw = 0;
        this.firing = false;

        this.sprites[0][0] = loadImage("assets/howitzer/h_5_normal.png");
        this.sprites[0][1] = loadImage("assets/howitzer/h_20_normal.png");
        this.sprites[0][2] = loadImage("assets/howitzer/h_35_normal.png");
        this.sprites[0][3] = loadImage("assets/howitzer/h_60_normal.png");

        this.sprites[1][0] = loadImage("assets/howitzer/h_5_firing.png");
        this.sprites[1][1] = loadImage("assets/howitzer/h_20_firing.png");
        this.sprites[1][2] = loadImage("assets/howitzer/h_35_firing.png");
        this.sprites[1][3] = loadImage("assets/howitzer/h_60_firing.png");

        this.shadowSprite = loadImage("assets/howitzer/h_shadow.png");
    }

    getFiringSpriteIndex()
    {
        if (this.angle < 15) return 0;
        if (this.angle < 27.5) return 1;
        if (this.angle < 47.5) return 2;
        else return 3;
    }

    update()
    {
        super.update();
    }

    draw()
    {
        push();
        translate(this.position.x, this.position.y);
        rotate(radians(this.yaw));
        image(this.shadowSprite, 0, 0);
        image(this.sprites[this.firing | 0][this.getFiringSpriteIndex()], 0, 0);
        pop();
    }
}

function setCanvasSize()
{
    var sx = floor(windowWidth / CANVAS_SIZE.x);
    var sy = floor(windowHeight / CANVAS_SIZE.y);
    resolutionScale = min(sx, sy);
}

var howy;
var bg;

function preload()
{
    howy = new Howitzer();
    bg = loadImage("assets/howitzer/h_background.png");
}

function setup()
{
    setCanvasSize();
    frameRate(60);
    imageMode(CENTER);
    var canvas = createCanvas(CANVAS_SIZE.x * resolutionScale, CANVAS_SIZE.y * resolutionScale).elt;
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
}

function windowResized()
{
    setCanvasSize();
    resizeCanvas(CANVAS_SIZE.x * resolutionScale, CANVAS_SIZE.y * resolutionScale);
}

function draw()
{
    background(0);
    push();
    scale(resolutionScale);
    push();
    imageMode(CORNER);
    image(bg, 0, 0);
    pop();
    howy.draw();
    pop();
}
