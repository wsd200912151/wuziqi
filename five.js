$(function() {

    var canvas = $('#canvas').get(0);
    var img=$('#img').get(0);
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    //做棋盘
    var row = 14;
    var off = 40;
    var biao = {};
    var blank={};
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            blank[i+'_'+j]=true;
        }
    }

    ctx.drawImage(img,0,0);
    function ge() {
        ctx.beginPath();
        for (var i = 0; i < row + 1; i++) {
            ctx.moveTo(off / 2 + 0.5, off / 2 + 0.5 + i * off);
            ctx.lineTo(off / 2 + 0.5 + row * off, off / 2 + 0.5 + i * off);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        for (var i = 0; i < row + 1; i++) {
            ctx.moveTo(off / 2 + 0.5 + i * off, off / 2 + 0.5);
            ctx.lineTo(off / 2 + 0.5 + i * off, off / 2 + 0.5 + row * off);
        }
        ctx.closePath();
        ctx.stroke();
    }

    ge();
    function drawcircle(x, y) {
        ctx.beginPath();
        ctx.arc(off / 2 + off * x + 0.5, off / 2 + off * y + 0.5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    drawcircle(3, 3);
    drawcircle(11, 3);
    drawcircle(7, 7);
    drawcircle(3, 11);
    drawcircle(11, 11);

//制作棋子
    function drawChess(position, color) {
        ctx.save();
        ctx.translate(off / 2 + off * position.x + 0.5, off / 2 + off * position.y + 0.5);
        ctx.beginPath();
        if (color === 'black') {
            var radgrad = ctx.createRadialGradient(-7, -6, 1, 0, 0, 18);
            radgrad.addColorStop(0, '#fff');
            radgrad.addColorStop(0.9, '#000');
            radgrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = radgrad;
        } else {
            var radgrad2 = ctx.createRadialGradient(-7, -6, 7, 0, 0, 18);
            radgrad2.addColorStop(0, '#fff');
            radgrad2.addColorStop(0.9, '#bbb');
            radgrad2.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = radgrad2;
        }
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        biao[position.x + '_' + position.y] = color;
        delete blank[position.x+"_"+position.y];
    }

    // function aa(position) {
    //     return  position.x + '_' + position.y;
    // }


    //棋谱
    function qipu(position,text,color){
        ctx.save();
        ctx.font="15px 微软雅黑";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        if(color=="black"){
            ctx.fillStyle="#fff";
        }else
        if(color=="white"){
            ctx.fillStyle="#000"
        }
        ctx.fillText(text,position.x*off+off/2+0.5,position.y*off+off/2+0.5)
        ctx.restore();
    }
    function textview(){
        var j=1;
        for(var i in biao){
            qipu(p2o(i),j,biao[i]);
            j++;
        }
    }
    function check(position,color){
        var table={};
        var num=1;
        var num1=1;
        var num2=1;
        var num3=1;
        for(var i in biao){
            if(biao[i]==color){
                table[i]=true;
            }
        }
        //横向
        var tx=position.x;
        var ty=position.y;
        while(table[(tx+1)+'_'+ty]){
            num++;
            tx++;
        }
        var tx=position.x;
        var ty=position.y;
        while(table[(tx-1)+'_'+ty]){
            num++;
            tx--;
        }
        //纵向
        var tx=position.x;
        var ty=position.y;
        while(table[tx+'_'+(ty+1)]){
            num1++;
            ty++;
        }
        var tx=position.x;
        var ty=position.y;
        while(table[tx+'_'+(ty-1)]){
            num1++;
            ty--;
        }
        //左上到右下
        var tx=position.x;
        var ty=position.y;
        while(table[(tx-1)+'_'+(ty-1)]){
            num2++;
            tx--
            ty--;
        }
        var tx=position.x;
        var ty=position.y;
        while(table[(tx+1)+'_'+(ty+1)]){
            num2++;
            tx++;
            ty++;
        }
        //右上到左下
        var tx=position.x;
        var ty=position.y;
        while(table[(tx+1)+'_'+(ty-1)]){
            num3++;
            tx++;
            ty--;
        }
        var tx=position.x;
        var ty=position.y;
        while(table[(tx-1)+'_'+(ty+1)]){
            num3++;
            tx--
            ty++;
        }
        return Math.max(num,num1,num2,num3)
        // num>=5||num1>=5||num2>=5||num3>=5;
    }

    function AI(){
        //Infinity 无穷大
        var maxb=-Infinity;
        var maxw=-Infinity;
        var black={};
        var white={};
        for(var i in blank){
            if(maxb<check(p2o(i),"black")){
               maxb = check(p2o(i),"black");
                black = i;
            }
            if(maxw<check(p2o(i),"white")){
                maxw = check(p2o(i),"white");
                white = i;
            }
        }
        if(maxb>=maxw){
            return black;
        }else{
            return white;
        }
    }
    function p2o(position){
        var pos={x:parseInt(position.split("_")[0]),y:parseInt(position.split("_")[1])};
        return pos;
    }

    //人人模式
    function rr(){
        var flag = true;
        $(canvas).on('click', function (e) {
            var position = {
                x: Math.round((e.offsetX - off / 2) / off),
                y: Math.round((e.offsetY - off / 2) / off)
            }
            if( biao[position.x + '_' + position.y] ){
                return;
            }
            if (flag) {
                drawChess(position, 'black');
                biao[position.x + '_' + position.y] = 'black';
                if(check(position,'black')>=5){
                    win.addClass('xian').find('.qiwin').text('黑棋胜');
                    winyes.on('click',function(){
                        win.removeClass('xian');
                        textview();
                    });
                    winnone.on('click',function(){
                        win.removeClass('xian');
                    })
                    $(this).off();
                    return;
                }
            } else {
                drawChess(position, 'white');
                biao[position.x + '_' + position.y] = 'white';
                if(check(position,'white')>=5){
                    win.addClass('xian').find('.qiwin').text('白棋胜');
                    winyes.on('click',function(){
                        win.removeClass('xian');
                        textview();
                    });
                    winnone.on('click',function(){
                        win.removeClass('xian');
                    })
                    $(this).off();
                    return;
                }
            }
            flag=!flag;
        })
    }
    //人机模式
    function rj(){
        var ai=true;
        $(canvas).on('click', function (e) {
            var position = {
                x: Math.round((e.offsetX - off / 2) / off),
                y: Math.round((e.offsetY - off / 2) / off)
            }
            if( biao[position.x + '_' + position.y] ){
                return;
            }
        if(ai){
            drawChess(position,'black');
            // biao[position.x + '_' + position.y] = 'black';
            console.log(position,biao)
            if(check(position,'black')>=5){
                win.addClass('xian').find('.qiwin').text('黑棋胜');
                winyes.on('click',function(){
                    win.removeClass('xian');
                    textview();
                });
                winnone.on('click',function(){
                    win.removeClass('xian');
                })
                $(this).off();
                return;
            }else{

                drawChess(p2o(AI()), 'white');
                // biao[AI()] = 'white';
                console.log(p2o(AI()),AI(),biao)
                if(check(p2o(AI()),'white')>5){
                    win.addClass('xian').find('.qiwin').text('白棋胜');
                    winyes.on('click',function(){
                        win.removeClass('xian');
                        textview();
                    });
                    winnone.on('click',function(){
                        win.removeClass('xian');
                    })
                    $(this).off();
                    return;
                }
            }
            return;
        }
        })
    }
    //八卦图
    function tj(){
        var canleft=$('#canvas-left').get(0);
        var ctl=canleft.getContext('2d');
        var canw=canleft.width;
        var canh=canleft.height;
        function w(i){
            return canw*i;
        }
        function h(i){
            return canh*i;
        }
        ctl.beginPath();
        ctl.fillStyle='#000';
        ctl.moveTo(w(2/3),h(1));
        ctl.arc(w(2/3),h(1/2),h(1/2),Math.PI/2,Math.PI*3/2);
        ctl.arc(w(2/3),h(1/4),h(1/4),Math.PI*3/2,Math.PI/2);
        ctl.arc(w(2/3),h(3/4),h(1/4),Math.PI*3/2,Math.PI/2,true);
        ctl.fill();
        ctl.closePath()
        ctl.beginPath();
        ctl.fillStyle='#fff';
        ctl.arc(w(2/3),h(1/4),h(1/12),0,Math.PI*2);
        ctl.fill();
        ctl.closePath();

        var canright=$('#canvas-right').get(0);
        var ctr=canright.getContext('2d');
        ctr.beginPath();
        ctr.fillStyle='#fff';
        ctr.moveTo(w(1/3),h(1));
        ctr.arc(w(1/3),h(1/2),h(1/2),Math.PI/2,Math.PI*3/2,true);
        ctr.arc(w(1/3),h(1/4),h(1/4),Math.PI*3/2,Math.PI/2);
        ctr.arc(w(1/3),h(3/4),h(1/4),Math.PI*3/2,Math.PI/2,true);
        ctr.fill();
        ctr.closePath();
        ctr.beginPath();
        ctr.fillStyle='#000';
        ctr.arc(w(1/3),h(3/4),h(1/12),0,Math.PI*2);
        ctr.fill();
        ctr.closePath();
    }
    tj();
    //开始游戏前 点击按钮
    var bigbtn=$('.big');
    var leftbtn=$('.big .left');
    var rightbtn=$('.big .right');
    var upbtn=$('.big .r-r');
    var downbtn=$('.big .r-j');
    var endbtn=$('.big .end');
    var tjl=$('#canvas-left');
    var tjr=$('#canvas-right');
    var pan=$('#canvas');

    leftbtn.on('click',function(){
        $(this).removeClass('bg sf').addClass('bg')
            .delay(200)
            .queue(function(){
                    $(this).addClass('sf').dequeue();
            });
        rightbtn.removeClass('bg sf')
            .delay(200)
            .queue(function(){
                rightbtn.addClass('sf').dequeue();
            });
        upbtn.addClass('xian').delay(500)
            .queue(function(){
                upbtn.removeClass('xian').dequeue();
            });
        downbtn.addClass('xian').delay(500)
            .queue(function(){
                downbtn.removeClass('xian').dequeue();
            });
    })
    rightbtn.on('click',function(){
        $(this).removeClass('bg sf').addClass('bg')
            .delay(200)
            .queue(function(){
                $(this).addClass('sf').dequeue();
            });
        leftbtn.removeClass('bg sf')
            .delay(200)
            .queue(function(){
                leftbtn.addClass('sf').dequeue();
            });
        endbtn.addClass('xian').delay(500)
            .queue(function(){
                endbtn.removeClass('xian').dequeue();
            });
    })
    upbtn.on('click',function(){
        $(this).removeClass('bg').addClass('bg');
        bigbtn.removeClass('dis').addClass('dis')
            .delay(2000).queue(function(){
            tjl.removeClass('open').addClass('open').dequeue();
            tjr.removeClass('open').addClass('open').dequeue();
            down.removeClass('u-p').addClass('u-p').dequeue();
        })
        rr();
    })
    downbtn.on('click',function(){
        $(this).removeClass('bg').addClass('bg');
        bigbtn.removeClass('dis').addClass('dis')
            .delay(2000).queue(function(){
            tjl.removeClass('open').addClass('open').dequeue();
            tjr.removeClass('open').addClass('open').dequeue();
            down.removeClass('u-p').addClass('u-p').dequeue();
        })
        rj();
    })


    //开始游戏后的点击按钮
    var down=$('.down');
    var bor=$('.down .bor');
    var rrbtn=$('.down .r_r');
    var rjbtn=$('.down .r_j');
    var jsbtn=$('.down .end');
    var endd=$('.end-d');

    bor.on('click',function(){
        down.toggleClass('u-p-p');
    })
    rrbtn.on('click',function(){
        ctx.clearRect(0,0,600,600);
        ctx.drawImage(img,0,0);
        ge();
        drawcircle(3, 3);
        drawcircle(11, 3);
        drawcircle(7, 7);
        drawcircle(3, 11);
        drawcircle(11, 11);
        biao = {};
        blank={};
        for(var i=0;i<15;i++){
            for(var j=0;j<15;j++){
                blank[i+'_'+j]=true;
            }
        }
        $(canvas).off();
        rr();
        down.removeClass('u-p-p');
    });
    rjbtn.on('click',function(){
        ctx.clearRect(0,0,600,600);
        ctx.drawImage(img,0,0);
        ge();
        drawcircle(3, 3);
        drawcircle(11, 3);
        drawcircle(7, 7);
        drawcircle(3, 11);
        drawcircle(11, 11);
        biao = {};
        blank={};
        for(var i=0;i<15;i++){
            for(var j=0;j<15;j++){
                blank[i+'_'+j]=true;
            }
        }
        $(canvas).off();
        rj();
        down.removeClass('u-p-p');
    });
    jsbtn.on('click',function(){
        endd.addClass('xian');
    })

    //赢棋
    var win=$('.win');
    var winyes=$('.win .yes');
    var winnone=$('.win .none');







})