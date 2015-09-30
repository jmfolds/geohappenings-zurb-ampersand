'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
// var uglify = require('gulp-uglify');
// var sourcemaps = require('gulp-sourcemaps');
var _ = require('lodash');
var gutil = require('gulp-util');
var hbs = require('browserify-handlebars');

function bundle (watch) {
    var inputs = './js/app.js';
    var outputLocation = './js/';
    
    var customOpts = {
        entries: inputs,
        transform: [hbs],
        debug: true
    };

    var opts = _.assign({}, watchify.args, customOpts);
    var b = watchify(browserify(opts));

    if (watch) {
        b.on('update', bundle); // on any dep update, runs the bundler
    }

    b.bundle()
    .on('error', function(err) {
        gutil.log(
            gutil.colors.red('Browserify compile error:'), 
            err.message
        );
        this.emit('end');
    })
    .pipe(source('./build/app.bundle.js'))
    // .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    //     .pipe(uglify())
    //     .on('error', gutil.log)
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(outputLocation));
}

// compile sass
gulp.task('sass', function () {
    gulp.src(['./scss/**/*.scss'])
        .pipe(sass({
            includePaths: ['bower_components/foundation/scss']
        }).on('error', sass.logError))
        .pipe(gulp.dest('./css'))
        .pipe(connect.reload());
});

// reload when html updates
gulp.task('html', function() {
  gulp.src('./*.html')
    .pipe(connect.reload());
});

// reload when sass updates
gulp.task('watch', function () {
    gulp.watch([
        './scss/**/*.scss',
        './js/**/*.js',
        './index.html'
        ], ['sass', 'html']);
    bundle(true);
});

// serve at localhost:8080, start 
gulp.task('serve', ['watch'], function() {
    connect.server({
        livereload: true
    });
});
