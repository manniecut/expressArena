const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello Express!');
})

app.get('/test', (req, res) => {
    res.send('Hellolol!');
})

app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end();
})

app.get('/sum', (req, res) => {
    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);

    if (!a) {
        return res.status(400).send('Please provide a a');
    }

    if (!b) {
        return res.status(400).send('Please provide a b');
    }

    const c = (a + b)

    const message = `Greetings, the sum of ${a} and ${b} is ${c}`;

    res.send(message);
})

app.get('/cipher', (req, res) => {
    const text = req.query.text;
    const shift = req.query.shift;

    if (!text) {
        return res.status(400).send('Please provide a text');
    }

    if (!shift) {
        return res.status(400).send('Please provide a shift');
    }

    const numShift = parseFloat(shift)

    const base = 'A'.charCodeAt(0);

    const cipher = text
        .toUpperCase()
        .split('')
        .map(char => {
            const code = char.charCodeAt(0);

            if (code < base || code > (base + 26)) {
                return char;
            }
            let diff = code - base;
            diff = diff + numShift;

            diff = diff % 26;

            const shiftedChar = String.fromCharCode(base + diff);
            return shiftedChar;
        })
        .join('');

    res
        .status(200)
        .send(cipher);
});

app.get('/lotto', (req, res) => {
    const { numbers } = req.query;

    if (!numbers) {
        return res.status(400).send('Please select your numbers');
    }
    if (!Array.isArray(numbers)) {
        return res
            .status(400)
            .send("numbers must be array");
    }

    const guesses = numbers
        .map(n => parseInt(n))
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

    if (guesses.length != 6) {
        return res
            .status(400)
            .send("numbers must contain 6 integers between 1 and 20");
    }

    const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

    const winningNumbers = [];
    for (let i = 0; i < 6; i++) {
        const ran = Math.floor(Math.random() * stockNumbers.length);
        winningNumbers.push(stockNumbers[ran]);
        stockNumbers.splice(ran, 1);
    }

    let diff = winningNumbers.filter(n => !guesses.includes(n));

    let responseText;

    switch (diff.length) {
        case 0:
            responseText = 'Wow! You win!';
            break;
        case 1:
            responseText = 'Congrats! $100!'
            break;
        case 2:
            responseText = 'Congrats! Free ticket!'
            break;
        default:
            responseText = 'Try again!'

    }
})

app.get('/greetings', (req, res) => {
    const name = req.query.name;
    const race = req.query.race;

    if (!name) {
        return res.status(400).send('Please provide a name');
    }

    if (!race) {
        return res.status(400).send('Please provide a race');
    }

    const greeting = `Greetings ${name} the ${race}, welcome to our kingdom`;

    res.send(greeting);
})

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
    Base Urrrl: ${req.baseUrl}
    Host with the Most: ${req.hostname}
    Path to victory: ${req.path}
    `;
    res.send(responseText);
})

app.get('/pizza/pepperoni', (req, res) => {
    res.send('Pizza is on the way!');
})

app.listen(8000, () => {
    console.log('Express server is listenin on port 8000!')
});