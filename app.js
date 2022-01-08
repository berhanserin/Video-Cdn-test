const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const hls = require('hls-server');
const videos=require('./videos');
const video_path = 'public/videoTest1.mp4';
const app = express();

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'View'));

app.use(express.static(path.join('public')));

app.get('/video', (req, res) => {
    res.render("main");
});

app.get('/video-start', (req, res) => {
    return res.status(200).sendFile(`${__dirname}/test.html`);
});

app.post('/file', (req, res) => {
    videos(req.files.file.tempFilePath);
});


const server = app.listen(5000, () => { console.log('Server Dinler'); });

new hls(server, {
    provider: {
        exists: (req, cb) => {
            const ext = req.url.split('.').pop();

            if (ext !== 'm3u8' && ext !== 'ts') {
                return cb(null, true);
            }

            fs.access(__dirname + req.url, fs.constants.F_OK, function (err) {
                if (err) {
                    console.log(err);
                    console.log('File not exist');
                    return cb(null, false);
                }
                cb(null, true);
            });
        },
        getManifestStream: (req, cb) => {
            const stream = fs.createReadStream(__dirname + req.url);
            cb(null, stream);
        },
        getSegmentStream: (req, cb) => {
            const stream = fs.createReadStream(__dirname + req.url);
            cb(null, stream);
        }
    }
});