const gulp = require('gulp');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const cssnano = require('gulp-cssnano');
const plumber = require('gulp-plumber');
var clean = require('gulp-clean');

const scssFiles = ['./assets/scss/**/*.scss'];
const scssMain = ['./assets/scss/main.scss'];
const pathStyleDest = './assets/css';
const browserSync = require('browser-sync').create();

// SASS
gulp.task('style', function () {
  return gulp.src(scssMain)
    .pipe(plumber({errorHandler: notify.onError("Style Build Error: <%= error.message %>")}))
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer('last 4 version'))
    .pipe(sourcemaps.write())
    .on('error', onError)
    .pipe(gulp.dest(pathStyleDest));
});

gulp.task('style-build', function () {
  return gulp.src(scssMain)
    .pipe(plumber({errorHandler: notify.onError("Style Build Error: <%= error.message %>")}))
    .pipe(sass())
    .on('error', onError)
    .pipe(autoprefixer('last 4 version'))
    .pipe(cssnano())
    .pipe(gulp.dest(pathStyleDest));
});

// Watcher
gulp.task('watch', () => {
  gulp.watch(scssFiles, function(){
    runSequence('style', ['notify']);
  });
});

// Build for prod
gulp.task('build', function(callback) {
  runSequence(['clean', 'style-build', 'copy'], callback)
});

// Default
gulp.task('default', done => {
  runSequence(['style', 'watch'], done);
});

gulp.task('copy', function() {
  return gulp.src(['assets/**/*', '*.html', '*.php'], { "base" : "." })
      .pipe(gulp.dest('build'));
});

gulp.task('clean', function(){
  return gulp.src('build', {read: false})
  .pipe(clean());
});

///////////////////////////////////////////////////////////
// Helpers
function onError(error) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task('notify', function () {
  return gulp.src('')
    .pipe(notify({message: 'DRAKARYS!!!', onLast: true}));
});

// Serve files and set a custom port
gulp.task('serve', function () {
  browserSync.init({
      server: {
          baseDir: "./" // Set your project's root directory
      },
      port: 3000 // Set custom port (change as needed)
  });

  // Watch for changes and reload
  gulp.watch("*.html").on("change", browserSync.reload);
  gulp.watch("css/**/*.css").on("change", browserSync.reload);
  gulp.watch("js/**/*.js").on("change", browserSync.reload);
});

// Default task
// gulp.task('default', gulp.series('serve'));