var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  concat = require('gulp-concat'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  scsslint = require('gulp-scss-lint'),
  // post css
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  csswring = require('csswring');

// Paths
var paths = {
  'source': './source/',
  'bower' : './bower_components/',
  'sass': './source/stylesheets/',
  'img': './source/images/',
  'public': './public/'
}

// Sass
gulp.task('sass', function() {
  watch([paths.sass + '**/**.scss'], function(){
    gulp.src([paths.sass + '**/**.scss'])
      .pipe(plumber())
      .pipe(sass({outputStyle: 'nested'})
      .on('error', sass.logError))
        .pipe(gulp.dest(paths.public + './stylesheets'))
  });

});

// sass lint
gulp.task('scss-lint', function() {
  watch([paths.sass + '**/**.scss'], function(){
    gulp.src(paths.sass + '**/**.scss')
      .pipe(plumber())
      .pipe(scsslint({
        'config': './lint.yml',
        'maxBuffer': 3072000,
        'filePipeOutput': 'scssReport.json'
      }))
      .pipe(gulp.dest('./reports'));
  });
});

// postCSS
gulp.task('css', function () {
  var processors = [
    autoprefixer({browsers: ['last 1 version']})
  ];
  watch(paths.public + 'stylesheets/**/**.css', function(){
    gulp.src(paths.public + 'stylesheets/**/**.css')
      .pipe(postcss(processors))
      .pipe(gulp.dest(paths.public + './css'));
  });
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
      open: false,
      host: '0.0.0.0',
      port: 10000,
    }));
});

gulp.task('default', ['scss-lint', 'sass', 'css', 'html', 'webserver']);



