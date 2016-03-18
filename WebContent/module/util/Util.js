define(['jquery', 'OpenLayers', 'jsts'], function($, OpenLayers, jsts) {
	
	var WKT2GeoJSON = function (wkt){
		var wktReader = new jsts.io.WKTReader();
		var parser = new jsts.io.OpenLayersParser();
		
		var obj = wktReader.read(wkt)
		var g = parser.write(obj);
		var gType = g.CLASS_NAME;
		var features = [];
		if(gType == "OpenLayers.Geometry.Point"){
			var feature =  { "type": "Feature",
		      "geometry": { "type": "Point", "coordinates": [g.x, g.y] },
		      "properties": {}
		      };
			features.push(feature);
		}else if(gType == "OpenLayers.Geometry.MultiPoint" ){
			var coordinates = g.components;
			var points = [];
			for(var i = 0; i < coordinates.length;i++){
				points.push([coordinates[i].x, coordinates[i].y]);
			}

			var feature =  { "type": "Feature",
			      "geometry": { "type": "MultiPoint", "coordinates": points },
			      "properties": {}
			      };
			features.push(feature);

		}else if(gType == "OpenLayers.Geometry.LineString"){
			var coordinates = g.components;
			var points = [];
			for(var i = 0; i < coordinates.length;i++){
				points.push([coordinates[i].x, coordinates[i].y]);
			}

			var feature =  { "type": "Feature",
			      "geometry": { "type": "LineString", "coordinates": points },
			      "properties": {}
			      };
			features.push(feature);

		}else if(gType == "OpenLayers.Geometry.MultiLineString"){
			var lineStringArray = g.components;
			for(var i = 0; i < lineStringArray.length;i++){
				var lineString = lineStringArray[i];
				var coordinates = lineString.components;
				var points = [];
				for(var j = 0; j < coordinates.length;j++){
					points.push([coordinates[j].x, coordinates[j].y]);
				}

				var feature =  { "type": "Feature",
				      "geometry": { "type": "LineString", "coordinates": points },
				      "properties": {}
				      };
				features.push(feature);
			}
			
		}else if(gType == "OpenLayers.Geometry.Polygon"){
			var pointsArray = g.components;
			var polygonPoints = [];
			for(var i = 0; i < pointsArray[0].components.length;i++){
				var p = pointsArray[0].components[i];
				polygonPoints.push([p.x,p.y]);
			}
			var holesArray = [];

			for(var i = 1; i < pointsArray.length; i++){
				var holePoints = [];
				for(var j = 0; j < pointsArray[i].components.length;j++){
					var p = pointsArray[i].components[j];
					holePoints.push([p.x,p.y]);
				}
				holesArray.push(holePoints)
			}
			var coordinates = [];
			coordinates.push(polygonPoints);
			for(var i = 0; i < holesArray.length; i++){
				coordinates.push(holesArray[i]);
			}
			var feature =  { "type": "Feature",
				      "geometry": { "type": "Polygon", "coordinates": coordinates },
				      "properties": {}
			      };
			features.push(feature);

		}else if(gType == "OpenLayers.Geometry.MultiPolygon"){
			var components = g.components;
			for(var k = 0; k < components.length;k++){
				var pointsArray = components[k].components;
				var polygonPoints = [];
				for(var i = 0; i < pointsArray[0].components.length;i++){
					var p = pointsArray[0].components[i];
					polygonPoints.push([p.x,p.y]);
				}
				var holesArray = [];

				for(var i = 1; i < pointsArray.length; i++){
					var holePoints = [];
					for(var j = 0; j < pointsArray[i].components.length;j++){
						var p = pointsArray[i].components[j];
						holePoints.push([p.x,p.y]);
					}
					holesArray.push(holePoints)
				}
				var coordinates = [];
				coordinates.push(polygonPoints);
				for(var i = 0; i < holesArray.length; i++){
					coordinates.push(holesArray[i]);
				}
				var feature =  { "type": "Feature",
					      "geometry": { "type": "Polygon", "coordinates": coordinates },
					      "properties": {}
				      };
				features.push(feature);
			}
		}
		var geoJson = {};
		geoJson.type = "FeatureCollection";
		geoJson.features = features;
		console.log(g);
		return geoJson;
	}
	
	return {
		WKT2GeoJSON: WKT2GeoJSON
	}
});