var gulp = require("gulp");
var less = require("gulp-less");
var browserSync = require("browser-sync").create();
var header = require("gulp-header");
var cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var pkg = require("./package.json");
var concat = require('gulp-concat');

// Set the banner content
var banner = "";

// Compile LESS files from /less into /css
gulp.task("less", function () {

    var files = [
        "less/*.less"
    ];

    return gulp.src(files)
        .pipe(less())
        .pipe(gulp.dest("source-css/from-less/"))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Minify compiled CSS
gulp.task("minify-css", ["less"], function () {

    var files = [
        "source-css/header/*.css",
        "source-css/vendor/*.css",
        "source-css/*.css",
        "source-css/from-less/*.css",
        "source-css/footer/*.css"
    ];

    return gulp.src(files)
        .pipe(cleanCSS({ compatibility: "ie8" }))
        .pipe(concat("all-styles-compiled.css"))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Copy JS to dist


gulp.task("js-mvc",
    function () {

        var files = [
            "JavaScript-Mvc-framework/Prototype/Array.js",
            "JavaScript-Mvc-framework/app.js",

            "JavaScript-Mvc-framework/app/*.js",
            "JavaScript-Mvc-framework/app/service.js",

            "JavaScript-Mvc-framework/service/*.js",
            "JavaScript-Mvc-framework/extensions/*.js",
            "JavaScript-Mvc-framework/controllers/*.js",
            "JavaScript-Mvc-framework/component/*.js",
            "JavaScript-Mvc-framework/events/*.js",
            "JavaScript-Mvc-framework/schema/*.js",

            "JavaScript-Mvc-framework/jQueryCaching.js",
            "JavaScript-Mvc-framework/libs/jquery.blockUI.js", // required
            "JavaScript-Mvc-framework/libs/toastr.js", // required
            "JavaScript-Mvc-framework/libs/FrontEnd/wow.js",
            "JavaScript-Mvc-framework/app.run.js"


        ];

        return gulp.src(files)
            //.pipe(uglify())
            .pipe(concat("js-mvc.js"))
            .pipe(rename({ suffix: ".min" }))
            .pipe(gulp.dest("source-js"))
            .pipe(browserSync.reload({
                stream: true
            }));
    });

gulp.task("minify-js", ["js-mvc"],
    function () {

        var files = [
            "source-js/header/*.js",
            "source-js/vendor/*.js",
			"source-js/vendor/database.plugins/*.js",
            "source-js/*.js",
            "source-js/footer/*.js"
        ];

        return gulp.src(files)
            .pipe(concat("all-scripts-compiled.js"))
            //.pipe(uglify())
            .pipe(rename({ suffix: ".min" }))
            .pipe(gulp.dest("dist/js"))
            .pipe(browserSync.reload({
                stream: true
            }));
    });


// Run everything
gulp.task("default", ["minify-css", "minify-js"]);

// Configure the browserSync task
gulp.task("browserSync",
    function () {
        browserSync.init({
            server: {
                baseDir: ""
            }
        });

    });

// Dev task with browserSync
gulp.task("dev", ["browserSync", "less", "minify-css", "minify-js", "js-mvc"], function () {
    gulp.watch("less/*.less", ["less"]);
    gulp.watch("source-css/*.css", ["minify-css"]);
    gulp.watch("source-css/**/*.css", ["minify-css"]);
    gulp.watch("source-js/*.js", ["minify-js"]);
    gulp.watch("source-js/**/*.js", ["minify-js"]);
    gulp.watch("JavaScript-Mvc-framework/*.js", ["js-mvc"]);
    gulp.watch("JavaScript-Mvc-framework/**/*.js", ["js-mvc"]);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch("views/*.html", browserSync.reload);
    gulp.watch("dist/js/*.js", browserSync.reload);
});
