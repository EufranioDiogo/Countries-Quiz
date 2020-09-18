let playMode = parseInt(window.location.href.split('?')[1].split('=')[1])


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
            let options = []
            let indexsSelected = []

            app.correctAnswerIndex = Math.floor(Math.random() * (app.results.length + 1));

            let index = null;
            let isIndexIn = false;
            let correctIndexTimeToInsert = Math.floor(Math.random() * (3 - 0 + 1))

            while (options.length < 4) {
                index = Math.floor(Math.random() * (app.results.length - 0 + 1));
                isIndexIn = false;

                if (options.length == correctIndexTimeToInsert) {
                    options.push(app.correctAnswerIndex)
                    indexsSelected.push(app.correctAnswerIndex)
                } else {
                    for (let i = 0; i < indexsSelected.length; i++) {
                        if (indexsSelected[i] == index) {
                            isIndexIn = true;
                        }
                    }
                    if (!isIndexIn) {
                        options.push(index)
                        indexsSelected.push(index)
                    }
                }
            }
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

                app.results = app.results.slice(0, app.correctAnswerIndex).concat(app.results.slice(app.correctAnswerIndex + 1))
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
                app.generateQuestion();
            }, 2000)
        }
    },






})

fetch('https://restcountries.eu/rest/v2/all').then(response => response.json()).then(data => {
    app.results = data;
    app.generateQuestion()
})

document.querySelector('.btn-exit').addEventListener('click', () => {
    window.location.assign(`result.html?corrects=${app.correctAnswers}&wrongs=${app.wrongAnswers}&mode=${playMode}`)
})