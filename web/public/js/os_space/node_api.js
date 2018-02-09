$.NODE_API  = {
		satellite_orbit: function(satellite_id){
			return "fake_api/orbit";
		},
		get_tracks_satellite: function(){
			return "fake_api/tracks_satellite";
		},
		post_tracks_satellite: function(){
			return "fake_api/tracks_satellite"
		},
		delete_tracks_satellite:function (){
			return "fake_api/tracks_satellite";
		},
		ground_stations: function(){
			return "fake_api/ground_stations"
		},
		ground_station: function(gs_name){
			return "fake_api/ground_station_" + gs_name
		},
		get_tracks_area: function(){
			return "fake_api/area";
		},
		post_tracks_area: function(){
			return "fake_api/area"
		},
		delete_tracks_area: function(){
			return "fake_api/area";
		},
		satellite: function(satellite_id){
			return "fake_api/satellite_" + satellite_id
		}
}
//$.NODE_API  = {
//		satellite_orbit: function(satellite_id){
//			return "satellites/" + satellite_id + "/orbit";
//		},
//		get_tracks_satellite: function(){
//			return "tracks/satellite";
//		},
//		post_tracks_satellite: function(){
//			return "tracks/satellite"
//		},
//		delete_tracks_satellite:function (){
//			return "tracks/satellite";
//		},
//		ground_stations: function(){
//			return "ground_stations"
//		},
//		ground_station: function(gs_name){
//			return "ground_stations/" + gs_name
//		},
//		get_tracks_area: function(){
//			return "tracks/area";
//		},
//		post_tracks_area: function(){
//			return "tracks/area"
//		},
//		delete_tracks_area: function(){
//			return "tracks/area";
//		},
//		satellite: function(satellite_id){
//			return "/satellites/" + satellite_id
//		}
//}