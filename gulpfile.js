"use strict";

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minify = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    wrap = require('gulp-wrap'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    path = require('path'),
    wiredep = require('gulp-wiredep'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync').create();

var outputFolder = 'dist/';
var moduleName = 'mdPickers';

gulp.task('assets', function() {
  return gulp.src(['src/core/**/*.less', 'src/components/**/*.less'])
        .pipe(concat('mdPickers.less'))
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulp.dest(outputFolder))
        .pipe(rename({suffix: '.min'}))
        .pipe(minify())
        .pipe(gulp.dest(outputFolder));
});

gulp.task('build-app', function() {
    return gulp.src(['src/mdPickers.js', 'src/core/**/*.js', 'src/components/**/*.js'])
        .pipe(concat('mdPickers.js'))
        .pipe(wrap('(function() {\n"use strict";\n<%= contents %>\n})();'))
        .pipe(sourcemaps.init())
        .pipe(gulp.dest(outputFolder))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outputFolder));
});

gulp.task('default', ['assets', 'build-app']);

gulp.task('bower', function () {
    gulp.src('./example/index.html')
        .pipe(wiredep())
        .pipe(gulp.dest('./example/'));
});

gulp.task('serve', function() {

    browserSync.init({
        server: "./",
        index: "./example/index.html"
    });

    gulp.watch(["src/**/*","example/**/*"], ['default', browserSync.reload]);
});