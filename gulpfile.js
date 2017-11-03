var gulp = require("gulp"),
	sass = require("gulp-sass"),
	cleanCSS = require("gulp-clean-css"),
	themeName = "gallery",
	pathSCSS = "./style/scss/",
	destCSS = "./style";

gulp.task("sass", function(){
  return gulp.src(pathSCSS + "style.scss", {style: "compressed"})
	  .pipe(sass())
	  .pipe(gulp.dest(destCSS))
	  .pipe(cleanCSS({keepSpecialComments: 0}))
	  .pipe(gulp.dest(destCSS));
});

gulp.task('watch', function(){
	gulp.watch( [pathSCSS + "**/*.scss"], ["sass"]);
});
