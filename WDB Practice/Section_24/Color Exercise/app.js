const header = document.querySelector("h2");
const btn = document.querySelector("#color_changer");

// not actually necessary, since there's never an initial setting to these values, but whatever
let red_chnl = Math.floor(Math.random() * 255);
let green_chnl = Math.floor(Math.random() * 255);
let blue_chnl = Math.floor(Math.random() * 255);


function randomize_channels() {
    red_chnl = Math.floor(Math.random() * 255);
    green_chnl = Math.floor(Math.random() * 255);
    blue_chnl = Math.floor(Math.random() * 255);
}

// this is how Colt approached color randomization
const makeRandColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},(${g},(${b})`
}

function change_background_color() {
    randomize_channels();
    // note: had to place `` on outside of entire expression, rather than just within rgb()
    document.body.style.backgroundColor = `rgb(${red_chnl},${green_chnl},${blue_chnl})`;
    header.innerText = `rgb(${red_chnl},${green_chnl},${blue_chnl})`;
    if (Math.max(red_chnl, green_chnl, blue_chnl) < 100) {
        header.style.color = "#FFFFFF";
    }
    else header.style.color = "black";
}

btn.addEventListener('click', change_background_color);

// did this without watching the video!