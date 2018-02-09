$.InfoBox = function(gsmap, ground_station) {
	this.gsmap = gsmap
	this.node_name = $("#node_name");
	this.node_status = $("#node_status");
	
	this.node_pos_div = $("#node_position");
	
	this.node_coords_div = $("#node_coords_div");
	this.node_coords = $("#node_coords");
	this.node_surf = $("#node_surf")

	this.node_lat = $("#node_lat");
	this.node_lon = $("#node_lon");
	this.node_altitude = $("#node_alt");
	this.node_utc = $("#node_utc");
	this.node_speed = $("#node_speed");
	this.node_azimuth = $("#node_azimuth");

	// TODO day or night, declination, elevation, rgith ascention, footprint

	this.node_speed_div = $("#node_speed_div");
	this.node_azimuth_div = $("#node_azimuth_div");

	this.node_capabilities_div = $("#node_capabilities_div");
	this.node_seeding_div = $("#node_seeding_div");
	this.node_leeching_div = $("#node_leeching_div");
	this.node_tracking_div = $("#node_tracking_div");
	this.node_next_satellites_div = $("#node_next_satellites_div");
	this.node_viewing_satellites_div = $("#node_viewing_satellites_div");

	this.node_move_btn = $("#node_move_btn");
	this.node_move_btn.click(function(e) {
		this.gsmap.map.move_to(new google.maps.LatLng(this.node.lat,
				this.node.lon))
	}.bind(this));

	
	this.node_center_on_btn = $("#node_center_on_btn");

	this.node_orbit_btn = $("#node_orbit_btn");

	this.node_images = $("#node_images");

	this.node_viewing_satellites = $("#node_viewing_satellites");
	this.node_next_satellites = $("#node_next_satellites");

	this.node_traking = $("#node_tracking");
	this.node_seeding = $("#node_seeding");
	this.node_leeching = $("#node_leeching");
	this.node_capabilities = $("#node_capabilities");

	this.node_untrack_satellite_btn = $("#btn_toggle_track");
	this.node_draw_satellite_orbit_btn = $("#btn_toggle_orbit");
	this.node_images_satellites_btn = $("#btn_toggle_images");

	this.gs = ground_station;

	this.node_untrack_satellite_btn.click(function(e) {
		this.gs.untrack_current_satellite(this.selected_node);
		this.ground_station(this.gs);
	}.bind(this));

	this.node_draw_satellite_orbit_btn.click(function(e) {

		var satellite = this.selected_node;

		if (this.gs.is_orbit_on_map(satellite.id)) {
			this.gs.undraw_orbit_current_satellite(satellite);
			this.node_draw_satellite_orbit_btn.html("Draw orbit")
		} else {
			this.gs.draw_orbit_current_satellite(satellite);
			this.node_draw_satellite_orbit_btn.html("Undraw orbit")
		}

	}.bind(this));

};

$.InfoBox.prototype = {
	html : function(elem, html) {
		elem.find("txt")
	},
	ground_station : function(node, myself) {
		this.selected_node = node;

		this.node_name.html(node.name);
		
		this.node_pos_div.show();		
		this.node_coords_div.hide();

		this.node_lat.html(node.lat);
		this.node_lon.html(node.lon);
		this.node_altitude.html(node.alt);
		this.node_utc.html(node.uct);

		this.node_speed_div.hide();
		this.node_azimuth_div.hide();

		this.node_capabilities_div.show();

		this.node_next_satellites_div.show();
		this.node_viewing_satellites_div.show();

		this.node_untrack_satellite_btn.hide();
		this.node_draw_satellite_orbit_btn.hide();
		this.node_center_on_btn.hide();
		
		this.node_draw_satellite_orbit_btn.hide();
		this.node_untrack_satellite_btn.hide();
		this.node_images_satellites_btn.hide();

		// this.node_images = node.images;

		// this.node_viewing_satellites.html(node.satellites.join(", "));
		this.node_next_satellites.html(node.next_satellites.join(", "));
		this.node_capabilities.html(node.capabilities.join(", "));

		if (myself) {
			this.node_seeding_div.show();
			this.node_leeching_div.show();
			this.node_tracking_div.show();

			this.node_traking.html(node.traking_satellites.join(", "));
			this.node_seeding.html(this._seeding_str(node.seeding));
			this.node_leeching.html(this._leeching_str(node.leeching));

		} else {
			this.node_seeding_div.hide();
			this.node_leeching_div.hide();
			this.node_tracking_div.hide();
		}
	},
	_seeding_str : function(leechs) {

		var strs = $.map(leechs, function(leech, i) {
			return leech["leech"] + "->" + leech["resource"];
		});

		return strs.join(", ");
	},
	_leeching_str : function(seeds) {

		var strs = $.map(seeds, function(seed, i) {
			return seed["seed"] + "->" + seed["resource"];
		});

		return strs.join(", ");
	},
	area : function(node) {
		
		this.selected_node = node;

		this.node_name.html(node.name);

		this.node_pos_div.hide()

		this.node_coords_div.show()
		this.node_coords.html("(10,20),(15,30),(29,8)")
		
		var poli = [];
		for (i = 0; i < node.points.length; i++) {
			e = new google.maps.LatLng(node.points[i].lat, node.points[i].lon);
			poli.push(e);
		}
		
		surf = google.maps.geometry.spherical.computeArea(poli) / 1000000; //da en metros cuadrados y lo paso a km2
		this.node_surf.html(surf.toFixed(2) + " km2")
		
		

		this.node_speed_div.hide();
		this.node_azimuth_div.hide();

		this.node_capabilities_div.show();

		this.node_next_satellites_div.show();
		this.node_viewing_satellites_div.show();

		this.node_untrack_satellite_btn.hide();
		this.node_draw_satellite_orbit_btn.hide();
		this.node_center_on_btn.hide();

		// this.node_images = node.images;

		// this.node_viewing_satellites.html(node.satellites.join(", "));
		// this.node_next_satellites.html(node.updates.join(", "));
		this.node_capabilities.html("relay_satellites");

		this.node_tracking_div.show();
		this.node_traking.html(node.updates.join(", "));
		this.node_seeding_div.hide();
		this.node_leeching_div.hide();

	},
	satellite : function(node, myself) {
		this.node_pos_div.show();		
		this.node_coords_div.hide();
		
		this.selected_node = node;

		this.node_name.html(node.name);

		this.node_untrack_satellite_btn.show();
		this.node_draw_satellite_orbit_btn.show();
		
		this.node_lat.html(node.lat.toFixed(2));
		this.node_lon.html(node.lon.toFixed(2));
		this.node_altitude.html(node.alt);
		this.node_utc.html(node.uct);

		this.node_speed_div.show();
		this.node_azimuth_div.show();

		this.node_speed.html(355);
		this.node_azimuth.html(234);
		
		this.node_draw_satellite_orbit_btn.show();
		this.node_untrack_satellite_btn.show();
		this.node_images_satellites_btn.show();
		
		if (this.gs.is_orbit_on_map(node.id)) {
			this.node_draw_satellite_orbit_btn.html("Undraw orbit");
		}else{
			this.node_draw_satellite_orbit_btn.html("Draw orbit");			
		}
	}
}