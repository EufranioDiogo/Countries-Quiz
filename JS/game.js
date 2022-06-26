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
        alreadySkip: false,
        alreadyMakeItEasy: false
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

            app.flagImg = app.results[app.correctAnswerIndex].flags.svg;

            app.answerOptions = options;
            
            if (app.flagImg.trim() == '') {
                app.generateCapitalQuestion();
            }
        },
        generateCapitalQuestion() {
            app.isFlagQuestion = false;

            document.querySelector('.question-text').style.marginTop = '50px'
            let options = app.generateOptions()

            app.capitalName = app.results[app.correctAnswerIndex].capital[0];
            app.answerOptions = options;

            if (app.capitalName.trim() == '') {
                app.generateCapitalQuestion();
            }
        },
        generateFlagOrCapitalQuestion() {
            if (Math.floor(Math.random() * (1 + 1))) {
                app.generateCapitalQuestion();
            } else {
                app.generateFlagQuestion();
            }
        },
        generateOptions() {
            let options = [];
            let correctAnswerIndex = getRandomArbitrary(0, app.results.length);
            let limit = app.results.length > 4 ? 4 : app.results.length
            let insertionIndexOfCorrectAnswer = getRandomArbitrary(0, limit)

            while (options.length < limit) {
                if (options.length == insertionIndexOfCorrectAnswer) {
                    options.push(correctAnswerIndex)
                } else {
                    let index = getRandomArbitrary(0, app.results.length)
                    let isOptionInTheList = false
                    for (let i = 0; i < options.length; i++) {
                        if (index == options[i] || index == correctAnswerIndex) {
                            isOptionInTheList = true
                            break
                        }
                    }
                    if (!isOptionInTheList) {
                        options.push(index)
                    }
                }
            }
            app.correctAnswerIndex = correctAnswerIndex
            return options;
        },
        analiseChoice(index, i = null) {
            if (app.alreadyMakeItEasy) {
                let options = document.querySelectorAll('.answer-option');

                for (let i = 0; i < options.length; i++) {
                    options[i].style.backgroundColor = '#fff'
                    options[i].disabled = false;
                }
            }

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
        },
        skipQuestion() {
            if (!app.alreadySkip) {
                app.generateQuestion();
                app.alreadySkip = true;
                document.querySelector('.btn-skip').style.backgroundColor = '#1515155e'
                document.querySelector('.btn-skip').disabled = true;
            }
        },
        makeItEasy() {
            if (!app.alreadyMakeItEasy) {
                let options = document.querySelectorAll('.answer-option');
                let correctOptionIndex = app.answerOptions.indexOf(app.correctAnswerIndex)
                let limit = app.results.length > 4 ? 4 : app.results.length
                let potentialCorrectAnswer = correctOptionIndex;

                while (potentialCorrectAnswer == correctOptionIndex) {
                    potentialCorrectAnswer = getRandomArbitrary(0, limit)
                }

                for (let i = 0; i < options.length; i++) {
                    if (i != correctOptionIndex && i != potentialCorrectAnswer) {
                        options[i].style.backgroundColor = '#ddd'
                        options[i].disabled = true;
                    }
                }
                app.alreadyMakeItEasy = true;
                document.querySelector('.btn-replay').style.backgroundColor = '#1515155e'
                document.querySelector('.btn-replay').disabled = true;
            }
        }
    },
})

document.querySelector('.btn-exit').addEventListener('click', () => {
    window.location.assign(`result.html?corrects=${app.correctAnswers}&wrongs=${app.wrongAnswers}&mode=${playMode}`)
})

document.querySelector('.end-of-game button').addEventListener('click', () => {
    window.location.assign('../index.html')
})

fetch('https://restcountries.com/v3.1/all').then(response => response.json()).then(data => {
    app.results = data;
    app.generateQuestion()
})