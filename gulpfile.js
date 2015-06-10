var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprexifer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename');

gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 4002}));
  app.use(express.static(__dirname + '/public'));
  app.listen(4000);
});

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(4002);
});


gulp.task('styles', function () {
    return sass('./src/sass/')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(gulp.dest('./public/css'));
});

gulp.task('html', function() {
  return gulp.src('./src/*.html')
          .pipe(gulp.dest('public'));
         
});

gulp.task('js', function() {
  return gulp.src('./src/js/*.js')
          .pipe(gulp.dest('public/js'));
         
});


function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname + '/public', event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}



gulp.task('watch', function() {
  gulp.watch('./src/*.html', ['html']);
  gulp.watch('./src/sass/*.sass', ['styles']);
  gulp.watch('./src/js/*.js', ['js']);
  gulp.watch('./public/css/*.css', notifyLiveReload);
  gulp.watch('./public/*.html', notifyLiveReload);
   gulp.watch('./public/js/*.js', notifyLiveReload);
});


gulp.task('default', ['styles', 'html', 'express', 'livereload', 'watch']);
