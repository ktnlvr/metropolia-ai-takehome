'use strict';

const translateButton = document.getElementById('translate');
const input = document.getElementById('input');
const hint = document.getElementById('hint-output');
const history = document.getElementById('history');
const clearHistoryButton = document.getElementById('clear-history');

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
    return div;
}

function getHistory() {
    return JSON.parse(localStorage.getItem('history') || "[]");
}

function updateHistory(en, fi, ts) {
    const history = getHistory();
    history.push({ en, fi, ts });
    localStorage.setItem('history', JSON.stringify(history));
    const latest = appendHistory(en, fi, ts)
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

async function translate(text) {
    const response = await fetch("/translate", {
        body: text.toString(), method: "POST",
    });
    const translated = await response.text();

    return translated;
}

translateButton.onclick = async () => {
    const text = input.value.trim();
    if (!text)
        return;

    hint.classList.remove("hidden");
    hint.textContent = "Thinking...";

    const translated = await translate(text);
    hint.classList.add("hidden");
    hint.textContent = "";

    const ts = new Date().toUTCString();
    updateHistory(text, translated, ts);
}

clearHistoryButton.onclick = () => {
    localStorage.clear();
    refreshHistory();
}