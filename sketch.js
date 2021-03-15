const model_url =
  'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let pitch;
let mic;
let freq = 0;
let threshold = 1;
let freqhistory=[];

let notes = [
  {
    note: 'A',
    freq: 440
  },
  {
    note: 'E',
    freq: 329.6276
  },
  {
    note: 'C',
    freq: 261.6256
  },
  {
    note: 'G',
    freq: 391.9954
  }
];

function setup() {
  createCanvas(400, 400);
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(listening);
  
}

function listening() {
  getAudioContext().resume();
  console.log('listening');
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}


function gotPitch(error, frequency) {
  if (error) {
    console.error(error);
  } else {
    //console.log(frequency);
    if (frequency) {
      freq = frequency;
      
      console.log(freqhistory);
    }
    
    pitch.getPitch(gotPitch);
  }
}
function draw() {
  background(0);
  freqhistory.push(freq);
  stroke(255);
  noFill();
  beginShape();
  for(var i=0;i<freqhistory.length;i++){
    var y = map(freqhistory[i], 150, 1800, height-200, height-400);
    vertex(i, y);
}
endShape();

if (freqhistory.length > width-30) {
    freqhistory.splice(0, 1);
  }
  stroke(255, 0, 0);
  line(freqhistory.length, 0, freqhistory.length, height);

  textAlign(CENTER, CENTER);
  fill(255);
  textSize(32);
  text(freq.toFixed(2), width / 2, height - 150);

  let closestNote = -1;
  let recordDiff = Infinity;
  for (let i = 0; i < notes.length; i++) {
    let diff = freq - notes[i].freq;
    if (abs(diff) < abs(recordDiff)) {
      closestNote = notes[i];
      recordDiff = diff;
    }
  }

  textSize(64);
  text(closestNote.note, width / 2, height - 50);

  //let diff = recordDiff;
  // let amt = map(diff, -100, 100, 0, 1);
  // let r = color(255, 0, 0);
  // let g = color(0, 255, 0);
  // let col = lerpColor(g, r, amt);


  
  /* let alpha = map(abs(diff), 0, 100, 255, 0);
  rectMode(CENTER);
  fill(255, alpha);
  stroke(255);
  strokeWeight(1);
  if (abs(diff) < threshold) {
    fill(0, 255, 0);
  }
  rect(200, 100, 200, 50);

  stroke(255);
  strokeWeight(4);
  line(200, 0, 200, 200);

  noStroke();
  fill(255, 0, 0);
  if (abs(diff) < threshold) {
    fill(0, 255, 0);
  }
  rect(200 + diff / 2, 100, 10, 75); */
}

function modelLoaded() {

  console.log('model loaded');
  pitch.getPitch(gotPitch);
}



 /* Plotly.plot(document.querySelector(".wrapper"),[{
  y:[getData()],
  type:'line'
}]);

var cnt=0;

setInterval(function(){
  if(audstat==1){
  Plotly.extendTraces(document.querySelector(".wrapper"),{y:[[getData()]]},[0]);
  cnt++;
  if(cnt>300){
    Plotly.relayout(document.querySelector(".wrapper"),{
      xaxis:{
        range:[cnt-300,cnt]
      }
    });
  }
}},15);
 */
/*function draw() {
  background(0);
  textAlign(CENTER,CENTER);
  fill(255);
  textSize(64);
  text(freq.toFixed(2),width/2,height/2);
}*/