//Stops that popup the browser gives when you reload forms, warning you of resubmissions
//Did this cause it was annoying when I was testing
if ( window.history.replaceState ) {
  window.history.replaceState( null, null, window.location.href );
}

//Load the random word to the document
const theWord = getRandomWord();

const para1 = document.getElementById('word');//First h1 element where the word is held throughout the whole game
const triesShown = document.getElementById('shownWord')//2nd h1 element under input box
const buttonOp = document.getElementById('theButton');//The button that is first shown on the page
const frm = document.getElementById('formPlace');//The div that holds the form after the game has started
const gameBox = document.getElementById('game');//The form
const inputBox = document.getElementById('inputChar');//The input box
const isError = document.getElementById('errorLine'); //Third h1 line that displays error
const holdChars = [];//Holds the inputed characters that were guessed;
let nomoreVowels = false;

//Function that displays beginning underscores of random word
function firstshowOnWindow(str){ 
   let line = '';
   let temp = str.split('');
   temp.forEach(element=>{
     line += '_ ';
  })

  return line;
}

para1.innerHTML  = firstshowOnWindow(theWord);

//Displays the first instances of the characters (r,s,t,l,n,e) in the word when the game is started
function gameStart(str){
     let line = '';
     let temp = str.split('');
     temp.forEach(element=>{
        switch (element){
         case 'r':
           line += 'r';
           break;
         case 's':
           line += 's';
           break;
         case 't':
           line += 't';
           break;
         case 'l':
           line += 'l';
           break;
         case 'n':
           line += 'n';
           break;
         case 'e':
           line += 'e';
           break;
         default:
           line += '_';
           break;
     }
     })
  return line;
}


//When the start game button is clicked, both a form and input box is created and appended to the window
//The first button is removed as to not have the function ran more than one time 
    buttonOp.addEventListener("click", ()=>{
    para1.innerHTML = gameStart(theWord); 
    buttonOp.remove(); 
    document.getElementById("game").hidden = false;
});


//Checks the input recieved and makes sure it fits in constraints 
function gotData(str){
   document.getElementById('game').reset();//Making input box blank
   isError.innerHTML = '';//Removing error message

   //Checking if input is either an uppercase or lowercase letter
   if(!str.match(/^[a-zA-Z]+$/)){
       isError.innerHTML = "<span style='color: red;'>Invalid input. Please only enter letters</span>" 
       return -1;
     }

   const temp = str.toLowerCase().split('');//Converting to lowercase and splitting to array

   for(let i=0; i<temp.length; i++){
      
      //Removing spaces from input
      if(temp[i] === ' '){
           temp.splice(i, 1); }
      
      //Only allowing one vowel to be passed
      //Lets only one vowel to be entered      
      if(temp[i] === 'a' || temp[i]==='e' || temp[i]==='i' || temp[i]==='o' || temp[i]==='u'){
        if(nomoreVowels === true){ 
          isError.innerHTML = "<span style='color: red;'>You are allowed only one single vowel</span>"
          return -1;
        }else{ nomoreVowels = true; }
      } 
    }
   
   //Pushing input into holdChars to keep track of what has been entered
   temp.forEach(element=>{
      holdChars.push(element);
   })
   
   //Keeping the length of holdChars array 4, and making sure the user adhers to the constraints of the program
   if(temp.length > 4){
     holdChars.splice(0);
     isError.innerHTML = "<span style='color: red;'>More than 4 characters were entered. Only valid characters have been added.</span>"
     return -1;
   }else if(holdChars.length > 4){ 
     holdChars.splice(4); 
     triesShown.innerHTML = holdChars.join(' ');
     isError.innerHTML = "<span style='color: red;'>More than 4 characters were entered. Only valid characters have been added.</span>"
   }else{
      triesShown.innerHTML = holdChars.join(' '); 
      return temp; }
}


//Replaces the underscores with the characters inputed if they get it right 
function deleteSpaces(inputArray){
      if(inputArray.length > 4){
         isError.innerHTML = "<span style='color: red;'>No More Characters can be added</span>"
         return -1;
      }
      let tempStr = para1.innerHTML;

     
      tempStr = tempStr.split('');
      const str = theWord.split('');
      
      //Replacing underscores with correct letters
      for(let a=0; a<str.length; a++){
         for(let i=0; i<inputArray.length; i++){
            if(inputArray[i] === str[a]){
               tempStr[a] = inputArray[i];
            }
         }
      }
     para1.innerHTML = tempStr.join('');
     return tempStr.join('');
} 


//Handles last attempt to guess word and win
function lastShot(){
     isError.innerHTML = '';//Removing error message
     triesShown.innerHTML = 'Alright this is your last shot. You have one try to guess the word. Make it count!!';
      
     inputBox.addEventListener("keydown", function(event) {
        if(event.key === 'Enter'){
           event.preventDefault();
           let element = event.target;
           
              if(element.value.toLowerCase() === theWord){
                 para1.innerHTML = theWord;
                 triesShown.innerHTML = 'Nice job. I knew you could do it';
                 document.getElementById("game").hidden = true;
              }else{
                 document.getElementById("word").hidden = true;
                 triesShown.innerHTML = `Aww Nice Try, but you didn't get it. The word was ${theWord}.`
                 document.getElementById("game").hidden = true;
              }
         }
      })
}


//Handles event listener of the input box and calls all other functions when needed
inputBox.addEventListener("keydown", function listen(event) {
        if(event.key === 'Enter'){
           event.preventDefault();
           const element = event.target;
           let temp = gotData(element.value); 
           temp = deleteSpaces(temp);
           
           if(temp === theWord){
              triesShown.innerHTML = 'Congratulations, You Win!!!!';
              document.getElementById("game").hidden = true;
              return -1;
           }

           if(holdChars.length === 4){ 
             inputBox.removeEventListener("keydown", listen);//Removing this event listener
             lastShot(); }
        }
 })