var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	browserify = require('browserify'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	source = require('vinyl-source-stream');

gulp.task('browserify', function () {
	var bundler = browserify({
		entries: './app/scripts/main.jsx',
		basedir: __dirname,
		insertGlobals: true,
		transform: ['reactify'],
		extensions: ['.jsx']
	});

	var stream = bundler.bundle();
	stream.on('error', function (err) {
		console.log(err);
	});

	return stream
		.pipe(source('main.js'))
		.pipe(gulp.dest('dist/scripts'))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('assets', function () {
	return gulp.src('app/index.html')
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['browserify', 'assets']);

gulp.task('serve', ['default'], function () {
	browserSync({
		notify: true,
		logPrefix: 'flux',
		server: {
			baseDir: ['dist', 'app'],
			routes: {
				'/bower_components': '../bower_components'
			}
		}

	});

	return gulp.watch('app/**/*.*', ['default']);
});
