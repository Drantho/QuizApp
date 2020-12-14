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
var timerContainer = document.querySelector("#timer");
var welcomeDiv = document.querySelector("#welcomeDiv");
var displayTimerDiv = document.querySelector("#timerText");
var questionDiv = document.querySelector("#question");    
var scoreDiv = document.querySelector("#scoreDiv");
var startBtn = document.querySelector("#startBtn");
var pathRemaining = document.querySelector("#pathRemaining");
var retryBtn = document.querySelector("#retryBtn");
var scoreList = document.querySelector("#scoreList");

// declare event listener to begin quiz
startBtn.addEventListener("click", runQuiz);
retryBtn.addEventListener("click", retryQuiz);

// create quiz timer variable and initial value - used for % remaining calc
var initialTime = 40;
var timer = initialTime;

// create variable to hold current question number
var questionNumber = 0;

//main function holds timer and asks first question
function runQuiz() {
    console.log("runQuiz() fires");

    // hide welcome and score divs
    welcomeDiv.style.display = "none";
    scoreDiv.style.display = "none";

    // show timer and question divs
    timerContainer.style.display = "block";
    questionDiv.style.display = "block"

    //ask first question
    displayQuestion(questionNumber);

    //set initial time on timer
    displayTimerDiv.textContent = formatTime();

    //begin timer set interval to 1s and run for 40s
    quizLoop = setInterval(function() {

        //decrease timer by 1s each loop
        timer--;
        
        pathRemaining.style.stroke = getColor();

        //show timer value on screen
        displayTimerDiv.textContent = formatTime();
        setCircleDashArray();
        //end timer at -1 to show 00:00
        if (timer < 0) {
            clearInterval(quizLoop);
            showScoreScreen();
        }
    }, 1000);

}

// show user the current question
function displayQuestion(questionNumber) {
    console.log(`displayQuestion(${questionNumber}) fires.`);

    //clear contents of question div
    questionDiv.innerHTML = "";

    //only attempt to add question if question exists and timer remains on the timer
    if (questionNumber < questions.length && timer > 0) {

        //add current question to screen
        var newQuestion = document.createElement("h2");
        newQuestion.textContent = questions[questionNumber].text;
        newQuestion.setAttribute("class", "question-text");
        questionDiv.appendChild(newQuestion);

        //loop through possible responses and display a button for each
        for (var i = 0; i < questions[questionNumber].responses.length; i++) {
            var newButton = document.createElement("div");
            newButton.textContent = questions[questionNumber].responses[i];
            newButton.setAttribute("class", "answerBtn")

            //button will send response number as argument to answerQuestion()
            newButton.setAttribute("onclick", "answerQuestion(" + i + ")");
            questionDiv.appendChild(newButton);
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
        if (timer >= 10) {
            timer -= 10;
        } else {
            timer = 0;
        }
        // make timing circle flash red
        pathRemaining.style.stroke = "red";
    }

    //move to next question
    questionNumber++;

    //put next question on screen
    displayQuestion(questionNumber);
}

// display a final score screen to the user after the quiz is over
function showScoreScreen() {
    console.log("showScoreScreen() fires");

    timerContainer.style.display = "none";

    // ensure no negative times
    if (timer < 0) {
        timer = 0;
    }

    // ensure timer/ score screen is correc at end;
    setCircleDashArray();

    //hide question and timer div
    questionDiv.style.display = "none";
    displayTimerDiv.style.display = "none";  
    
    // show score div
    scoreDiv.style.display = "block";

    //create score element and display
    var scoreDisplay = document.createElement("h1");
    scoreDisplay.textContent = "You scored " + timer + "!";
    questionDiv.appendChild(scoreDisplay);

    saveUser();
}

// save score to local storage
function saveUser() {

    // get previous scores from local storage and place in array or use empty array
    var scores = JSON.parse(localStorage.getItem("scores")) || [];

    // create score object
    var score = {
        "score": timer,
        "date": Date()
    }

    if ((scores.length >= 10 && score.score > scores[9].score) || (scores.length < 10)) {

        // prompt user for name
        score.initials = prompt("You earned a high score! Enter your initials!");

        // add current score to score array
        scores.push(score);

        // sort score array by score value 
        scores.sort((a, b) => {
            if (a.score < b.score) {
                return 1
            } else if (a.score > b.score) {
                return -1
            }
            return 0;

        })

        if(scores.length > 10){
            scores.splice(10, 1);
        }

        console.log(scores);

        // save latest score to local storage for special styling
        localStorage.setItem("latestScore", JSON.stringify(score));
        // save score list to local storage
        localStorage.setItem("scores", JSON.stringify(scores));

    }
    else{
        alert("you didn't make the high score list. Try harder next time!");
    }
    displayScores(score);
}

// display score list after quiz
function displayScores(testScore) {

    console.log(`displayScores(${testScore}) fires`)
    // console.log("testScore: ", testScore);
    
    scoreList.innerHTML = "";
    
    // get score list from local storage
    var scores = JSON.parse(localStorage.getItem("scores"));

    // loop through scores and place in ol    
    for (var i = 0; i < scores.length; i++) {
        var score = document.createElement("div");
        score.setAttribute("Class", "highScore");

        // console.log(`testScore.date: ${testScore.date} ?= scores[${i}].date: ${scores[i].date}`);

        // set text to score
        score.textContent = `${i+1}. ${scores[i].initials}  ${scores[i].score}`;

        // test if score is from quiz just taken then add class and message if so
        if (scores[i].date === testScore.date) {
            score.setAttribute("class", "highScore yourScore");
            score.textContent += " - your score!";
        }
        scoreList.appendChild(score);
    }

}

// reset variables to initial values and call functions to begin quiz
function retryQuiz(){
    questionNumber = 0;
    timer = initialTime;
    setCircleDashArray();
    pathRemaining.style.stroke = getColor();
    runQuiz();    
}

//==================================================================
// timer animation functions
// =================================================================

// format seconds int to  MM:SS string
function formatTime() {

    // get whole minutes
    var minutes = Math.floor(timer / 60);

    // get remaining seconds
    var seconds = timer % 60;

    // add leading "0"s
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
}

// sets length of timing circle
function setCircleDashArray() {
    // set stroke-dasharray equal to the ration of time remaining/initial time

    // circumference of circle = 2* pi * r(45px) = 283
    var circleDasharray = `${((timer / initialTime) * 283).toFixed(0)} 283`;
    document.getElementById("pathRemaining").setAttribute("stroke-dasharray", circleDasharray);
}

// makes timing circle fade from green to red through yellow
function getColor() {
    // set initial color values
    var red = 0;
    var green = 255;

    // set formulas for later
    var ratioTimeLeft = timer / initialTime;
    var ratioTimeElapsed = 1 - ratioTimeLeft;

    // if time elapsed is < 50% increase red 
    if (ratioTimeElapsed <= 0.5) {
        red = ratioTimeElapsed * 2 * 255;
    }
    // reduce green
    else {
        red = 255;
        green = (ratioTimeLeft * 2) * 255
    }

    return `rgba(${red}, ${green}, 0)`;
}
