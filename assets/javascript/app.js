$(document).ready(function () {

  let allQuestions = [];
  let numCorrectAnswers = 0;
  let numWrongAnswers = 0;
  let index = 0;
  let rightAnswer = '';
  let countDown = {
    time: 30,
    resetClock: function () {
      this.time = 30;
      $('.timer').text( countDown.time + ' seconds remaining');
    },
    start: function () {
      counter = setInterval(countDown.count, 1000);
    },
    stop: function () {
      console.log("Stopping");
      console.log(counter);
      clearInterval(counter);
    },
    count: function () {
      countDown.time--;
      console.log(countDown.time);
      if (countDown.time >= 0) {
        $('.timer').text( countDown.time + ' seconds remaining');
      } else {
        if (index < 10) {
          answerWrong();
          numWrongAnswers = numWrongAnswers + 1;
        } else {
          console.log("Calling reset");
          reset();
        }   
      }
    }
  };

  const generateQuestion = function () {
    $.ajax({
      url: "https://opentdb.com/api.php?amount=10&type=multiple",
      method: 'GET'
    }).then(function (response) {
      allQuestions = response.results;
    });
  };

  const displayQuestion = function (index) {
    console.log("In display question");
    if (index < 10) {
      
      let all_options = [];
      let correct_option = allQuestions[index].correct_answer;
      let incorrect_answers = allQuestions[index].incorrect_answers;
      all_options.push(correct_option);
      for (let i = 0; i < incorrect_answers.length; i++) {
        all_options.push(incorrect_answers[i]);
      }
      all_options.sort();
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
      countDown.start();

    } else {
      console.log("All questions have exhaused");
      reset();
    }
  };


  const getGIF = function (word) {
    urlQuery = `https://api.giphy.com/v1/gifs/random?api_key=K49b1wyxkVVa4Gh4Q5uKUOzpWuCQpl3b&tag=${word}&rating=PG-13`
    $.ajax(url = urlQuery, method = 'GET').then(function (response) {
      console.log("In gif");
      console.log(response.data);
      $('#options').append(`<img class="gif" src="${response.data.fixed_height_downsampled_url}" alt="">`);
    })
  }

  const answerWrong = function () {
    $('.timer').css('visibility', 'hidden');
    $('#questions').text('');
    $('#options').text('');
    $('#questions').text('You are Wrong !!'); 
    $('#questions').append(`<p>The correct answer is - ${rightAnswer.trim()}</p>`); 
    getGIF("wrong");
    countDown.stop();
    countDown.resetClock();
    index = index + 1;
    setTimeout(displayQuestion, 6000, index);
  };

  const answerRight = function () {
    $('.timer').css('visibility', 'hidden');
    $('#questions').text('');
    $('#options').text('');
    $('#questions').text('You are Right !!');
    $('#questions').append(`<p>The correct answer is - ${rightAnswer.trim()}</p>`); 
    getGIF("right");
    countDown.stop();
    countDown.resetClock();

    index = index + 1;
    setTimeout(displayQuestion, 6000, index);
  };

  const reset = function () {
    $('.timer').css('visibility', 'hidden');
    $('#questions').text('');
    $('#options').text('');
    $('#options').append(`<button class="reset" type="button"> Click here to play again.... </button>`)  
    $('#options').append(`<p class="score"> Your Score.... </p>`) 
    $('#options').append(`<p class="score"> Total Questions : ${allQuestions.length} </p>`)  
    $('#options').append(`<p class="score"> No. of Right Answers : ${numCorrectAnswers} </p>`)  
    $('#options').append(`<p class="score"> No. of Wrong Answers : ${numWrongAnswers} </p>`)  
    countDown.stop();
    countDown.resetClock();
  };

  $('.startGame').click(function () {
    $('.startGame').remove();
    displayQuestion(index);
  });

  $(document).on('click', '.choice', function () {
    if ($(this).hasClass("correct")) {
      numCorrectAnswers = numCorrectAnswers + 1;
      answerRight();
    } else {
      numWrongAnswers = numWrongAnswers + 1;
      answerWrong();
    }
  });

  $(document).on('click', '.reset', function () {
    index = 0;
    generateQuestion();
    displayQuestion(index);
  });

  generateQuestion();

});