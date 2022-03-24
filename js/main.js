'use strict'
var gBoard;
var gGame = {
    isOn: true,
    showCount: 0,
    minesFlagged: 0,
    secsPassed: 0,
}
var face = '😏'
var lifeLostFace = '😰'
var gameOverFace = '😭'
var victoryFace = '🤩'
var gStartTimer
var gStopTimer
var MINE = '💣'
var FLAG = '🏴‍☠️'
var gLevel = {
    size: 4,
    mines: 2,
}
var gLives = 3
var size = gLevel.size
var mines = gLevel.mines

function init(){
    clearInterval(gStopTimer)
    gStartTimer.innerText = 'Timer'
    gBoard = createBoard(size,mines)
    createMat(size,size)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
}
function easy(){
    gLevel.size = 4
    gLevel.mines = 2
    init()
}
function medium(){
    size = 8
    mines = 12
    init()
}
function hard(){
    size = 12
    mines = 30
    init()
}

function createBoard(size,mines){
    gBoard = createMat(size,size)
    var minesLocation = []
    for(var i = 0; i < mines; i++){
        var randomI = getRandomIntInclusive(0,gBoard.length - 1)
        var randomJ = getRandomIntInclusive(0,gBoard.length - 1)
        while(minesLocation.includes(`${randomI},${randomJ}`)) {
            randomI = getRandomIntInclusive(0,gBoard.length - 1)
            randomJ = getRandomIntInclusive(0,gBoard.length - 1)
        }
        gBoard[randomI][randomJ].isMine = true
        minesLocation.push(`${randomI},${randomJ}`)
    }
    return gBoard
}


function cellClicked(elCell){
    var elFace = document.querySelector('.face')
    var elLIves = document.querySelector('.lives span')
    if(!gGame.isOn)return
    var cellClass = elCell.className.split('-')
    var i = cellClass[1]
    var j = cellClass[2]
    if(gBoard[i][j].isMarked || gBoard[i][j].isShow ) return
    var location = {
        i:i,
        j:j
    }
    if(gBoard[i][j].isMine){
        renderCell(location, MINE)
        audioBomb.play();
        gLives--
        console.log(gLives)
        elLIves.innerHTML = gLives
        elFace.innerHTML = lifeLostFace
        var timeout = setTimeout(() => {elFace.innerHTML = face}, 1000)
        if(gLives === 0){
            clearTimeout(timeout)
            elFace.innerHTML = gameOverFace
            gameOver()
            return
        }
    }
    if(!gBoard[i][j].isMine && !gBoard[i][j].minesAroundCount){
        var neighbors = showNeighbors(gBoard,i,j)
    }
    // gGame.showCount++
    renderCell(location, gBoard[i][j].minesAroundCount)
    console.log('mines flagged',gGame.minesFlagged)
    checkVictory()
    if (!gStopTimer) {
        var start = Date.now()
        gStopTimer = setInterval(() => startTimer(start), 1);
    }
}

function checkVictory(){
    if(gGame.minesFlagged === mines && gGame.showCount === (size**2 - mines)) victory()
}

function victory(){
    clearInterval(gStopTimer)
    gGame.isOn = false
    console.log('victory')
}

function gameOver(){
    clearInterval(gStopTimer)
    console.log('gameOver')
    gGame.isOn = false
    return
}

