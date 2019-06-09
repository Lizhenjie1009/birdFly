/**
 * 游戏类
 * ctx--画笔
 * bird--鸟类
 * pipe--管子类
 * land--地面
 * mountain--山
 ***/

function Game(ctx,bird,pipe,land,mountain){
    this.ctx = ctx;
    this.bird = bird;
    this.pipeArr = [pipe];
    this.land = land;
    this.mountain = mountain;
    this.timer = null;
    this.iframe = null; // 定义帧

    this.init();
}
//初始化
Game.prototype.init = function() {
    this.start();
    this.bindEvent();
}
//游戏开始
Game.prototype.start = function() {
    var me = this;
    // 定时器内，清屏---渲染
    this.timer = setInterval(function(){
        //清屏
        me.clear();
        // 像素检测碰撞
        // me.checkPX();
        //渲染
        me.randerMountain();
        me.randerLand();
        me.randerBird();
        // 改变帧++
        me.iframe++;
        // 判断帧为10的倍数让鸟飞
        if(me.iframe % 10 == 0){
            me.bird.fly();
        }
        // 鸟下降
        me.bird.fallDown();
        // 管子移动
        me.movePipe();
        me.randerPipe();
        // 判断创建管子之间的距离
        if(!(me.iframe % 65)){
            // 创建管子
            me.createPipe();
        }
        // 清楚管子
        me.clearPipe();
        // 渲染小鸟四个点
        me.randerBirdPoints();
        // 渲染管子八个点
        me.randerPipePoints();
        // 碰撞检测
        me.check();
    },20)
}
//清屏
Game.prototype.clear = function() {
    this.ctx.clearRect(0,0,360,512);
}
//渲染山
Game.prototype.randerMountain = function() {
    // 获取BackGround实例mountain的图片
    var img = this.mountain.img;
    // 让山的x点每次减减BackGround实例mountain的步长
    this.mountain.x -= this.mountain.step;
    //判断山BackGround实例mountain的x小于图片的宽，然后等于0
    if(this.mountain.x < -img.width){
        this.mountain.x = 0;
    }
    //在canvas中绘制图片
    this.ctx.drawImage(img,this.mountain.x,this.mountain.y)
    this.ctx.drawImage(img,this.mountain.x + img.width,this.mountain.y)
    this.ctx.drawImage(img,this.mountain.x + img.width * 2,this.mountain.y)
}
//渲染地面
Game.prototype.randerLand = function() {
    var img = this.land.img;
    this.land.x -= this.land.step;
    if(this.land.x < -img.width){
        this.land.x = 0;
    }
    this.ctx.drawImage(img,this.land.x,this.land.y);
    this.ctx.drawImage(img,this.land.x + img.width,this.land.y);
    this.ctx.drawImage(img,this.land.x + img.width * 2,this.land.y);
}
//渲染小鸟
Game.prototype.randerBird = function() {
    var img = this.bird.img;
    // 状态保存
    this.ctx.save();
    // 改变坐标系
    this.ctx.translate(this.bird.x,this.bird.y);
    // 绘制矩形
	// this.ctx.strokeRect(-this.bird.img.width / 2 + 5, -this.bird.img.height / 2 + 5, this.bird.img.width - 10, this.bird.img.height - 10);
    // 让小鸟旋转，状态是 D 的话下降顺时针，否则上升逆时针
    var deg = this.bird.state === "D" ? Math.PI / 180 * this.bird.speed : -Math.PI / 180 * this.bird.speed;
    this.ctx.rotate(deg);
    // 绘制图片
    this.ctx.drawImage(img,-img.width / 2, -img.height / 2);
    // 状态恢复
    this.ctx.restore();
}
//绑定点击事件
Game.prototype.bindEvent = function() {
    var me = this;
    this.ctx.canvas.onclick = function() {
        me.bird.goUp();
    }
}
//渲染管子
Game.prototype.randerPipe = function() {
    var me = this;
    // 循环管子数组
    this.pipeArr.forEach(function(value){
        var img = value.pipe_up;
        var img_x = 0;
        var img_y = img.height - value.up_height;
        var img_w = img.width;
        var img_h = value.up_height;
        var canvas_x = me.ctx.canvas.width - value.step * value.count;
        var canvas_y = 0;
        var canvas_w = img.width;
		var canvas_h = value.up_height;
		// 绘制上管子图片
		me.ctx.drawImage(img, img_x, img_y, img_w, img_h, canvas_x, canvas_y, canvas_w, canvas_h);
        
        var img_down = value.pipe_down;
        var img_down_x = 0;
		var img_down_y = 0;
		var img_down_w = img_down.width;
		var img_down_h = value.down_height;
		var canvas_down_x = me.ctx.canvas.width - value.step * value.count;
		var canvas_down_y = value.up_height + 150;
		var canvas_down_w = img_down.width;
		var canvas_down_h = value.down_height;
		// 绘制下管子图片
		me.ctx.drawImage(img_down, img_down_x, img_down_y, img_down_w, img_down_h, canvas_down_x, canvas_down_y, canvas_down_w, canvas_down_h);
    })
}
//管子移动
Game.prototype.movePipe = function() {
    this.pipeArr.forEach(function(value){
        value.count++;
    })
}
// 创建管子
Game.prototype.createPipe = function() {
    // 定义一根管子
    var pipe = this.pipeArr[0].newPipe();
    // 将创建出来的管子放入打到数组中
	this.pipeArr.push(pipe);
}
// 清楚管子
Game.prototype.clearPipe = function() {
    // 循环数组
    for(var i = 0; i < this.pipeArr.length; i++){
        var pipe = this.pipeArr[i];
        // 判断当前管子的位置
        if(pipe.x - pipe.step * pipe.count < -pipe.pipe_up.width) {
            // 移除当前管子
            this.pipeArr.splice(i,1);
            return;
        }
    }
}
// 渲染小鸟四个点
Game.prototype.randerBirdPoints = function() {
    var Bird_A = {
        x: -this.bird.img.width / 2 + 5 + this.bird.x,
        y: -this.bird.img.height / 2 + 5 + this.bird.y
    }
    var Bird_B = {
        x: Bird_A.x + this.bird.img.width - 10,
        y: Bird_A.y
    }
    var Bird_C = {
        x: Bird_A.x,
        y: Bird_A.y + this.bird.img.height - 10
    }
    var Bird_D = {
        x: Bird_B.x,
        y: Bird_C.y
    }
    // 绘制小鸟四个点
    // 开启路径
    this.ctx.beginPath();
    // 移动画笔到某个位置
    this.ctx.moveTo(Bird_A.x,Bird_A.y);
    this.ctx.lineTo(Bird_B.x,Bird_B.y);
    this.ctx.lineTo(Bird_D.x, Bird_D.y);
    this.ctx.lineTo(Bird_C.x, Bird_C.y);
    // 闭合路径
    this.ctx.closePath();
    this.ctx.strokeStyle = "red";
    this.ctx.stroke();
}
// 渲染管子的八个点
Game.prototype.randerPipePoints = function() {
    for(var i = 0;i < this.pipeArr.length; i++){
        var pipe = this.pipeArr[i];
        // 绘制上管子的四个点
        var pipe_A = {
            x: pipe.x - pipe.step * pipe.count,
            y: 0
        }
        var pipe_B = {
            x: pipe_A.x + pipe.pipe_up.width,
            y: 0
        }
        var pipe_C = {
            x: pipe_A.x,
            y: pipe.up_height
        }
        var pipe_D = {
            x: pipe_B.x,
            y: pipe_C.y
        }

        // 绘制上管子的四个点
        // 开启路径
        this.ctx.beginPath();
        // 移动画笔到某个位置
        this.ctx.moveTo(pipe_A.x,pipe_A.y);
        this.ctx.lineTo(pipe_B.x,pipe_B.y);
        this.ctx.lineTo(pipe_D.x, pipe_D.y);
        this.ctx.lineTo(pipe_C.x, pipe_C.y);
        // 闭合路径
        this.ctx.closePath();
        this.ctx.strokeStyle = "red";
        this.ctx.stroke();


        // 绘制下管子的四个点
        var pipe_down_A = {
            x: pipe.x - pipe.step * pipe.count,
            y: pipe.up_height + 150
        }
        var pipe_down_B = {
            x: pipe_down_A.x + pipe.pipe_up.width,
            y: pipe_down_A.y
        }
        var pipe_down_C = {
            x: pipe_down_A.x,
            y: pipe_down_A.y + pipe.down_height
        }
        var pipe_down_D = {
            x: pipe_down_B.x,
            y: pipe_down_C.y
        }

         // 绘制下管子的四个点
        // 开启路径
        this.ctx.beginPath();
        // 移动画笔到某个位置
        this.ctx.moveTo(pipe_down_A.x,pipe_down_A.y);
        this.ctx.lineTo(pipe_down_B.x,pipe_down_B.y);
        this.ctx.lineTo(pipe_down_D.x, pipe_down_D.y);
        this.ctx.lineTo(pipe_down_C.x, pipe_down_C.y);
        // 闭合路径
        this.ctx.closePath();
        this.ctx.strokeStyle = "red";
        this.ctx.stroke();
    }
}
// 碰撞检测
Game.prototype.check = function() {
    for(var i = 0; i < this.pipeArr.length; i++){
        var pipe = this.pipeArr[i];
        // 绘制上管子的四个点
        var pipe_A = {
            x: pipe.x - pipe.step * pipe.count,
            y: 0
        }
        var pipe_B = {
            x: pipe_A.x + pipe.pipe_up.width,
            y: 0
        }
        var pipe_C = {
            x: pipe_A.x,
            y: pipe.up_height
        }
        var pipe_D = {
            x: pipe_B.x,
            y: pipe_C.y
        }

        // 绘制下管子的四个点
        var pipe_down_A = {
            x: pipe.x - pipe.step * pipe.count,
            y: pipe.up_height + 150
        }
        var pipe_down_B = {
            x: pipe_down_A.x + pipe.pipe_up.width,
            y: pipe_down_A.y
        }
        var pipe_down_C = {
            x: pipe_down_A.x,
            y: pipe_down_A.y + pipe.down_height
        }
        var pipe_down_D = {
            x: pipe_down_B.x,
            y: pipe_down_C.y
        }
        // 绘制小鸟四个点
        var Bird_A = {
            x: -this.bird.img.width / 2 + 5 + this.bird.x,
            y: -this.bird.img.height / 2 + 5 + this.bird.y
        }
        var Bird_B = {
            x: Bird_A.x + this.bird.img.width - 10,
            y: Bird_A.y
        }
        var Bird_C = {
            x: Bird_A.x,
            y: Bird_A.y + this.bird.img.height - 10
        }
        var Bird_D = {
            x: Bird_B.x,
            y: Bird_C.y
        }
        // 用鸟的B点和上管子的C点比较---还要位于管子的左边
        if(Bird_B.x >= pipe_C.x && Bird_B.y <= pipe_C.y && Bird_A.x <= pipe_D.x){
            this.gameOver();
        }
        // 用鸟的D点和上管子的A点比较
        if(Bird_D.x >= pipe_down_A.x && Bird_D.y >= pipe_down_A.y && Bird_A.x <= pipe_down_B.x){
            this.gameOver();
        }
        if(Bird_D.y >= pipe_down_C.y || Bird_B.y <= pipe_A.y){
            this.gameOver();
        }
    }
}
// 游戏结束
Game.prototype.gameOver = function() {
    clearInterval(this.timer);
    alert("Game Over!");
}
// 像素碰撞检测
Game.prototype.checkPX = function() {
    this.ctx.clearRect(0,0,360,512);
    this.ctx.save();
    this.randerPipe();
    this.ctx.globalCompositeOperation = "source-in";
    this.randerBird();
    this.ctx.restore();

    var imgData = this.ctx.getImageData(0,0,360,512);
    for(var i = 0; i < imgData.data.length; i++){
        if(imgData.data[i]){
            this.gameOver();
            return;
        }
    }
}