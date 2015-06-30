/**
 * @module Shape
 * @submodule 3D Primitives
 * @for p5
 * @requires core
 * @requires canvas
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core/core');
  require('3d/p5.Geometry3D');

  /**
   * generate plane geomery
   * @param  {Number} width   the width of the plane
   * @param  {Number} height  the height of the plane
   * @param  {Number} detailX how many segments in the x axis
   * @param  {Number} detailY how many segments in the y axis
   * @return {[type]}         [description]        
   */
  p5.prototype.plane = function(width, height, detailX, detailY){

    width = width || 1;
    height = height || 1;

    detailX = detailX || 1;
    detailY = detailY || 1;

    var uuid = 'plane|'+width+'|'+height+'|'+detailX+'|'+detailY;
 
    if(this._graphics.notInHash(uuid)){

      var geometry3d = new p5.Geometry3D();

      var createPlane = function(u, v){
        var x = 2 * width * u - width;
        var y = 2 * height * v - height;
        var z = 0;
        return new p5.Vector(x, y, z);
      };
      
      geometry3d.parametricGeometry(createPlane, detailX, detailY);
      
      var obj = geometry3d.generateObj();
 
      this._graphics.initBuffer(uuid, obj);
    
    }

    this._graphics.drawBuffer(uuid);

  };

  /**
   * [sphere description]
   * @param  {[type]} radius  [description]
   * @param  {[type]} detailX [description]
   * @param  {[type]} detailY [description]
   * @return {[type]}         [description]
   */
  p5.prototype.sphere = function(radius, detailX, detailY){

    radius = radius || 50;

    detailX = detailX || 10;
    detailY = detailY || 6;

    var uuid = 'sphere|'+radius+'|'+detailX+'|'+detailY;

    if(this._graphics.notInHash(uuid)){
    
      var geometry3d = new p5.Geometry3D();

      var createSphere = function(u, v){
        var theta = 2 * Math.PI * u;
        var phi = Math.PI * v - Math.PI / 2;
        var x = radius * Math.cos(phi) * Math.sin(theta);
        var y = radius * Math.sin(phi);
        var z = radius * Math.cos(phi) * Math.cos(theta);
        return new p5.Vector(x, y, z);
      };

      geometry3d.parametricGeometry(createSphere, detailX, detailY);

      var obj = geometry3d.generateObj();

      this._graphics.initBuffer(uuid, obj);
    }

    this._graphics.drawBuffer(uuid);

    return this;
  };

  /**
   * [cylinder description]
   * @param  {[type]} radius  [description]
   * @param  {[type]} detailX [description]
   * @param  {[type]} detailY [description]
   * @return {[type]}         [description]
   */
  p5.prototype.cylinder = function(radius, height, detailX, detailY){

    radius = radius || 50;
    height = height || 50;

    detailX = detailX || 12;
    detailY = detailY || 8;

    var uuid = 'cylinder|'+radius+'|'+height+'|'+detailX+'|'+detailY;

    if(this._graphics.notInHash(uuid)){

      var geometry3d = new p5.Geometry3D();

      var createCylinder = function(u, v){
        var theta = 2 * Math.PI * u;
        var x = radius * Math.sin(theta);
        var y = 2 * height * v - height;
        var z = radius * Math.cos(theta);
        return new p5.Vector(x, y, z);
      };

      geometry3d.parametricGeometry(createCylinder, detailX, detailY);
      var obj = geometry3d.generateObj();


     var top = new p5.Geometry3D();
      var createTop = function(u, v){
        var theta = 2 * Math.PI * u;
        var x = radius * Math.sin(-theta);
        var y = height;
        var z = radius * Math.cos(theta);
        if(v === 0){
          return new p5.Vector(0, height, 0);
        }
        else{
          return new p5.Vector(x, y, z);
        }
      };

      top.parametricGeometry(
        createTop, detailX, 1, geometry3d.vertices.length);
      var obj1 = top.generateObj();

      var bottom = new p5.Geometry3D();
      var createBottom = function(u, v){
        var theta = 2 * Math.PI * u;
        var x = radius * Math.sin(theta);
        var y = -height;
        var z = radius * Math.cos(theta);
        if(v === 0){
          return new p5.Vector(0, -height, 0);
        }else{
          return new p5.Vector(x, y, z);
        }
      };

      bottom.parametricGeometry(
        createBottom, detailX, 1, 
        geometry3d.vertices.length + top.vertices.length);
      var obj2 = bottom.generateObj();

      obj.vertices = obj.vertices.concat(obj1.vertices).concat(obj2.vertices);
      obj.vertexNormal = obj.vertexNormal
      .concat(obj1.vertexNormal)
      .concat(obj2.vertexNormal);
      obj.faces = obj.faces.concat(obj1.faces).concat(obj2.faces);
      obj.len = obj.len + obj1.len + obj2.len;

      this._graphics.initBuffer(uuid, obj);
    }

    this._graphics.drawBuffer(uuid);

    return this;
  };

  /**
   * [cone description]
   * @param  {[type]} radius  [description]
   * @param  {[type]} height  [description]
   * @param  {[type]} detailX [description]
   * @param  {[type]} detailY [description]
   * @return {[type]}         [description]
   */
  p5.prototype.cone = function(radius, height, detailX, detailY){
    
    radius = radius || 50;
    height = height || 50;

    detailX = detailX || 10;
    detailY = detailY || 6;

    var uuid = 'cone|'+radius+'|'+height+'|'+detailX+'|'+detailY;

    if(this._graphics.notInHash(uuid)){

      var geometry3d = new p5.Geometry3D();

      var createCone = function(u, v){
        var theta = 2 * Math.PI * u;
        var x = radius * (1 - v) * Math.sin(theta);
        var y = 2 * height * v - height;
        var z = radius * (1 - v) * Math.cos(theta);
        return new p5.Vector(x, y, z);
      };

      geometry3d.parametricGeometry(createCone, detailX, detailY);
      geometry3d.mergeVertices();

      var createBottom = function(u, v){
        var theta = 2 * Math.PI * u;
        var x = radius * (1 - v) * Math.sin(-theta);
        var y = -height;
        var z = radius * (1 - v) * Math.cos(theta);
        return new p5.Vector(x, y, z);
      };

      geometry3d.parametricGeometry(
        createBottom, detailX, 1, geometry3d.vertices.length);

      var obj = geometry3d.generateObj(true);

      this._graphics.initBuffer(uuid, obj);
    }

    this._graphics.drawBuffer(uuid);

    return this;
  };

  /**
   * [torus description]
   * @param  {[type]} radius  [description]
   * @param  {[type]} height  [description]
   * @param  {[type]} detailX [description]
   * @param  {[type]} detailY [description]
   * @return {[type]}         [description]
   */
  p5.prototype.torus = function(radius, tube, detailX, detailY){
    
    radius = radius || 50;
    tube = tube || 20;

    detailX = detailX || 12;
    detailY = detailY || 6;

    var uuid = 'torus|'+radius+'|'+tube+'|'+detailX+'|'+detailY;

    if(this._graphics.notInHash(uuid)){

      var geometry3d = new p5.Geometry3D();

      var createTorus = function(u, v){
        var theta = 2 * Math.PI * u;
        var phi = 2 * Math.PI * v;
        var x = (radius + tube * Math.cos(phi)) * Math.cos(theta);
        var y = (radius + tube * Math.cos(phi)) * Math.sin(theta);
        var z = tube * Math.sin(phi);
        return new p5.Vector(x, y, z);
      };

      geometry3d.parametricGeometry(createTorus, detailX, detailY);

      var obj = geometry3d.generateObj();

      this._graphics.initBuffer(uuid, obj);
    }

    this._graphics.drawBuffer(uuid);

    return this;
  };

  /**
   * [cube description]
   * @param  {[type]} width   [description]
   * @param  {[type]} height  [description]
   * @param  {[type]} depth   [description]
   * @param  {[type]} detailX [description]
   * @param  {[type]} detailY [description]
   * @return {[type]}         [description]
   */
  p5.prototype.box = function(width, height, depth){

    width = width || 10;
    height = height || width;
    depth = depth || width;

    //detail for box as optional
    var detailX = typeof arguments[3] === Number ? arguments[3] : 1;
    var detailY = typeof arguments[4] === Number ? arguments[4] : 1;

    var uuid = 'cube|'+width+'|'+height+'|'+depth+'|'+detailX+'|'+detailY;

    if(this._graphics.notInHash(uuid)){

      var geometry3d = new p5.Geometry3D();

      var createPlane1 = function(u, v){
        var x = 2 * width * u - width;
        var y = 2 * height * v - height;
        var z = depth;
        return new p5.Vector(x, y, z);
      };
      var createPlane2 = function(u, v){
        var x = 2 * width * ( 1 - u ) - width;
        var y = 2 * height * v - height;
        var z = -depth;
        return new p5.Vector(x, y, z);
      };
      var createPlane3 = function(u, v){
        var x = 2 * width * u - width;
        var y = height;
        var z = 2 * depth * ( 1- v ) - depth;
        return new p5.Vector(x, y, z);
      };
      var createPlane4 = function(u, v){
        var x = 2 * width * u - width;
        var y = -height;
        var z = 2 * depth * v - depth;
        return new p5.Vector(x, y, z);
      };
      var createPlane5 = function(u, v){
        var x = width;
        var y = 2 * height * u - height;
        var z = 2 * depth * v - depth;
        return new p5.Vector(x, y, z);
      };
      var createPlane6 = function(u, v){
        var x = -width;
        var y = 2 * height * ( 1 - u ) - height;
        var z = 2 * depth * v - depth;
        return new p5.Vector(x, y, z);
      };
      
      geometry3d.parametricGeometry(
        createPlane1, detailX, detailY, geometry3d.vertices.length);
      geometry3d.parametricGeometry(
        createPlane2, detailX, detailY, geometry3d.vertices.length);
      geometry3d.parametricGeometry(
        createPlane3, detailX, detailY, geometry3d.vertices.length);
      geometry3d.parametricGeometry(
        createPlane4, detailX, detailY, geometry3d.vertices.length);
      geometry3d.parametricGeometry(
        createPlane5, detailX, detailY, geometry3d.vertices.length);
      geometry3d.parametricGeometry(
        createPlane6, detailX, detailY, geometry3d.vertices.length);
      
      var obj = geometry3d.generateObj(true);

      this._graphics.initBuffer(uuid, obj);
    }

    this._graphics.drawBuffer(uuid);

    return this;

  };

  return p5;

});