'use strict'
var gBoard;
var gGame = {
    isOn: true,
    showCount: 0,
    minesFlagged: 0,
    isSevenBoom: false,
}
var face = '<span>😏</span>'
var noLivesFace = '💀'
var lifeLostFace = '<span>😰</span>'
var gameOverFace = '<span>😭</span>'
var victoryFace = '<span>🤩</span>'
var gStartTimer
var gStopTimer
var MINE = '💣'
var FLAG = '🏴‍☠️'
var gLevel = {
    size: 4,
    mines: 2,
}
var gScoresKey = 'scores'
var gScores
var gLives = 1
var size = gLevel.size
var mines = gLevel.mines

function init(){
    var elFace = document.querySelector('.face')
    elFace.innerHTML = face
    gGame.isOn = true
    var elLives = document.querySelector('.lives span')
    var lives = size === 4 ? 1 : 3
    gLives = lives
    elLives.innerText = getHearts(gLives)
    clearInterval(gStopTimer)
    gStopTimer = ''
    gStartTimer.innerText = 'Timer'
    gBoard = createMat(size,size)
    renderBoard(gBoard)
    gScores = JSON.parse(localStorage.getItem(gScoresKey)) || { 
        easy:0,
        medium:0,
        hard:0,
    }
    var level = getLevel()
    var elScore = document.querySelector('.score span')
    elScore.innerText = gScores[level]
}
function easy(){
    size = 4
    mines = 2
    init()
}
function medium(){
    var elLives = document.querySelector('.lives span')
    gLives = 3
    elLives.innerText = gLives
    size = 8
    mines = 12
    init()
}
function hard(){
    var elLives = document.querySelector('.lives span')
    gLives = 3
    elLives.innerText = gLives
    size = 12
    mines = 30
    init()
}


function cellClicked(elCell){
    var elFace = document.querySelector('.face')
    var elLives = document.querySelector('.lives span')
    var cellClass = elCell.className.split('-')
    var i = cellClass[1]
    var j = cellClass[2]
    if(checkFirstClick(gBoard)){
        setMines(i,j)
        setMinesNegsCount(gBoard)
    }
    if (!gStopTimer) {
        var start = Date.now()
        gStopTimer = setInterval(() => startTimer(start), 1);
    }
    if(!gGame.isOn)return
    if(gBoard[i][j].isMarked || gBoard[i][j].isShow ) return
    var location = {
        i:i,
        j:j
    }
    if(gBoard[i][j].isMine && !gBoard[i][j].isShow){
        audioBomb.play();
        renderCell(location, MINE)
        gLives--
        elLives.innerText = getHearts()
        gBoard[i][j].isShow= true
        elFace.innerHTML = lifeLostFace
        var timeout = setTimeout(() => {elFace.innerHTML = face}, 1000)
        if(gLives === 0){
            clearTimeout(timeout)
            elFace.innerHTML = gameOverFace
            elLives.innerText = noLivesFace
            gameOver()
            return
        }return
    }
    if(!gBoard[i][j].isMine){
        var level = getLevel()
        gScores[level]++
        var elScore = document.querySelector('.score span')
        elScore.innerText = gScores[level]
        localStorage.setItem(gScoresKey, JSON.stringify(gScores))
    }
    if(!gBoard[i][j].isMine && !gBoard[i][j].minesAroundCount){
        showNeighbors(gBoard,i,j)
    }
    if(!gBoard[i][j].isShow) {
        gBoard[i][j].isShow = true
        gGame.showCount++
    }
    var content = gBoard[i][j].minesAroundCount ? gBoard[i][j].minesAroundCount : ''
    renderCell(location, content)
    checkVictory()
}


// function sevenBoom(){//doesnt work
//     gGame.isSevenBoom = true
//     var count = 0
//     for(var i = 0; i < gBoard.length; i++){
//         for(var j = 0; j < gBoard.length; j++){
//             var currCell = gBoard[i][j]
//             count++
//             if(count % 7 === 0) currCell.isMine = true
//         }
//     }
//     setMinesNegsCount(gBoard)
// }
