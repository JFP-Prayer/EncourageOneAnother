let texts = [];
let currentIndex = 0;
let sheetId = ‘1qHBiDkLif6EKwF533d3w5Jto-3li7LDxhh6i1Ysm3X’;
let apiKey = ‘AIzaSyDsxNQ-6s0l7Z6pEo1LAnrh16UagHmA_v8’;
let clientId = '561693598210-halt2klftn9o0tem3fmmroqgldu5vajc.apps.googleusercontent.com';

function initClient() {
    gapi.client.init({
        apiKey: apiKey,
        clientId: clientId,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
        scope: "https://www.googleapis.com/auth/spreadsheets"
    }).then(loadTexts);
}

function loadTexts() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Sheet1!A:A',
    }).then(response => {
        texts = response.result.values;
        shuffleArray(texts);
        displayText();
    });
}

function displayText() {
    document.getElementById('text-display').innerText = texts[currentIndex];
}

function prevText() {
    if (currentIndex > 0) {
        currentIndex--;
        displayText();
    }
}

function nextText() {
    if (currentIndex < texts.length - 1) {
        currentIndex++;
        displayText();
    }
}

function copyText() {
    navigator.clipboard.writeText(texts[currentIndex]);
}

function sendEmail() {
    let mailto = `mailto:?body=${encodeURIComponent(texts[currentIndex])}`;
    window.location.href = mailto;
}

function submitText() {
    let userText = document.getElementById('userText').value;
    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Sheet2!A:A',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [[userText]]
        }
    }).then(() => {
        document.getElementById('userText').value = '';
        alert('Text submitted successfully!');
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

gapi.load('client:auth2', initClient);

