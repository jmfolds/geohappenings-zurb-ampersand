'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    paths = {
        scripts: [],
        sass: ['./scss/**/*.scss']
    };
 
gulp.task('sass', function () {
    console.log('test');
    gulp.src(['./scss/**/*.scss'])
        .pipe(sass({
            includePaths: ['bower_components/foundation/scss']
        }).on('error', sass.logError))
        .pipe(gulp.dest('./css'))
        .pipe(connect.reload());
});
 


gulp.task('sass:watch', function () {
    gulp.watch(['./scss/**/*.scss', './index.html'], ['sass', 'html']);
    // gulp.watch('./index.html', function () {
    //     console.log('testing....');
    //     connect.reload();
    // });
});

gulp.task('serve', ['sass:watch'], function() {
    connect.server({
        livereload: true
    });
});

gulp.task('html', function() {
  gulp.src('./*.html')
    .pipe(connect.reload());
});
