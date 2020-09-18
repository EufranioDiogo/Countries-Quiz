let playMode = parseInt(window.location.href.split('?')[1].split('=')[1])


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}


let app = new Vue({
    el: '.main-conteiner',
    data: {
        results: [],
        correctAnswers: 0,
        wrongAnswers: 0,
        skipAnswers: 0,
        indexesCorrectAnswersSelected: [],
        answerOptions: [],
        correctAnswerIndex: 0,
        flagImg: null,
        line: ['A', 'B', 'C', 'D'],
        isFlagQuestion: false,
        capitalName: '',
    },
    methods: {
        generateQuestion() {
            if (playMode == 1) {
                app.generateFlagQuestion()
            } else if (playMode == 2) {
                app.generateCapitalQuestion()
            } else {
                app.generateFlagOrCapitalQuestion()
            }
        },
        generateFlagQuestion() {
            app.isFlagQuestion = true;

            document.querySelector('.question-text').style.marginTop = '15px'
            let options = app.generateOptions()

            app.flagImg = app.results[app.correctAnswerIndex].flag;
            app.answerOptions = options;
        },
        generateCapitalQuestion() {
            app.isFlagQuestion = false;

            document.querySelector('.question-text').style.marginTop = '50px'
            let options = app.generateOptions()

            app.capitalName = app.results[app.correctAnswerIndex].capital;
            app.answerOptions = options;
        },
        generateFlagOrCapitalQuestion() {
            if (Math.floor(Math.random() * (1 + 1))) {
                app.generateCapitalQuestion()
            } else {
                app.generateFlagQuestion()
            }
        },
        generateOptions() {
            let options = [];
            let correctAnswerIndex = getRandomArbitrary(0, app.results.length);
            let limit = app.results.length > 4 ? 4 : app.results.length
            let insertionIndexOfCorrectAnswer = getRandomArbitrary(0, limit)

            while(options.length < limit){
                if(options.length == insertionIndexOfCorrectAnswer){
                    options.push(correctAnswerIndex)
                } else {
                    let index = getRandomArbitrary(0, app.results.length)
                    let isOptionInTheList = false
                    console.log(index)
                    for(let i = 0; i < options.length; i++){
                        if(index == options[i] || index == correctAnswerIndex){
                            isOptionInTheList = true
                            break
                        }
                    }
                    if(!isOptionInTheList){
                        options.push(index)
                    }
                }
            }
            app.correctAnswerIndex = correctAnswerIndex
            return options;
        },
        analiseChoice(index, i = null) {
            if (index == app.correctAnswerIndex) {
                app.correctAnswer()
            } else {
                app.wrongAnswer(i)
            }
        },
        correctAnswer() {
            app.correctAnswers += 1;

            document.querySelectorAll('.answer-option')[app.answerOptions.indexOf(app.correctAnswerIndex)].style.color = '#FFF';
            document.querySelectorAll('.answer-option')[app.answerOptions.indexOf(app.correctAnswerIndex)].style.backgroundColor = '#00b7e9';

            setTimeout(() => {
                document.querySelectorAll('.answer-option')[app.answerOptions.indexOf(app.correctAnswerIndex)].style.color = '#1f1f1f';
                document.querySelectorAll('.answer-option')[app.answerOptions.indexOf(app.correctAnswerIndex)].style.backgroundColor = '#FFF';

                let auxArray = []

                for (let i = 0; i < app.results.length; i++) {
                    if (i != app.correctAnswerIndex) {
                        auxArray.push(app.results[i])
                    }
                }
                app.results = auxArray;
                app.generateQuestion();
            }, 2000)
        },
        wrongAnswer(index) {
            app.wrongAnswers += 1;

            document.querySelectorAll('.answer-option')[parseInt(index)].style.backgroundColor = '#EA8282';
            document.querySelectorAll('.answer-option')[parseInt(index)].style.color = '#FFF';

            document.querySelectorAll('.answer-option')[app.answerOptions.indexOf(app.correctAnswerIndex)].style.color = '#FFF';
            document.querySelectorAll('.answer-option')[app.answerOptions.indexOf(app.correctAnswerIndex)].style.backgroundColor = '#00b7e9';

            setTimeout(() => {
                document.querySelectorAll('.answer-option')[parseInt(index)].style.backgroundColor = '#FFF';
                document.querySelectorAll('.answer-option')[parseInt(index)].style.color = '#1f1f1f';

                document.querySelectorAll('.answer-option')[app.answerOptions.indexOf(app.correctAnswerIndex)].style.color = '#1f1f1f';
                document.querySelectorAll('.answer-option')[app.answerOptions.indexOf(app.correctAnswerIndex)].style.backgroundColor = '#FFF';
                app.results = app.results
                app.generateQuestion();
            }, 2000)
        }
    },
})

document.querySelector('.btn-exit').addEventListener('click', () => {
    window.location.assign(`result.html?corrects=${app.correctAnswers}&wrongs=${app.wrongAnswers}&mode=${playMode}`)
})

document.querySelector('.end-of-game button').addEventListener('click', ()=>{
    window.location.assign('../index.html')
})

fetch('https://restcountries.eu/rest/v2/all').then(response => response.json()).then(data => {
    app.results = data;
    console.log(app.results)
    app.generateQuestion()
})

