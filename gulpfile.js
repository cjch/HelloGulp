//引入gulp和各个插件
var gulp = require('gulp'),	//gulp插件
	uglify = require('gulp-uglify'),	//js代码压缩
	cleanCSS = require('gulp-clean-css'),	//css代码压缩
	sourcemaps = require('gulp-sourcemaps'),	//sourcemaps，方便调试定位
	rename = require('gulp-rename'),	//重命名
	concat = require('gulp-concat');	//合并文件


//将resouce资源复制到dist文件夹，未做任何处理，实际应用中可以对图片进行压缩。
gulp.task('resource', function() {
	gulp.src('src/resource/**')
		.pipe(gulp.dest('dist/resource'));
});


//将html文件复制到dist文件夹，不做任何未做任何处理，
gulp.task('html', function() {
	gulp.src('src/**/*.html')
		.pipe(gulp.dest('dist'));
});

//合并压缩js文件，合并为all.js，然后压缩为all.min.js
gulp.task('js', [], function(){
	gulp.src('src/js/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/js'));
});

//压缩css文件并生成sourcemaps，方便调试定位
gulp.task('css', function(){
	gulp.src('src/css/*.css')
		.pipe(sourcemaps.init())
		.pipe(cleanCSS())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/css'));
});

//监控文件，如果文件内容改变就执行，就执行对应的任务
gulp.task('watch', function() {
	gulp.watch('src/js/*.js', ['js']);
	gulp.watch('src/css/*.css', ['css']);
	gulp.watch('src/**/*.html', ['html']);
	gulp.watch('src/resource/**', ['resource']);
});

//默认任务
gulp.task('default', ['js', 'css', 'html', 'resource', 'watch'], function(){
	console.log('gulp process start...');
});