



$(function () {
    newgame();
});

var board = []; //存放数字的数组
var score = 0; //存放得分
var hasConflicted = []; //存放是否冲突的数组
let preValue = [];//存放每一步时每个格子的值
let preScore = [];//存放每一步时的得分

function newgame () {
    // 初始化棋盘格和数字格，将每个对应的数字放到格子中
    init();
    
}


// 初始化
function init () {
    
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++) {
            // 定义变量 gridCell 来记录每个格子的位置
            var gridCell = $('#grid_cell_' + i + '_' + j);


            // 设置格子距离顶部的距离
            // 通过 gridCell.css 的方法，来设置 gridCell 的 css 样式
            // 调用 getPosTop() 函数
            gridCell.css('top',getPosTop(i,j));
            // gridCell.style.top = getPosTop(i,j) + 'px';
            // 设置格子距离左侧的距离
            // gridCell.style.left = getPosLeft(i,j) + 'px'
            gridCell.css('left',getPosLeft(i,j));
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i] = [];
        hasConflicted[i] = [];
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0; //把board定义为二维数组来更方便地表达出每个格子，board为0即这个格子没有数字，不为0即有数字
            hasConflicted[i][j] = false; //初始化时需要将每个格子是否冲突的属性定义为false
        }
    }

    updateBoardView();

    // 生成两个随机格的随机数字
    generateOneNumber();
    generateOneNumber();

    score = 0;
    updateScore(score);  // 初始化
}


// 该方法的作用是将每个数字放到对应的格子中
function updateBoardView () {
    //由于每一次操作都要调用该函数，所以每次调用之前都要先将上次操作后产生的数字清除
    $('.number_cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            // 获取到大的div的id 向中添加一个新的div用来显示数字
            // append() 方法在被选元素的结尾（仍然在内部）插入指定内容。
            $('#Large_lattice').append("<div class='number_cell' id='number_cell_" + i + "_" + j +"'></div>")
            // 拿到插入div的值并赋予到新的变量中
            var numberCell = $("#number_cell_" + i + "_" + j);
        
            if (board[i][j] == 0) {
                numberCell.css('width','0');
                numberCell.css('height','0');
                numberCell.css('top',getPosTop(i,j));
                numberCell.css('left',getPosLeft(i,j));
            }else {
                numberCell.css('width','100px');
                numberCell.css('height','100px');
                numberCell.css('top',getPosTop(i,j));
                numberCell.css('left',getPosLeft(i,j));

                //定义该函数来存放不同数字的背景颜色
                numberCell.css('background-color',getNumberBackgroundColor(board[i][j]));

                // 定义函数来存放不同数字的颜色
                numberCell.css('color',getNumberColor(board[i][j]));

                //将数字值赋予给相应的格子
                numberCell.text(board[i][j]);
                }
            //由于每一次操作都要调用该函数，所以每次调用之前都要先将每个格子是否冲突的属性定义为false
            hasConflicted[i][j] = false;
        }
    }
}


// 生成一个位置的随机数字
function generateOneNumber () {

    // 判断是否还有空位置
    if (nospace(board)) {
        return false;
    }else {
        
    // 生成一个随机的位置，0-3之间
    // Math.random() 返回值 0.0 ~ 1.0 之间的一个伪随机数。
    // Math.random() * 4 返回一个小于4 的随机数
    // Math.floor() 向下取整数部分 11.9 = 11
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    var times = 0;
    while (times < 50) {
        // 判断生成的位置上 数字是否为0，如果不为0就继续循环生成
        if (board[randx][randy] == 0){
            break;
        }else {
            var randx = parseInt(Math.floor(Math.random() * 4));
            var randy = parseInt(Math.floor(Math.random() * 4));
        }
        times++;
    }
    //若算法运行了50次后仍然没有找到空位置，则人工采用for循环来找
        if (times == 50) {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if(board[i][j] = 0){
                        randx = i;
                        randy = j;
                    }
                }
            }
        }
        // 生成一个随机的数字
        //当随机数小于0.5时，取2，否则取4
        var randNumber = Math.random() < 0.5 ? 2 : 4;
        // 在随机的位置上显示随机的数字
        // x,y 轴上显示随机生成的数字
        board[randx][randy] = randNumber;

        //给生成数字的动作添加动画
        showNumberWithAnimation(randx, randy, randNumber); 
        return true;
    }
}

