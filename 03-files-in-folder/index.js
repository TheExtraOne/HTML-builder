const fs = require('fs');
const path = require('path');


fs.promises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true})

    // If promise resolved and
    // data are fetched
    .then(filenames => {
        let filteredFiles = filenames.filter(filename => filename.isFile());

        for (let item of filteredFiles) {
            fs.stat(path.join(__dirname, 'secret-folder',item.name), (error, stats) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(`${item.name.slice(0,item.name.indexOf('.'))} - ${path.extname(item.name)} - ${stats.size}`);
                }
            });
        }
    })
    // If promise is rejected
    .catch(err => {
        console.log(err)
    })