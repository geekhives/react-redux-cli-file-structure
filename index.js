#!/usr/bin/env node
var program = require('commander');
var fs = require('fs')
var Promise = require('promise')
var Mustache = require('mustache')
var path = require('path');
var _str = require('lodash/string');


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

  		var mod = destination+_str.kebabCase(moduleName);

  		fs.mkdirSync(mod)

  		if (fs.existsSync(mod)) {
  			return mod;
  		}

  	})
  	.then(function(module){
  		
  		var p1 = new Promise(function(resolve, reject){
  			if(fs.existsSync(module)){
  				fs.mkdir(module+'/actions')
  				resolve(module+'/actions')
  			}
  		});

  		var p2 = new Promise(function(resolve, reject){
  			if(fs.existsSync(module)){
  				fs.mkdir(module+'/components')
  				resolve(module+'/components')
  			}
  		});

  		var p3 = new Promise(function(resolve, reject){
  			if(fs.existsSync(module)){
  				fs.mkdir(module+'/containers')
  				resolve(module+'/containers')
  			}
  		});

  		var p4 = new Promise(function(resolve, reject){
  			if(fs.existsSync(module)){
  				fs.mkdir(module+'/reducers')
  				resolve(module+'/reducers')
  			}
  		});

      var p5 = new Promise(function(resolve, reject){
        if(fs.existsSync(module)){
          fs.mkdir(module+'/constants')
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
        console.log(program.dirdest+mod+'/containers');

        if(folders.indexOf(program.dirdest+mod+'/containers') > -1){
            
            var p1 = new Promise(function(resolve, reject){

                var containerTemplate = fs.readFileSync(BASE_PATH+'/templates/container.template').toString()
                    
                var output = Mustache.render(containerTemplate, containerData);             

                fs.writeFileSync(program.dirdest+mod+'/containers/'+containerData.moduleNameOrig+".js", output);

                if(fs.existsSync(program.dirdest+mod+'/containers/'+containerData.moduleNameOrig+".js")){
                  resolve(program.dirdest+mod+'/containers'+containerData.moduleNameOrig+".js")
                }
                else{
                  reject('container didnt created')
                }

            });

        }


        if(folders.indexOf(program.dirdest+mod+'/reducers') > -1){
            
            var p2 = new Promise(function(resolve, reject){

                var containerTemplate = fs.readFileSync(BASE_PATH+'/templates/reducer.template').toString()
                    
                var output = Mustache.render(containerTemplate, containerData);             

                fs.writeFileSync(program.dirdest+mod+'/reducers/index.js', output);

                if(fs.existsSync(program.dirdest+mod+'/reducers/index.js')){
                  resolve(program.dirdest+mod+'/reducers/index.js')
                }
                else{
                  reject('reducer didnt created')
                }

            });

        }


        if(folders.indexOf(program.dirdest+mod+'/actions') > -1){
            
            var p3 = new Promise(function(resolve, reject){

                    
                fs.writeFileSync(program.dirdest+mod+'/actions/index.js', "import * as c from '../constants';");

                if(fs.existsSync(program.dirdest+mod+'/actions/index.js')){
                  resolve(program.dirdest+mod+'/actions/index.js')
                }
                else{
                  reject('actions didnt created')
                }

            });

        }

         if(folders.indexOf(program.dirdest+mod+'/constants') > -1){

           var p4 = new Promise(function(resolve, reject){

                    
                fs.writeFileSync(program.dirdest+mod+'/constants/index.js', "");

                if(fs.existsSync(program.dirdest+mod+'/constants/index.js')){
                  resolve(program.dirdest+mod+'/constants/index.js')
                }
                else{
                  reject('constants didnt created')
                }

            });
         }

        var p5 = new Promise(function(resolve, reject){

            var routesTemplate = fs.readFileSync(BASE_PATH+'/templates/routes.template').toString()
                
            var output = Mustache.render(routesTemplate, containerData);             

            fs.writeFileSync(program.dirdest+mod+'/routes.js', output);

            if(fs.existsSync(program.dirdest+mod+'/routes.js')){
              resolve(program.dirdest+mod+'/routes.js')
            }
            else{
              reject('routes didnt created')
            }

        });

  	})
    .then(function(){
        console.log('module successfully created');
    })
  	.catch(function(err){
  		console.log(err)
  	})
 
  })
  .parse(process.argv);