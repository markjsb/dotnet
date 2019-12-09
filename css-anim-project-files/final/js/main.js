let today = new Date();
let hourNow = today.getHours();
let svg = document.getElementById("svg");
let sun = document.getElementById("sun");
let welcome = document.getElementById("welcome");
let timeslot = "";
let bd = document.body;

hourNow = 16;
//change text
if (hourNow >= 5 && hourNow < 12) welcome.innerHTML = "Good Morning, welcome to";
if (hourNow >= 12 && hourNow < 18) welcome.innerHTML = "Good Afternoon, welcome to";
if (hourNow >= 18 || hourNow < 5) welcome.innerHTML = "Good Evening, welcome to";


//change background
if (hourNow >= 6 && hourNow < 9) {
    timeslot = "sunrise";
    bd.classList.remove("day-back");
    bd.classList.add("rise-back");
};
if (hourNow >= 9 && hourNow < 16) timeslot = "day";
if (hourNow >= 16 && hourNow < 18) {
    timeslot = "sunset";
    bd.classList.remove("day-back");
    bd.classList.add("rise-back");
}
if (hourNow >= 18 || hourNow < 6) {
    timeslot = "night";
    bd.classList.remove("day-back");
    bd.classList.add("night-back");
}

//animate the sun or moon
let pause = setTimeout(() => {
    if (timeslot == "sunrise" || timeslot == "day" || timeslot == "sunset") {
        let angle = -70 + ((hourNow - 6) * 12);
        console.log(angle);

        sun.style.transform = 'rotate(' + angle + 'deg)';
    }
    if (timeslot == "night") {
        let angle;
        if (hourNow >= 18 && hourNow <= 23) {
            angle = -70 + ((hourNow - 18) * 12);
        } else if (hourNow >= 0) angle = -70 + ((hourNow + 5) * 12);
        sun.style.backgroundColor = "#eafdff";
        sun.style.transform = 'rotate(' + angle + 'deg)';

    }
}, 500);

svg.addEventListener("load", function () {
    let svgDoc = svg.contentDocument;
    let mt = svgDoc.getElementById("mountTint");
    if (timeslot == "day" || timeslot == "night") mt.style.opacity = 0;
}, false);
