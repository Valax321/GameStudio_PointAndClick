const CANVAS_SIZE = {x: 640, y: 480}

var resolutionScale = 1;

var interactables = [];

function deltaTime()
{
    return 1 / getFrameRate();
}

//It would be nice if I didn't have to keep writing my own maths functions...

// Float is approximately equal to another float
function approx(a, b, delta = 0.001)
{
    var diff = abs(a - b);
    return diff <= delta;
}

function clamp(value, a, b)
{
    if (a > b)
    {
        var temp = b;
        b = a;
        a = temp;
    }
    if (value > b) return b;
    if (value < a) return a;
    return value;
}

// https://answers.unity.com/questions/227736/clamping-a-wrapping-rotation.html
function clampAngle(angle, from, to)
{
    if (angle > 180) angle = 360 - angle;
    angle = clamp(angle, from, to);
    if (angle < 0) angle = 360 + angle;
    return angle;
}

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

const FS_YAW = 0;
const FS_PITCH = 1;
const FS_FIRING = 3;

var deathScreams = [];

class DeathImpact
{
    constructor(accuracy)
    {
        this.accuracy = accuracy;
    }

    doScream()
    {
        if (this.accuracy > 0.8)
        {

        }
        else if (this.accuracy > 0.6)
        {

        }
        else if (this.accuracy > 0.4)
        {

        }
        else
        {
            
        }
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
        this.desiredYaw = 0;
        this.maxYaw = 40;
        this.firing = false;

        this.fireStage = FS_YAW;

        this.maxPitchDistance = 300;

        this.rotateSpeed = 10;

        this.fireTimer = 7;
        this.currentFireTime = 0;

        //TODO: ADD MORE STATES TO THIS! Probably every 10 degrees
        this.sprites[0][0] = loadImage("assets/howitzer/h_5_normal.png");
        this.sprites[0][1] = loadImage("assets/howitzer/h_10_normal.png");
        this.sprites[0][2] = loadImage("assets/howitzer/h_20_normal.png");
        this.sprites[0][3] = loadImage("assets/howitzer/h_30_normal.png");
        this.sprites[0][4] = loadImage("assets/howitzer/h_40_normal.png");
        this.sprites[0][5] = loadImage("assets/howitzer/h_50_normal.png");
        this.sprites[0][6] = loadImage("assets/howitzer/h_60_normal.png");

        this.sprites[1][0] = loadImage("assets/howitzer/h_5_firing.png");
        this.sprites[1][1] = loadImage("assets/howitzer/h_10_firing.png");
        this.sprites[1][2] = loadImage("assets/howitzer/h_20_firing.png");
        this.sprites[1][3] = loadImage("assets/howitzer/h_30_firing.png");
        this.sprites[1][4] = loadImage("assets/howitzer/h_40_firing.png");
        this.sprites[1][5] = loadImage("assets/howitzer/h_50_firing.png");
        this.sprites[1][6] = loadImage("assets/howitzer/h_60_firing.png");

        this.shadowSprite = loadImage("assets/howitzer/h_shadow.png");

        this.fireSound = loadSound("assets/sound/howy_fire.ogg");
        this.fireSound.playMode('sustain');

        this.aimFont = loadFont("assets/fonts/icbmss25.ttf");
    }

    getFiringSpriteIndex()
    {
        return clamp(round(this.angle * 0.1), 0, 60);
    }

    mousePressed()
    {
        if (this.fireStage == FS_YAW) this.fireStage = FS_PITCH;
        else if (this.fireStage == FS_PITCH)
        {
             this.firing = true;
             this.fireStage = FS_FIRING;
             this.fireSound.play();
             //I would spawn a cool smoke/muzzle effect here, but my 2D art skills are so bad I don't know how to make one.
        }
    }

    update()
    {
        super.update();

        var mXo = mouseX - this.position.x * resolutionScale; //Because mouse position is in unscaled units.
        var mYo = mouseY - this.position.y * resolutionScale;

        var mo = createVector(mXo, mYo);

        if (this.fireStage == FS_YAW)
        {
            if (getFrameRate() != 0) //HACK: p5 is so well made that getFrameRate() returns 0 on the first frame, meaning deltaTime() returns Infinity. It broke rotation by instantly setting yaw to Infinity too.
            {
                this.desiredYaw = clampAngle(degrees(mo.heading()) + 90, this.maxYaw, -this.maxYaw);
                // Move the howitzer slowly.
                var dyC = this.desiredYaw > 180 ? (360 - this.desiredYaw) * -1 : this.desiredYaw;
                var yC = this.yaw > 180 ? 360 - this.yaw : this.yaw;
                var dir = Math.sign(dyC - yC);
                if (approx(dyC, yC, 0.1)) dir = 0; //Stop moving if we're pretty close.
                this.yaw += this.rotateSpeed * dir * deltaTime()
            }
        }
        else if (this.fireStage == FS_PITCH)
        {
            var mDist = mo.mag() / resolutionScale;
            var distScale = pow(clamp(mDist / this.maxPitchDistance, 0, 1), 2);
            this.angle = lerp(0, 60, distScale);
        }
        else if (this.fireStage == FS_FIRING)
        {
            this.currentFireTime += deltaTime();

            if (this.currentFireTime > 0.2)
            {
                this.firing = false;
            }

            if (this.currentFireTime >= this.fireTimer)
            {
                this.fireStage = FS_YAW;
                this.currentFireTime = 0;
            }
        }
        else
        {
            console.log("Invalid fire stage on howitzer!");
        }
    }

    draw()
    {
        push();
            translate(this.position.x, this.position.y);
            rotate(radians(this.yaw));
            image(this.shadowSprite, 0, 0);
            image(this.sprites[this.firing | 0][this.getFiringSpriteIndex()], 0, 0);
        pop();
        push();
            textFont(this.aimFont);
            fill(255);
            strokeWeight(1);
            stroke(0);
            var mx = (mouseX / resolutionScale) + 10;
            text("Yaw: " + this.yaw.toFixed(0), mx, mouseY / resolutionScale);
            text("Pitch: " + this.angle.toFixed(0), mx, (mouseY / resolutionScale) - 15);
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

    for (var i = 1; i < 13; i++)
    {
        deathScreams[i] = loadSound("assets/sound/c_scream_" + (i < 10 ? "0" + i : i) + ".ogg");
    }
}

function setup()
{
    setCanvasSize();
    frameRate(60);
    imageMode(CENTER);
    var canvas = createCanvas(CANVAS_SIZE.x * resolutionScale, CANVAS_SIZE.y * resolutionScale).elt;
    var ctx = canvas.getContext('2d');
    //ctx.imageSmoothingEnabled = false;
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
    howy.update();
    howy.draw();
    pop();
}

function mousePressed()
{
    if (howy != null)
    {
        howy.mousePressed();
    }
}
