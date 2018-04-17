var gulp = require('gulp');
var sass = require('gulp-sass');
var fileinclude = require('gulp-file-include');
var watch = require('gulp-watch');
var strip = require('gulp-strip-comments');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./www-root"
    });

    gulp.watch("development/sass/**/*.scss", ['sass', 'sass-for-git']);
    gulp.watch("development/html/**/*.html", ['fileinclude','move-for-git', 'include-for-git']);
    gulp.watch("development/images/**/*.{jpg,png,gif}", ['move-images']);
    gulp.watch("www-root/**/*.*").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("development/sass/**/*.scss")
        .pipe(sass())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest("www-root/site-assets/css"))
        .pipe(gulp.dest("git-integration/site-assets/css"))
        .pipe(browserSync.stream());
});

gulp.task('sass-for-git', function() {
    return gulp.src("development/sass/**/*.scss")
        .pipe(sass())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest("git-integration/site-assets/css"))
});

gulp.task('move-images', [], function() {
  gulp.src('development/images/**/*.{jpg,png,gif}')
        .pipe(imagemin())
        .pipe(gulp.dest('www-root/site-assets/images'))
});

gulp.task('move-for-git', [], function() {
  gulp.src('development/html/includes/**/*.html')
        .pipe(gulp.dest('git-integration/includes/'))
        .pipe(strip())
        .pipe(gulp.dest('git-integration/includes_stripped/'))
});

gulp.task('include-for-git', [], function() {
  gulp.src('development/html/page-layouts/**/*.html')
        .pipe(fileinclude({
          prefix: '@@',
          basepath: './git-integration/includes_stripped/'
        }))
        .pipe(gulp.dest('git-integration/page-layouts/'))
});

gulp.task('fileinclude', function() {
  gulp.src('./development/html/page-layouts/**/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: './development/html/includes/'
    }))
    .pipe(gulp.dest('./www-root/'));

});

gulp.task('default', ['serve']);
