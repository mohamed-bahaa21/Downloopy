const express = require("express");
const bodyParser = require("body-parser");
const Promise = require("bluebird");
// const request = require("request")
const request = Promise.promisifyAll(require("request"), {
    multiArgs: true
});
// const { response } = require("express");
var progress = require('progress-stream');
// var fs = require('fs');
const fs = Promise.promisifyAll(require("fs"));
PDFDocument = require('pdfkit');


// const htmlparser2 = require("htmlparser2");

// download all files
exports.downloadAll = (req, response, next) => {

    const folder_name = "Introduction to Data Oriented Design"
    // TODO:: if !== finish_num -> index++
    const start_num = 1;
    const finish_num = 77;
    const total_imgs_num = finish_num - start_num + 1;

    const uri_start = "https://image.slidesharecdn.com/introductiontodata-orienteddesignflat-101105120121-phpapp01/95/introduction-to-data-oriented-design-";
    const uri_end = "-728.jpg?cb=1288958560";

    // FOR LOOP STARTS
    for (let index = 0; index < total_imgs_num; index++) {
        const element = start_num + index;

        const uri = `${uri_start}${element}${uri_end}`;

        request.head(uri, function (err, res, body) {
            console.log("content-type:", res.headers["content-type"]);
            console.log("content-length:", res.headers["content-length"]);

            var f = fs.createWriteStream(`data/imgs/output/${folder_name}/IMG-${element}.jpg`);

            f.on("finish", function () {
                // do stuff
                console.log(`STREAM::WRITE::DONE__IMG::${element}`);
            });

            request(uri)
                .pipe(f)
                .on("finish", () => {
                    console.log(`PIPE::DONE__IMG::${element}`);
                });
        });
    }

    // FOR LOOP ENDS
    response.send('<h1>Download Finished</h1>')
};

// download one file
exports.downloadOne = (req, response, next) => {

    const img_num = 378;
    const uri = `https://archive.alsharekh.org/MagazinePages/Magazine_JPG/EL_Mawred/mogalad_12/Issue_4/${img_num}.JPG`;

    request.head(uri, function (err, res, body) {
        // console.log("content-type:", res.headers["content-type"]);
        // console.log("content-length:", res.headers["content-length"]);

        // downloaded image file
        var img_filename = `imgs/image-${img_num}.jpg`
        var img_file = fs.createWriteStream(img_filename)

        // watch stream stat sync 
        var stat = fs.statSync(res.body);
        // watch progress stream 
        var str = progress({
            length: stat.size,
            time: 100 /* ms */
        });
        // stream on progress
        str.on('progress', function (progress) {
            console.log(progress);
        });
        // stream request uri -> pipe -> stat -> write stream -> finish
        // fs.createReadStream(img_file)
        request(uri)
            .pipe(img_file)
            .pipe(str)
            .on("finish", () => {
                console.log(`PIPE::DONE__IMG::${img_num}`);
                response.send('<h1>Download Finished</h1>')
            });

        // var filename = fs.createWriteStream(`imgs/image-${img_num}.jpg`);
        // request(uri)
        //     .pipe(filename)
        //     .on("finish", () => {
        //         console.log(`PIPE::DONE__IMG::${img_num}`);
        //         response.send('<h1>Download Finished</h1>')
        //     });
    });

    // filename.on("finish", function () {
    //     // do stuff
    //     console.log(`STREAM::WRITE::DONE__IMG::${img_num}`);
    // });
}

// Add images to a PDF File
exports.pdfing = (response) => {
    doc = new PDFDocument

    //Pipe its output somewhere, like to a file or HTTP response 
    //See below for browser usage 
    doc.pipe(fs.createWriteStream('toPDF/result/output.pdf'))

    //Add an image, constrain it to a given size, and center it vertically and horizontally 
    pages_num = 60
    for (let index = 0; index < pages_num; index++) {
        doc.image(`./toPDF/image-${index}.jpg`, {
            fit: [500, 750],
            align: 'center',
            valign: 'center',
        });

        doc.addPage()
            .image(`./toPDF/image-${index}.jpg`, {
                size: 'A4',
                fit: [500, 750],
                align: 'center',
                valign: 'center',
            });
    }

    doc.end()
    response.send('<h1>PDFing Finished</h1>')
}


// landing
exports.getLanding = (req, res, next) => {
    res.render("index", {
        msgs: req.flash('success'),
    })
};