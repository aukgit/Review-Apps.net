var fs = require('fs');

var folderNames = {
    source: {
        css: "../ReviewApps/Content/source-css",
        less: "../Content/source-css/less",
        js: "../Content/source-js/",
    },
    publish: {
        css: "../dist/css/",
        js: "../dist/js/"

    }
}

function getDirectories(fs, path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path+'/'+file).isDirectory();
    });
}

function getFiles(fs, path, typeFiler) {
    return fs.readdirSync(path).filter(function (file) {
        return !fs.statSync(path+'/'+file).isDirectory();
    });
}

var folders = getFiles(fs, folderNames.source.css);

console.log(folders.length);
console.log(folders);
