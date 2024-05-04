const letterContainer = document.querySelector(".the-letters");
const container = document.querySelector(".container");
const category = document.querySelector(".category");
const drawDiv = document.querySelector(".the-draw");
const popup = document.querySelector(".pop");
const replayBtn = document.querySelector(".replay");
//creating letters and adding them to html ==============================================
const letters = "abcdefghijklmnopqrstuvwxyz";
const lettersArray = Array.from(letters);
lettersArray.forEach((letter) => {
  const span = document.createElement("span");
  span.className = "letter-box";
  const spanNode = document.createTextNode(letter);
  span.append(spanNode);
  letterContainer.appendChild(span);
});
//========================================================================================
// creating object of categories and words for the game
let words;
const getData = async () => {
  try {
    let response = await fetch("words.json");
    let wordsArr = await response.json();
    return (words = wordsArr[0]);
  } catch {
    throw Error("there is no response");
  }
};
getData()
  .then((words) => {
    let wordsKeys = Object.keys(words);
    let randomKey = wordsKeys[Math.floor(Math.random() * wordsKeys.length)];
    return randomKey;
  })
  .then((randomKey) => {
    let randomWord =
      words[randomKey][Math.floor(Math.random() * words[randomKey].length)];
    category.innerHTML = randomKey.toUpperCase();
    return randomWord;
  })
  .then((randomWord) => {
    let loseCounter = 0;
    let winCounter = 0;
    const wordContainer = document.createElement("div");
    wordContainer.className = "words-container";
    container.appendChild(wordContainer);
    let randomWordArray = Array.from(randomWord);
    randomWordArray.forEach((letter) => {
      const input = document.createElement("div");
      if (letter === " ") {
        input.style.backgroundColor = "grey";
        winCounter++;
      }
      wordContainer.appendChild(input);
    });
    [...drawDiv.children].forEach((child) => {
      child.style.display = "none";
    });
    // building game logic
    let randomWordArr = [...randomWord];
    [...letterContainer.children].forEach((letter) => {
      //add event listener
      letter.addEventListener("click", () => {
        let inputs = document.querySelectorAll(".words-container div");

        if (Array.from(randomWord).includes(letter.innerHTML)) {
          let index = randomWordArr.indexOf(letter.innerHTML);

          let letterInput = inputs[index];
          if (index !== -1) {
            theLetterIsTrue(letter, letterInput, index);
            if (!randomWordArr.includes(letter.innerHTML)) {
              letter.style.backgroundColor = "grey";
            }
          } else {
            theLetterIsFalse();
          }
        } else {
          theLetterIsFalse();
        }
        result();
      });
    });
    const theLetterIsTrue = (letterClicked, letterInput, index) => {
      if (letterInput.innerHTML === "") {
        letterInput.innerHTML = letterClicked.innerHTML;
        randomWordArr[index] = "";
        winCounter++;
      }
    };
    const theLetterIsFalse = () => {
      drawDiv.children[loseCounter].style.display = "block";
      loseCounter++;
    };
    const result = () => {
      if (winCounter === randomWord.length) {
        popup.insertAdjacentHTML(
          "afterbegin",
          `<div><span>you win and the word is</span>  <span class="last">${randomWord.toUpperCase()}</span></div>`
        );
        popup.style.display = "flex";
      }
      if (loseCounter === drawDiv.children.length) {
        popup.insertAdjacentHTML(
          "afterbegin",
          `<div><span>you lose and the word is </span>  <span class="last">${randomWord.toUpperCase()}</span></div>`
        );
        popup.style.display = "flex";
      }
    };
  });

replayBtn.addEventListener("click", () => {
  location.reload();
});
