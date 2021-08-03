"use strict";

let gulp = require("gulp"),
	autoprefixer = require("gulp-autoprefixer"),
	csso = require("gulp-csso"),
	size = require("gulp-size"),
	// exec = require("gulp-exec"), <- ne trebva
	browserSync = require('browser-sync').create(),
	// sass = require('gulp-sass'),
	sass = require('gulp-sass')(require('sass')),
	cp = require("child_process");

gulp.task("sass", function() {
	return gulp.src( '_scss/**/*.scss' )
		.pipe( size() )
		.pipe( sass().on('error', sass.logError) )
		.pipe( autoprefixer() )
		.pipe( size() )
		.pipe( csso() )
		.pipe( size() )
		.pipe( gulp.dest( './docs/css/' ) )
		.pipe( browserSync.stream({ match: '**/*.css' }) )
	;
});

// Jekyll
gulp.task("jekyll", function() {
	return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit", shell: true });
});

gulp.task("watch", function() {

	browserSync.init({
		server: {
            baseDir: "./docs/"
		}
	});

	gulp.watch( '_scss/**/*.scss', gulp.series('sass') );

	gulp.watch(
		[
			"./*.html",
			"./*.yml",
			"./_includes/*.html",
			"./_layouts/*.html",
			"./_posts/**/*.*"
		]
	).on('change', gulp.series('jekyll', 'sass') );

	gulp.watch( 'docs/**/*.html' ).on('change', browserSync.reload );
	gulp.watch( 'docs/**/*.js' ).on('change', browserSync.reload );
});

gulp.task("deploy", gulp.series('jekyll', 'sass'));
gulp.task("default", gulp.series('jekyll', 'sass', 'watch'));
