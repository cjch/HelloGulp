# 从零开始前端工程自动化

## 前言
去年下半年开始学习前端方面的技能：HTML，JavaScript，CSS。然后就开始试着做项目的一些H5需求，之后又做了一个前端项目。因为一个人摸索，不知道前端自动化的思想和相关工具，开发起来很是痛苦。比如css和js文件修改后发布需要手动压缩，因为不能覆盖源文件，这些文件需要压缩为新文件，或者合并几个小文件，然后还要手动更改html代码中的的路径；发布后的代码如果存在bug，又要重新折腾一遍等。项目文件结构类似：

```
webapp
	|- src	
		|- resource
			|- image
			|- font
			
		|- css
		|- js
		|- html
		|- index.html

```

今年上半年接触了前端自动化方面的知识，了解了node和gulp（grunt未考虑）。接下来我们使用这些自动化工具提升前端开发的效率和幸福感！！！

## 实践
在项目中我们使用gulp自动化构建工具。那么项目文件结构就应该类似：

```
webapp
	|- package.json
	|- gulpfile.js

	|- dist
		|- 空目录
	|- src	
		|- resource
			|- image
			|- font
			
		|- css
		|- js
		|- html
		|- index.html

```
src为项目开发文件夹，新增dist(distribution)为项目部署文件夹，另外新增了项目配置文件package.json和gulp配置文件**gulpfile.js**，自动化工作就是在该文件中完成。下面我们一步步完成工具安装和自动化工作。

1. 安装node.js和npm，安装教程可参考	
	- Node: [http://nodejs.cn](http://nodejs.cn) 
	- NPM: [https://www.npmjs.com](https://www.npmjs.com)

2. package.json项目配置文件生成(此步骤可选)。命令行下切换到项目目录，使用如下命令，然后按照提示完成即可自动生成package.json文件

	```
	npm init
	```
	生成package.json的一个好处在于：协同开发的其他人可以很方便的安装自动化环境。

2. 安装gulp，首先全局安装gulp：

	```
	npm install -g gulp
	```
	全局安装gulp后，把目录切换到项目文件夹下，还在项目目录下单独安装一次，如果可能，将gulp写到package.json文件的依赖中：

	```
	npm install gulp		//安装到项目目录
	或
	npm install --save-dev gulp 	//安装到项目目录并写到package.json文件的依赖中
	```
到这里我们就完成了gulp的安装。

4. 编写gulp自动化任务代码。先看看我们的gulpfile.js文件内容：

	```javascript
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
	```
	
	代码中我们都写了一些解释，首先我们引入需要的插件，然后使用这些插件实现相应的任务，上述代码基本可以满足我们工程的需要。文件编写完成后，只需要在项目目录下命令行执行如下命令就完成了自动化工作：
	
	```
	gulp [任务名，省略时执行default任务]
	```
	可在[gulp官网](http://gulpjs.com/plugins/)查找可用的插件资源，然后在项目目录下安装插件，安装命令都类似gulp的安装(这里我们都写入到项目依赖中)：
	
	```
	npm install --save-dev [插件名]
	```
	如果事先将插件写入到package.json的依赖中，还可以在项目目录下执行命令：
	
	```
	npm install
	```
这样就会在项目目录下安装依赖的所有插件。

##总结
通过一段时间的学习，在项目中使用了前端自动化的一些工作流程后，确实感到方便了许多。前端自动化还可以做更多，后续根据需要我们可以引入更多的功能，比如sass，js检查，html文件压缩，图片压缩，服务器启动，自动刷新等，这些都可以使前端开发更方便，更轻松。

最后，这只是我在前端自动化中的一点浅见，如有什么疏漏和错误，欢迎交流和讨论。