'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var debowerify = require('debowerify');
var concat = require('gulp-concat');
// var buffer = require('vinyl-buffer');
// var uglify = require('gulp-uglify');
// var sourcemaps = require('gulp-sourcemaps');
var _ = require('lodash');
var gutil = require('gulp-util');
var hbs = require('browserify-handlebars');

function bundle (watch) {
    var inputs = './js/app.js';
    var outputLocation = './build/js/';
    
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
    .pipe(source('./app.bundle.js'))
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
            includePaths: ['node_modules/foundation-sites/scss']
        }).on('error', sass.logError))
        .pipe(gulp.dest('./build/css'))
        .pipe(connect.reload());
    //hack to include leaflet.css and not include bower_components in github for github pages
    gulp.src(['./build/css/app.css', 'node_modules/leaflet/dist/leaflet.css'])
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./build/css'));
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
