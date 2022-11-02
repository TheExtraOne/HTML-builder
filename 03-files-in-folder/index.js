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
                    console.log(`Stats object for: ${item.name}`);
                    console.log(stats.size);
                }
            });
        }

        let result = [];
        filteredFiles.forEach(item => {
            result.push( { file: `${item.name.slice(0,item.name.indexOf('.'))} - ${path.extname(item.name)}` } );
        });
        console.log(result);
    })
    // If promise is rejected
    .catch(err => {
        console.log(err)
    })