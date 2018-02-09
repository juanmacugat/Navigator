/**
 **/
function satelliteStyle(satStatus) {
	if (satStatus == "SATELLITE_STATUS.receiving") {
		return 'sat_receiving';
	} else if (satStatus == "SATELLITE_STATUS.updating") {
		return 'sat_updating';
	} else {
		return 'sat_predicted';
	}
}

$._delete = function(url, data, callback, type) {

	if ($.isFunction(data)) {
		type = type || callback, callback = data, data = {}
	}

	return $.ajax({
		url : url,
		type : 'DELETE',
		success : callback,
		data : data,
		contentType : type
	});
}

$.QueryString = (function(a) {
	if (a == "")
		return {};
	var b = {};
	for (var i = 0; i < a.length; ++i) {
		var p = a[i].split('=');
		if (p.length != 2)
			continue;
		b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	}
	return b;
})(window.location.search.substr(1).split('&'))

$.SatellitesTable = function(element, ground_station) {
	this.element = element;
	this.gs = ground_station;
};
$.SatellitesTable.prototype = {

	datatable : function() {
		return $(this.element).DataTable();
	},
	load_satellites : function() {

		var satellites_table = this;
		var options = {
			"processing" : true,
			"serverSide" : true,
			"ajax" : "/satellites",
			"ordering" : false,
			"searching" : false,
			"responsive" : true,
			"columns" : [
					{
						"data" : "name"
					},
					{
						"data" : "id"
					},
					{
						"data" : "lat",
						"render" : function(data, type, row) {
							return data.toFixed(2);
						}
					},
					{
						"data" : "lon",
						"render" : function(data, type, row) {
							return data.toFixed(2);
						}
					},
					{
						"data" : "source"
					},
					{
						"data" : "last_update"
					},
					{
						"title" : "Status",
						"data" : "status",
						"render" : function(data, type, row) {
							var cssclass = satelliteStyle(data);
							return '<div height="100%" width="100%" class="'
									+ cssclass + '">&nbsp;&nbsp;&nbsp;</div>';
						}
					},
					{
						"data" : null,
						"title" : '<i title="On Map" class="fa fa-fw fa-map-marker"></i>',
						"render" : function(data, type, row) {
							/**
							 * In this scope the "this" variable is the window
							 * object.
							 */
							var element_id = 'satellite_' + data.id + '_chk';

							var valueShow = "Show";
							var valueOrbit = "Orbit";
							var valueTrack = "Track";

							if (satellites_table.gs
									.is_tracking_satellite(data.id)) {
								satellites_table.gs.update_satellite(data);
								valueShow = "Unshow";
								valueTrack = "Untrack";
							}

							return '<input class="show_satellite_map" type="button" value="'
									+ valueShow
									+ '"/>'
									+ '<input class="orbit_satellite_map" type="button" value="'
									+ valueOrbit
									+ '"/>'
									+ '<input class="track_satellite_map" type="button" value="'
									+ valueTrack + '"  />';
						}
					} ]

		};

		var satellite_table_draw_complete = function() {
			$(".show_satellite_map").each(
					this.activate_show_satellite.bind(this));
			$(".orbit_satellite_map").each(
					this.activate_orbit_satellite.bind(this));
			$(".track_satellite_map").each(
					this.activate_track_satellite.bind(this));
		}
		$(this.element).dataTable(options).on('draw.dt',
				satellite_table_draw_complete.bind(this));

		// this._refresh_interval();
	},
	activate_show_satellite : function(i, button_element) {
		var datatable = this.datatable();

		function on_click() {

			// in this scope the variable "this" is the button
			var satellite = datatable.row(
					button_element.parentElement.parentElement).data();

			if (this.gs.is_on_map(satellite.id)) {
				// sacarlo
				this.gs.unshow_satellite(satellite.id);
				$(button_element).val("Show")
			} else {
				// meterlo
				this.gs.show_satellite(satellite);
				$(button_element).val("Unshow")
			}
		}
		$(button_element).click(on_click.bind(this));

	},
	activate_orbit_satellite : function(i, button_element) {
		var datatable = this.datatable();

		function on_click() {

			// in this scope the variable "this" is the button
			var satellite = datatable.row(
					button_element.parentElement.parentElement).data();

			if (this.gs.is_orbit_on_map(satellite.id)) {
				// sacarlo
				this.gs.unload_satellite_orbit(satellite.id);
				$(button_element).val("Orbit")
			} else {
				// meterlo
				this.gs.load_satellite_orbit(satellite.id);
				$(button_element).val("No Orbit")
			}
		}
		$(button_element).click(on_click.bind(this));

	},
	activate_track_satellite : function(i, button_element) {
		var datatable = this.datatable();

		function on_click() {

			// in this scope the variable "this" is the button
			var satellite = datatable.row(
					button_element.parentElement.parentElement).data();

			if (this.gs.is_tracking_satellite(satellite.id)) {
				// sacarlo
				this.gs.untrack_satellite(satellite.id);
				$(button_element).val("Track")
			} else {
				// meterlo
				this.gs.track_satellite(satellite);
				$(button_element).val("Untrack")
			}
		}
		$(button_element).click(on_click.bind(this));

	},
	_refresh_interval : function() {

		var datatable = $(this.element).DataTable();
		this.refresh_interval = setInterval(function() {

			datatable.ajax.reload();
		}, 15000);
	},
	clear_interval : function() {
		clearInterval(this.refresh_interval);
	}
}
$.GroundStationsTable = function(element, ground_station) {
	this.element = element;
	this.gs = ground_station;
};

