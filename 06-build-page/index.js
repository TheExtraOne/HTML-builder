const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;


fsPromises.mkdir( path.join(__dirname, 'project-dist'), {recursive: true} )
    .then(function () {
        console.log('Сreated directory');
        let data = '';
        const stream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            let compNamesArr = data.match(/{{\D+?}}/g);
            let compNamesArrShort = compNamesArr.map(item => {
                return item.slice(2, item.length -2)
            });
            //console.log(compNamesArrShort);

            fsPromises.readdir(path.join(__dirname, 'components'))
                .then(filenames => {
                    for (let file of filenames) {
                        let fileName = file.slice(0, file.indexOf('.'));
                        if (compNamesArrShort.includes(fileName)) {
                            const newstream = fs.createReadStream(path.join(__dirname, 'components', file), 'utf-8');
                            let tags = '';
                            newstream.on('data', chunk => tags += chunk);
                            newstream.on('end', () => {
                                let index = compNamesArrShort.indexOf(fileName);
                                data = data.replace(compNamesArr[index],tags);
                                console.log(data);
                                fs.writeFile(
                                    path.join(__dirname, 'project-dist', 'index.html'),
                                    data,
                                    (err) => {
                                        if (err) throw err;
                                        //console.log('Файл был создан');
                                    }
                                );
                            })
                            newstream.on('error', error => console.log('Error', error.message));
                        }
                    }
                })
        });
        stream.on('error', error => console.log('Error', error.message));
    })
    .catch(function() {
        console.log('failed to create directory');
    });

fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true})

    // If promise resolved and
    // data are fetched
    .then(filenames => {
        let filteredFiles = filenames.filter(filename => filename.isFile());

        fs.access(path.join(__dirname, 'project-dist', 'style.css'), fs.F_OK, (err) => {
            if (err) {
                //console.error(err)
                return;
            }

            fs.unlink(path.join(__dirname, 'project-dist', 'style.css'), err => {
                if(err) throw err; // не удалось удалить файл
            })
        });

        fs.writeFile(
            path.join(__dirname, 'project-dist', 'style.css'),
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
                        path.join(__dirname, 'project-dist', 'style.css'),
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

fsPromises.mkdir( path.join(__dirname, 'project-dist', 'assets'), {recursive: true} )
.then(recCopy('assets', 'project-dist'))
    /*.then(function() {
        fs.promises.readdir(path.join(__dirname, 'project-dist', 'assets'))
        .then(filenames => {
            for (let file of filenames) {
                fs.unlink(path.join(__dirname, 'project-dist', 'assets', file), err => {
                    if(err) throw err; // не удалось удалить файл
                });
            }
        })*/
    
        /*fs.promises.readdir(path.join(__dirname, 'assets'), {withFileTypes: true})
    
        // If promise resolved and
        // data are fetched
        .then(filenames => {
            for (let file of filenames) {
                if (file.isFile()) {
                    fs.writeFile(
                        path.join(__dirname, 'project-dist', 'assets', file),
                        '',
                        (err) => {
                            if (err) throw err;
                        }
                    );
        
                    fs.copyFile(path.join(__dirname, 'assets',file), path.join(__dirname, 'project-dist', 'assets', file), (err) => {
                        if (err) {
                            console.log("Error Found:", err);
                        }
                        else {
                            console.log('Copied successfully');
                        }
                    });
                } else {
                    fs.promises.readdir(path.join(__dirname, 'assets', file.name), {withFileTypes: true})
                            .then(filenames => {
                                console.log(filenames);
                            })
                }
            }
        })
        // If promise is rejected
        .catch(err => {
            console.log(err)
        })
        
    }).catch(function() {
        console.log('failed to create directory');
    });*/

    function recCopy (from, dest) {
        fs.promises.readdir(path.join(__dirname, from), {withFileTypes: true})
        
        // If promise resolved and
        // data are fetched
        .then(filenames => {
            for (let file of filenames) {
                if (file.isFile()) {
                    fs.writeFile(
                        path.join(__dirname, dest, from, file),
                        '',
                        (err) => {
                            if (err) throw err;
                        }
                    );
        
                    fs.copyFile(path.join(__dirname, from,file), path.join(__dirname, dest, from, file, file), (err) => {
                        if (err) {
                            console.log("Error Found:", err);
                        }
                        else {
                            console.log('Copied successfully');
                        }
                    });
                } else {
                    fsPromises.mkdir( path.join(__dirname, dest, from, file.name), {recursive: true} )
                        .then(function() {
                            fs.promises.readdir(path.join(__dirname, from, file.name), {withFileTypes: true})
        
                            // If promise resolved and
                            // data are fetched
                            .then(filenames => {
                                for (let item of filenames) {
                                        fs.writeFile(
                                            path.join(__dirname, dest, from, file.name,item.name),
                                            '',
                                            (err) => {
                                                if (err) throw err;
                                            }
                                        );
                            
                                        fs.copyFile(path.join(__dirname, from,file.name,item.name), path.join(__dirname, dest, from, file.name,item.name), (err) => {
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
                        })
                }
            }
        })
        // If promise is rejected
        .catch(err => {
            console.log(err)
        })
    }