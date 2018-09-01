var gulp        = require('gulp'),
    wait        = require('gulp-wait'),
    concat      = require('gulp-concat'),
    less        = require('gulp-less'),
    uglify      = require('gulp-uglify'),
    minify      = require('gulp-minify-css'),
    rename      = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload,
    //imagemin    = require('gulp-imagemin'),
    pngquant    = require('gulp-pngquant'),
    sourcemaps  = require('gulp-sourcemaps'),
    clean       = require('gulp-clean'),
    notify      = require('gulp-notify'),
    prefixer    = require('gulp-autoprefixer');

var path = {
    build: {
        html:   'build/',
        js:     'build/js/',
        css:    'build/css/',
        img:    'build/img/',
        libs:   'build/libs/',
        fonts:  'build/fonts'
    },
    src: {
        html:   'src/*.html',
        js:     'src/js/main.js',
        style:  'src/style/main.less',
        img:    ['src/img/**/*.*', '!src/img/**/Thumbs.db', '!src/img/**/*.svg'],
        svg:    'src/img/**/*.svg',
        libs:   'src/libs/**/*.*',
        fonts:  'src/fonts/**/*.*'
    },
    watch: {
        html:   'src/**/*.html',
        js:     'src/js/**/*.js',
        style:  'src/style/**/*.less',
        img:    ['src/img/**/*.*', '!src/img/**/*.svg'],
        svg:    'src/img/**/*.svg',
        libs:   'src/libs/**/*.*',
        fonts:  'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    // tunnel: true,
    host:   'localhost',
    port: 9000,
    logPrefix: "el"
};


// TASKS
gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src('src/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(sourcemaps.init())
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('libs:build', function () {
    gulp.src(path.src.libs)
        .pipe(gulp.dest(path.build.libs))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(wait(50))
        .pipe(sourcemaps.init())
            .pipe(less())                
            .pipe(prefixer({
                browsers: ['IE > 9', 'last 2 versions' ],
                cascade: false
            }))
            .pipe(minify())
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('img:build', function() {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'libs:build',
    'style:build',
    'fonts:build',
    'img:build'
]);

gulp.task('watch', function() {
    gulp.watch([path.watch.html], ['html:build']);
    gulp.watch([path.watch.js], ['js:build']);
    gulp.watch([path.watch.libs], ['libs:build']);
    gulp.watch([path.watch.style], ['style:build']);
    gulp.watch([path.watch.img], ['img:build']);
    gulp.watch([path.watch.fonts], ['fonts:build']);
});

gulp.task('webserver', function() {
    browserSync.init(config);
});

gulp.task('clean', function() {
    return gulp.src(path.clean, {read: false})
        .pipe(clean());
})

gulp.task('default', ['build', 'webserver', 'watch']);
