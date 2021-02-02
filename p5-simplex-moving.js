// Based on: https://codepen.io/jwagner/pen/BNmpdm/?editors=001

//let simplex = new SimplexNoise();
let WIDTH = 400;//600;
let HEIGHT = 200;//400;
let C_WIDTH = 800;
let C_HEIGHT = 200;
let map = new Array(HEIGHT);

let grass = null;
let water = null;
let dirt = null;
let mountains = null;

let img = null;
let offset = [0, 0];
let dir = [1, 1];
let pause = false;

let octaveSlider;
let freqSlider;
let noiseGen;

let lockedFrameCount;



// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function updateSimplex() {
  noiseGen = new FastSimplexNoise({ frequency: freqSlider.value(), octaves: octaveSlider.value() });
}

function writeArray() {
  lockedFrameCount = frameCount;

  let output = "map = [<br>";
  for (let x = lockedFrameCount; x < lockedFrameCount + WIDTH; x++) {
    output += "  [";
    for (let y = lockedFrameCount; y < lockedFrameCount + HEIGHT; y++) {
      if (y >= (lockedFrameCount + HEIGHT - 1))
        output += noiseGen.get2DNoise(x+offset[0], y+offset[1]);
      else
        output += noiseGen.get2DNoise(x+offset[0], y+offset[1]) + ", ";
    }
    output += "  ],<br>";
  }
  output += "];"

  select("#output").html(output);
}

function setup() {
  noiseGen = new FastSimplexNoise({ frequency: 0.01, octaves: 4 });

  createCanvas(C_WIDTH, C_HEIGHT);
  background(color("#eeeeee"));


  // sliders
  octaveSlider = createSlider(0, 20, 4, 1);
  octaveSlider.position(WIDTH+20, 30);
  freqSlider   = createSlider(0.01, 0.2, 0.01, 0.01);
  freqSlider.position(WIDTH+20, 50);

  // buttons
  button = createButton('write array');
  button.position(WIDTH+20, 70);

  octaveSlider.mouseReleased(updateSimplex);
  freqSlider.mouseReleased(updateSimplex);
  button.mousePressed(writeArray);

  textSize(15);

  grass = color(0, 153, 76);
  water = color(51, 153, 255);
  dirt = color(153, 76, 0);
  mountains = color(51, 25, 0);

  img = createImage(WIDTH, HEIGHT);
  img.loadPixels();


  frameRate(30);
  //noStroke();
}

function keyReleased() {
  if (keyCode == UP_ARROW)
    dir[1] = 1;
  else if (keyCode == DOWN_ARROW)
    dir[1] = -1;
  else if (keyCode == LEFT_ARROW) 
    dir[0] = 1;
  else if (keyCode == RIGHT_ARROW)
    dir[0] = -1;
  else if (keyCode == 32) //SPACE
    pause = !pause;
    
}

function draw() {
  let t = frameCount / 60; // update time

  if (!pause) {
    for (var x = 0; x < img.width; x++) {//WIDTH; x++) { //}=10) {
      for (var y = 0; y < img.height; y++) { //HEIGHT; y++) {//}=10) {
        let col = null;

      //let s = simplex.noise2D(x, y);
        let s = noiseGen.get2DNoise(x+offset[0], y+offset[1]);
        //let s = noiseGen.get2DNoise(x+(dir[0]*offset[0]), y+(dir[1]*offset[1]));

        if (s < 0.0)
          col = water;
        else if (s < 0.25)
          col = dirt;
        else if (s < 0.75) 
          col = grass;
        else
          col = mountains;
        img.set(x, y, col);

      

      /*
        var r = simplex.noise3D(x / 16, y / 16, frameCount/16) * 0.5 + 0.5;
        var g = simplex.noise3D(x / 8, y / 8, frameCount/16) * 0.5 + 0.5;
        let _red = r * 255;
        let _green = (r + g) * 200;
        let _blue = 0;
        let _alpha = 255;

        fill(_red, _green, _blue, _alpha);
        ellipse(x, y, 1);//getRandomArbitrary(5,15));
        */
      }
    }

    offset[0] += dir[0];
    offset[1] += dir[1];
    img.updatePixels();
    image(img, 0,0);//100, 100);
  }

  const o = octaveSlider.value();
  const f = freqSlider.value();
  text('octaves', WIDTH + 20 + octaveSlider.width, 35);
  //text('frequency', freqSlider.x * 2 + freqSlider.width, 65);
  text('frequency', WIDTH + 20 + freqSlider.width, 58);
}