$.GroundStationsTable.prototype = {

	load_ground_stations : function() {

		var gs_table = this;
		var table_id = "#" + this.element.id

		var options = {
			"processing" : true,
			"serverSide" : true,
			"ajax" : "/ground_stations",
			"ordering" : false,
			"searching" : false,
			"responsive" : true,
			"columns" : [
					{
						"data" : "name"
					},
					{
						"data" : "lat"
					},
					{
						"data" : "lon"
					},
					{
						"data" : "last_update"
					},
					{
						"title" : '<i tooltip="On Map" class="fa fa-fw fa-map-marker"></i>',
						"data" : null,
						"render" : function(data, type, row) {
							/**
							 * In this scope "this" is the window object
							 */
							var datatable = $(table_id).DataTable();
							if (data.name == gs_table.gs.name) {
								return "";
							} else {
								var element_id = 'staton_' + data.name + '_chk';
								var checked = "";
								// if(window.stations.indexOf(data.name) != -1){
								if (gs_table.gs.has_ground_station(data.name)) {
									checked = "checked=checked";
								}
							}
							return '<input '
									+ checked
									+ '  class="ground_map_chk" type="checkbox" id="'
									+ element_id + '" />'
						}
					} ]

		};
		$(this.element).DataTable(options);

		var ground_table_draw_complete = function() {
			$(".ground_map_chk").each(this.bind_ground_chk_event.bind(this));
		}
		this.datatable().on('draw.dt', ground_table_draw_complete.bind(this));

		this._refersh_interval();

	},
	bind_ground_chk_event : function(i, x) {
		var gs_table = this;
		var ground_chk_change = function(evt) {
			/**
			 * In this scope, the variable "this" is the checkbox element
			 */
			if ($(this).is(':checked')) {
				ground_station = gs_table.datatable().row(
						this.parentElement.parentElement).data()
				gs_table.gs.add_ground_station(ground_station);
			} else {
				gs_table.gs.remove_ground_station(ground_station.name);
			}
		};
		// var name = x.id.replace("staton_", "").replace("_chk", "");
		$('#' + x.id).change(ground_chk_change);
	},
	datatable : function() {
		return $(this.element).DataTable();
	},
	_refersh_interval : function() {
		var gs_table = this;
		this.refersh_interval = setInterval(function() {
			/**
			 * In this context the "this" variable is the windows object.
			 */
			gs_table.datatable().ajax.reload();
		}, 30000);
	},
	clear_interval : function() {
		clearInterval(this.refresh_interval);
	}
}

$.AreaOfInterest = function(element) {
	this.element = element;

};