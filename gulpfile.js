var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  concat = require('gulp-concat'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  scsslint = require('gulp-scss-lint'),
  svgSprite = require('gulp-svg-sprites'),
  filter = require('gulp-filter'),
  svg2png = require('gulp-svg2png'),
  // post css
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer');

// Paths
var paths = {
  'source': './source/',
  'bower' : './bower_components/',
  'sass': './source/stylesheets/',
  'img': './source/images/',
  'public': './public/',
  'tpls': './gulp-tpls/'
}

// Sass
gulp.task('sass', function() {
  gulp.src([paths.sass + '**/**.scss'])
    .pipe(plumber())
    .pipe(sass({outputStyle: 'nested'})
    .on('error', sass.logError))
      .pipe(gulp.dest(paths.public + './stylesheets'))
});

// sass lint
gulp.task('scss-lint', function() {
  gulp.src([paths.sass + '**/**.scss', '!' + paths.sass + '_sprite.scss'])
    .pipe(plumber())
    .pipe(scsslint({
      'config': './lint.yml',
      'maxBuffer': 3072000,
      'filePipeOutput': 'scssReport.json'
    }))
    .pipe(gulp.dest('./reports'));
});

watch([paths.sass + '**/*.scss'], function() {
  gulp.start('sass', 'scss-lint');
});


// SVG Sprite
gulp.task('svg-sprite', function() {
  gulp.src('./source/images/sprites/*.svg')
    .pipe(plumber())
    .pipe(svgSprite({
      svg: {
        sprite: "sprite.svg"
      },
      cssFile: '_sprite.css',
      selector: "icons-%f",
      templates: {
        css: require("fs").readFileSync(paths.tpls + 'svg-sprite.css', "utf-8")
      }
    }))
    .pipe(gulp.dest(paths.public))
    .pipe(filter("**/*.svg"))
    .pipe(svg2png())
    .pipe(gulp.dest(paths.public));
});
watch('./source/images/sprites/*.svg', function() {
  gulp.start('svg-sprite');
});
watch(paths.public + '_sprite.css', function(){
  gulp.src(paths.public + '_sprite.css')
    .pipe(concat('_sprite.scss'))
    .pipe(gulp.dest(paths.sass));
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
watch(paths.source + '**/**.html', function(){
  gulp.start('html');
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

gulp.task('default', ['svg-sprite', 'scss-lint', 'sass', 'css', 'html', 'webserver']);



