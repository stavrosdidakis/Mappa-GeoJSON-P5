//Initialize variables
var myMap;
var canvas;
var mappa = new Mappa('Leaflet');
var geoJSON, geoJSONlength;

//Initialize arrays to store the GeoJSON values
var loc = [],
		lat = [],
		lon = [],
		r = [],
		g = [],
		b = [];

var sizeCircle = 80;

//Setting up properties for the Leaflet-Mappa
var options = {
	lat: 50.3745,
	lng: -4.141,
	zoom: 17.4,
	style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

//Load the map
function preload(){
	geoJSON = loadJSON("map.geojson", getGJSON);
}

//Call-back function for getting the GeoJSON data
//After extraction, push the values on each separate array
function getGJSON(data){
	geoJSONlength = data.features.length;
	for (var i = 0; i < geoJSONlength; i++) {
		lat.push(data.features[i].geometry.coordinates[1]);
		lon.push(data.features[i].geometry.coordinates[0]);
		r.push(data.features[i].r);
		g.push(data.features[i].g);
		b.push(data.features[i].b);
	}
}

function setup(){
	canvas = createCanvas(1280,720);

	myMap = mappa.tileMap(options);
	myMap.overlay(canvas)

	//Redraw map on change
	//myMap.onChange(drawPoint);
}

function draw(){
	drawPoint();
}

// We moved everything to this custom function that
// will be trigger only when the map moves
function drawPoint(){
	clear();
	for (var i=0; i<geoJSONlength; i++){
		//Convert all points from latitude and longitude to pixel
		loc[i] = myMap.latLngToPixel(lat[i], lon[i]);
		fill(255, 0, 255, 80);
		stroke(255, 255, 255);
		strokeWeight(3);
		//Draw the ellipses on the location points
		ellipse(loc[i].x, loc[i].y, sizeCircle, sizeCircle);
		//Run the distancePlace function that draws the interactive animation
		distancePlace(loc[i].x, loc[i].y, r[i], g[i], b[i]);
	}
}

//Function that calculates and draws on the screen the distance
//between the mouse position and the locations on screen
function distancePlace(x, y, r, g, b){
	var distanceCalc = dist(mouseX, mouseY, x, y);
	if (distanceCalc<sizeCircle/2){
		var mapAlpha = map (distanceCalc, 0, 50, 255, 0);
		fill(r, g, b, mapAlpha)
	} else {
		fill (0, 0);
	}
	noStroke();
	ellipse(x, y, sizeCircle+3, sizeCircle+3);
	var strokeMap = map (distanceCalc, 0, 350, 255, 0);
	stroke(r, g, b, strokeMap);
	var strokeWeightMap = map (distanceCalc, 0, 350, 20, 0);
	strokeWeight(strokeWeightMap);
	line(mouseX, mouseY, x, y);
}
