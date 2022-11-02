const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

fsPromises.mkdir( path.join(__dirname, 'files-copy'), {recursive: true} )
.then(function() {
    fs.promises.readdir(path.join(__dirname, 'files-copy'))
    .then(filenames => {
        for (let file of filenames) {
            fs.unlink(path.join(__dirname, 'files-copy', file), err => {
                if(err) throw err; // не удалось удалить файл
            });
        }
    })

    fs.promises.readdir(path.join(__dirname, 'files'))

    // If promise resolved and
    // data are fetched
    .then(filenames => {
        for (let file of filenames) {
            fs.writeFile(
                path.join(__dirname, 'files-copy', file),
                '',
                (err) => {
                    if (err) throw err;
                }
            );

            fs.copyFile(path.join(__dirname, 'files',file), path.join(__dirname, 'files-copy', file), (err) => {
                if (err) {
                    console.log("Error Found:", err);
                }
                else {
                    console.log('Copied successfully');
                }
            });
        }
    })
    // If promise is rejected
    .catch(err => {
        console.log(err)
    })
}).catch(function() {
    console.log('failed to create directory');
});
