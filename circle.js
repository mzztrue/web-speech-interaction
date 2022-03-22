class Circle {
    constructor(x, y, xspeed, yspeed, dia,clr) {
      this.pos = new p5.Vector(x, y);
      this.speed = new p5.Vector(xspeed, yspeed);
      this.dia = dia;
      this.acc = 0.1;
      this.clr = new p5.Vector(clr.x,clr.y,clr.z);
    }
  
    move() {
      this.pos.x += this.speed.x;
      this.pos.y += this.speed.y;
      // if(this.pos.x<0||this.pos.x>width){this.speed.x *=-1;}
      // if(this.pos.y<0||this.pos.y>height){this.speed.y*=-1;}
      this.speed.y += this.acc;
    }
  
    display() {
      colorMode(HSB);
      fill(this.clr.x,this.clr.y,this.clr.z);
      circle(this.pos.x, this.pos.y, this.dia);
    }
  }

//   function draw_loadingtrail(x1=0.45*width,x2=0.55*width,y=height-50){
//     let r = x2-x1;
//     let trail = [];
//     let clr = new p5.Vector(random(0,255),random(0,255),random(200,255));
//     let balls_num = 20;
//     let max_dia = 10;
//     let dia = max_dia * trail.length / balls_num;
//     for(let i=0;i<balls_num;i++){
//         let cx=map(i,0,balls_num-1,x1,x1+5);
//         let cy=map(i,0,balls_num-1,y+5,y);


//     }
    

//   }