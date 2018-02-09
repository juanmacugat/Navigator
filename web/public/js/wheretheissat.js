var setArrows;
function ArrowHandler(map) {
	this.setMap(map);
	this.arrowheads = []
}
ArrowHandler.prototype = new google.maps.OverlayView;
ArrowHandler.prototype.draw = function() {
	if (this.arrowheads.length > 0)
		for (var b = 0, a; a = this.arrowheads[b]; b++)
			a.setOptions({
				position : this.usePixelOffset(a.p1, a.p2)
			})
};
ArrowHandler.prototype.usePixelOffset = function(b, a) {
	var e = this.getProjection(), f = google.maps, c = e
			.fromLatLngToContainerPixel(b), d = e.fromLatLngToContainerPixel(a);
	c = new f.Point(d.x - c.x, d.y - c.y);
	var g = Math.sqrt(c.x * c.x + c.y * c.y);
	c = new f.Point(c.x / g, c.y / g);
	f = new f.Point(d.x - 12 * c.x, d.y - 12 * c.y);
	return e.fromContainerPixelToLatLng(f)
};
ArrowHandler.prototype.addIcon = function(b) {
	var a = google.maps;
	return new a.MarkerImage("http://www.google.com/mapfiles/" + b, new a.Size(
			24, 24), null, new a.Point(12, 12))
};
ArrowHandler.prototype.create = function(b, a, e) {
	var f, c = google.maps;
	if (e == "onset")
		f = b;
	else if (e == "head")
		f = this.usePixelOffset(b, a);
	else if (e == "midline")
		f = c.geometry.spherical.interpolate(b, a, 0.5);
	var d = c.geometry.spherical.computeHeading(b, a).toFixed(1);
	d = Math.round(d / 3) * 3;
	if (d < 0)
		d += 240;
	if (d > 117)
		d -= 120;
	d = this.addIcon("dir_" + d + ".png");
	f = new c.Marker({
		position : f,
		map : this.map,
		icon : d,
		icon : d,
		animation : c.Animation.DROP,
		clickable : false
	});
	if (e == "head") {
		f.p1 = b;
		f.p2 = a;
		this.arrowheads.push(f)
	}
};
ArrowHandler.prototype.load = function(b, a) {
	for (var e = 0; e < b.length - 1; e++)
		e % 3 == 0 && this.create(b[e], b[e + 1], a)
};
function createPoly(b, a) {
	setArrows.load(b, a)
};

var iss_time, iss_alt, iss_vel, iss_lat, iss_lon, center_iss = true, pause_iss = false;
function initialize() {
	latlng = new google.maps.LatLng(data_lat, data_lon);
	myOptions = {
		zoom : 3,
		center : latlng,
		disableDefaultUI : true,
		zoomControl : true,
		mapTypeControl : true,
		scaleControl : true,
		mapTypeId : google.maps.MapTypeId.TERRAIN
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	var a = new google.maps.MarkerImage(iss_img_url, new google.maps.Size(168,
			120), new google.maps.Point(0, 0), new google.maps.Point(65, 73)), b = new google.maps.LatLng(
			data_darklat, data_darklon);
	termCircle = new google.maps.Circle({
		strokeColor : "black",
		strokeOpacity : 0.1,
		strokeWeight : 5,
		fillColor : "black",
		fillOpacity : 0.4,
		map : map,
		center : b,
		radius : 10018790
	});
	horizonCircle = new google.maps.Circle({
		strokeColor : "#FFFFFF",
		strokeOpacity : 0.8,
		strokeWeight : 2,
		fillColor : "#FFFFFF",
		fillOpacity : 0.3,
		map : map,
		center : latlng,
		radius : data_footprint
	});
	marker = new google.maps.Marker({
		position : latlng,
		map : map,
		icon : a,
		title : "ISS"
	});
	(new google.maps.Polyline({
		path : passCoords,
		geodesic : true,
		strokeColor : "yellow",
		strokeOpacity : 1,
		strokeWeight : 2
	})).setMap(map);
	a = google.maps;
	setArrows = new ArrowHandler;
	a.event.addListenerOnce(map, "tilesloaded", function() {
		createPoly(passCoords, "head")
	})
}
$(document).ready(function() {
//	$("#predictions-button").click(function() {
//		window.location = "/w/passes"
//	});
//	initialize();
//	iss_time = $("#iss_time");
//	iss_alt = $("#iss_alt");
//	iss_vel = $("#iss_vel");
//	iss_lat = $("#iss_lat");
//	iss_lon = $("#iss_lon");
//	$("#center_checkbox").live("click", function() {
//		center_iss = center_iss ? false : true
//	});
//	$("#pause_checkbox").live("click", function() {
//		pause_iss = pause_iss ? false : true
//	});
//	doIssUpdate()
});
function issUpdate() {
	pause_iss
			|| $
					.ajax({
						url : "/w/ajax/realtime",
						timeout : 900,
						success : function(a) {
							if (a.success === true) {
								$(iss_time).html(a.data.time);
								$(iss_alt).html(a.data.alt);
								$(iss_vel).html(a.data.vel);
								$(iss_lat).html(a.data.lat);
								$(iss_lon).html(a.data.lon);
								setISSVisibility(a.data.vis);
								var b = new google.maps.LatLng(a.data.lat,
										a.data.lon), c = new google.maps.LatLng(
										a.data.darklat, a.data.darklon);
								center_iss && map.setCenter(b);
								marker.setPosition(b);
								horizonCircle.setCenter(b);
								horizonCircle.setRadius(a.data.footprint);
								termCircle.setCenter(c)
							} else
								alert(a.data)
						}
					});
	t = setTimeout("issUpdate()", 1E3)
}
function setISSVisibility(a) {
	var b = $("#iss_vis");
	switch (a) {
	case "V":
	case "D":
		b.html("<strong>The ISS is in daylight</strong>");
		b.attr("class", "index-daylight-sat-key");
		break;
	case "E":
		b.html("<strong>The ISS is in Earth's shadow</strong>");
		b.attr("class", "index-eclipsed-sat-key");
		break;
	default:
		b.html("");
		break
	}
}
function doIssUpdate() {
	issUpdate()
};