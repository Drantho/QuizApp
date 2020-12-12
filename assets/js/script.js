// create quiz questions array
var questions = [
    {
        text: "What is your name?",
        responses: [
            "King Arthur",
            "Sir Lancelot of Camelot",
            "Sir Robin of Camelot",
            "Fred of the cul de sac"
        ],
        correctResponse: 0
    },
    {
        text: "What is your quest?",
        responses: [
            "To find a new minstrel",
            "To seek the Holy Grail",
            "To find Camelot",
            "To wash the car"
        ],
        correctResponse: 1
    },
    {
        text: "What is your favorite color?",
        responses: [
            "Brown",
            "Red",
            "Blue",
            "Green"
        ],
        correctResponse: 2
    },
    {
        text: "What is the air speed of an unladen swallow?",
        responses: [
            "15 f/s",
            "20 m/s",
            "African or European swallow?",
            "3x10^8 m/s"
        ],
        correctResponse: 2
    }
];

// declare variable used for setInterval globally
var quizLoop;

// declare html element variables
var displayTimerDiv = document.querySelector("#timer");
var displayQuestionDiv = document.querySelector("#question");
var startBtn = document.querySelector("#startBtn");

// declare event lister to begin quiz
startBtn.addEventListener("click", function(){
    runQuiz()
});

// create quiz timer variable
var timer = 40;

// create variable to hold current question number
var questionNumber = 0;

//main function holds timer and asks first question
function runQuiz() {
    console.log("runQuiz() fires");

    //ask first question
    displayQuestion(questionNumber);

    //set initial time on timer
    displayTimerDiv.textContent = timer;

    //begin timer set interval to 1s and run for 40s
    quizLoop = setInterval(() => {

        //decrease timer by 1s each loop
        timer--;

        //show timer value on screen
        displayTimerDiv.textContent = timer;
        
        //end timer at 0
        if (timer <= 0) {
            clearInterval(quizLoop);
            showScoreScreen();
        }
    }, 1000);

}

// show user the current question
function displayQuestion(questionNumber) {
    console.log(`displayQuestion(${questionNumber}) fires.`);

    //clear contents of question div
    displayQuestionDiv.innerHTML = "";

    //only attempt to add question if question exists and timer remains on the timer
    if (questionNumber < questions.length && timer > 0) {

        //add current question to screen
        var newQuestion = document.createElement("h2");
        newQuestion.textContent = questions[questionNumber].text;
        displayQuestionDiv.appendChild(newQuestion);

        //loop through possible responses and display a button for each
        for (var i = 0; i < questions[questionNumber].responses.length; i++) {
            var newButton = document.createElement("button");
            newButton.textContent = questions[questionNumber].responses[i];

            //button will send response number as argument to answerQuestion()
            newButton.setAttribute("onclick", "answerQuestion(" + i + ")");
            displayQuestionDiv.appendChild(newButton);
        }

    }
    else {
        //questions have all been asked go to score screen
        clearInterval(quizLoop);
        showScoreScreen();
    }

}

// accept answer from user
function answerQuestion(answerNumber) {
    console.log(`answerQuestion(${answerNumber}) fires`);

    //convert string argument to int for comparison
    answerNumber = parseInt(answerNumber);

    //compare user answer to correct answer
    if (answerNumber !== questions[questionNumber].correctResponse) {
        //answer is incorrect - deduct 10s from timer
        timer -= 10;
    }

    //move to next question
    questionNumber++;

    //put next question on screen
    displayQuestion(questionNumber);
}

// display a final score screen to the user after the quiz is over
function showScoreScreen() {
    console.log("showScoreScreen() fires");

    //if score is < 0 set to 0
    if(timer < 0){
        timer = 0;
    }

    //clear timer display and question display
    displayTimerDiv.innerHTML = "";
    displayQuestionDiv.innerHTML = "";

    //create score element and display
    var scoreDisplay = document.createElement("h1");
    scoreDisplay.textContent = "You scored " + timer + "!";
    displayQuestionDiv.appendChild(scoreDisplay);

    //TODO save score and display high scores

    saveUser();
}

function saveUser(){
    var initials = prompt("You earned a high score! Enter your initials!");
    var score = {
        "initials": initials,
        "score": timer,
        "date": Date()
    }
    var scores = JSON.parse(localStorage.getItem("scores")) || [];
    
    scores.push(score);
    
    scores.sort((a,b) => {
        if(a.score <  b.score){
            return 1
        } else if(a.score > b.score){
            return -1
        }
        return 0;

    })

    console.log(scores);

    localStorage.setItem("latestScore", JSON.stringify(score));
    localStorage.setItem("scores", JSON.stringify(scores));
    
    displayScores();
}

function displayScores(){
    var scores = JSON.parse(localStorage.getItem("scores"));
    var latestScore = JSON.parse(localStorage.getItem("latestScore"));
    
    var scoreList = document.createElement("ol");    
    for(var i=0; i<scores.length; i++){
        var score = document.createElement("li");
        if(scores[i].date === latestScore.date){
            score.setAttribute("class", "yourScore");
        }
        score.textContent = scores[i].initials + " " + scores[i].score;
        scoreList.appendChild(score);
    }
    displayQuestionDiv.appendChild(scoreList);

}