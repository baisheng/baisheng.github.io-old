'use strict'

const gulp = require('gulp'),
      newer = require('gulp-newer'),
      imagemin = require('gulp-imagemin'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      autoprefixer = require('gulp-autoprefixer'),
      cssnano = require('gulp-cssnano'),
      rename = require('gulp-rename'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      watch = require('gulp-watch'),
      rigger = require('gulp-rigger'),
      prettify = require('gulp-jsbeautifier'),
      browserSync = require('browser-sync')
// const gulp = require('gulp')
// const watch = require('gulp-watch')
// const rigger = require('gulp-rigger')
// const browserSync = require('browser-sync')
// const prettify = require('gulp-jsbeautifier')
// const download = require('gulp-download-stream')
// const rename = require('gulp-rename')
// const jsonTransform = require('gulp-json-transform')
// const Showdown = require('showdown')

// const folder = {
  // src: 'src/',    // source files
  // dist: 'dist/'
// }
const path = {
  build: { // production
    html: './',
    css: './css'
  },
  src: { // development
    html: 'src/*.html',
    scss: 'src/scss/slides.scss'
  },
  watch: {
    html: 'src/**/*.html',
    scss: 'src/scss/**/*'
  }
}

/* =====================================================
 SERVER
 ===================================================== */
const config = {
  server: {
    baseDir: './'
  },
  tunnel: false,
  host: 'localhost',
  port: 9000,
  logPrefix: 'NEDIM_PP',
  open: false,
  watchTask: true
}

gulp.task('webserver', () => {
  browserSync(config)
})

/* =====================================================
 HTML
 ===================================================== */

gulp.task('html:build', () => {
  return gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(prettify())
    .pipe(gulp.dest(path.build.html))
})

/* =====================================================
 CSS
 ===================================================== */
gulp.task('css', () => {
  console.log(path.src.scss)
  return gulp.src(path.src.scss)
      .pipe(sourcemaps.init())
      .pipe(sass()) // scss to css
      .pipe(autoprefixer({
        browsers: ['last 2 version']
      }))
      .pipe(gulp.dest(path.build.css))
      .pipe(rename({ // rename main.css to main.min.css
        suffix: '.min'
      }))
      .pipe(cssnano({ // minify css
        discardComments: {removeAllButFirst: true}
      }))
      .pipe(sourcemaps.write('./')) // source mpas for main.min.css
      .pipe(gulp.dest(path.build.css))
})

/* =====================================================
 RELEASES
 ===================================================== */

gulp.task('download:gitawards', () => {
  return download('http://git-awards.com/api/v0/users/needim', {
    headers: {
      'User-Agent': 'ned.im personal page'
    }
  })
    .pipe(rename('gitawards.json'))
    .pipe(gulp.dest(path.build.html))
})


/* =====================================================
 BUILD TASK
 ===================================================== */

gulp.task('build', ['html:build'])

/* =====================================================
 WATCH
 ===================================================== */

gulp.task('watch', () => {
  watch([path.watch.html, path.watch.scss], (event, cb) => {
    gulp.start('html:build'),
    gulp.start('css')
  })
})

/* =====================================================
 DEFAULT TASK
 ===================================================== */

// gulp.task('default', ['download:gitawards','build', 'webserver', 'watch'])
gulp.task('default', ['build', 'webserver', 'watch'])
