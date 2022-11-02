const fs = require('fs');
const path = require('path');

fs.writeFile(
    path.join(__dirname, 'usertext.txt'),
    '',
    (err) => {
        if (err) throw err;
        console.log('Hello, please, enter your text');
    }
);
const process = require('process');
const { stdin } = process;
const output = fs.createWriteStream(path.join(__dirname, 'usertext.txt'));

stdin.setEncoding('utf8');

stdin.on('data', (data) => {
    if (data.trim() === 'exit') {
        process.exit();
    }

    output.write(data);
    console.log('You add something important, please, continue');
});

process.on('exit', () => console.log('Have a nice day'));



