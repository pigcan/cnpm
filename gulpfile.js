const gulp = require('gulp');
const zip = require('gulp-zip');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');
const rename = require('gulp-rename');

const rm = require('rimraf').sync;

const exec = require('child_process').exec;
const join = require('path').join;

const pkg = require('./package.json');
const releaseNote = `${pkg.name}-v${pkg.version}`;

gulp.task('pkg', (cb) => {
  const cwd = process.cwd();
  rm(join(cwd, 'release'));
  rm(join(cwd, 'cnpm-linux'));
  rm(join(cwd, 'cnpm-macos'));
  rm(join(cwd, 'cnpm-win.exe'));
  exec('pkg ./', function(err) {
    if (err) return cb && cb(err);
    cb && cb();
  });
});

gulp.task('mac', ['pkg'], function() {
  gulp.src('cnpm-macos')
    .pipe(rename('cnpm'))
    .pipe(tar(`${releaseNote}-darwin-x64.tar`))
    .pipe(gzip())
    .pipe(gulp.dest('release'))
});

gulp.task('win', ['pkg'], function() {
  const name = `${releaseNote}-win-x64.zip`;
  gulp.src('cnpm-win.exe')
    .pipe(rename('cnpm.exe'))
    .pipe(zip(`${releaseNote}-win-x64.zip`))
    .pipe(gulp.dest('release'))
});

gulp.task('default', ['mac', 'win']);