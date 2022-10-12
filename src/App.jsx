import { useState, useEffect } from "react";
import arrayShuffle from "array-shuffle";
import "./App.css";

function App() {
  const [newQuiz, setNewQuiz] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState({});
  const [showingScore, setShowingScore] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
   if (!isGameStarted) {
      fetch(
        "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple"
      )
        .then((res) => res.json())
        .then((data) =>
          setNewQuiz(
            data.results.map((item, index) => {
              return {
                ...item,
                answers: arrayShuffle(item.incorrect_answers.concat(item.correct_answer)) ,
              };
            })
          )
        );
          } 
  }, [isGameStarted]);

  

  function selectedAnswers(questionIndex, answerIndex) {
    setQuizAnswer({ ...quizAnswer, [questionIndex]: answerIndex });
  }

  function newGame(){
    setIsGameStarted(!isGameStarted)
   setShowingScore(false)
    setQuizAnswer({})
  }

  function calculateScore() {
    let count = 0;
    for (let i = 0; i < newQuiz.length; i++) {
      let correctAnswer = newQuiz[i].correct_answer;
      let pickedIndex = quizAnswer[i];
      let pickedAnswer = newQuiz[i].answers[pickedIndex];
      if (correctAnswer === pickedAnswer) {
        count += 1;
      }
    }
    return count;
  }

  function results() {
    setShowingScore(!showingScore);
    
  }

  return (
    <main>
      {!isGameStarted ? (
        <div className="start-page">
        
          <h1>Quizzical</h1>
          <h3>Here is the quiz game you have been waiting to play</h3>
          <button   className="start-game" onClick={newGame}>Start Quiz</button>  
          <div className="colors">
          <div className="top-color"></div>
          <div className="bottom-color"></div>
          </div>
        </div>
      ) : (
        <div className="App">
          {newQuiz.map((item, questionIndex) => (
            <div>
              <h2>{item.question}</h2>
              <div className="answers">
                {item.answers.map((answer, answerIndex) => {
                  const isSelected = quizAnswer[questionIndex] === answerIndex;
                  const isShowingCorrect =
                    showingScore &&
                    item.answers.indexOf(item.correct_answer) === answerIndex;
                  return (
                    <button
                   
                      onClick={() =>
                        selectedAnswers(questionIndex, answerIndex)
                      }
                      className={"btn " +
                        (isShowingCorrect
                          ? "right_answer"
                          : isSelected
                          ? showingScore
                            ? "incorrect_answers"
                            : "selected_answer"
                          : "")
                      }
                    >
                      {answer}
                    </button>
                  );
                })}
              </div>
              
            </div>
          ))}
        <br></br>
          <button className="submit-btn" onClick={results}>Submit</button>
          <br></br>
          {showingScore && (
            <div>
              You Scored {calculateScore()}/{newQuiz.length} correct answers
            </div>
          )}
          <br></br>
          <button className="play-btn" onClick = {newGame}>Play again</button>
        </div>
      )}
    </main>
  );
}

export default App;
