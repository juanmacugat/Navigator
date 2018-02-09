function controlDelete(controlDiv, gsmap) {

	// Set CSS for the control border.
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = '#fff';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '2px';
	controlUI.style.borderColor = '#000000';
	controlUI.style.height = '23px';
	controlUI.style.marginTop = '7px';
	controlUI.style.marginLeft = '-6px';
	controlUI.style.paddingTop = '11px';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	// controlUI.title = 'Click to set the map to Home';
	controlDiv.appendChild(controlUI);

	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.style.fontFamily = 'Arial,sans-serif';
	controlText.style.fontSize = '10px';
	controlText.style.paddingLeft = '4px';
	controlText.style.paddingRight = '4px';
	controlText.style.marginTop = '-8px';
	controlText.innerHTML = 'Delete';
	controlUI.appendChild(controlText);

	google.maps.event.addDomListener(controlUI, 'click',
			gsmap.remove_area_interest.bind(gsmap));
}

function togglelHitmap(controlDiv, gsmap) {

	// Set CSS for the control border.
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = '#fff';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '1px';
	controlUI.style.borderColor = '#000000';
	controlUI.style.height = '23px';
	controlUI.style.marginTop = '7px';
	controlUI.style.marginLeft = '-6px';
	controlUI.style.paddingTop = '11px';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	// controlUI.title = 'Click to set the map to Home';
	controlDiv.appendChild(controlUI);

	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.style.fontFamily = 'Arial,sans-serif';
	controlText.style.fontSize = '10px';
	controlText.style.paddingLeft = '4px';
	controlText.style.paddingRight = '4px';
	controlText.style.marginTop = '-8px';
	controlText.innerHTML = 'Heatmap';
	controlUI.appendChild(controlText);

	google.maps.event.addDomListener(controlUI, 'click', gsmap.toggle_heatMap
			.bind(gsmap));
}

function changeGradientHitmap(controlDiv, gsmap) {

	// Set CSS for the control border.
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = '#fff';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '1px';
	controlUI.style.borderColor = '#000000';
	controlUI.style.height = '23px';
	controlUI.style.marginTop = '7px';
	controlUI.style.marginLeft = '-6px';
	controlUI.style.paddingTop = '11px';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	// controlUI.title = 'Click to set the map to Home';
	controlDiv.appendChild(controlUI);

	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.style.fontFamily = 'Arial,sans-serif';
	controlText.style.fontSize = '10px';
	controlText.style.paddingLeft = '4px';
	controlText.style.paddingRight = '4px';
	controlText.style.marginTop = '-8px';
	controlText.innerHTML = 'Change Gradient';
	controlUI.appendChild(controlText);

	google.maps.event.addDomListener(controlUI, 'click',
			gsmap.change_gradient_heatMap.bind(gsmap));
}

function changeRadiusHitmap(controlDiv, gsmap) {

	// Set CSS for the control border.
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = '#fff';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '1px';
	controlUI.style.borderColor = '#0000';
	controlUI.style.height = '23px';
	controlUI.style.marginTop = '7px';
	controlUI.style.marginLeft = '-6px';
	controlUI.style.paddingTop = '11px';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	// controlUI.title = 'Click to set the map to Home';
	controlDiv.appendChild(controlUI);

	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.style.fontFamily = 'Arial,sans-serif';
	controlText.style.fontSize = '10px';
	controlText.style.paddingLeft = '4px';
	controlText.style.paddingRight = '4px';
	controlText.style.marginTop = '-8px';
	controlText.innerHTML = 'Change Radius';
	controlUI.appendChild(controlText);

	google.maps.event.addDomListener(controlUI, 'click',
			gsmap.change_radius_hitmap.bind(gsmap));
}

function changeOpacityHitmap(controlDiv, gsmap) {

	// Set CSS for the control border.
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = '#fff';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '1px';
	controlUI.style.borderColor = '#000000';
	controlUI.style.height = '23px';
	controlUI.style.marginTop = '7px';
	controlUI.style.marginLeft = '-6px';
	controlUI.style.paddingTop = '11px';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	// controlUI.title = 'Click to set the map to Home';
	controlDiv.appendChild(controlUI);

	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.style.fontFamily = 'Arial,sans-serif';
	controlText.style.fontSize = '10px';
	controlText.style.paddingLeft = '4px';
	controlText.style.paddingRight = '4px';
	controlText.style.marginTop = '-8px';
	controlText.innerHTML = 'Change Opacity';
	controlUI.appendChild(controlText);

	google.maps.event.addDomListener(controlUI, 'click',
			gsmap.change_opacity_heatmap.bind(gsmap));
}

