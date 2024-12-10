'use strict';

const translateButton = document.getElementById('translate');
const input = document.getElementById('input');
const hint = document.getElementById('hint-output');
const history = document.getElementById('history');
const clearHistoryButton = document.getElementById('clear-history');
const improveCheckbox = document.getElementById('improve');

input.onkeydown = async (e) => {
    // Key code for '\n'
    if (e.keyCode == 13) {
        e.preventDefault();
        await translateButton.onclick()
    }
}

function appendHistory(en, fi, ts) {
    const div = document.createElement('div');
    div.classList.add("history-entry");

    const timestamp = ts;

    div.innerHTML = `
        <p class="history-query">
            🧑<br>${en}
        <p>
        <p class="history-response">
            <span>🤖<br>${fi}</span><br>
            <span class="history-addendum">
                ${timestamp}
                (<a class="copy">copy</a>)
            </span>
        </p>
    `

    const copy = div.getElementsByClassName('copy')[0];
    copy.onclick = async () => {
        await navigator.clipboard.writeText(fi);
    }

    history.appendChild(div);
}

function getHistory() {
    return JSON.parse(localStorage.getItem('history') || "[]");
}

function updateHistory(en, fi, ts) {
    const history = getHistory();
    history.push({ en, fi, ts });
    localStorage.setItem('history', JSON.stringify(history));
    appendHistory(en, fi, ts)
    input.scrollIntoView({
        'behavior': 'smooth',
        'block': 'start',
    });
}

function refreshHistory() {
    history.innerHTML = "";
    for (const { en, fi, ts } of getHistory()) {
        appendHistory(en, fi, ts);
    }
}

refreshHistory();

async function translate(text, improve) {
    const body = JSON.stringify({ text, improve: !!improve });
    const method = "POST";

    const response = await fetch("/translate", {
        body, method,
    });
    const json = await response.json();

    return json.translated;
}

translateButton.onclick = async () => {
    const text = input.value.trim();
    if (!text)
        return;

    hint.classList.remove("hidden");
    hint.textContent = "Thinking...";

    input.value = "";
    
    const improve = improveCheckbox.checked
    const translated = await translate(text, improve);
    hint.classList.add("hidden");
    hint.textContent = "";

    const ts = new Date().toUTCString();
    updateHistory(text, translated, ts);
}

clearHistoryButton.onclick = () => {
    localStorage.clear();
    refreshHistory();
}