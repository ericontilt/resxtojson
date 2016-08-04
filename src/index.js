#!/usr/bin/env node
/*
 * resxtojson
 * https://github.com/ericontilt/resxtojson
 *
 * Copyright (c) 2016 Eric Beragg
 * Licensed under the MIT license.
 */

'use strict';

var program = require('commander');
var glob = require('glob');
var fs = require('fs');
var path = require('path');
var transformer = require('./transformer');
var pkg = require('../package.json');

var resxPath;
var outputPath;

program
  .version(pkg.version)
  .arguments('<resx_path> <output_path>')
  .action(function (pResx, pOutput) {
    resxPath = pResx;
    outputPath = pOutput;
  });

program.parse(process.argv);

glob(resxPath, {}, function (err, files) {
  if (err !== null) {
    console.error('No match for \'%s\'', resxPath);
    process.exit(1);
  }

  try {
    fs.accessSync(outputPath, fs.F_OK);
  } catch (e) {
    fs.mkdirSync(outputPath);
    console.log('Output directory created "%s"', outputPath);
  }

  var regExpWithCulturePrefix = /\b\.([a-z]{2}-[A-Z]{2})\.resx/;
  var mainResxPath = files.find(function(f) {
    return regExpWithCulturePrefix.exec(f) === null;
  });

  console.log('Main resx file: %s', mainResxPath);

  function doTransformation(srcPath, baseTranslation) {
    var fileContent = fs.readFileSync(path.normalize(srcPath));
    var translation = Object.assign({}, baseTranslation || {}, transformer(fileContent));
    var srcFileName = path.basename(srcPath);
    var dstFileName = path.join(outputPath, srcFileName.replace('.resx', '.json'));
    fs.writeFileSync(dstFileName, JSON.stringify(translation));
    return translation;
  }

  var baseTranslation = doTransformation(mainResxPath);

  files.filter(function(f) {
    return f !== mainResxPath;
  }).forEach(function(f) {
    doTransformation(f, baseTranslation);
  });
});
