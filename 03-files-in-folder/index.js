const fs = require('fs');
const path = require('path');

fs.promises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true})

    // If promise resolved and
    // data are fetched
    .then(filenames => {
        for (let filename of filenames) {
            console.log(filename)
        }
    })

    // If promise is rejected
    .catch(err => {
        console.log(err)
    })