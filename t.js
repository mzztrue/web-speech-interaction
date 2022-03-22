class text_platform
{
  constructor(x,y,w,h,p){
    this.x = x;
    this.y = y;
	this.w = w;
	this.h = h;

	this.padding = p;
  }


  display(textIn,polarity,alpha) {//at 0,0
    //display transcript string as a text box
	noStroke();
	//change color or size, even movement..?
	
	let hu = 300;
	let s = 200;
	let b = map(polarity,0,1,0,255);
	colorMode(HSB);
    fill(hu,s,b,alpha);

    rect(0, 0, this.w, this.h);
	
    // translate(this.padding+this.w/2,this.padding + this.h/2);
	textAlign(LEFT, TOP);
	translate(this.padding,this.padding);
	fill(255,alpha);

	// textSize(30);
	textWrap(WORD);	
    text(textIn, 0, 0, this.w, this.h);

  }
 
}

class text_block{
	constructor(textIn='',pred){
		this.textIn = textIn;
		this.t_size = 30;
		
		//set a random position and display as a platform
		this.pos = createVector(round(random(0,0.7*width)),round(random(0.1*height,0.9*height)));
		this.gravity = 3;
		this.support = 0;	
		// this.float = random(1,3);
		const CENTER = createVector(width/2,height/2);
		this.dir = p5.Vector.sub(CENTER,this.pos).normalize();
		
		//use this for the fade in/out transition
		this.alpha = 0;
		this.lifespan = 0.0;
		this.gen = new p5.Gen();

		//platform property
		this.padding = 10;
		this.plat_w = textWidth(this.textIn)+ this.padding*2;

		if(this.pos.x + this.plat_w > 0.9*width){
			this.plat_w = 0.9*width-this.pos.x;
		}
	
		this.plat_h = round(textWidth(textIn)/(this.plat_w - 2*this.padding))*30;
		this.platfrom = new text_platform(this.pos.x,this.pos.y,this.plat_w,this.plat_h,this.padding);

		//sentiment
		this.polarity = pred;

		
	}
	update(){
		this.pos.add(0,this.gravity+this.support);
		this.platfrom.x = this.pos.x;
		this.platfrom.y = this.pos.y;
		if(this.pos.y + this.plat_h > height){
			this.pos.y = height-this.plat_h;
			this.support = -3;
		}
		this.lifespan += 0.002;
		this.alpha = map(this.gen.waveform(this.lifespan,'cosine'),1,-1,0,255);
	}
	
	draw(){
		push();
		translate(this.pos.x,this.pos.y);
		// rotate(fixAngle(this.dir.heading()));	
		this.platfrom.display(this.textIn,this.polarity,this.alpha);
		pop();
	}

	isDone(){
		return this.lifespan > 1.0;
	}
}



//--------------Make an array of text (and get rid of the ones we don't need anymore to save space)-----------
class AllTheText{
	constructor(){
		this.allTxt = [];
	}
	addNewTxt(textIn, pred){
		//this.allTxt.push(new FlyingText(textIn));
		this.allTxt.push(new text_block(textIn, pred));

	}
	
	run(){
		for (let txt of this.allTxt){
			txt.update();
			txt.draw();
		}
		if (this.allTxt.some((item) => item.isDone())){
			this.checkExpired();
		}
	}
	//if it's past the lifespan, get rid of it!
	checkExpired(){
		this.allTxt = this.allTxt.filter((item)=> item.isDone() === false);
	}
}



// class FlyingText{
// 	constructor(textIn=''){
// 		this.textIn = textIn;
      
// 		//set a random position and aim it directly towards the other side of the screen
// 		this.pos = createVector(round(random(0,width)),round(random(0,height)));
// 		//calculate an angle of attack!
// 		const CENTER = createVector(width/2,height/2);
// 		const SPEED = random(1,3);
// 		this.dir = p5.Vector.sub(CENTER,this.pos).normalize();
// 		this.velocity = p5.Vector.mult(this.dir,SPEED);
// 		//use this for the fade in/out transition
// 		this.alpha = 0;
// 		this.lifespan = 0.0;
// 		this.gen = new p5.Gen();
// 	}
	
// 	update(){
// 		this.pos.add(this.velocity);
// 		this.lifespan += 0.002;
// 		this.alpha = map(this.gen.waveform(this.lifespan,'cosine'),1,-1,0,255);
// 	}
	
// 	draw(){
// 		push();
// 		fill(0,this.alpha);
// 		translate(this.pos.x,this.pos.y);
// 		rotate(fixAngle(this.velocity.heading()));
// 		text(this.textIn,0,0);
// 		pop();
// 	}
	
// 	isDone(){
// 		return this.lifespan > 1.0;
// 	}
// }