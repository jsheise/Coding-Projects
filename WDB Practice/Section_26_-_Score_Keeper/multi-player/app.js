const rst_btn = document.querySelector("#reset");
const goal_select = document.querySelector("#goal");
const playerButtons = document.querySelector("#playerButtons");
const newPlayerButton = document.querySelector("#addPlayer");
const scoreList = document.querySelector("#scoreList");
let win_score = 3;
let isGameOver = false;

// could also put this inside a playersData object with an addPlayer method, but start simple
const players = []; // don't need a variable for # players; can use players.length

const playerTemplate = {
    score: 0,
    button: null,
    disp: null,
    label: null
}

function addPlayer() {
    players.push({ ...playerTemplate });
    // need to save locally; console.log(`clicked button${players.length}`)) will cause whatever current value is to print
    const newPlayerNum = players.length; 
    
    let newPlayerButton = document.createElement("button");
    newPlayerButton.innerText = `+1 Player ${newPlayerNum}`; // just added a new element
    newPlayerButton.setAttribute("id", `p${newPlayerNum}Button`);
    newPlayerButton.classList.add('button', 'card-footer-item');
    newPlayerButton.style.background = makeRandColor();
    newPlayerButton.addEventListener('click', () => incrementScore(newPlayerNum));

    let newPlayerLabel = document.createElement("label");
    newPlayerLabel.classList.add('title', 'is-1');
    newPlayerLabel.setAttribute("id", `p${newPlayerNum}Label`);
    newPlayerLabel.innerText = `Player ${newPlayerNum} Score: `;

    let newPlayerDisplay = document.createElement("span");
    newPlayerDisplay.classList.add('title', 'is-1');
    newPlayerDisplay.setAttribute("id", `p${newPlayerNum}Display`);
    newPlayerDisplay.innerText = "0\n";

    scoreList.append(newPlayerLabel, newPlayerDisplay);

    playerButtons.append(newPlayerButton);
    players[players.length-1].button = newPlayerButton;
    players[players.length-1].disp = newPlayerDisplay;
    players[players.length-1].label = newPlayerLabel;
}

function makeRandColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
}

newPlayerButton.addEventListener('click', addPlayer);

rst_btn.addEventListener('click', gameReset);
function gameReset() {
    newPlayerButton.disabled = false;
    isGameOver = false;
    // two approaches to removing buttons: object>button access or ID w/ string literal match
    for (let p of players) {
        p.button.remove();
        p.disp.remove();
        p.label.remove();
    }
    players.splice(0, players.length); // empty array; if going with aforementioned object>button, still need array around for loop
}

goal_select.addEventListener('change', function () {
    win_score = parseInt(this.value);
    gameReset();
});

function incrementScore(playerNum) {
    if (!isGameOver) {
        players[playerNum-1].score++;
        if (players[playerNum-1].score === win_score) {
            isGameOver = true;
            players[playerNum-1].disp.classList.add('has-text-success');
            players[playerNum-1].button.disabled = true;
            setLosersColor(playerNum);
        }
        players[playerNum-1].disp.innerText = `${players[playerNum-1].score}\n`;
    }
}
let losers = null; 
function setLosersColor(winningPlayerNum) {
    losers = [...players]; losers.splice(winningPlayerNum-1, 1)
    // why doesn't (for p in losers) work??? nested objects??
    // for (let i = 0; i < losers.length; i++) {
    //     losers[i].disp.classList.add('has-text-danger');
    //     losers[i].button.disabled = true;
    // }
    for (let p of losers) {
        p.disp.classList.add('has-text-danger');
        p.button.disabled = true;
    }
    newPlayerButton.disabled = true;
}

//https://stackoverflow.com/questions/64190782/array-spliceindex-1-removing-more-than-1-item
//https://stackoverflow.com/questions/9638361/how-can-i-pass-a-parameter-to-a-function-without-it-running-right-away
//https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
//https://stackoverflow.com/questions/1819878/changing-button-color-programmatically
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
//https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/
//https://www.freecodecamp.org/news/copying-stuff-in-javascript-how-to-differentiate-between-deep-and-shallow-copies-b6d8c1ef09cd/
//https://developer.mozilla.org/en-US/docs/Web/API/Element/remove
//https://stackoverflow.com/questions/1819878/changing-button-color-programmatically