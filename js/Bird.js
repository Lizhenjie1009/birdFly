//鸟类imgArr--鸟类图片数组，x位于canvas的x点，y位于canvas的y点，index--鸟类图片数组随机出现的索引值
function Bird(imgArr,x,y) {
    this.imgArr = imgArr;
    this.index = parseInt(Math.random() * this.imgArr.length);
    this.img = this.imgArr[this.index];
    this.x = x;
    this.y = y;
    // 定义小鸟上升/下降的速度
    this.speed = 0;
    // 定义小鸟的状态
    this.state = "D"; // D: down--下降，U: up--上升
}
Bird.prototype.fly = function() {
    this.index++;
    if(this.index >= this.imgArr.length){
        this.index = 0;
    }
    this.img = this.imgArr[this.index];
}
// 鸟下降
Bird.prototype.fallDown = function() {
    if(this.state === "D"){
        this.speed++;
        //        改变小鸟的移动速度
        this.y += Math.sqrt(this.speed);
    } else {
        this.speed--;
        // 当从20减到0的时候，改变鸟的状态下降；
        if(this.speed == 0){
            this.state = "D";
            return;
        }
        this.y -= Math.sqrt(this.speed);
    }
}

// 鸟的上升
Bird.prototype.goUp = function() {
    // 改变鸟的状态上升---Up
    this.state = "U"
    // 定义上升的最大值
	this.speed = 20;
}