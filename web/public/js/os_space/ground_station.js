$.GroundStation = function(properties, gsmap) {
	this.name = properties.name;
	$.each(properties, function(attr, val) {
		this[attr] = val;
	}.bind(this));
	this.properties = properties;
	this.gsmap = gsmap;
	this.stations = {}
	this.satellites = {}
	this.area_created = null;
	this.area = null;
};

$.GroundStation.prototype = {
	load_satellite_orbit : function(satellite_id) {
		$.getJSON("satellites/" + satellite_id + "/orbit",
				function(orbit_response) {

					var orbit = orbit_response.orbit
					this.gsmap.add_orbit(satellite_id, orbit_response.orbit);
				}.bind(this)).fail(
				function(e) {
					alert("Error loading orbit from satellite '" + satellite_id
							+ "':" + e)
				});
	},

	unload_satellite_orbit : function(satellite_id) {
		this.gsmap.remove_orbit(satellite_id)
	},

	show_ground_station : function(ground_station) {
		this.gsmap.add_ground_station(ground_station,
				ground_station.name == this.name, this.ground_station_clicked);
	},

	add_ground_station : function(ground_station) {
		this.stations[ground_station.name] = ground_station;
		this.gsmap.add_ground_station(ground_station,
				ground_station.name == this.name, this.ground_station_clicked);
	},

	get_satellites : function() {
		return this.satellites;
	},

	is_on_map : function(satellite_id) {
		return this.gsmap.has_satellite(satellite_id);
	},
	is_orbit_on_map : function(satellite_id) {
		return this.gsmap.has_orbit(satellite_id);
	},
	is_tracking_satellite : function(satellite_id) {
		return typeof (this.satellites[satellite_id]) !== 'undefined';
	},

	load_ground_stations : function() {
		$.getJSON("ground_stations", function(ground_stations) {
			for (i = 0; i < ground_stations.data.length; i++) {
				this.show_ground_station(ground_stations.data[i])
			}
		}.bind(this)).fail(function(e) {
			alert("Error loading tracked satellites");
		});
	},

	load_tracked_satellites : function() {
		$.getJSON("tracks/satellite", function(tracked_satellites) {

			for (i = 0; i < tracked_satellites.satellites.length; i++) {
				this.add_satellite(tracked_satellites.satellites[i]);
				// this.show_satellite(tracked_satellites.satellites[i]);
			}
		}.bind(this)).fail(function(e) {
			alert("Error loading tracked satellites");
		});
	},
	show_satellite : function(satellite) {
		this.gsmap.add_satellite(satellite, this.satellite_clicked);

	},
	unshow_satellite : function(satellite_id) {
		this.gsmap.remove_satellite(satellite_id);
		if (this.has_satellite(satellite_id)) {
			delete this.satellites[satellite_id];
		}
	},
	show_satellite_orbit : function(satellite) {
		this.load_satellite_orbit(satellite.id);
	},
	add_satellite : function(satellite) {
		this.satellites[satellite.id] = satellite;
		this.show_satellite(satellite);
	},
	remove_ground_station : function(ground_station_name) {
		if (this.has_ground_station(ground_station_name)) {
			delete this.stations[ground_station_name];
			this.gsmap.remove_ground_station(ground_station_name);
		}
	},
	remove_satellite : function(satellite_id) {
		if (this.has_satellite(satellite_id)) {
			delete this.satellites[satellite_id];
			// this.gsmap.remove_satellite(satellite_id)
		}
	},
	has_ground_station : function(ground_station_name) {
		return typeof (this.stations[ground_station_name]) !== 'undefined';
	},
	has_satellite : function(satellite_id) {

		return typeof (this.satellites[satellite_id]) !== 'undefined';
	},
	update_satellite : function(satellite) {

		this.satellites[satellite.id] = satellite;
		this.gsmap.update_satellite(satellite);
	},
	update_ground_station : function(ground_station) {

		if (this.has_ground_station(ground_station.name)) {
			this.stations[ground_station.name] = ground_station;
			this.gsmap.update_ground_station(ground_station);

		} else {

			this.add_ground_station(ground_station);

		}

	},

	track_satellite : function(satellite, always_fn) {
		$.post("tracks/satellite", {
			sender : this.name,
			satellite : satellite.id
		}).done(function(data) {
			this.add_satellite(satellite);
		}.bind(this)).fail(function(err) {
			alert("Error following satellite")
		});
	},
	untrack_current_satellite : function(satellite) {
		this.untrack_satellite(satellite.id);
		this.gsmap.remove_satellite(satellite.id);
	},

	draw_orbit_current_satellite : function(satellite) {
		this.load_satellite_orbit(satellite.id);
	},
	undraw_orbit_current_satellite : function(satellite) {
		this.unload_satellite_orbit(satellite.id);
	},
	untrack_satellite : function(satellite_id, always_fn) {
		$._delete("tracks/satellite", {
			sender : this.name,
			satellite : satellite_id
		}).done(function(data) {
			this.remove_satellite(satellite_id);
		}.bind(this)).fail(function(err) {
			alert("Error following satellite")
		});
	},
	create_area : function(area_name, polygon) {
		$.post("tracks/area", {
			name : area_name,
			points : JSON.stringify(polygon)
		}).done(function(data) {
			this.area = data;
			if (this.area_created != null) {
				this.area_created(data)
			}
		}.bind(this)).fail(function(err) {
			alert("Error tracking area")
		});
	},
	load_area_interest : function() {

		$.getJSON("tracks/area", function(area_response) {

			var areas = area_response.areas

			if (areas.length > 0) {
				this.area = areas[0];
				this.gsmap.load_area(this.area.name, this.area.points);
			}

		}.bind(this)).fail(function(e) {
		});

	},

}