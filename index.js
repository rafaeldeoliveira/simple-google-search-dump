var scraper = require('google-search-scraper');
const path = require('path');
const args = require('yargs').argv;
const fs = require('fs');
const http = require('http');
const https = require('https');
const download = require('download-file')
const sanitize = require("sanitize-filename");

const dumpFolder = path.resolve(__dirname, './dump');
const query = args.query;
const age = args.age || '1m';
const limit = args.limit || 50;
if (fs.existsSync(dumpFolder)) {
    deleteFolderRecursive(dumpFolder);
}

fs.mkdirSync(dumpFolder);

var options = {
    query,
    age,
    limit
};

let i = 0;

scraper.search(options, function (err, url, meta) {
    let id = ++i;
    console.log(`downloading ${url}`)
    try {
        download(url, { timeout: 5000, directory: dumpFolder, filename: sanitize(url) }, function (err) {
            if (err === true) {
                console.log(`[${id}] error downloading ${url}`);
            } else if (err === false) {
                console.log(`[${id}] downloaded ${url}`)
            } else {
                // code 302
            }
        });
    } catch (e) {
        //ignore
    }
})



function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};