//==============================================================================

var p1 = "Hey body! i'm Eric a space fighter from the earth. The most beautiful plant on the universe. i was living their "
 + "with my family till... ! Yeah the day that we descivered the we are not the only creatures on the universe. We learned "
 + "that by the Hard way. the aliens we everywhere ... killing and kidnapping evey one, i saw my whole family get kidnaped"
 + " by them, a light came from the sky dragging them. i servived .... And now trying to get them back from the aliens,"
 + " DO U WANT TO HELP ME !?";
var p2 = " Hello there! i'm Henata a space fighter,it was horrible when i saw my whole family getting killed"
+ " by the aliens, i was the only surviver .... now i'm seeking for revenge,"
+ " DO U WANT TO HELP ME !?";
var p3 = "MORAH ASO, that 'Hello' in my language! i don't know if u noticed or not but i'm an Orc. the most evolved species "
+ "on the univers, and living on the Titans planet, that planet doesn't exist anymore ... it was destroyed 10 light years " 
+ "ago. we could escape on the last sec. but we don't have home any more SO... it's wasn't the best choice but the only "
+ "one. we invaded all the planets that contain life on our way, but it was NEVER enough. we were so many and these planets "
+ "were so poor too. till we found Earth. it was a treasure for us. i was a General in the Orcs army. we were ordered to kill"
+ "and kidnap all the creatures on that planet, to get all the resources for only us. that was when i decided not to do that"
+ " i wont do that anymore. Yeah the Orcs king 'Ona Ool', jailed me! till some human saved me. Eric he was. then i Knew "
+ "that the only way to stop my species is to kill 'Ona Ool', DO U WANT TO HELP ME !?";
var images = ["Eric", "Naglaa", "Richard"];
var paragraphes = [p1, p2, p3];
var selectedChar = 0;

//==============================================================================

var startGame = document.getElementById("start");
var charDescription = document.getElementById("charDescript");
var charImg = document.getElementById("charImg");

//==============================================================================
//var queryString = decodeURIComponent(window.location.search);
//queryString = queryString.substring(1);
selectedChar = parseInt(window.localStorage.getItem('index'));
//selectedChar = parseInt(queryString.charAt(queryString.length-1));

viewChar();
function viewChar(){
    charImg.src = "images/" + images[selectedChar] + ".png";
    showStory();
}

//==============================================================================
startGame.addEventListener('click',goToGame);
function goToGame(){
    window.location.href = "index.html";
}
//=================================Nageh=============================================
var go_back= document.getElementById("back");
go_back.addEventListener('click',goToback);
function goToback(){
    window.location.href = "slidShow.html";
}

//==============================================================================
function showStory() {
    var i = 0 ;  
    var intervalId = setInterval(frame, 80);
    function frame() {
        charDescription.textContent = paragraphes[selectedChar].slice(0, i + 1);
        i++;
        if(i >= paragraphes[selectedChar].length)
            clearInterval(intervalId);
    }
  }

// function myMove() {
//     var i = 0 ;  
//     var arr = paragraphes[selectedChar - 1].slice();
//     var intervalId = setInterval(frame, 100);
//     function frame() {
//         charDescription.textContent += arr[i];
//         i++;
//         if(i >= arr.length){ i = 0; clearInterval(intervalId);}
//     }
//   }

