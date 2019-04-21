var slid_pilot = document.getElementById("pilot");
var slid_pragraph = document.getElementById("pragraph");
var slid_Rocket = document.getElementById("Rocket");
//var image = ["Eric", "Naglaa", "Richard"];
var rocket = ["blackSpaceShip", "whiteSpaceShip", "redSpaceShip"];
var text = ["My Name is Eric ,I am from Planet Earth  i will fight the enemies to protect you, i will use blackSpaceShip Roket with :<br>vlocity:10km/s<br>speed:20m/s"
    , "My Name is Henata ,I am from Planet Earth  i will fight the enemies to protect you, i will use whitepaceShip Roket with:<br> vlocity:10km/s<br>speed:30m/s"
    , "My Name is Rechard ,I am from Planet Earth  i will fight the enemies to protect you, i will use redSpaceShip Roket with:<br>vlocity:10km/s<br>speed:40m/s"]
var imgindex = 0;
var next_btn = document.getElementById("next");
var prev_btn = document.getElementById("prev");
//===========================================================s
var selectbtn = document.getElementById('selectbtn');
selectbtn.addEventListener('click', goToNextStep);
function goToNextStep() {
    //var queryString = "?para1=" + imgindex ;
    window.localStorage.setItem('index', imgindex);
    window.location.href = "description.html";
}
//=======================Nageh==================================
var backbtn = document.getElementById('backbtn');
backbtn.addEventListener('click', goTobackStep);
function goTobackStep() {
    //var queryString = "?para1=" + imgindex ;
    window.localStorage.setItem('index', imgindex);
    window.location.href = "login.html";
}
//===========================================================
next_btn.addEventListener('click', next);
prev_btn.addEventListener('click', prev);
/// function next 
function next() {
    imgindex++;
    if (imgindex == image.length) imgindex = 0;
    slid_pilot.innerHTML = "<img class='pilotimg' src='images/" + image[imgindex] + ".png'>";
    slid_pragraph.innerHTML = "<p>" + text[imgindex] + "<p>";
    slid_Rocket.innerHTML = "<img id='rocket_img'src='images/" + rocket[imgindex] + ".ico'>"
}
//function Prev
function prev() {
    imgindex = imgindex - 1;
    if (imgindex == -1) imgindex = image.length - 1;
    slid_pilot.innerHTML = "<img class='pilotimg' src='images/" + image[imgindex] + ".png'>";
    slid_pragraph.innerHTML = "<p>" + text[imgindex] + "<p>";
    slid_Rocket.innerHTML = "<img id='rocket_img'src='images/" + rocket[imgindex] + ".ico'>"
}

