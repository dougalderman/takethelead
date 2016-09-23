/* -----------------------------------------------------------------------------
|
| GULP BUILD SCRIPT
|
| TASKS:
| - gulp watch - starts the browser sync server
| - gulp lint - runs jslint
| - gulp csslink - runs csslint
| - gulp build - compiles a build for prod
|
| TODO: Removed Template Cache - rewrite view, remove concat for dev watch
|
----------------------------------------------------------------------------- */

'use strict';

//---------------------------
// LIBRARY INCLUDES
//---------------------------
var gulp            = require('gulp');
var open            = require('gulp-open');
var livereload      = require('gulp-livereload');
var runSequence     = require('run-sequence');
var changed         = require('gulp-changed');
var concat          = require('gulp-concat');
var clean           = require('gulp-clean');
var sourcemaps      = require('gulp-sourcemaps');
var sass            = require('gulp-sass');
var sassLint        = require('gulp-sass-lint');
var nodemon         = require('gulp-nodemon');
var uglify          = require('gulp-uglify');
var cleanCSS        = require('gulp-clean-css');
var jshint          = require('gulp-jshint');
var jshintStyle     = require('jshint-stylish');
var inject          = require('gulp-inject');

//---------------------------
//CONFIG VARIABLES

var config = {
  bower_components: [
    'app/bower_components/angular-waypoints/dist/angular-waypoints.min.js'
  ],
  html: ['./app/index.html', './app/**/*.html'],
  js: ['app/js/**/*.js', 'app/js/*.js'],
  bower: ['app/bower_components/**/*'],
  img: ['app/images/*.*', 'app/images/**/*.*'],
  css: ['app/css/*.css'],
  sass: ['app/sass/*.scss'],
  sassPartials: ['app/sass/_*.scss'],
};

//---------------------------
// DEV TASKS
//---------------------------

gulp
  .task('start-server', function () {
    livereload.listen();
    return nodemon({
      script: 'server/index.js',
      watch: 'server',
      env: { 'NODE_ENV': 'development' }
    })
  .on('restart', function() {
    console.log('restarting server');
  });
});

gulp.task('reload-browser', function () {
  return gulp .src('./app/index.html')
              .pipe(livereload());
});

gulp.task('clean-dev-css', function(done) {
    return gulp .src('app/css', {read: false})
                .pipe(clean());
});

gulp.task('js-dev', ['jshint']);

gulp.task('inject-dev-index', function() {

  var cssSources = gulp.src(config.css, {read: false});
  var jsSources = gulp.src(config.js, {read: false});


  return gulp .src('app/index.html')
              .pipe(inject(cssSources, {ignorePath: 'app'}))
              .pipe(inject(jsSources, {ignorePath: 'app'}))
              .pipe(gulp.dest('app'));
});

//---------------------------
// SCRIPT TASKS
//---------------------------


gulp.task('jshint', function (done) {
  return gulp .src(config.js)
              .pipe(jshint())
              .pipe(jshint.reporter('jshint-stylish'));
});

//---------------------------
// STYLE TASKS
//---------------------------

gulp.task('sass-dev', ['sasslint', 'clean-dev-css'], function (done) {
  return gulp .src(config.sass)
              .pipe(sass.sync().on('error', sass.logError))
              .pipe(gulp.dest('app/css'));
});

gulp.task('sasslint', function() {
  var options = {
    configFile: '.sass-lint.yml'
  }

  return gulp .src(config.sass.concat(config.sassPartials))
              .pipe(sassLint())
              .pipe(sassLint.format())
              .pipe(sassLint.failOnError());
              //.pipe(scsslint({ customReport: scssLintStyle }));
});

//---------------------------
// DIST TASKS
//---------------------------

gulp.task('clean-dist', function () {
  return gulp
        .src('dist', {read: false})
        .pipe(clean());
});

gulp.task('minify-js', function () {
  return gulp
    .src(config.js)
    .pipe(concat('takethelead.min.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify({mangle: false}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('minify-css', function () {
  return gulp.src(config.sass)
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(concat('takethelead.min.css'))
      .pipe(sourcemaps.init())
        .pipe(cleanCSS())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist/css'));
});

gulp.task('copy-bower', function() {
  return gulp .src(config.bower)
              .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('copy-index', function() {
  return gulp .src(['index.html'])
              .pipe(gulp.dest('dist'));
});

gulp.task('copy-img', function() {
  return gulp .src(config.img)
              .pipe(gulp.dest('dist/images'));
});

gulp.task('inject-dist-index', function() {

  var min = gulp.src(['./dist/js/takethelead.min.js', './dist/css/takethelead.min.css'], {read: false});

  return gulp .src('app/index.html')
              .pipe(inject(min, {ignorePath: 'dist'}))
              .pipe(gulp.dest('dist'));
});

gulp.task('copy-assets', ['copy-index', 'copy-bower', 'copy-img']);

gulp.task('js-dist', ['jshint', 'minify-js']);

gulp.task('css-dist', ['sasslint', 'minify-css']);


//---------------------------
// WATCHERS
//---------------------------

gulp.task('watch', ['watch-dev-html', 'watch-dev-js', 'watch-dev-sass']);

gulp.task('watch-dev-html', function(done) {
  return gulp.watch(config.html, ['reload-browser']);
});

gulp.task('watch-dev-js', function(done) {
  return gulp.watch(config.js, ['reload-browser']);
});

gulp.task('watch-dev-sass', function(done) {
  return gulp.watch(config.sass.concat(config.sassPartials), ['sass-after-watch']);
});

gulp.task('sass-after-watch', function(done) {
  runSequence('sass-dev', 'reload-browser', done);
});

//---------------------------
// BUILD TASKS
//---------------------------

gulp.task('default', function(done) {
  runSequence('js-dev', 'sass-dev', 'inject-dev-index', ['watch', 'start-server'], done);
});

gulp.task('dist', function(done) {
  runSequence('clean-dist', 'js-dist', 'css-dist', 'copy-assets', 'inject-dist-index', done);
});
