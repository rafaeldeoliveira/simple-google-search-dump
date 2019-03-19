const GoogleSearch = require("google-searcher");
const path = require('path');
const args = require('yargs').argv;
const fs = require('fs');
const http = require('http');
const https = require('https');

var sanitize = require("sanitize-filename");

const dumpFolder = path.resolve(__dirname, './dump');
const query = args.query;

if(!fs.existsSync(dumpFolder)) {
    fs.mkdirSync(dumpFolder);
}

new GoogleSearch()
    .host("www.google.com")
    .lang("en")
    .query(query)
    .exec()
    .then(results => {
        console.log(`[INFO] ${results.length} results found.`);
        results.forEach(url => {
            console.log(`downloading ${url}`)
            const request = (url.startsWith('https') ? https : http).get(url, function (response) {
                response.pipe(fs.createWriteStream(path.resolve(dumpFolder, sanitize(url))));
                console.log(`downloaded ${url}`)
            });
        })
    });
