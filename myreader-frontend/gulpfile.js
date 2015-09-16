var uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    gulp = require('gulp'),
    minifyHtml = require('gulp-minify-html'),
    htmlreplace = require('gulp-html-replace'),
    ghtmlSrc = require('gulp-html-src'),
    debug = require('gulp-debug'),
    del = require('del'),
    rev = require('gulp-rev'),
    through = require('through2'),
    gulpSequence = require('gulp-sequence'),
    vinylPaths = require('vinyl-paths'),
    base64 = require('gulp-base64');

var paths = {
    index: 'src/index.html',
    img: 'src/app/img',
    dest: {
        root: 'dist',
        app: 'dist/app'
    },
    compress: {
        css: 'main.css',
        js: 'main.js'
    },
    compressed: {}
};

function memorizeCompressedFilename() {
    return through.obj(function(file, enc, cb) {
        var revOrigPathComponents = file.revOrigPath.split('/');
        var fileName = revOrigPathComponents[revOrigPathComponents.length -1];
        var revPathComponents = file.path.split('/');
        var revFileName = revPathComponents[revPathComponents.length -1];
        paths.compressed[fileName] = revFileName;
        cb();
    });
}

function replaceNodeModulesPath(attributeName) {
    var back = '../';

    return function(node) {
        var filenameWithPath = node.attr(attributeName);
        return filenameWithPath.match(/^node_.+/) ? back + filenameWithPath : filenameWithPath;
    }
}

gulp.task('copy-assets', function() {
    return gulp.src([paths.img + '/*'])
        .pipe(gulp.dest(paths.dest.app))
        .pipe(debug({title: 'copying asset'}));
});

gulp.task('process-index-file', function() {
    return gulp.src(paths.index)
        .pipe(debug({title: 'processing html file'}))
        .pipe(htmlreplace({
            'css': 'app/' + paths.compressed[paths.compress.css],
            'js': 'app/' + paths.compressed[paths.compress.js]
        }))
        .pipe(minifyHtml())
        .pipe(gulp.dest(paths.dest.root))
        .pipe(debug({title: 'processed html file'}));
});

gulp.task('process-js', function() {
    return gulp.src(paths.index)
        .pipe(debug({title: 'looking for javascript files in'}))
        .pipe(ghtmlSrc({presets: 'script', getFileName: replaceNodeModulesPath('src')}))
        .pipe(debug({title: 'found javascript file '}))
        .pipe(concat(paths.compress.js))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(paths.dest.app))
        .pipe(debug({title: 'processed javascript file'}))
        .pipe(memorizeCompressedFilename())
});

gulp.task('process-css', function() {
    return gulp.src(paths.index)
        .pipe(debug({title: 'looking for css files in'}))
        .pipe(ghtmlSrc({presets: 'css', getFileName: replaceNodeModulesPath('href')}))
        .pipe(debug({title: 'found css file'}))
        .pipe(base64({debug:true, maxImageSize: 32768000000}))
        .pipe(concat(paths.compress.css))
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest(paths.dest.app))
        .pipe(debug({title: 'processed css file'}))
        .pipe(memorizeCompressedFilename())
});

gulp.task('clean', function () {
    return gulp.src(paths.dest.root)
        .pipe(debug({title: 'cleaning folder'}))
        .pipe(vinylPaths(del))
        .pipe(gulp.dest('.'));
});

gulp.task('build', gulpSequence('clean', 'process-js', 'process-css', 'process-index-file', 'copy-assets'));