// 生成新数字，遍历所有格子 如果格子的数字为0，那么就有空位置。
// 全部遍历完成后没有为0的数字的话，那么就没有空位置
function nospace (board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

// 给生成的数字添加动画和样式
function showNumberWithAnimation (i,j,randNumber) {

    // 获取当前的数字格子
    var $numberCell = $("#number_cell_" + i + "_" + j);

    //当$numberCell从没有数字变到有数字，或者从一个数字变成另一个数字时，该$numberCell的css样式要发生改变
    // 将所有段落的字体颜色设为红色并且背景为蓝色
    //$("p").css({ color: "#ff0011", background: "blue" });
    //2 如果属性名包含 "-"的话，必须使用引号
    // $("p").css({ "margin-left": "10px", "background-color": "blue" });
    $numberCell.css({
        'background-color':getNumberBackgroundColor(randNumber),
        'color':getNumberColor(randNumber)
    });
    $numberCell.text(randNumber);

    // Animate()方法用于创建自定义动画
    // 语法为：$(“”).animate({params},speed,callback);
    // Params：它的第一个参数的意思是：定义形成动画的Css属性
    // Speed：speed 是一个可选的参数，规定效果的时长。它可以取以下值："slow"、"fast"       或毫秒
    // Callback：选的 callback 参数是动画完成后所执行的函数名称。
    $numberCell.animate({
        "width": "100px",
        "height": "100px",
        "top": getPosTop(i, j),
        "left": getPosLeft(i, j)
    }, 50);
}

//每个格子的上方与大盒子顶端的距离
function getPosTop (i,j) {
    return 20 + i * 120;
}

//每个格子的左边与大盒子左边的距离
function getPosLeft (i,j) {
    return 20 + j * 120;
}

// 根据数字不同，来改变数字的背景样式
function getNumberBackgroundColor(number) {
    switch (number) {
        case 2:
            return "#eee4da";
            break;
        case 4:
            return "#ede0c8";
            break;
        case 8:
            return "#f2b179";
            break;
        case 16:
            return "#f59563";
            break;
        case 32:
            return "#f67c5f";
            break;
        case 64:
            return "#f65e3b";
            break;
        case 128:
            return "#edcf72";
            break;
        case 256:
            return "#edcc61";
            break;
        case 512:
            return "#9c0";
            break;
        case 1024:
            return "#33b5e5";
            break;
        case 2048:
            return "#09c";
            break;
        case 4096:
            return "#a6c";
            break;
        case 8192:
            return "#93c";
            break;
    }
    return "black";
}

// 根据数字不同，来改变数字的颜色
function getNumberColor(number) {
    if (number <= 4) {
        return "#776e65";
    } else {
        return "white";
    }
}


// 获取用户的键盘事件
$(document).keydown(function (enevt) {
    // 获取用户按下按键的键码值
    switch (enevt.keyCode) {
        case 37:   
            console.log('左')
            // 判断是否可以进行移动
            if (moveLeft()) {
                // setTimeout函数用来指定某个函数或某段代码，在多少毫秒之后执行。
                // generateOneNumber() 随机生成一个新数字
                // isgameover() 判断游戏是否结束
                setTimeout(generateOneNumber,210);
                setTimeout(isgameover,300);
            }
            break;

        case 38:   
            console.log('上')
            if(moveTop()) {
                setTimeout(generateOneNumber,210);
                setTimeout(isgameover,300);
            }
            break;

        case 39:   
            console.log('右')
            if (moveRight()) {
                setTimeout(generateOneNumber,210);
                setTimeout(isgameover,300);
            }
            break;

        case 40:   
            console.log('下')
            if (moveBottom()) {
                setTimeout(generateOneNumber,210);
                setTimeout(isgameover,300);
            }
            break;
    }
});


// 向左移动
function moveLeft () {

    // 定义两个空数组，然后记录下每一步的数据
    // 我是在每一次移动的函数中，在移动操作之前先读取当前位置的数据
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            preValue.push(board[i][j]);
        }
    }
    preScore.push(score);
    // 判断是否可以向左移动
    // console.log(canMoveLeft(board));
    if (canMoveLeft(board)) {

        // i = 行  j = 列
        for (var i = 0; i < 4; i++) {
            // 因为是向左移动，所以不循环第一列
            for (var j = 1; j < 4; j++) {
                // 判断有数字的格子进行移动
                if (board[i][j] != 0) {

                    for (var k = 0; k < j; k++) {
                        // 如果找到了某个格子中 数字为0，且他们之间没有障碍物， 就可以向左移
                        if (board[i][k] == 0 && noBlockHorizontal(i,k,j,board)) {
                            // 添加移动时的的动画
                            showMoveAnimation(i,j,i,k);
                            // 将 要移动 的格子中的数字 赋值 到 要移动到 的格子中去
                            board[i][k] = board[i][j];
                            // 移动完之后，将之前格子的数值清零
                            board[i][j] = 0;                         
                            // continue语句的作用是跳过本次循环体中余下尚未执行的语句，立即进行下一次的循环条件判定，可以理解为仅结束本次循环。
                            continue;
                            // 如果 要移动要的位置 和 将要移动的格子中的数字相同，且他们之间没有障碍物，且他们之间不冲突
                        }else if (
                            board[i][k] == board[i][j] && 
                            noBlockHorizontal(i,k,j,board) && 
                            !hasConflicted[i][k]
                        ) {
                            // 添加移动动画
                            showMoveAnimation(i,j,i,k);
                            // 要 移动到 的格子中的数字，和 要移动的格子中的数字相加
                            // board[i][k] = board[i][k] + board[i][j];
                            board[i][k] += board[i][j];
                            // 移动完成后，清楚原来格子中的数字
                            board[i][j] = 0;
                            // 分数相加
                            score += board[i][k];
                            // 将分数动态传回 #score
                            updateScore(score);
                            // 每一次移动后，都要将该位置是否存在冲突的属性 设为 true
                            hasConflicted[i][k] = true;
                            continue;
                        }
                    }
                }
            }
        }   
    //由于每一次操作,board都会发生变化,所以每操作一次 都要将数字赋值到对应的格子中
    //在此处循环完后，调用一次该函数，此处设置了一个200ms的setTimeout，是因为我们在showMoveAnimation函数中给动画添加的完成时间是200ms
    // 如果我们不给updateBoardView添加一个200ms的延迟的话，就会发现动画还没完成，数字就已经显示出来了。
    setTimeout(updateBoardView,200);
    return true;
    }else {
        return false;
    }
}

