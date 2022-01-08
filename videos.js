const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

function command(path) {
    const name = Date.now();
    fs.mkdirSync('./public/assets/segments/' + name);
    const hls_segment_filename = '-hls_segment_filename ./public/assets/segments/' + name + '/file%03d.ts';
    const out_file = './public/assets/segments/'+name+'/index.m3u8';
    ffmpeg(path, { timeout: 432000 })
        .addOption([
            '-profile:v baseline',
            '-f segment',
            '-level 3.0',
            '-start_number 0',
            hls_segment_filename,
            '-hls_time 6',
            '-hls_list_size 0',
            '-f hls',
        ])
        .output(out_file)
        .setStartTime(50).setDuration(30)
        .on('end', (stdout, stderr) => {
            console.log('Transcoding succeeded !');
        })
        .on('start', (commandLine) => {
            console.log('start', commandLine);
        })
        .on('codecData', (data) => {
            console.log('Input is ' + data.audio + ' audio ' +
                'with ' + data.video + ' video');
        })
        .on('progress', function (progress) {
            console.log('Processing. Timemark: -> ' + progress.timemark)
        })
        .on('stderr', function (stderrLine) {
            // do nothing
        })
        .on('error', function (err, stdout, stderr) {
            console.log('Cannot process video: ' + err.message);
        })
        .on('data', function (chunk) {
            console.log('ffmpeg just wrote ' + chunk.length + ' bytes');
        }).run();
}


module.exports = command;