// Handle basic gulp tasks
const { dest, parallel, series, src } = require('gulp');
// Gulp plugins
const browserify = require('browserify');
const del = require('del');
const ts = require('gulp-typescript');
const run = require('gulp-run');
const source = require('vinyl-source-stream');
const sass = require('gulp-sass');
// Typescript project (app)
const tsAppProject = ts.createProject("src/app/tsconfig.json");
// Configure sass compiler
sass.compiler = require('node-sass');


// Clean build/ directory
function clean_build(cb) {
    del(["build/**/*.js", "build/**/*.css"]).then((val) => {
        cb();
    })
}


// Copy *.html to build/renderer/
function copy_html(cb) {
    src("src/renderer/*.html").pipe(dest("build/renderer")).on("end", cb);
}


// Copy src/res folder to build/renderer/res
function copy_res(cb) {
    src("src/renderer/res/**/*").pipe(dest("build/renderer/res")).on("end", cb);
}


// Compile typescript for NodeJS/Electron backend
function tsc_app(cb) {
    tsAppProject.src().pipe(tsAppProject()).js.pipe(dest("build")).on("end", cb);
}


// Compile typescript+jsx -> browserify for renderer frontend
function renderify(cb) {
    let bundler = browserify({
        basedir: "src/renderer",
        entries: "App.tsx",
        insertGlobalVars: 'global',
        ignoreMissing: true
    });
    bundler.plugin("tsify")
           .bundle()
           .pipe(source("app.js"))
           .pipe(dest("build/renderer"))
           .on('end', cb);
}


// Compile SCSS -> CSS for renderer frontend
function scss_renderer(cb) {
    src("src/renderer/app.scss").pipe(sass()).pipe(dest("build/renderer")).on('end', cb);
}


// Run app
function runApp(cb) {
    run("npm run start").exec("", cb);
}


// Export default task
let defaultTask = series(clean_build, parallel(copy_html, copy_res, tsc_app, renderify, scss_renderer));

module.exports = {
    default: defaultTask,
    rerun: series(defaultTask, runApp)
};