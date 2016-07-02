#!/usr/bin/env node
var program = require('commander');
var fs = require('fs')
var Promise = require('promise')
var Mustache = require('mustache')
var path = require('path');
var _str = require('lodash/string');
var colors = require('colors');

var BASE_PATH = __dirname

program
  .arguments('<modulename>')
  .option('-d, --dirdest <dirdest>', 'The directory destination')
  
  .action(function(moduleName) {

  	var promise = new Promise(function(resolve, reject){
  		if (fs.existsSync(program.dirdest)) {
  			resolve(program.dirdest)
  		}
  		reject('Destination does not exist')
  	})
  	.then(function(destination){

  		var mod = destination+'/'+_str.kebabCase(moduleName);

  		fs.mkdirSync(mod)

  		if (fs.existsSync(mod)) {
  			return mod;
  		}

  	})
  	.then(function(module){
  		
  		var p1 = new Promise(function(resolve, reject){
  			if(fs.existsSync(module)){
  				fs.mkdir(module+'/actions')
          console.log(colors.green(module+'/actions'+' created'));
  				resolve(module+'/actions')
  			}
  		});

  		var p2 = new Promise(function(resolve, reject){
  			if(fs.existsSync(module)){
  				fs.mkdir(module+'/components')
          console.log(colors.green(module+'/components'+' created'));
  				resolve(module+'/components')
  			}
  		});

  		var p3 = new Promise(function(resolve, reject){
  			if(fs.existsSync(module)){
  				fs.mkdir(module+'/containers')
          console.log(colors.green(module+'/containers'+' created'));
  				resolve(module+'/containers')
  			}
  		});

  		var p4 = new Promise(function(resolve, reject){
  			if(fs.existsSync(module)){
  				fs.mkdir(module+'/reducers')
          console.log(colors.green(module+'/reducers'+' created'));
  				resolve(module+'/reducers')
  			}
  		});

      var p5 = new Promise(function(resolve, reject){
        if(fs.existsSync(module)){
          fs.mkdir(module+'/constants')
          console.log(colors.green(module+'/constants'+' created'));
          resolve(module+'/constants')
        }
      });

  		return Promise.all([p1, p2, p3, p4, p5]).then(function(values) { 
		    return values
		  });

  	})
  	.then(function(folders){
        
        var mod = _str.kebabCase(moduleName)
       
        var containerData = {
          moduleNameCamelCase: _str.camelCase(moduleName),
          moduleNameLowerCase: moduleName.toLowerCase(),
          moduleNameOrig: moduleName,
          moduleNameUpperCase: moduleName.toUpperCase(),
          moduleNameKebabCase: mod,
          moduleStartCase: _str.startCase(moduleName)
        }
       

        if(folders.indexOf(program.dirdest+'/'+mod+'/containers') > -1){
            
            var p1 = new Promise(function(resolve, reject){

                var containerTemplate = fs.readFileSync(BASE_PATH+'/templates/container.template').toString()
                    
                var output = Mustache.render(containerTemplate, containerData);             

                fs.writeFileSync(program.dirdest+'/'+mod+'/containers/'+containerData.moduleNameOrig+".js", output);

                if(fs.existsSync(program.dirdest+'/'+mod+'/containers/'+containerData.moduleNameOrig+".js")){

                  console.log(colors.green(program.dirdest+'/'+mod+'/containers/'+containerData.moduleNameOrig+".js"+' created'));
                  resolve(program.dirdest+'/'+mod+'/containers/'+containerData.moduleNameOrig+".js")
                }
                else{
                  console.log(colors.red('container didnt created'));
                  reject('container didnt created')
                }

            });

        }


        if(folders.indexOf(program.dirdest+'/'+mod+'/reducers') > -1){
            
            var p2 = new Promise(function(resolve, reject){

                var containerTemplate = fs.readFileSync(BASE_PATH+'/templates/reducer.template').toString()
                    
                var output = Mustache.render(containerTemplate, containerData);             

                fs.writeFileSync(program.dirdest+'/'+mod+'/reducers/index.js', output);

                if(fs.existsSync(program.dirdest+'/'+mod+'/reducers/index.js')){

                  console.log(colors.green(program.dirdest+'/'+mod+'/reducers/index.js'+' created'));
                  resolve(program.dirdest+'/'+mod+'/reducers/index.js')
                }
                else{
                  console.log(colors.red('reducer didnt created'));
                  reject('reducer didnt created')
                }

            });

        }


        if(folders.indexOf(program.dirdest+'/'+mod+'/actions') > -1){
            
            var p3 = new Promise(function(resolve, reject){

                var actionsTemplate = fs.readFileSync(BASE_PATH+'/templates/actions.template').toString()      

                var output = Mustache.render(actionsTemplate, containerData); 

                fs.writeFileSync(program.dirdest+'/'+mod+'/actions/index.js', output);

                if(fs.existsSync(program.dirdest+'/'+mod+'/actions/index.js')){

                  console.log(colors.green(program.dirdest+'/'+mod+'/actions/index.js'+ ' created'));
                  resolve(program.dirdest+'/'+mod+'/actions/index.js')
                }
                else{
                  console.log(colors.red('actions didnt created'));
                  reject('actions didnt created')
                }

            });

        }

         if(folders.indexOf(program.dirdest+'/'+mod+'/constants') > -1){

           var p4 = new Promise(function(resolve, reject){

                var constantsTemplate = fs.readFileSync(BASE_PATH+'/templates/constants.template').toString()  
                    
                var output = Mustache.render(constantsTemplate, containerData); 

                fs.writeFileSync(program.dirdest+'/'+mod+'/constants/index.js', output);

                if(fs.existsSync(program.dirdest+'/'+mod+'/constants/index.js')){

                  console.log(colors.green(program.dirdest+'/'+mod+'/constants/index.js'+ ' created'));
                  resolve(program.dirdest+'/'+mod+'/constants/index.js')
                }
                else{
                  console.log(colors.red('constants didnt created'));
                  reject('constants didnt created')
                }

            });
         }

        // var p5 = new Promise(function(resolve, reject){

        //     var routesTemplate = fs.readFileSync(BASE_PATH+'/templates/routes.template').toString()
                
        //     var output = Mustache.render(routesTemplate, containerData);             

        //     fs.writeFileSync(program.dirdest+'/'+mod+'/routes.js', output);

        //     if(fs.existsSync(program.dirdest+'/'+mod+'/routes.js')){

        //       console.log(colors.green(program.dirdest+mod+'/routes.js'+ ' created'));
        //       resolve(program.dirdest+'/'+mod+'/routes.js')
        //     }
        //     else{
        //       console.log(colors.red('routes didnt created'));
        //       reject('routes didnt created')
        //     }

        // });

  	})
    .then(function(){
        console.log(colors.green(_str.kebabCase(moduleName)+' module successfully created'));
    })
  	.catch(function(err){
      
        if(err.code == 'EEXIST'){
          return console.log(colors.red(`${err.path} already exist`))
        }

        console.log(colors.red(err))
  	})
  })
  .parse(process.argv);