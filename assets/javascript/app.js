$(document).ready(function () {

  // tracks all the questions
  let allQuestions = [];

  // tracks number of correct answers
  let numCorrectAnswers = 0;

  // tracks number of incorrect answers
  let numWrongAnswers = 0;

  // index for the questions
  let index = 0;

  // records the right answer
  let rightAnswer = '';

  // countdown object
  let countDown = {
    time: 30,
    // reset the counter
    resetClock: function () {
      this.time = 30;
      $('.timer').text( countDown.time + ' seconds remaining');
    },
     // start the counter
    start: function () {
      counter = setInterval(countDown.count, 1000);
    },
     // stop the counter
    stop: function () {
      clearInterval(counter);
    },
    // functionality for the actions that needs to happen when countdown reaches zero
    count: function () {
      countDown.time--;
      if (countDown.time >= 0) {
        $('.timer').text( countDown.time + ' seconds remaining');
      } else {
        if (index < 10) {
          answerWrong();
          numWrongAnswers = numWrongAnswers + 1;
        } else {
          reset();
        }   
      }
    }
  };

  // ajax call go GET trivia questions
  const initialize = function () {
    let urlString;
    let address = "https://opentdb.com/api.php?";
    let queryParams = "amount=10&category=18&difficulty=easy&type=multiple";
    // GET Request URL for trivia questions
    urlString = address + queryParams;
    // ajax call
    $.ajax({
      url: urlString,
      method: 'GET'
    }).then(function (response) {
      allQuestions = response.results;
    });
  };

  // Function to display the question on the screen.
  const displayQuestion = function (index) {

    if (index < 10) {      
      let all_options = [];
      let correct_option = allQuestions[index].correct_answer;
      let incorrect_answers = allQuestions[index].incorrect_answers;
      all_options.push(correct_option);
      for (let i = 0; i < incorrect_answers.length; i++) {
        all_options.push(incorrect_answers[i]);
      }
      all_options.sort(); // for randomizing the options
      $('#questions').text('');
      $('#options').text('');
      $('#questions').append(`<p>${index + 1}.  ${allQuestions[index].question} </p>`)
      all_options.forEach((option) => {
        if (option === correct_option) {
          rightAnswer = correct_option;
          $('#options').append(`<li><button class="choice correct" type="button" style="background:transparent; border:none;"> ${option} </button></li>`)
        } else {
          $('#options').append(`<li><button class="choice" type="button" style="background:transparent; border:none;"> ${option} </button></li>`)
        }
      });
      
      $('.timer').css('visibility', 'visible');
      countDown.start(); // Start the timer when question gets displayed.
    } else {
      reset();
    }
  };

  // ajax call to get and display GIFs on the page
  const getGIF = function (word) {
    let urlString;
    let address = "https://api.giphy.com/v1/gifs/random?";
    let api_key = "api_key=K49b1wyxkVVa4Gh4Q5uKUOzpWuCQpl3b&tag=";
    let queryParams = "&rating=PG-13";
    // GET Request URL for GIFS
    urlString = address + api_key + word + queryParams;
    // ajax call 
    $.ajax(url = urlString, method = 'GET').then(function (response) {
      $('#options').append(`<img class="gif" src="${response.data.fixed_height_downsampled_url}" alt="">`);
    })
  }

  // correct answer method
  const answerWrong = function () {
    $('.timer').css('visibility', 'hidden');
    $('#questions').text('');
    $('#options').text('');
    $('#questions').text('You are Wrong !!'); 
    $('#questions').append(`<p>The correct answer is - ${rightAnswer.trim()}</p>`); 
    getGIF("wrong");
    countDown.stop(); // stopping the countdown
    countDown.resetClock(); // resetting the countdown
    index = index + 1;
    // delay between answer and next question
    setTimeout(displayQuestion, 6000, index);
  };

   // correct answer method
  const answerRight = function () {
    $('.timer').css('visibility', 'hidden');
    $('#questions').text('');
    $('#options').text('');
    $('#questions').text('You are Right !!');
    $('#questions').append(`<p>The correct answer is - ${rightAnswer.trim()}</p>`); 
    getGIF("right");
    countDown.stop(); // stoping the countdown
    countDown.resetClock(); // resetting the countdown
    index = index + 1;
     // delay between answer and next question
    setTimeout(displayQuestion, 6000, index);
  };

  // reset method when all question are exhausted
  const reset = function () {
    $('.timer').css('visibility', 'hidden');
    $('#questions').text('');
    $('#options').text('');
    $('#options').append(`<p class="over"> Game Over </p>`) 
    $('#options').append(`<p class="score"> Your Score </p>`) 
    $('#options').append(`<p class="score"> Total Questions : ${allQuestions.length} </p>`)  
    $('#options').append(`<p class="score"> No. of Right Answers : ${numCorrectAnswers} </p>`)  
    $('#options').append(`<p class="score"> No. of Wrong Answers : ${numWrongAnswers} </p>`)  
    $('#options').append(`<button class="reset" type="button"> Click here to play again.... </button>`)  
    countDown.stop(); // stoping the countdown
    countDown.resetClock(); // resetting the countdown
  };

  // click event listner on start the game button
  $('.startGame').click(function () {
    $('.startGame').remove();
    displayQuestion(index);
  });

  // click event listner on when we choose option
  $(document).on('click', '.choice', function () {
    if ($(this).hasClass("correct")) {
      numCorrectAnswers = numCorrectAnswers + 1;
      answerRight();
    } else {
      numWrongAnswers = numWrongAnswers + 1;
      answerWrong();
    }
  });

  // click event listner on game reset
  $(document).on('click', '.reset', function () {
    numCorrectAnswers = 0;
    numWrongAnswers = 0;
    index = 0;
    rightAnswer = '';
    initialize(); // makes another ajax call to fresh list of questions
    displayQuestion(index);
  });

  // This method will be called to make an ajax call and grad list of trivia questions
  initialize();
});