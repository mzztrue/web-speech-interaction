//1.mic speech on and off bind; 2.
let mic, fft; //using p5 sound library
let micOn;
let speechrecOn;

// let lang = document.querySelector("#select_dialect").value;

let lang = 'zh-CN';
console.log(lang);

const speech = new p5.SpeechRec(lang);
const syn = new p5.Speech(lang);

// Create a new Sentiment method
const sentiment = ml5.sentiment('movieReviews');


let allTxt;


function setup() {
  
//set up canvas
  let mycanvas = createCanvas(windowWidth, windowHeight*0.7);
  mycanvas.parent('canvasContainer');
  colorMode(HSB);
  noFill();
  textAlign(CENTER);
  textFont('Georgia');
  let t_size = 20;
  textSize(t_size);

  allTxt = new AllTheText();

  //setup speech engine

  mic = new p5.AudioIn();
  mic.stop(); //defult not micOn==false
  micOn = false; speechrecOn = false;
  speech.continuous = true;
  speech.interimResults = false; //engine will give faster, partial results (true) or wait for the speaker to pause (false = default).
  
    //The result event will pass an event object to the callback function. This object will contain the results in the form of an array. 
  //Each element in the array will have a property called isFinal denoting whether that item is an interim result or a final result.
  let final_transcript = "";

    // Callback Function for the onStart Event
  speech.onStart = () => {
    // Show the Status Element
    document.querySelector("#status").style.display = "block";
    //link with audio visualization
    mic.start();micOn = true;speechrecOn = true;
    userStartAudio();
    final_transcript = "";
  };
  
  speech.onError = () => {
    // Hide the Status Element
    document.querySelector("#status").style.display = "none";
  };
  
  speech.onEnd = () => {
    // Hide the Status Element
    document.querySelector("#status").style.display = "none";
    text("speech rec end", width * 0.5, 250);
    //link with audio visualization
    mic.stop(); micOn = false; speechrecOn = false;
    final_transcript = "";
  };
  

  
  speech.onResult = () => {

    let e=speech.resultJSON;
    // Create the interim transcript string locally because we don't want it to persist like final transcript
    let interim_transcript = "";
    
    // Loop through the results from the speech recognition object.
    for (let i = e.resultIndex; i < e.results.length; ++i) {
      // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
      if (e.results[i].isFinal) {
        final_transcript += e.results[i][0].transcript;
      } else {
        interim_transcript += e.results[i][0].transcript;
      }
    }

    //combine with ml5 sentiment
    let prediction = sentiment.predict(final_transcript);
    print(final_transcript,prediction);
    // Set the Final transcript and Interim transcript.
    // document.querySelector("#final").innerHTML = final_transcript;
    // document.querySelector("#interim").innerHTML = interim_transcript;
    //wire results to add a new sentence
    // allTxt.addNewTxt(capitalizeSentence(speech.resultString),prediction.score);
    allTxt.addNewTxt(capitalizeSentence(final_transcript),prediction.score);
  };
  
  // Set the onClick property of the start button
  document.querySelector("#start").onclick = () => {
    // Start the Speech Recognition
    if(!speechrecOn){speech.start()}
    else{print("started already.")}
  };
  // Set the onClick property of the stop button
  document.querySelector("#stop").onclick = () => {
    // Stop the Speech Recognition
    speech.stop();
  };


  //generates a spectrum for sound to appear on
  fft = new p5.FFT();
  fft.setInput(mic);
  
}

function draw() {
  //gui
  

  //speech

  //sound
  background(30);
  let spec = fft.analyze();
  let wave = fft.waveform();
  if(speechrecOn){
    
    fft_spec_visualize(spec,col_type = "line",
    freq_num = 200,
    x1 = 0.0,
    x2 = 1.0,y1 = 0,y2 = 0.99);
    
    push();
    translate(0, 0.99*height);
    plot_waveform(wave);
    pop();

  }

  allTxt.run();
  

}


function keyPressed(){
  if(key =='s'){
    if(!speechrecOn){speech.start()}
    else{print("started already.")}
  }
}
function keyReleased(){
  if(key =='s'){
    speech.stop();

  }
}

function fft_spec_visualize(
  spec,
  col_type = "ellipse",
  freq_num = 200,
  x1 = 0.25,
  x2 = 0.75,
  y1 = 0.25,
  y2 = 0.5
) {
  for (let i = 0; i < freq_num; i++) {
    let x = map(i, 0, freq_num, x1, x2) * width;
    let ylow = y2 * height;
    let yhigh = y1 * height;
    let ypeak = map(spec[i], 0, 255, ylow, yhigh);
    let h = ylow - ypeak;
    let w = (width * (x2 - x1)) / freq_num;
    let hu = map(i, 0, freq_num, 0, 360);
    stroke(hu, 255, 255);

    if (col_type == "line") {
      line(x, ylow, x, ypeak);
    }

    if (col_type == "ellipse") {
      ellipse(x, ylow, w, h);
    }

    if (col_type == "rectangle") {
      rectMode(CENTER);
      rect(x, ylow, w, h);
    }
  }
}

function plot_waveform(wave, x1 = 0.0, x2 = 1.0, h = 0.2) {
  beginShape();
  for (let i = 0; i < wave.length; i++) {
    stroke(200);
    let x = map(i, 0, wave.length, x1, x2) * width;
    vertex(x, height * h * wave[i]);
  }
  endShape();
}


