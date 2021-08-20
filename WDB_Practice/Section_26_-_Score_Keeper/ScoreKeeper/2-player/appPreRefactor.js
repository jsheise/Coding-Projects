const p1_btn = document.querySelector("#p1Button");
const p2_btn = document.querySelector("#p2Button");
const rst_btn = document.querySelector("#reset");
const goal_select = document.querySelector("#goal");

const p1_disp = document.querySelector('#p1Display');
const p2_disp = document.querySelector('#p2Display');

let p1Score = 0;
let p2Score = 0;
let win_score = 3;
let isGameOver = false;

const p1_obj = {
    score: 0,

}

p1_btn.addEventListener('click', function () {
    if (!isGameOver) {
        p1Score++;
        if (p1Score === win_score) {
            isGameOver = true;
            p1_disp.classList.add('has-text-success');
            p2_disp.classList.add('has-text-danger');
            p1_btn.disabled = true;
            p2_btn.disabled = true;

        }
        p1_disp.innerText = p1Score; // I was going to use .innerText, which also works, but Cole used .textContent
    }
});

p2_btn.addEventListener('click', function () {
    if (!isGameOver) {
        p2Score++;
        if (p2Score === win_score) {
            isGameOver = true;
            p2_disp.classList.add('has-text-success');
            p1_disp.classList.add('has-text-danger');
            p1_btn.disabled = true;
            p2_btn.disabled = true;
        }
        p2_disp.innerText = p2Score; // I was going to use .innerText, which also works, but Cole used .textContent
    }
});

rst_btn.addEventListener('click', gameReset);

function gameReset() {
    isGameOver = false;
    p1Score = 0; p2Score = 0;
    p1_disp.innerText = 0; p2_disp.innerText = 0;
    p1_disp.classList.remove('has-text-success', 'has-text-danger');
    p2_disp.classList.remove('has-text-success', 'has-text-danger');
    p1_btn.disabled = false;
    p2_btn.disabled = false;
}

goal_select.addEventListener('change', function () {
    win_score = parseInt(this.value);
    gameReset();
});