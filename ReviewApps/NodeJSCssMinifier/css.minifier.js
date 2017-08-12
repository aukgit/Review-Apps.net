console.log('Running.');
var fs = require('fs');

var querystring = require('querystring');
var http = require('http');
var https = require('https');
var request = require('request');

var cssFileRead = '../Content/Published.Styles/Styles.css';
var cssFileWrite = '../Content/Published.Styles/Styles.min.css';


fs.readFile(cssFileRead, 'utf8', function (err, css) {
    if (err) {
        console.log("Error encounter");
        return console.log(err);
    }

    var query = querystring.stringify({
        input: css
    });
    //console.log(data); 00



    var req = https.request(
        {
            method: 'POST',
            hostname: 'cssminifier.com',
            path: '/raw',
           
        },
        function (resp) {
            // if the statusCode isn't what we expect, get out of here
            if (resp.statusCode !== 200) {
                console.log('StatusCode=' + resp.statusCode);
                
            }
            var cssMinified = [];
            resp.on('data', function (cssMinifiedParts) {
                //  console.log('BODY: ' + cssMinified);
                cssMinified.push(cssMinifiedParts);
                
            });

            resp.on('end', function () {
                cssMinified = cssMinified.join("");
                console.log('BODY: ' + cssMinified);
                fs.writeFile(cssFileWrite, cssMinified, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The file was saved! [" + cssFileWrite + "]");
                });

            });


       
         
            //resp.pipe(process.stdout);
        }
    );
    req.on('error', function (err) {
        throw err;
    });
    req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.setHeader('Content-Length', query.length);
    req.end(query, 'utf8');

});
