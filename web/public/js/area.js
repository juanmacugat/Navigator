function get_area(callback){
	
	$.get("get_area", function(data) {
		
		if (data) {
			var puntos = JSON.parse(data)
			callback(puntos);
		}

	});
	
}