$.GroundStationMap = function(element_map, element_legend) {

	this.element = element_map;
	this.element_legend = element_legend;
	this.satellites = {} // id:marker
	this.orbits = {} // sat_id:polygon
	this.ground_stations = {} // name:marker
	this.map = null; // Google maps map object
	this.nite_interval = null;
	this.area = null;
	this.timer = null;
	this.area_created_listener = null;
	this.heatMap = null;
	this.area_on_click = null;
	this.drawingManager = null;
	this.page_area_load = false;
	
};

$.GroundStationMap.prototype = {
	set_center : function(lat, lon) {
		this.map.setCenter(new google.maps.LatLng(lat, lon));
	},
	add_orbit : function(satellite_id, orbit) {

		var imgmarkers = []

		var orbit_points = $.map(orbit, function(x) {
			return new google.maps.LatLng(x.lat, x.lon)
		}.bind(this));

		var polyline = new google.maps.Polyline({
			path : orbit_points,
			geodesic : true,
			strokeColor : "yellow",
			strokeOpacity : 1,
			strokeWeight : 2
		})
		polyline.setMap(this.map);
		this.orbits[satellite_id] = polyline
	},

	remove_orbit : function(satellite_id) {
		this.orbits[satellite_id].setMap(null);
		delete this.orbits[satellite_id];
	},

	add_images : function(satellite_id, images) {

		imgmarkers = []

		var images_points = $.map(images, function(x) {
			var infoBubble = this.create_infobubble(x);
			var marker = this.create_marker(x);
			imgmarkers.push(marker);

			google.maps.event.addListener(marker, 'click', function() {
				infoBubble.open(this.map, marker);
			}.bind(this));
		}.bind(this))
	},

	create_marker : function(coord) {

		var marker = new google.maps.Marker({
			map : this.map,
			visible : true,
			position : new google.maps.LatLng(coord.lat, coord.lon)
		})
		return marker;
	},

	create_infobubble : function(coord) {
		var infoBubble = new InfoBubble({
			map : this.map,
			content : "<img src='" + coord.img + "'>",
			position : new google.maps.LatLng(coord.lat, coord.lon),
			borderRadius : 5,
			arrowSize : 10,
			maxWidth : 300,
			maxHeight : 200,
			arrowPosition : 50,
			backgroundClassName : 'transparent',
			arrowStyle : 2
		});
		return infoBubble;
	},

	update_satellite : function(satellite) {

		var marker = this.satellites[satellite.id];
		// marker.setMap(null);
		marker
				.setPosition(new google.maps.LatLng(satellite.lat,
						satellite.lon));

		marker.labelContent = this._satellite_label_contents(satellite.status);
		// marker.setMap(this.map);
	},

	_init_legend : function() {

		this.map.controls[google.maps.ControlPosition.RIGHT_CENTER]
				.push(this.element_legend);
	},
	_init_nite : function() {

		nite.init(this.map);
		this.nite_interval = setInterval(function() {
			nite.refresh()
		}, 60000);
	},

	stop_nite_update : function() {
		clearInterval(this.nite_interval);
	},

	init : function(center) {

		var mapOptions = {
			zoom : 4,
			center : center,
			panControl : false,
			mapTypeControlOptions : {
				style : google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				position : google.maps.ControlPosition.TOP_RIGHT
			},
			overviewMapControl : true,
			overviewMapControlOptions : {
				opened : true,
				position : google.maps.ControlPosition.LEFT_CENTER
			},
			zoomControl : true,
			zoomControlOptions : {
				style : google.maps.ZoomControlStyle.LARGE,
				position : google.maps.ControlPosition.TOP_LEFT
			},
			scaleControl : true,
			streetViewControl : false

		}
		this.map = new google.maps.Map(this.element, mapOptions);

		function displayCoordinates(pnt) {

			var lat = pnt.lat();
			lat = lat.toFixed(4);
			var lng = pnt.lng();
			lng = lng.toFixed(4);
			$("#lat_leyend").html("Latitude: " + lat);
			$("#lon_leyend").html("Longitude: " + lng);
		}
		google.maps.event.addListener(this.map, 'mousemove', function(event) {
			displayCoordinates(event.latLng);
		});

		this.drawingManager = drawingManager = new google.maps.drawing.DrawingManager(
				{
					// drawingMode : google.maps.drawing.OverlayType.POLYGON,
					drawingControl : false,
					drawingControlOptions : {
						position : google.maps.ControlPosition.TOP_CENTER,
						drawingModes : [ google.maps.drawing.OverlayType.POLYGON ]

					},

				});

		drawingManager.setMap(this.map);

		// Create the DIV to hold the control and call the HomeControl()
		// constructor
		// passing in this DIV.

		// var homeControlDiv = document.createElement('div');
		// var homeControl = new controlDelete(homeControlDiv, this);
		//
		// homeControlDiv.index = 1;
		// this.map.controls[google.maps.ControlPosition.TOP_CENTER]
		// .push(homeControlDiv);

		// Button toggle hitmap
		var togglelHitmapDiv = document.createElement('div');
		var _togglelHitmap = new togglelHitmap(togglelHitmapDiv, this);

		togglelHitmapDiv.index = 2;
		this.map.controls[google.maps.ControlPosition.TOP_CENTER]
				.push(togglelHitmapDiv);

		// Button changeGradient

		var changeGradientHitmapDiv = document.createElement('div');
		var _changeGradientHitmap = new changeGradientHitmap(
				changeGradientHitmapDiv, this);

		changeGradientHitmapDiv.index = 3;
		this.map.controls[google.maps.ControlPosition.TOP_CENTER]
				.push(changeGradientHitmapDiv);

		// Button changeRadiosHitmap

		var changeRadiusHitmapDiv = document.createElement('div');
		var _changeRadiusHitmap = new changeRadiusHitmap(changeRadiusHitmapDiv,
				this);

		changeRadiusHitmapDiv.index = 4;
		this.map.controls[google.maps.ControlPosition.TOP_CENTER]
				.push(changeRadiusHitmapDiv);

		// Button changeOpacity

		var changeOpacityHitmapDiv = document.createElement('div');
		var _changeOpacityHitmap = new changeOpacityHitmap(
				changeOpacityHitmapDiv, this);

		changeRadiusHitmapDiv.index = 5;
		this.map.controls[google.maps.ControlPosition.TOP_CENTER]
				.push(changeOpacityHitmapDiv);

		heatmap = new google.maps.visualization.HeatmapLayer({
			// data : pointArray,
			radius : 1,
			dissipating : false,
		});

		this.heatMap = heatmap;

		google.maps.event
				.addListener(
						drawingManager,
						'polygoncomplete',
						function(polygon) {
							var puntos = polygon.getPath()

							var name_polygon = prompt("Insert Polygon Name: ");

							if (name_polygon == null || name_polygon == "") {
								name_polygon = "Area of interest";
							}

							if (this.area == null) {
								this.area = polygon;
								this.cargarTablaPuntos(puntos);
								this.on_area_created(name_polygon, polygon);
							} else {
								var replace_current_area = confirm("Do you wish to replace with a new area?")
								if (replace_current_area) {
									this.remove_area_interest()
									this.area = polygon;
									// this.borrarTabla("area_table");
									this.on_area_created(name_polygon, polygon);
									this.cargarTablaPuntos(puntos);
								} else {
									// debo borrar el area recientemente
									// dibujada
									polygon.setMap(null);

								}

							}

						}.bind(this));

		this._init_legend();
		this._init_nite();
	},

	_satellite_label_contents : function(satellite_status) {
		return '<div class="' + satelliteStyle(satellite_status)
				+ '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>'
	},

	add_satellite : function(satellite, click_handler) {

		var marker = new MarkerWithLabel({ // google.maps.Marker
			position : new google.maps.LatLng(satellite.lat, satellite.lon),
			map : this.map,
			title : satellite.name,
			labelContent : this._satellite_label_contents(satellite.status),
			labelVisible : true,
			icon : "img/legend/satellite.png"
		});
		this.satellites[satellite.id] = marker;

		google.maps.event.addListener(marker, 'click', function() {
			this.map.panTo(marker.position);
			click_handler(satellite);
		}.bind(this));
	},

	remove_satellite : function(satellite_id) {

		if (typeof (this.satellites[satellite_id]) !== 'undefined') {
			this.satellites[satellite_id].setMap(null);
			delete this.satellites[satellite_id]
		}
		if (typeof (this.orbits[satellite_id]) !== 'undefined') {
			this.orbits[satellite_id].polyline.setMap(null);

			$(this.orbits[satellite_id].images).each(function(i, marker) {
				marker.setMap(null)
			})
			delete this.orbits[satellite_id]
		}
	},

	has_satellite : function(satellite_id) {
		return typeof (this.satellites[satellite_id]) !== 'undefined'
	},

	has_orbit : function(satellite_id) {
		return typeof (this.orbits[satellite_id]) !== 'undefined';
	},

	add_ground_station : function(ground_station, myself, click_handler) {
		var myself = typeof myself !== 'undefined' ? myself : false;
		var latlon = new google.maps.LatLng(ground_station.lat,
				ground_station.lon);
		var icon = "img/legend/ground_station.png";
		if (myself) {
			icon = "img/legend/me.png";
			this.map.setCenter(latlon);
		}

		var marker = new google.maps.Marker({
			position : latlon,
			map : this.map,
			title : ground_station.name,
			icon : icon
		});
		this.ground_stations[ground_station.name] = marker;

		google.maps.event.addListener(marker, 'click', function() {
			this.map.panTo(latlon)
			click_handler(ground_station)
		}.bind(this));
	},

	remove_ground_station : function(ground_station_name) {
		if (typeof (this.ground_stations[ground_station_name]) !== 'undefined') {
			this.ground_stations[ground_station_name].setMap(null);
			delete this.ground_stations[ground_station_name]
		}
	},

	cargarTablaPuntos : function(puntos) {
		return
 // ver el nombre de la tabla
		var table = document.getElementById("area_table");

		var j = table.rows.length;

		// Si i = 1, la tabla solo tiene cargado el encabezado y i = 1 en el
		// insertRow es la segunda posicion.
		// Con lo cual uso i como "contador"

		for (i = 0; i < puntos.length; i++) {
			e = puntos.getAt(i);

			var row = table.insertRow(j);
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			// var cell3 = row.insertCell(2);
			cell1.innerHTML = (e.lat()).toFixed(2);
			cell2.innerHTML = (e.lng()).toFixed(2);

			j++;
		}

	},

	borrarTabla : function(nombre) {
		return

		var table = document.getElementById(nombre);
		// Arranca del 1 para no borrar el encabezado :)
		for (var i = table.rows.length - 1; i >= 1; i--) {
			table.deleteRow(i)
		}
		;
	},

	remove_area_interest : function() {

		if (this.area != null) {
			this.area.setMap(null);
			this.borrarTabla("area_table");
			this.remove_area();
			this.area = null;
		}

	},
	remove_area : function() {
		$._delete("tracks/area", {
			sender : this.name
		}).done(function(data) {
			// NO hacer nada
		}.bind(this)).fail(function(err) {
			alert("Error remove area")
		});

	},

	on_area_created : function(area_name, polygon) {
		if (this.area_created_listener != null) {

			var puntos = polygon.getPath();
			var area_points = [];

			for (i = 0; i < puntos.length; i++) {

				e = puntos.getAt(i);

				area_points.push({
					lat : e.lat(),
					lon : e.lng()
				});

			}
			google.maps.event.addListener(polygon, 'click', function() {
				if (this.area_on_click != null) {
					this.area_on_click(polygon)
				}
			}.bind(this));
			this.area_created_listener(area_name, area_points);

		}

	},

	load_area : function(name, points) {

		poli = new google.maps.Polygon({
			strokeColor : '#FF0000',
			strokeOpacity : 0.8,
			strokeWeight : 3,
			fillColor : '#FF0000',
			fillOpacity : 0.35,

		});

		for (i = 0; i < points.length; i++) {
			e = new google.maps.LatLng(points[i].lat, points[i].lon);
			poli.getPath().push(e);
		}
		poli.setMap(this.map);
		this.area = poli;

		google.maps.event.addListener(poli, 'click', function() {
			if (this.area_on_click != null) {
				this.area_on_click(poli)
			}
		}.bind(this));

		this.cargarTablaPuntos(poli.getPath());
	},
	toggle_heatMap : function() {

		if (this.heatMap.getMap() == null) {
			this.get_ground_stations_location();
		} else {
			this.heatMap.setMap(null);
		}
	},
	get_ground_stations_location : function() {

		$.getJSON("ground_stations", function(ground_stations) {
			// ?length=0&offset=0

			this.show_heatmap(ground_stations)

		}.bind(this)).fail(function(e) {
			alert("Error loading tracked satellites");
		});
	},
	show_heatmap : function(ground_stations) {

		var arrayPuntos = []

		for (i = 0; i < ground_stations.data.length; i++) {
			arrayPuntos.push({
				location : new google.maps.LatLng(ground_stations.data[i].lat,
						ground_stations.data[i].lon),
				weight : 2000
			});
		}
		var arrayCarry = new google.maps.MVCArray(arrayPuntos)
		this.heatMap.data = arrayCarry;
		this.heatMap.setMap(null);
		this.heatMap.setMap(this.map);

	},

	change_gradient_heatMap : function() {
		if (this.heatMap.getMap() == null) {
			alert("You must select heatmap")
		} else {

			var gradient = [ 'rgba(0, 255, 255, 0)', 'rgba(0, 255, 255, 1)',
					'rgba(0, 191, 255, 1)', 'rgba(0, 127, 255, 1)',
					'rgba(0, 63, 255, 1)', 'rgba(0, 0, 255, 1)',
					'rgba(0, 0, 223, 1)', 'rgba(0, 0, 191, 1)',
					'rgba(0, 0, 159, 1)', 'rgba(0, 0, 127, 1)',
					'rgba(63, 0, 91, 1)', 'rgba(127, 0, 63, 1)',
					'rgba(191, 0, 31, 1)', 'rgba(255, 0, 0, 1)' ]

			this.heatMap.set('gradient', this.heatMap.get('gradient') ? null
					: gradient);

		}

	},
	change_radius_hitmap : function() {
		if (this.heatMap.getMap() == null) {
			alert("You must select heatmap")
		} else {
			if (this.heatMap.get('radius') == 1) {
				this.heatMap.set('radius', 50);
				this.heatMap.set('dissipating', true);
			} else {
				this.heatMap.set('radius', 1);
				this.heatMap.set('dissipating', false);
			}
		}

	},
	change_opacity_heatmap : function() {
		if (this.heatMap.getMap() == null) {
			alert("You must select heatmap")
		} else {
			this.heatMap.set('opacity', this.heatMap.get('opacity') ? null
					: 0.2);
		}

	},

	show_area_button_map : function() {

		this.drawingManager.drawingControl = true;
		// this.drawingManager.drawingMode =
		// [google.maps.drawing.OverlayType.POLYGON, ];

		this.drawingManager.setMap(null);
		this.drawingManager.setMap(this.map);
		var homeControlDiv = document.createElement('div');

		var homeControl = new controlDelete(homeControlDiv, this);
		homeControlDiv.id = "pepito";
		homeControlDiv.index = 1;
		$("#pepito").show();

		if (!this.page_area_load) {
			this.map.controls[google.maps.ControlPosition.TOP_CENTER]
					.push(homeControlDiv);

			this.page_area_load = true;

		}

	},
	hide_area_button_map : function() {

		this.drawingManager.drawingControl = false;
		this.drawingManager.setMap(null);
		this.drawingManager.setMap(this.map);

		$("#pepito").hide();

	},
	update_ground_station : function(ground_station) {

		var marker = this.ground_stations[ground_station.name];
		marker.setPosition(new google.maps.LatLng(ground_station.lat,
				ground_station.lon));

	}

}
