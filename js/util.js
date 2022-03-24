"use strict";

var gStartTimer = document.querySelector('.timer')
var elCell

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}



var audioBomb = new Audio('explosion.mp3');
var audioSwoosh = new Audio('swoosh.mp3');


function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            var cell = {
            minesAroundCount:0,
            isShow: false,
            isMine:false,
            isMarked: false,
            }
            row.push(cell)
        }
        mat.push(row)
    }
    return mat
}

function getEmptyCells() {
    var emptyCell=[]
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            if(!cell.isMine) emptyCell.push({i:i,j:j})
        }
    }
    if(emptyCell === [])return null
    return emptyCell
}

function showNeighbors(mat, idxI, idxJ) {
    idxI = parseInt(idxI)
    idxJ = parseInt(idxJ)
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i > mat.length - 1) {
            continue
        }
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (i === idxI && j === idxJ)continue
            if(mat[idxI][idxJ].isMine)continue
            if (j < 0 || j > mat[i].length - 1)continue
            if(mat[i][j].isShow)continue
            if(mat[i][j].isMarked)continue
            mat[i][j].isShow = true;
            gGame.showCount++
            var content = mat[i][j].minesAroundCount ? mat[i][j].minesAroundCount : ''
            renderCell({i:i,j:j}, content)
        }
    }
}

function renderBoard(mat) {
    var strHTML = '<table><tbody>';

    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var className = 'cell cell-' + i + '-' + j;
            strHTML += `<td id="id:${i},${j}" class="` + className + `" onclick="cellClicked(this,${i},${j})" oncontextmenu="cellRightClick(event, this,${i},${j})"> `
            if(mat[i][j].isMine){
                strHTML += MINE
            } else strHTML+= ''
            strHTML += '</td>' 
        } 
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board');
    elContainer.innerHTML = strHTML;

}

function cellRightClick(event, elCell, i, j){
    event.preventDefault()
    var cell = gBoard[i][j]
    var idx ={
        i:i,
        j:j,
    }
    if(cell.isMarked){
        renderCell(idx,'')
        cell.isMarked = false
        if (cell.isMine) gGame.minesFlagged--
        return
    }
    if(cell.isShow) return
    cell.isMarked = true
    audioSwoosh.play()
    renderCell(idx, FLAG)
    if(cell.isMine) gGame.minesFlagged++
    checkVictory()
}

function renderCell(location, value) {
    elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
    elCell.style.backgroundColor = '#767272'
    return elCell;
}

function startTimer(start){
    var end = Date.now()
    var timePassed = end - start
    var fixed = (timePassed / 1000).toFixed(0)
    gStartTimer.innerText = fixed
}

function sumArea(matrix, rowIdxStart, rowIdxEnd, colIdxStart, colIdxEnd) {
    var sum = 0;
    for (var i = rowIdxStart; i <= rowIdxEnd; i++) {
        var currRow = matrix[i];
        for (var j = colIdxStart; j <= colIdxEnd; j++) {
            var currNum = currRow[j];
            sum += currNum;
        }
    }
    return sum;
}


function setMinesNegsCount(board){
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board.length; j++)
        gBoard[i][j].minesAroundCount = countNeighbors(i,j,gBoard)
    }
}

function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if(mat[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount;
}
function victory(){
    clearInterval(gStopTimer)
    gGame.isOn = false
}

function gameOver(){
    clearInterval(gStopTimer)
    showMines()
    gGame.isOn = false
    return
}

function checkVictory(){
    if(gGame.minesFlagged === mines && gGame.showCount === size**2) victory()
}

function checkFirstClick(mat){
    for(var i =0; i < mat.length; i++){
        for(var j =0; j < mat[0].length; j++){
            if(mat[i][j].isShow) return false
        }
    }
    return true
}

function setMines(idxI,idxJ){
    var minesLocation = []
    for(var i = 0; i < mines; i++){
        var randomI = getRandomIntInclusive(0,gBoard.length - 1)
        var randomJ = getRandomIntInclusive(0,gBoard.length - 1)
        while(minesLocation.includes(`${randomI},${randomJ}`) || (randomI === +idxI && randomJ === +idxJ)) {
            randomI = getRandomIntInclusive(0,gBoard.length - 1)
            randomJ = getRandomIntInclusive(0,gBoard.length - 1)
        }
        gBoard[randomI][randomJ].isMine = true
        minesLocation.push(`${randomI},${randomJ}`)
    }
}

function getLevel(){
    return size === 4 ? 'easy': size === 8 ? 'medium': 'hard'
}

function showMines(){
    for(var i = 0; i < gBoard.length;i++){
        for(var j = 0; j < gBoard[0].length;j++){
            if(gBoard[i][j].isMine) {
                renderCell({i:i, j:j}, MINE)
            }
        }
    }
}