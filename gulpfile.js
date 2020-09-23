const gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const runSequence = require('gulp4-run-sequence');
const browserSync = require('browser-sync').create();


gulp.task('processHTML', () => {
    return gulp.src('*.html')
      .pipe(gulp.dest('dist'));
  });

gulp.task('processJS', () => {
  return gulp.src(['blog.js','functions.js'])
    .pipe(jshint({
      esversion: 8
    }))
    .pipe(jshint.reporter('default'))
		.pipe(babel({
      presets: ['@babel/preset-env'],
      plugins: ['@babel/transform-runtime']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('babelPolyfill', () => {
  return gulp.src('node_modules/babel-polyfill/browser.js')
    .pipe(gulp.dest('dist/node_modules/babel-polyfill'));
});

/* gulp.task('browserSync', () => {
   browserSync.init({
    server: './dist',
    port: 8080,
    ui: {
      port: 8081
    }
  });
}); */

gulp.task('watch',  () => {
  gulp.watch('*.js', gulp.series('processJS'));
  gulp.watch('*.html', gulp.series('processHTML'));
  gulp.watch('dist/*.js', browserSync.reload);
  gulp.watch('dist/*.html', browserSync.reload);  
});



gulp.task('default', (callback) => {
  browserSync.init({
    server: './dist',
    port: 8080,
    ui: {
      port: 8081
    }
  });
  return runSequence(['processHTML', 'processJS', 'babelPolyfill'], 'watch', callback);
});