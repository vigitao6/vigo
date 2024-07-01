// JavaScript to generate 3x3 tables and handle button click
function generateTable(tableId) {
    let table = document.getElementById(tableId);
    for (let i = 0; i < 3; i++) {
        let row = table.insertRow();
        for (let j = 0; j < 3; j++) {
            let cell = row.insertCell();
            let input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.max = '8';
            cell.appendChild(input);
        }
    }
}

function getState(tableId) {
    let table = document.getElementById(tableId);
    let state = [];
    for (let row of table.rows) {
        let rowData = [];
        for (let cell of row.cells) {
            let value = parseInt(cell.firstElementChild.value, 10);
            if (!isNaN(value)) {
                rowData.push(value);
            } else {
                rowData.push(0); // Default to 0 if input is not a number
            }
        }
        state.push(rowData);
    }
    return state;
}

function validateState(state) {
    const values = new Set();
    for (let row of state) {
        for (let value of row) {
            values.add(value);
        }
    }
    return values.size === 9 && [...values].every(val => val >= 0 && val <= 8);
}

function displayStep(step, index) {
    const container = document.createElement('div');
    container.classList.add('step-container');

    const table = document.createElement('table');
    table.classList.add('grid', 'mini-grid');

    for (let i = 0; i < 3; i++) {
        const row = table.insertRow();
        for (let j = 0; j < 3; j++) {
            const cell = row.insertCell();
            cell.textContent = step[i][j] === 0 ? '' : step[i][j];
            cell.classList.add('cell');
        }
    }

    const title = document.createElement('div');
    title.classList.add('step-title');
    title.textContent = `Step ${index + 1}`;
    container.appendChild(title);

    container.appendChild(table);
    document.getElementById('steps-container').appendChild(container);
}

function resetGame() {
    document.getElementById('initial-state').innerHTML = '';
    document.getElementById('end-state').innerHTML = '';
    document.getElementById('steps-container').innerHTML = '';
    document.getElementById('play-again').style.display = 'none';
    document.getElementById('start-solving').style.display = 'inline';
    document.getElementById('scroll-to-top').style.display = 'none';
    generateTable('initial-state');
    generateTable('end-state');
}

document.addEventListener('DOMContentLoaded', () => {
    generateTable('initial-state');
    generateTable('end-state');

    document.getElementById('start-solving').addEventListener('click', function() {
        let initialState = getState('initial-state');
        let endState = getState('end-state');

        console.log('Initial State:', initialState); // Debug log
        console.log('End State:', endState); // Debug log

        if (!validateState(initialState) || !validateState(endState)) {
            alert('Both initial and end states must contain all numbers from 0 to 8.');
            return;
        }

        fetch('/solve/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                initial: initialState,
                end: endState
            })
        })
        .then(response => response.json())
        .then(data => {
            const stepsContainer = document.getElementById('steps-container');
            stepsContainer.innerHTML = '';
            if (data.error) {
                stepsContainer.innerHTML = `Error: ${data.error}`;
            } else {
                data.steps.forEach((step, index) => {
                    displayStep(step, index);
                });
                document.getElementById('play-again').style.display = 'inline';
                document.getElementById('start-solving').style.display = 'none';
                document.getElementById('scroll-to-top').style.display = 'inline';
            }
        })
        .catch(error => {
            console.error('Error during fetch:', error);
            alert('An error occurred while solving the puzzle. Please try again.');
        });
    });

    document.getElementById('play-again').addEventListener('click', resetGame);

    document.getElementById('scroll-to-top').addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Function to get the CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
