const rst_btn = document.querySelector("#reset");
const goal_select = document.querySelector("#goal");
let win_score = 3;
let isGameOver = false;

const p1_obj = {
    score: 0,
    button: document.querySelector("#p1Button"),
    disp: document.querySelector('#p1Display')
}
const p2_obj = {
    score: 0,
    button: document.querySelector("#p2Button"),
    disp: document.querySelector('#p2Display')
}

function incrementScore(player, opponent) {
    if (!isGameOver) {
        player.score++;
        if (player.score === win_score) {
            isGameOver = true;
            player.disp.classList.add('has-text-success');
            opponent.disp.classList.add('has-text-danger');
            player.button.disabled = true;
            opponent.button.disabled = true;

        }
        player.disp.innerText = player.score; // I was going to use .innerText, which also works, but Cole used .textContent
    }
}

p1_obj.button.addEventListener('click', function () {
    incrementScore(p1_obj, p2_obj);
});

p2_obj.button.addEventListener('click', function () {
    incrementScore(p2_obj, p1_obj);
});

rst_btn.addEventListener('click', gameReset);

function gameReset() {
    isGameOver = false;
    for (let p of [p1_obj, p2_obj]) {
        p.score = 0;
        p.disp.innerText = 0;
        p.disp.classList.remove('has-text-success', 'has-text-danger');
        p.button.disabled = false;
    }
    // p1_obj.score = 0; p2_obj.score = 0;
    // p1_obj.disp.innerText = 0; p2_obj.disp.innerText = 0;
    // p1_obj.disp.classList.remove('has-text-success', 'has-text-danger');
    // p2_obj.disp.classList.remove('has-text-success', 'has-text-danger');
    // p1_obj.button.disabled = false;
    // p2_obj.button.disabled = false;
}

goal_select.addEventListener('change', function () {
    win_score = parseInt(this.value);
    gameReset();
});