// 向右移动
function moveRight () {

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            preValue.push(board[i][j]);
        }
    }
    preScore.push(score);

    // console.log(canMoveRight(board));
    if (canMoveRight(board)) {
        for (var i = 0; i < 4; i++) {
            for (var j = 2; j >= 0; j--) {
                if (board[i][j] != 0) {
                    for (var k = 3; k > j; k--) {
                        if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                            showMoveAnimation(i, j, i, k);
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]) {
                            showMoveAnimation(i,j,i,k);
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            score += board[i][k];
                            updateScore(score);
                            hasConflicted[i][k] = true;
                            continue;
                        }
                    }
                }
            }
        }
        setTimeout(updateBoardView, 200);
        return true;
    }else {
        return false;
    }
}

// 向上移动
function moveTop () {

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            preValue.push(board[i][j]);
        }
    }
    preScore.push(score);

    if (canMoveTop(board)) {
        for (var i = 1; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] != 0) {
                    for (var k = 0; k < i; k++) {
                        if (board[k][j] == 0 && noBlockHorizontal(j,k,i,board)) {
                            showMoveAnimation(i,j,k,j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }else if(board[k][j] == board[i][j] && noBlockHorizontal(j,k,i,board) && !hasConflicted[k][j]) {
                            showMoveAnimation(i,j,k,j); 
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            score += board[k][j];
                            updateBoardView(score);
                            hasConflicted[k][j] = true;
                            continue;
                        }
                    }
                }
            }
        }
        setTimeout(updateBoardView,200);
        return true;
    }else {
        return false;
    }
}

