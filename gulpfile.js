/* -----------------------------------------------------------------------------
|
| GULP BUILD SCRIPT
|
| TASKS:
| - DEV TASKS:
|    - start-server
|    - reload-browser
|    - clean-dev-css
|    - js-dev
|    - inject-dev-index
|
| - SCRIPT TASKS:
|    - jshint
|
| - STYLE TASKS:
|    - sass-dev
|    - sass-lint
|
| - DIST TASKS:
|    - clean-dist
|    - minify-js
|    - minify-css
|    - copy-bower
|    - copy-index
|    - copy-img
|    - inject-dist-index
|    - copy-assets
|    - js-dist
|    - css-dist
|
| - WATCHERS:
|    - watch
|    - watch-dev-html
|    - watch-dev-js
|    - watch-dev-sass
|    - sass-after-watch
|
| - BUILD TASKS:
|    - default
|    - dist
----------------------------------------------------------------------------- */

'use strict';

//---------------------------
// LIBRARY INCLUDES
//---------------------------
var gulp            = require('gulp');
var livereload      = require('gulp-livereload');
var concat          = require('gulp-concat');
var clean           = require('gulp-clean');
var sourcemaps      = require('gulp-sourcemaps');
var sass            = require('gulp-sass');
var sassLint        = require('gulp-sass-lint');
var nodemon         = require('gulp-nodemon');
var uglify          = require('gulp-uglify');
var cleanCSS        = require('gulp-clean-css');
var jshint          = require('gulp-jshint');
var inject          = require('gulp-inject');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');

//---------------------------
//CONFIG VARIABLES

var config = {
  bower_components: [
    'app/bower_components/angular-waypoints/dist/angular-waypoints.min.js'
  ],
  html: ['./app/index.html', './app/**/*.html'],
  js: ['app/js/**/*.js', 'app/js/*.js', ],
  backEndJs: ['server/*.js', 'server/**/*.js'],
  bower: ['app/bower_components/**/*'],
  img: ['app/images/*.*', 'app/images/**/*.*'],
  css: ['app/css/*.css'],
  sass: ['app/sass/*.scss'],
  sassPartials: ['app/sass/_*.scss'],
};

//---------------------------
// SCRIPT TASKS
//---------------------------


gulp.task('js-hint', function (done) {
  return gulp .src(config.js.concat(config.backEndJs))
              .pipe(jshint())
              .pipe(jshint.reporter('jshint-stylish'));
});


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
    return gulp .src(['app/css', 'app/tempcss'], {read: false, allowEmpty: true})
                .pipe(clean());
});

gulp.task('clean-temp-css', function(done) {
    return gulp .src('app/tempcss', {read: false, allowEmpty: true})
                .pipe(clean());
});


gulp.task('js-dev', gulp.series('js-hint'));

gulp.task('inject-dev-index', function() {

  var cssSources = gulp.src(config.css, {read: false});
  var jsSources = gulp.src(config.js, {read: false});

  return gulp .src('app/index.html')
              .pipe(inject(cssSources, {ignorePath: 'app'}))
              .pipe(inject(jsSources, {ignorePath: 'app'}))
              .pipe(gulp.dest('app'));
});


//---------------------------
// STYLE TASKS
//---------------------------

gulp.task('sasslint', function() {
  var options = {
    configFile: '.sass-lint.yml'
  }

  return gulp .src(config.sass.concat(config.sassPartials))
              .pipe(sassLint())
              .pipe(sassLint.format())
              .pipe(sassLint.failOnError());
});

gulp.task('sass-dev',
  gulp.series('sasslint', 'clean-dev-css', function () {
  return gulp .src(config.sass)
              .pipe(sass.sync().on('error', sass.logError))
              .pipe(gulp.dest('app/tempcss'));
}));

gulp.task('autoprefixer', function () {
   return gulp.src('app/tempcss/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer({ browsers: ['last 5 versions'] }) ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/css'));
});

//---------------------------
// DIST TASKS
//---------------------------

gulp.task('clean-dist', function () {
  return gulp
        .src('dist', {read: false, allowEmpty: true})
        .pipe(clean());
});

gulp.task('clean-dist-tempcss', function () {
  return gulp
        .src('dist/tempcss', {read: false, allowEmpty: true})
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
      .pipe(gulp.dest('dist/tempcss'));
});

gulp.task('dist-autoprefixer', function () {
   return gulp.src('dist/tempcss/*.min.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer({ browsers: ['last 5 versions'] }) ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy-bower', function() {
  return gulp .src(config.bower)
              .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('copy-index', function() {
  return gulp .src(['./app/index.html'])
              .pipe(gulp.dest('dist'));
});

gulp.task('copy-robots', function() {
  return gulp .src(['./app/robots.txt'])
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

gulp.task('copy-assets', gulp.parallel('copy-index', 'copy-robots', 'copy-bower', 'copy-img'));

gulp.task('js-dist', gulp.series('js-hint', 'minify-js'));

gulp.task('css-dist', gulp.series('sasslint', 'minify-css'));


//---------------------------
// WATCHERS
//---------------------------

gulp.task('watch-dev-html', function(done) {
  return gulp.watch(config.html, gulp.series('reload-browser'));
});

gulp.task('watch-dev-js', function(done) {
  return gulp.watch(config.js, gulp.series('reload-browser'));
});

gulp.task('sass-after-watch',
  gulp.series('sass-dev', 'autoprefixer', 'clean-temp-css', 'reload-browser'));

gulp.task('watch-dev-sass', function(done) {
  return gulp.watch(config.sass.concat(config.sassPartials), gulp.series('sass-after-watch'));
});

gulp.task('watch', gulp.parallel('watch-dev-html', 'watch-dev-js', 'watch-dev-sass'));


//---------------------------
// BUILD TASKS
//---------------------------

gulp.task('default',
  gulp.series('js-dev', 'sass-dev', 'autoprefixer', 'clean-temp-css', 'inject-dev-index', gulp.parallel('watch', 'start-server')));

gulp.task('dist',
  gulp.series('clean-dist', 'js-dist', 'css-dist', 'dist-autoprefixer', 'clean-dist-tempcss', 'copy-assets', 'inject-dist-index'));

