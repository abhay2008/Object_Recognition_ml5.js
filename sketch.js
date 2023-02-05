let video;
let detector;
let detections = {};
   

function preload() {
  detector = ml5.objectDetector('cocossd');
}

function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  
  for (let i = 0; i < results.length; i++) {
    let object = results[i];
    let label = object.label;
    console.log(label);
    if (detections[label]) {
      let existing = detections[label];
      if (existing.length == 0) {
        existing.push(object);
        object.timer = 100;
      }      
    } else {
      detections[label] = [object];     
      object.timer = 100;
    }
  }
  detector.detect(video, gotDetections);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  detector.detect(video, gotDetections);
}

function draw() {
  image(video, 0, 0);
  
  let lables = Object.keys(detections);
  for (let label of lables) {
    let objects = detections[label];
    for (let i = objects.length-1; i >= 0; i--) {
      let object = objects[i];
      stroke(0, 255, 0);
      strokeWeight(4);
      fill(0, 255, 0, object.timer);
      rect(object.x, object.y, object.width, object.height);
      noStroke();
      fill(255);
      textSize(24);
      text(object.label, object.x + 10, object.y + 24);
      object.timer -= 5;
      if (object.timer < 0) {
        objects.splice(i, 1);
      }
    }
  }  
}