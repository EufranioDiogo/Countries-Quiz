document.querySelector('#btn-game-flags').addEventListener('click', ()=>{
    window.location.assign('HTML/game.html?playMode=1')
})
document.querySelector('#btn-game-capitals').addEventListener('click', ()=>{
    window.location.assign('HTML/game.html?playMode=2')
})
document.querySelector('#btn-game-capitals-flags').addEventListener('click', ()=>{
    window.location.assign('HTML/game.html?playMode=3')
})
document.querySelector('#btn-game-exit').addEventListener('click', ()=>{
    window.close()
})