const fs = require('fs');
const path = require('path');


fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true})

    // If promise resolved and
    // data are fetched
    .then(filenames => {
        let filteredFiles = filenames.filter(filename => filename.isFile());

        fs.access(path.join(__dirname, 'project-dist', 'bundle.css'), fs.F_OK, (err) => {
            if (err) {
                //console.error(err)
                return;
            }

            fs.unlink(path.join(__dirname, 'project-dist', 'bundle.css'), err => {
                if(err) throw err; // не удалось удалить файл
            })
        });

        fs.writeFile(
            path.join(__dirname, 'project-dist', 'bundle.css'),
            '',
            (err) => {
                if (err) throw err;
                console.log('Файл был создан');
            }
        );

        for (let item of filteredFiles) {
            if (path.extname(item.name) === '.css') {
                const stream = fs.createReadStream(path.join(__dirname,'styles', item.name), 'utf-8');
                stream.on('data', chunk => {
                    fs.appendFile(
                        path.join(__dirname, 'project-dist', 'bundle.css'),
                        chunk,
                        err => {
                            if (err) throw err;
                        }
                    );
                });
                stream.on('end', () => {console.log('ok');});
                stream.on('error', error => console.log('Error', error.message));
            }
        }
    })
    // If promise is rejected
    .catch(err => {
        console.log(err)
    })