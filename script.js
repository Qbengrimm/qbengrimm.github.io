// Definicja kończyn
const limbOptions = ["Lewa ręka", "Prawa ręka", "Lewa noga", "Prawa noga"];

// Inicjalizacja zmiennych gry
let colors = [];
let moveCount = 0;
let moves = [];
let isFirstDraw = true; // Flaga do sprawdzania, czy to pierwsze losowanie
let lastDraws = {
    "Lewa ręka": null,
    "Prawa ręka": null,
    "Lewa noga": null,
    "Prawa noga": null
};

// Elementy DOM
const colorForm = document.getElementById('color-form');
const colorInput = document.getElementById('color');
const colorList = document.getElementById('colors');
const gameControls = document.getElementById('game-controls');
const drawButton = document.getElementById('draw-button');
const endButton = document.getElementById('end-button');
const resultsSection = document.getElementById('results');
const currentDraw = document.getElementById('current-draw');
const moveHistory = document.getElementById('move-history');
const totalMoves = document.getElementById('total-moves');
const startGameSection = document.getElementById('start-game');
const startButton = document.getElementById('start-button');
const playAgainButton = document.getElementById('play-again-button');
const resetButton = document.getElementById('reset-button');

// Funkcja do kapitalizacji pierwszej litery
function capitalizeFirstLetter(string) {
    if (string.length === 0) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Funkcja losowania ruchu z zapobieganiem powtórzeniom
function draw() {
    if (colors.length === 0) {
        alert("Proszę dodać co najmniej jeden kolor, zanim rozpoczniesz grę.");
        return;
    }

    if (isFirstDraw) {
        // Pierwsze losowanie: przypisanie koloru do każdej kończyny
        let currentAssignments = {};
        for (let limb of limbOptions) {
            let newColor = getRandomColor(limb);
            currentAssignments[limb] = newColor;
            lastDraws[limb] = newColor;
        }

        // Uaktualnienie interfejsu
        updateCurrentDraw(currentAssignments);
        addMoveToHistory(currentAssignments);
        moveCount++;

        isFirstDraw = false;
        return currentAssignments;
    } else {
        // Kolejne losowania: przypisanie koloru do jednej losowej kończyny
        let randomLimb = limbOptions[Math.floor(Math.random() * limbOptions.length)];
        let newColor = getRandomColor(randomLimb);

        // Aktualizacja ostatniego przypisanego koloru dla danej kończyny
        lastDraws[randomLimb] = newColor;

        let assignment = {};
        assignment[randomLimb] = newColor;

        // Uaktualnienie interfejsu
        updateCurrentDraw(assignment);
        addMoveToHistory(assignment);
        moveCount++;

        return assignment;
    }
}

// Funkcja generująca losowy kolor dla danej kończyny, unikając powtórzeń
function getRandomColor(limb) {
    if (colors.length === 1) {
        // Jeśli jest tylko jeden kolor, zwróć go
        return colors[0];
    }

    let newColor;
    let attempts = 0;
    const maxAttempts = 100; // Zapobiega nieskończonej pętli

    do {
        newColor = capitalizeFirstLetter(colors[Math.floor(Math.random() * colors.length)]);
        attempts++;
        if (attempts > maxAttempts) {
            // Jeśli nie można znaleźć unikalnego koloru, zwróć aktualny
            break;
        }
    } while (newColor === lastDraws[limb]);

    return newColor;
}

// Funkcja dodająca ruch do historii
function addMoveToHistory(assignments) {
    if (isFirstDraw) {
        // Dla pierwszego ruchu dodajemy kilka wpisów jako jeden ruch
        let moveDescription = "Ruch " + moveCount + ":<br>";
        for (let limb in assignments) {
            moveDescription += `${limb} – ${assignments[limb]}<br>`;
        }

        const li = document.createElement('li');
        li.innerHTML = moveDescription;
        moveHistory.appendChild(li);
    } else {
        // Dla kolejnych ruchów pojedyncze wpisy
        let moveDescription = `Ruch ${moveCount}: ${Object.keys(assignments)[0]} – ${Object.values(assignments)[0]}`;
        const li = document.createElement('li');
        li.textContent = moveDescription;
        moveHistory.appendChild(li);
    }
}

// Funkcja aktualizująca aktualny ruch na stronie
function updateCurrentDraw(assignments) {
    if (isFirstDraw) {
        let displayText = "Aktualne przypisania:<br>";
        for (let limb in assignments) {
            displayText += `${limb}: ${assignments[limb]}<br>`;
        }
        currentDraw.innerHTML = displayText;
    } else {
        let limb = Object.keys(assignments)[0];
        let color = assignments[limb];
        currentDraw.innerHTML = `Ostatni ruch - ${limb}: ${color}`;
    }
}

// Funkcja zakończenia gry
function endGame() {
    return moveCount;
}

// Funkcja resetująca grę (bez usuwania dodanych kolorów)
function resetGame() {
    // Resetowanie zmiennych gry
    moveCount = 0;
    moves = [];
    isFirstDraw = true;
    for (let limb in lastDraws) {
        lastDraws[limb] = null;
    }

    // Czyszczenie wyników na stronie
    currentDraw.innerHTML = '';
    moveHistory.innerHTML = '';
    totalMoves.textContent = '';

    // Wznawianie przycisków
    drawButton.disabled = false;
    endButton.disabled = false;

    alert("Gra została zresetowana. Możesz rozpocząć nową grę.");
}

// Funkcja całkowicie resetująca aplikację (w tym kolory)
function resetAll() {
    if (!confirm("Czy na pewno chcesz zresetować aplikację? Stracisz wszystkie dodane kolory.")) {
        return;
    }

 // Usuwanie wszystkich danych z localStorage
    localStorage.clear();

    // Odświeżenie strony
    location.reload();

    // Resetowanie zmiennych gry
    moveCount = 0;
    moves = [];
    colors = [];
    isFirstDraw = true;
    for (let limb in lastDraws) {
        lastDraws[limb] = null;
    }

    // Czyszczenie listy kolorów na stronie
    colorList.innerHTML = '';

    // Ukrywanie i pokazywanie odpowiednich sekcji
    gameControls.classList.add('hidden');
    resultsSection.classList.add('hidden');
    startGameSection.classList.add('hidden');

    // Resetowanie wyników na stronie
    currentDraw.innerHTML = '';
    moveHistory.innerHTML = '';
    totalMoves.textContent = '';

    alert("Aplikacja została całkowicie zresetowana.");
}

// Obsługa dodawania kolorów
colorForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const color = colorInput.value.trim().toLowerCase();

    if (colors.length >= 12) {
        alert("Osiągnięto maksymalną liczbę 12 kolorów.");
        return;
    }

    if (color && !colors.includes(color)) {
        colors.push(color);
        const li = document.createElement('li');
        li.textContent = capitalizeFirstLetter(color);
        colorList.appendChild(li);
        colorInput.value = '';

        // Sprawdzenie liczby kolorów i wyświetlenie sekcji startu gry
        if (colors.length >= 2 && colors.length <= 12) {
            startGameSection.classList.remove('hidden');
        } else {
            startGameSection.classList.add('hidden');
        }
    } else if (!color) {
        alert("Proszę wprowadzić kolor.");
    } else {
        alert("Proszę wprowadzić unikalny kolor.");
    }
});

