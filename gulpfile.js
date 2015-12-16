var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  concat = require('gulp-concat'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  scsslint = require('gulp-scss-lint'),
  batch = require('gulp-batch');

// 定義路徑
var paths = {
  'source': './source/',
  'bower' : './bower_components/',
  'css': './source/stylesheets/',
  'img': './source/images/',
  'public': './public/'
}

// 編譯 Sass
gulp.task('sass', function() {
  return gulp.src([paths.css + '**/**.scss'])
  .pipe(plumber())
  .pipe(sass({outputStyle: 'nested'})
  .on('error', sass.logError))
    .pipe(gulp.dest(paths.public + './stylesheets'))
});

// sass lint
gulp.task('scss-lint', function() {
  return gulp.src([paths.css + '**/**.scss'])
    .pipe(plumber())
    .pipe(scsslint({
      'config': './lint.yml',
      'maxBuffer': 307200,
      'filePipeOutput': 'scssReport.json'
    }))
    .pipe(gulp.dest('./reports'));
});

gulp.task('html', function() {
  return gulp.src(paths.source + '**/**.html')
    .pipe(plumber())
    .pipe(gulp.dest('./public/'));
});

gulp.task('webserver', function() {
  gulp.src('./public')
    .pipe(webserver({
      livereload: true,
      open: true,
      host: '0.0.0.0',
      port: 10000,
    }));
});

gulp.task('watch', function () {
  watch([paths.css + '**/**.scss'], batch(function (events, done) {
    gulp.start(['sass', 'scss-lint'], done);
  }));
  watch(paths.source + '**/**.html', batch(function (events, done) {
    gulp.start('html', done);
  }));
});

gulp.task('default', ['watch', 'sass', 'html', 'webserver']);


