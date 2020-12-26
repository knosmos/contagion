let w = window.innerWidth;
let h = window.innerHeight;

cells = [];
viruses = [];
tcells = [];

let startCells = 100;
let startViruses = 10;
let healthy = startCells;
let infected = 0;
let dead = 0;
let cviruses = startViruses;
let timeElapsed = 0;

let tCellPos = false;

let win = false;
let start = true;

function randint(l,h){
    return l+Math.random()*(h-l);
}

function toRadians(angle) {
    return angle*(Math.PI/180);
}

function distance(x1,y1,x2,y2){
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function buttonHovered(x,y,w,h){
    if(mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h){
        return true;
    }
    return false;
}

function buttonPressed(x,y,w,h){
    if(mouseIsPressed&&mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h){
        return true;
    }
    return false;
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

class cell{
    constructor(){
        this.size = randint(50,80);
        this.pos = [randint(this.size/2,w-this.size/2),randint(this.size/2,h-this.size/2)];
        this.pos2 = [randint(0,w),randint(0,h)];
        this.slope = (this.pos[1]-this.pos2[1])/(this.pos[0]-this.pos2[0]);
        this.speed = 0.5;
        this.dslope = randint(0,360);//Math.atan(this.slope);
        this.dir = [Math.cos(toRadians(this.dslope)),Math.sin(toRadians(this.dslope))];
        this.infected = false;
        this.suicideCtr = 0;
        this.divideCtr = 0;
        //this.dir = [(this.pos[0]-this.pos2[0])/this.speed,(this.pos[1]-this.pos2[1])/this.speed];
    }
    render(){
        if(this.infected){
            fill(230, 0, 255,200);
        }
        else{
            fill(245, 230, 66, 200);
        }
        circle(this.pos[0],this.pos[1],this.size);
        if(this.infected){
            fill(167, 27, 242);
        }
        else{
            fill(255, 221, 0);
        }
        circle(this.pos[0],this.pos[1],this.size/2);
    }
    move(){
        this.pos[0]+=this.dir[0]*this.speed;
        this.pos[1]+=this.dir[1]*this.speed;
        if(this.pos[0]-this.size/2<0||this.pos[0]+this.size/2>w){
            this.dir[0]*=-1;
        }
        if(this.pos[1]-this.size/2<0||this.pos[1]+this.size/2>h){
            this.dir[1]*=-1;
        }
    }
    suicide(){
        if(this.infected){
            if(this.suicideCtr>=50){
                this.dir[0]*=-1;
                this.pos[0]+=this.dir[0]*5;
            }
            if(this.suicideCtr>=80){
                for(let nv=0;nv<5;nv++){
                    viruses.push(new virus(randint(this.pos[0]-this.size/2,this.pos[0]+this.size/2),randint(this.pos[1]-this.size/2,this.pos[1]+this.size/2)));
                }
                cviruses+=5;
                infected-=1;
                dead+=1;
                return true;
            }
            this.suicideCtr+=1;
        }
    }
    divide(){
        if(this.divideCtr>=400){

        }
    }
}

class virus{
    constructor(x,y){
        this.size = 20;
        this.pos = [x,y];//[randint(this.size/2,w-this.size/2),randint(this.size/2,h-this.size/2)];
        this.speed = 4;
        this.dslope = randint(0,360);//Math.atan(this.slope);
        this.dir = [Math.cos(toRadians(this.dslope)),Math.sin(toRadians(this.dslope))];
        this.bounces = 0;
    }
    render(){
        fill(222, 100, 208);
        circle(this.pos[0],this.pos[1],this.size/2);
    }
    move(){
        this.pos[0]+=this.dir[0]*this.speed;
        this.pos[1]+=this.dir[1]*this.speed;
        if(this.bounces>=2){
            if(this.pos[0]-this.size/2<0||this.pos[0]+this.size/2>w||this.pos[1]-this.size/2<0||this.pos[1]+this.size/2>h){
                cviruses-=1;
                return true;
            }
        }
        if(this.pos[0]-this.size/2<0||this.pos[0]+this.size/2>w){
            this.dir[0]*=-1;
            this.bounces+=1;
        }
        if(this.pos[1]-this.size/2<0||this.pos[1]+this.size/2>h){
            this.dir[1]*=-1;
            this.bounces+=1;
        }
    }
    infect(){
        for(let i of cells){
            if(distance(this.pos[0],this.pos[1],i.pos[0],i.pos[1])<i.size/2){
                if(i.infected===false){
                    i.infected = true;
                    healthy-=1;
                    infected+=1;
                }
                cviruses -= 1;
                return true;
            }
        }
    }
}

class tcell{
    constructor(pos,pos2){
        this.pos = pos;
        this.pos2 = pos2;
        this.slope = (pos[1]-pos2[1])/(pos[0]-pos2[0]);
        console.log(this.slope);
        this.speed = 2;
        this.dslope = Math.atan(this.slope);
        console.log(this.dslope);
        this.dir = [Math.cos(this.dslope),Math.sin(this.dslope)];
        if(pos[0]>pos2[0]){
            this.dir[0]*=-1;
            this.dir[1]*=-1;
        }
        this.size = 50;
        //this.dir = [(pos[0]-pos2[0])/this.speed,(pos[1]-pos2[1])/this.speed];
    }
    render(){
        fill(100,100,255,200);
        circle(this.pos[0],this.pos[1],this.size);
        fill(100,100,255);
        circle(this.pos[0],this.pos[1],this.size/2);
    }
    move(){
        this.pos[0]+=this.dir[0]*this.speed;
        this.pos[1]+=this.dir[1]*this.speed;
    }
    killInfected(){
        for(let j=0; j<cells.length; j++){
            i = cells[j];
            if(distance(this.pos[0],this.pos[1],i.pos[0],i.pos[1])<i.size/2+25){
                if(i.infected){
                    infected-=1;
                    dead+=1;
                    cells.splice(j,1);
                }
            }
        }
    }
}

function reset(){
    cells = [];
    viruses = [];
    tcells = [];
    healthy = startCells;
    infected = 0;
    dead = 0;
    cviruses = startViruses;
    timeElapsed = 0;
    tCellPos = false;
    win = false;
    for(let i=0; i<startCells; i++){
        cells.push(new cell());
    }
    for(let i=0; i<startViruses; i++){
        viruses.push(new virus(randint(0,w),randint(0,h)));
    }
}

function windowResized(){
    w = window.innerWidth;
    h = window.innerHeight;
    resizeCanvas(w,h);
}

function tCellMaker(){
    if(tCellPos){
        fill(100,255,100);
        circle(tCellPos[0],tCellPos[1],50);
        stroke(10);
        line(tCellPos[0],tCellPos[1],mouseX,mouseY);
        noStroke();
    }
}

function startScreen(){
    if(start){
        fill(100);
        rect(0,0,w,h);
        fill(255);
        rect(w/4,h/4,w/2,h/2,20);
        fill(0);
        textAlign(CENTER,TOP);
        textSize(30);
        text('Contagion',w/4+5,h/4+10,w/2);
        textSize(20);
        text('Viruses have appeared in the interstitial fluid, wreaking havoc on whatever they meet! Direct T-Cells to destroy infected cells ... before the viruses do.\n\nPress, drag, and release to launch t-cells.',w/4+5,h/4+60,w/2);
        if(buttonHovered(w/4,h*5/8,w/2,h/8)){
            fill(100,255,100);
        }
        else{
            fill(52, 195, 235);
        }
        rect(w/4,h*5/8,w/2,h/8,0,0,20,20);
        fill(0);
        textSize(20);
        text('Start!',w/4,h*11/16-10,w/2);
        if(buttonPressed(w/4,h*5/8,w/2,h/8)){
            start=false;
        }
    }
}

function endScreen(){
    if(healthy===0){
        fill(100,100);
        rect(0,0,w,h);
        fill(255);
        rect(w/4,h/4,w/2,h/2,20);
        fill(0);
        textAlign(CENTER,TOP);
        textSize(20);
        text('Game Over',w/4+5,h/4+20,w/2);
        textSize(15);
        text(`The viruses compromised all your cells\nYou lasted ${timeElapsed*33}ms`,w/4+5,h/4+40,w/2);
        if(buttonHovered(w/4,h*5/8,w/2,h/8)){
            fill(100,255,100);
            if(mouseIsPressed){
                reset();
            }
        }
        else{
            fill(52, 195, 235);
        }
        rect(w/4,h*5/8,w/2,h/8,0,0,20,20);
        fill(0);
        textSize(20);
        text('Play Again',w/4,h*5/8+5,w/2);
    }
}

function winScreen(){
    if(cviruses===0&&infected===0&&healthy>0){
        if(win===false){
            win=true;
        }
        fill(100,100);
        rect(0,0,w,h);
        fill(255);
        rect(w/4,h/4,w/2,h/2,20);
        fill(0);
        textAlign(CENTER,TOP);
        textSize(20);
        text('You Win!',w/4+5,h/4+10,w/2);
        textSize(15);
        text(`The immune system prevails!\nYou won in ${timeElapsed*33}ms\nYou saved ${healthy} cells from premature doom`,w/4+5,h/4+40,w/2);
        if(buttonHovered(w/4,h*5/8,w/2,h/8)){
            fill(100,255,100);
        }
        else{
            fill(250, 85, 173);
        }
        rect(w/4,h*5/8,w/2,h/8,0,0,20,20);
        fill(0);
        textSize(20);
        text('Play Again',w/4,h*5/8+5,w/2);
        if(buttonPressed(w/4,h*5/8,w/2,h/8)){
            reset();
        }
    }
}

function displayCtrs(){
    fill(0);
    textSize(20);
    textAlign(LEFT,TOP)
    text(`time elapsed: ${timeElapsed*33}ms`,10,20);
    text(`healthy: ${healthy}`,10,50);
    text(`infected: ${infected}`,10,80);
    text(`dead: ${dead}`,10,110);
    text(`viruses: ${cviruses}`,10,140);
    textAlign(CENTER,CENTER);
    textSize(30);
    text('contagion',w/2,30);
}

function setup(){
    for(let i=0; i<startCells; i++){
        cells.push(new cell());
    }
    for(let i=0; i<startViruses; i++){
        viruses.push(new virus(randint(0,w),randint(0,h)));
    }
    createCanvas(w,h);
    noStroke();
    textFont('Open Sans');
    frameRate(30);
}

function mousePressed(){
    tCellPos = [mouseX,mouseY];
}

function mouseReleased(){
    if(tCellPos){
        tcells.push(new tcell(tCellPos,[mouseX,mouseY]));
        tCellPos = false;
    }
}

function touchEnded(){
    if(tCellPos){
        tcells.push(new tcell(tCellPos,[mouseX,mouseY]));
        tCellPos = false;
    }
}

function draw(){
    background(255);
    if(start){
        startScreen();
    }
    else{
        for(let j=0; j<cells.length;j++){
            i=cells[j];
            i.render();
            i.move();
            if(i.suicide()){
                cells.splice(j,1);
            }
        }
        for(let i of tcells){
            i.render();
            i.move();
            i.killInfected();
        }
        for(let j=0; j<viruses.length;j++){
            i=viruses[j];
            i.render();
            if(i.infect()||i.move()){
                viruses.splice(j,1);
            }
        }
        tCellMaker();
        displayCtrs();
        tCellMaker();
        endScreen();
        winScreen();
        if(healthy>0&&win===false){
            timeElapsed+=1;
        }
        if(timeElapsed%200===0&&cviruses!=0&&infected!=0){
            viruses.push(new virus(randint(0,w),randint(0,h)));
            cviruses+=1;
        }
    }
}
