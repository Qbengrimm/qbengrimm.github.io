// === ZMIENNE ===
const limbOptions = ["Lewa ręka", "Prawa ręka", "Lewa noga", "Prawa noga"];
let colors = [], moveCount = 0, isFirstDraw = true;
let lastDraws = { "Lewa ręka":null, "Prawa ręka":null, "Lewa noga":null, "Prawa noga":null };
// === DOM ===
const colorForm = document.getElementById('color-form');
const colorInput = document.getElementById('color');
const colorList = document.getElementById('colors');
const startGameSection = document.getElementById('start-game');
const startButton = document.getElementById('start-button');
const gameControls = document.getElementById('game-controls');
const drawButton = document.getElementById('draw-button');
const endButton = document.getElementById('end-button');
const resultsSection = document.getElementById('results');
const currentDraw = document.getElementById('current-draw');
const moveHistory = document.getElementById('move-history');
const totalMoves = document.getElementById('total-moves');
const playAgainButton = document.getElementById('play-again-button');
const resetButton = document.getElementById('reset-button');
const actionButtons = document.querySelector('.action-buttons');
const resultButtons = document.querySelector('.result-buttons');
const colorInputSection = document.getElementById('color-input');
const rulesButtonContainer = document.querySelector('.rules-button-container');
// === FUNKCJE ===
function capitalizeFirstLetter(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }
function getRandomColor(limb) {
    let attempts = 0, color;
    do { color = capitalizeFirstLetter(colors[Math.floor(Math.random()*colors.length)]);
         attempts++;
    } while (color === lastDraws[limb] && attempts < 50);
    return color;
}
function draw() {
    if (!colors.length) return alert("Dodaj kolory!");
    moveCount++;
    let assignment = {};
    if (isFirstDraw) {
        limbOptions.forEach(limb => {
            let col = getRandomColor(limb);
            assignment[limb] = col; lastDraws[limb] = col;
        });
        isFirstDraw = false;
    } else {
        const limb = limbOptions[Math.floor(Math.random()*4)];
        const col = getRandomColor(limb);
        assignment[limb] = col; lastDraws[limb] = col;
    }
    updateCurrentDraw(assignment);
    addMoveToHistory(assignment);
    updateTotalMoves();  // Aktualizuj licznik po każdym ruchu
    rulesButtonContainer.scrollIntoView({ behavior: 'smooth' });
}
function updateCurrentDraw(obj) {
    let html = isFirstDraw ? "Start:<br>" : "Ruch:<br>";
    for (let k in obj) html += `${k}: <b>${obj[k]}</b><br>`;
    currentDraw.innerHTML = html;
    currentDraw.classList.add('highlight');
    setTimeout(() => currentDraw.classList.remove('highlight'), 1000);
}
function addMoveToHistory(obj) {
    const li = document.createElement('li');
    if (moveCount === 1) {  // Użyj moveCount zamiast isFirstDraw, bo isFirstDraw zmienia się przed tym вызовом
        let txt = "Ruch 1:<br>";
        for (let k in obj) txt += `${k} – ${obj[k]}<br>`;
        li.innerHTML = txt;
    } else {
        const [limb] = Object.keys(obj);
        li.textContent = `Ruch ${moveCount}: ${limb} – ${obj[limb]}`;
    }
    moveHistory.prepend(li);  // Dodaj na początek listy, aby najnowsze było na górze
}
function updateTotalMoves() {
    totalMoves.textContent = moveCount;
}
// === EVENTY ===
colorForm.addEventListener('submit', e => {
    e.preventDefault();
    let c = colorInput.value.trim().toLowerCase().replace(/\s+/g, '');  // Usuń spacje
    if (!c) return alert("Wpisz kolor!");
    if (colors.includes(c)) return alert("Już jest!");
    if (colors.length >= 12) return alert("Max 12 kolorów!");
    colors.push(c);
    localStorage.setItem('colors', JSON.stringify(colors));
    const li = document.createElement('li');
    li.textContent = capitalizeFirstLetter(c);
    colorList.appendChild(li);
    colorInput.value = '';
    if (colors.length >= 2) startGameSection.classList.remove('hidden');
});
startButton.addEventListener('click', () => {
    if (colors.length < 2) return alert("Minimum 2 kolory!");
    gameControls.classList.remove('hidden');
    resultsSection.classList.remove('hidden');
    startGameSection.classList.add('hidden');
    colorInputSection.classList.add('hidden');
    updateTotalMoves();  // Inicjalizuj licznik na 0 po starcie
});
drawButton.addEventListener('click', draw);
endButton.addEventListener('click', () => {
    actionButtons.classList.add('hidden');
    resultButtons.classList.remove('hidden');
    alert(`Koniec! Wykonałeś ${moveCount} ruchów!`);
    gameControls.scrollIntoView({behavior:'smooth'});
});
playAgainButton.addEventListener('click', () => location.reload());
resetButton.addEventListener('click', () => {
    if (confirm("Całkowity reset?")) { localStorage.clear(); location.reload(); }
});
// === MODAL ===
const modal = document.getElementById('rules-modal');
document.getElementById('open-rules').onclick = () => modal.style.display = 'block';
document.querySelectorAll('.close, .close-btn').forEach(b => b.onclick = () => modal.style.display = 'none');
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
// === LOAD KOLORY ===
window.addEventListener('load', () => {
    if (localStorage.getItem('colors')) {
        colors = JSON.parse(localStorage.getItem('colors'));
        colors.forEach(c => {
            const li = document.createElement('li');
            li.textContent = capitalizeFirstLetter(c);
            colorList.appendChild(li);
        });
        if (colors.length >= 2) startGameSection.classList.remove('hidden');
    }
});
