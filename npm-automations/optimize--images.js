const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
 
imagemin(['../Database Diagrams/*.{jpg,png}'], '../build/images', {
    plugins: [
        imageminJpegtran(),
        imageminPngquant({quality: '20-30'})
    ]
}).then(files => {
    console.log(files);
    //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …] 
});