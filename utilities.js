//some miscalleneous utility functions

//because some recognized speech comes out as lower case, which bugs me lol
const capitalizeSentence = (txtIn) => {
	const [firstWord, ...words] = txtIn.split(' ');
	const [firstLetter, ...letters] = firstWord;
	const capitalized = [firstLetter.toUpperCase(), ...letters].join('');
	return [capitalized, ...words].join(' ');
};

//some of the text was originally rotated upside down, so we wanna flip it over if that occurs
const fixAngle = (angleIn) => {
	//keep it between -PI/2 and PI/2
	return (angleIn > HALF_PI || angleIn < -HALF_PI)?(angleIn + PI):angleIn;
};

//mic info display
function display_transcript(canvas_upper=0.5,canvas_lower=1){}

function display_mic_status(canvas_upper=0,canvas_lower=0.5) {
  let lvl = mic.getLevel();
  let canvas_h= canvas.lower-canvas.upper;
  
  push();
  translate(0,canvas_upper*height);
  fill(255);
  
  let largesize = canvas_h/5;
  let smallsize = canvas_h/10;
  
  textFont("Courier New", largesize);
  if (micOn) {
    text("MIC: ON", width * 0.5, canvas_upper + largesize *2);
    text("OUT: " + nf(6 * logN(lvl, 10), 1, 1) + " dB", width * 0.5, canvas_upper + largesize *4 );
  } 
  else {
    text("MIC: OFF", width * 0.5, canvas_upper + largesize *2);
    text("OUT: -.- dB", width * 0.5, canvas_upper + largesize *4 );
  }

  textFont("Courier New", smallsize);
  text("Press start or 'M' to toggle ON/OFF", width * 0.5, canvas_upper + largesize *2 + smallsize*2);

  textFont("Courier New", smallsize);
  text("Press stop or 'Z' to end an recognition", width * 0.5, canvas_upper + largesize *2 + smallsize*4);

  pop();
}

function logN(x, N) {
  return log(x) / log(N);
}

