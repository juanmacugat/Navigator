<!doctype html>
<html class="no-js" lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Draw Area</title>
<link rel="stylesheet"
	href="http://dhbhdrzi4tiry.cloudfront.net/cdn/sites/foundation.min.css">

<link rel="stylesheet" href="css/reveal.css">
<script src="js/area.js" type="text/javascript"></script>


<style type="text/css">
#map {
	padding: 0;
	margin: 0;
	width: 100%;
	height: 428px;
}
</style>

</head>
<body>
	<div class="top-bar">
		<div class="row">
			<div class="top-bar-left">
				<ul class="dropdown menu" data-dropdown-menu>
					<li class="menu-text">Space AI - Navigator</li>
				</ul>
			</div>
			<div class="top-bar-right">
				<ul class="menu">
					<li>
						<button type="button" class="button">Juan</button>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="medium-8 columns">
			<div class="row columns">
				<nav aria-label="You are here:" role="navigation">
					<!-- <ul class="breadcrumbs">
						<li><a  href="draw_area" id="area_button" >Area</a></li>
						<li><a href="#">Satellite</a></li>
					</ul> -->
				</nav>
			</div>
			<BR> <BR>

			<div id="map-canvas"></div>
		</div>

	</div>




	<div class="row">
		<div class="medium-6 columns">
			<div id="map"></div>


		</div>
		<div class="medium-6 large-5 columns">
			<h3>Select Area</h3>

			<div class="expanded button-group">

				<!-- 	<a href="draw_area" id="update_area" data-reveal-id="myModal"
					data-reveal-ajax="true" class="button">Update Area</a>  -->
				<a id="update_area" data-reveal-id="myModal"
					data-reveal-ajax="draw_area" class="button">Update Area</a>


			</div>
			<a href="#" id='delete' data-open="exampleModal1" class="button">Delete
				Area</a>
		</div>
		<div class="row">
			<div id="tabla"></div>
		</div>

	</div>
	<div class="row column">
		<hr>
		<ul class="menu">
			<li class="float-right">Copyright 2016</li>
		</ul>
	</div>

	<div class="reveal" id="exampleModal1" data-reveal>
		<h2>You want to clear the area?</h2>

		<a href="#" id='delete-button' data-close class="button">Yes</a> <a
			href="#" id='close-modal' data-close class="button">No</a>
		<button class="close-button" data-close aria-label="Close modal"
			type="button">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>

	<!-- <p><a data-open="exampleModal1">Click me for a modal</a></p> -->

	<!-- <div id="myModal" class="reveal-modal" data-reveal></div> -->



	<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
	<script
		src="http://dhbhdrzi4tiry.cloudfront.net/cdn/sites/foundation.js"></script>

	<script type="text/javascript">
		var points = []
		var map;
		var poly;

		function init() {
			initMap();
			update_selected_area();
			get_area(drawOtherPolygon);
		}

		function update_selected_area() {

			$("#update_area").click(function(evt) {

				if (points.lenght != 0) {
					var put = JSON.stringify(points);
					$("#points").val(put);
					$("#miForm").submit();
					/*  $.post("set_area",{'points': put});*/

				}

				/* $('#myModal').foundation('reveal', 'open', 'prueba.html'); */

			});

		}

	

		function initMap() {

			map = new google.maps.Map(document.getElementById('map'), {
				zoom : 3,
				center : {
					lat : -34.5677997,
					lng : -58.4344577
				},
			/* mapTypeId : google.maps.MapTypeId.TERRAIN */
			});

			poly = new google.maps.Polygon({
				paths : points,
				strokeColor : '#FF0000',
				strokeOpacity : 0.8,
				strokeWeight : 2,
				fillColor : '#FF0000',
				fillOpacity : 0.35,
				editable : false
			});

			google.maps.event.addListener(map, 'click', function(event) {
				// alert( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() ); 
				drawPolygon(poly, event);
			});

			google.maps.event.addDomListener(document
					.getElementById('delete-button'), 'click', deletePolygon);

		}

		function drawPolygon(poly, event) {

			points.push({
				lat : event.latLng.lat(),
				lng : event.latLng.lng()
			});

			poly.setPath(points);

			poly.setMap(null);

			poly.setMap(map);

			addTable();
		}

		function drawOtherPolygon(myPoints) {

			points = []

			points = myPoints.slice();

			poly.setPath(points);

			poly.setMap(null);

			poly.setMap(map);

			addTable();
		}

		function deletePolygon() {

			deleteTable();
			points = [];
			poly.setMap(null);

		}

		function addTable() {

			deleteTable();

			var tablearea = $('#tabla');
			var table = $('<table/>').addClass("table");

			var tr = $('<tr/>').appendTo(table);

			$('<td/>').appendTo(tr).html('Lat');
			$('<td/>').appendTo(tr).html('Lon');

			for (var i = 0; i < points.length; i++) {

				var tr = document.createElement('tr');

				tr.appendChild(document.createElement('td'));
				tr.appendChild(document.createElement('td'));

				var lat = points[i].lat;
				var lg = points[i].lng;

				tr.cells[0].appendChild(document.createTextNode(lat))
				tr.cells[1].appendChild(document.createTextNode(lg));

				table.append(tr);
			}

			tablearea.append(table);
		}

		function deleteTable() {

			$('#tabla').empty();

		}
	</script>

	<form action="set_area" method="post" id="miForm">

		<input type="hidden" name="points" id="points" />

	</form>


	<script
		src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBZjIj6CfswF7y6GY74-kvc7SVfHFPVrq8&signed_in=true&libraries=drawing&callback=init"></script>


	<script>
		$(document).foundation();
		
/* 		$(document).ready(function() {
			
		}); */
	</script>
</body>
</html>