// Obsługa startowania gry
startButton.addEventListener('click', function() {
    if (colors.length < 2 || colors.length > 12) {
        alert("Proszę dodać od 2 do 12 kolorów.");
        return;
    }
    gameControls.classList.remove('hidden');
    resultsSection.classList.remove('hidden');
    startGameSection.classList.add('hidden');
});

// Obsługa losowania
drawButton.addEventListener('click', function() {
    const result = draw();
    if (result) {
        // Przewinięcie sekcji "Kontrolki Gry" na górę ekranu
        gameControls.scrollIntoView({ behavior: 'smooth' });
    }
});

// Obsługa kończenia gry
endButton.addEventListener('click', function() {
    const finalMoves = endGame();
    totalMoves.textContent = finalMoves;
    drawButton.disabled = true;
    endButton.disabled = true;
    alert(`Gra zakończona! Wykonałeś ${finalMoves} ruchów.`);

    // Przewinięcie do sekcji "Łączna liczba ruchów"
    totalMoves.scrollIntoView({ behavior: 'smooth' });
});

// Obsługa przycisku "Graj od nowa"
playAgainButton.addEventListener('click', function() {
    resetGame();
});

// Obsługa przycisku "Reset"
resetButton.addEventListener('click', function() {
    resetAll();
});