// 向下移动
function moveBottom () {

    // push()方法在数组的尾部添加一个或多个元素，并返回数组新的长度，修改并替换了原始数组而非生成一个修改版的新数组。
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            preValue.push(board[i][j]);
        }
    }
    preScore.push(score);

    if (canMoveBottom(board)) {
        for (var i = 2; i >= 0; i--) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] != 0) {
                    for (var k = 3; k > i; k--) {
                        if (board[k][j] == 0 && noBlockHorizontal(j,i,k,board)) {
                            showMoveAnimation(i,j,k,j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }else if (board[k][j] == board[i][j] && noBlockHorizontal(j,i,k,board) && !hasConflicted[k][j]) {
                            showMoveAnimation(i,j,k,j);
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            score += board[k][j];
                            updateBoardView(score);
                            hasConflicted[k][j] = true;
                            continue;
                        }
                    }
                }
            }
        }
        setTimeout(updateBoardView,200);
        return true;
    }
    else{
        return false;
    }
}

// 判断是否可以向下移动
function canMoveBottom (board) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// 判断是否可以向上移动
function canMoveTop (board) {
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// 判断是否可以向右移动
function canMoveRight (board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++){
            if(board[i][j] != 0) {
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// 判断是否可以向左移动
function canMoveLeft (board) {
    for (var i = 0; i < 4; i++) {
        // i 行 j 列，向左移动 第一列不可以移动 所以 j=1,只需遍历右三列即可
        for (var j = 1; j < 4; j++) {
            // 判断要移动的是哪个格子
            if (board[i][j] != 0) {
                // 如果前一列的格子值为0 或 前一列格子的数字等于他自身，则可以移动
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

// 判断移动的格子和要移动到的位置中 是否有障碍物
function noBlockHorizontal (row,col1,col2,board) {
        // row = i  col1 = k  col2 = j  board = board
        // var i = k; i < j; i++
    for (var i = col1 + 1; i < col2; i++) {
        if (board[row][i] != 0) {
            return false;
        }
    }
    return true;
}

// 创建移动时的动画
function showMoveAnimation (fromx,fromy,tox,toy) {
    // fromx = i;  fromy = j;  tox = i;  toy = k;
    // 原来的位置 和要移动到的位置
    var numberCell = $('#number_cell' + fromx + '_' + fromy);
    // Animate()方法用于创建自定义动画
    // 语法为：$(“”).animate({params},speed,callback);
    // Params：它的第一个参数的意思是：定义形成动画的Css属性
    // Speed：speed 是一个可选的参数，规定效果的时长。它可以取以下值："slow"、"fast"       或毫秒
    // Callback：选的 callback 参数是动画完成后所执行的函数名称。
    numberCell.animate({
        'top':getPosTop(tox,toy),
        'left':getPosLeft(tox,toy)
    },200);
}

// 将分数添加到 #score 中
function updateScore (score) {
    // 将相加的分数添加到 #score 中
    $('#score').text(score);
}

function isgameover () {
    if (nospace(board) && nomove(board)) {
        // 当没有空位且不能移动时 游戏结束
        alert('gameover');
        // $('Large_lattice').append('<div id="gameover" class="gameover">\
        //                                 <p>\
        //                                     本次得分\
        //                                 </p>\
        //                                 \
        //                                 <span>\
        //                                     "+score+"\
        //                                 </span>\
        //                                 \
        //                                 <a href="javascript:restartgame();" id="restartgamebuttom">\
        //                                     Restart\
        //                                 </a>\
        //                             </div>');
        // var gameover = $('gameover');
        // gameover.css('width','500px');
        // gameover.css('height','500px');
        // gameover.css('background-color','rgba(119,119,119,0.3)');
    }
}

function nomove () {
    if (canMoveLeft(board) || canMoveRight(board) || canMoveTop(board) || canMoveBottom(board)) {
        return false;
    }else {
        return true;
    }
}

// 返回上一步
function undo() {
    let obj = {};
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (obj[board[i][j]]) {
                obj[board[i][j]]++;
            } else {
                obj[board[i][j]] = 1;
            }
        }
    }
    for (let key in obj) {
        if (key == 0 && obj[key] == 14) { //当场上只有两个格子有数字即newgame时，按下undo无反应
            return false;
        }
    }
    for (let i = 3; i >= 0; i--) {
        for (let j = 3; j >= 0; j--) {
            board[i][j] = preValue.pop();
        }
    }
    score = preScore.pop();
    updateBoardView();
    updateScore(score);
}


function restartgame () {
    $('gameover').remove();
    updateScore(0);
    newgame();
}
