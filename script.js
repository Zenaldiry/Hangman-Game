const letterContainer = document.querySelector(".the-letters");
const container = document.querySelector(".container");
const category = document.querySelector(".category");
const drawDiv = document.querySelector(".the-draw");
const popup = document.querySelector(".pop");
const replayBtn = document.querySelector(".replay");
let endgame = false;
//making two counter to count each click of user if it true or false
let loseCounter = 0;
let winCounter = 0;
//creating letters and adding them to html ==============================================
const letters = "abcdefghijklmnopqrstuvwxyz";
const lettersArray = Array.from(letters);
lettersArray.forEach((letter) => {
  const span = document.createElement("button");
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
    //sending request and getting response
    let response = await fetch("words.json");
    //getting the data from json file and put them in array
    let wordsArr = await response.json();
    return (words = wordsArr[0]);
  } catch {
    throw Error("there is no response");
  }
};
getData()
  .then((words) => {
    //getting the keys of the object in json file to use it as a category
    let wordsKeys = Object.keys(words);
    //getting a random key from object
    let randomKey = wordsKeys[Math.floor(Math.random() * wordsKeys.length)];
    return randomKey;
  })
  .then((randomKey) => {
    //getting random word of values of random key
    let randomWord =
      words[randomKey][Math.floor(Math.random() * words[randomKey].length)];
    //adding the random key to html as a category
    category.innerHTML = randomKey.toUpperCase();
    return randomWord;
  })
  .then((randomWord) => {
    //creating a div to hold the letters which is true and display it on html
    const wordContainer = document.createElement("div");
    // adding class to the div
    wordContainer.className = "words-container";
    //adding it to container in html
    container.appendChild(wordContainer);
    //converting the word to array
    let randomWordArray = Array.from(randomWord);
    randomWordArray.forEach((letter) => {
      //creating a div for each letter of the random word
      const input = document.createElement("div");
      //checking if there a space in the random word and adding style
      if (letter === " ") {
        input.style.backgroundColor = "grey";
        winCounter++;
      }
      //adding each input created to html
      wordContainer.appendChild(input);
    });
    //hidding draw parts
    [...drawDiv.children].forEach((child) => {
      child.style.display = "none";
    });
    // building game logic
    //making copy of the random word array
    let randomWordArr = [...randomWord];
    [...letterContainer.children].forEach((letter) => {
      //add event listener on clicking the letter
      letter.addEventListener("click", () => {
        // selecting the inputs
        let inputs = document.querySelectorAll(".words-container div");
        //checking if the random word include the letter clicked
        if (Array.from(randomWord).includes(letter.innerHTML)) {
          // selecting the index of letter clicked in the array of the random word
          let index = randomWordArr.indexOf(letter.innerHTML);
          // selecting the input of letter clicked
          let letterInput = inputs[index];
          // checking if the letter existed in word array
          if (index !== -1) {
            theLetterIsTrue(letter, letterInput, index, randomWordArr);
            if (!randomWordArr.includes(letter.innerHTML)) {
              letter.style.backgroundColor = "grey";
            }
          }
        } else {
          theLetterIsFalse(letter);
        }
        result(randomWord);
      });
    });
  });
//function if the clicked letter is true
const theLetterIsTrue = (letterClicked, letterInput, index, randomWordArr) => {
  if (letterInput.innerHTML === "") {
    letterInput.innerHTML = letterClicked.innerHTML;
    randomWordArr[index] = "";
    winCounter++;
  }
};

//function if the clicked letter is false
const theLetterIsFalse = (letter) => {
  disableButton(letter); // Refactored to use disableButton
  drawDiv.children[loseCounter].style.display = "block";
  loseCounter++;
};
// the result function
const result = (randomWord) => {
  if (winCounter === randomWord.length) {
    popup.insertAdjacentHTML(
      "afterbegin",
      `<div><span>you win and the word is</span>  <span class="last">${randomWord.toUpperCase()}</span></div>`
    );
    popup.style.display = "flex";
    disableAllButtons();
  }
  if (loseCounter === drawDiv.children.length) {
    popup.insertAdjacentHTML(
      "afterbegin",
      `<div><span>you lose and the word is </span>  <span class="last">${randomWord.toUpperCase()}</span></div>`
    );
    popup.style.display = "flex";
    disableAllButtons();
  }
};
// function to reload the page if the user want
replayBtn.addEventListener("click", () => {
  location.reload();
});
// function to disable button
const disableButton = (button) => {
  button.style.backgroundColor = "red";
  button.setAttribute("disabled", "disabled");
};

// Function to disable all buttons
const disableAllButtons = () => {
  [...letterContainer.children].forEach(disableButton);
};
