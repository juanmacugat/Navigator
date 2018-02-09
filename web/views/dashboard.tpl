<!doctype html>
<html class="no-js" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Space AI - Dashboard</title>
    <link rel="stylesheet"
          href="http://dhbhdrzi4tiry.cloudfront.net/cdn/sites/foundation.min.css">
    <link rel="stylesheet" href="css/app.css">
    <link rel="stylesheet" href="foundation-icons/foundation-icons.css">
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
                    <button type="button" class="button">{{user.name}}</button>
                </li>
            </ul>
        </div>
    </div>
</div>
<br>
<div class="row">
            <div class="row columns">
            <nav aria-label="You are here:" role="navigation">
                <ul class="breadcrumbs">
                    <li><a href="draw_area" id="area_button">Area</a></li>
                    <li><a href="#">Satellite</a></li>
                </ul>
            </nav>
        </div>
    <div class="medium-8 columns">
        <div id="map-canvas"></div>
    </div>
    <div class="medium-6 large-4 columns">
        <h3 id="satellite_name"></h3>
        <div class="row">
            <div class="small-4 columns">
                <label class="middle">Latitude:</label>
            </div>
            <div class="small-8 columns">
                <label id='latitude' class="middle">{{satellite.latitude}}</label>
            </div>
            <div class="small-4 columns">
                <label class="middle">Longitude:</label>
            </div>
            <div class="small-8 columns">
                <label id='longitude' class="middle">{{satellite.longitude}}</label>
            </div>
            <div class="small-4 columns">
                <label class="middle">Altitude:</label>
            </div>
            <div class="small-8 columns">
                <label id='altitude' class="middle">{{satellite.altitude}}</label>
            </div>
            <div class="small-4 columns">
                <label class="middle">Velocity:</label>
            </div>
            <div class="small-8 columns">
                <label id='velocity' class="middle">{{satellite.velocity}}</label>
            </div>
        </div>
        <a href="#" class="button large expanded">More info</a>
    </div>
</div>
<div class="column row">
    <hr>
    <ul class="tabs" data-tabs id="example-tabs">
        <li class="tabs-title is-active"><a href="#panel1"
        aria-selected="true">My trackings</a></li>
    </ul>
    <div class="tabs-content" data-tabs-content="example-tabs">
        <table width="100%">
            <thead>
            <tr>
                <th>#</th>
                <th>Satellite</th>
                <th>Satellite Service</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            %for item in tracking:
            <tr>
                <td>{{item.id}}</td>
                <td>{{item.satellite.name}}</td>
                <td>{{item.satellite.name}}</td>
                <td>{{item.status}}</td>
                <td>
                    <div class="icon-bar three-up">
                        <a class="item"> <i class="fi-play"></i>
                        </a> <a class="item"> <i class="fi-pause"></i>
                    </a> <a class="item"> <i class="fi-stop"></i>
                    </a>
                    </div>
                </td>
            </tr>
            %end
            </tbody>
        </table>
    </div>
</div>
<div class="row column">
    <hr>
    <ul class="menu">
        <li class="float-right">Copyright 2016</li>
    </ul>
</div>
<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script
        src="http://dhbhdrzi4tiry.cloudfront.net/cdn/sites/foundation.js"></script>
<script src="js/satellite.js" type="text/javascript"></script>
<script src="js/area.js" type="text/javascript"></script>
<script src="js/preorb/predict.js" type="text/javascript"></script>
<script src="js/preorb/predictExample.js" type="text/javascript"></script>
<script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBQfWyCbKGfp0998G9lVP3XoxbE94EZt-s">
</script>
<script>
    var map;
    var satellitesMarkers = {};
    var points = [];
    var poly;

    var satellitesTLEs = {};
    var satellite_clicked = null;
    var groundstation_clicked = null;

    function initialize() {

        var lat = parseFloat({{user.position.lat}});
        var lon = parseFloat({{user.position.lon}});

        var myLatlng = new google.maps.LatLng(lat, lon);

        map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: myLatlng,
            zoom: 2
        });

        poly = new google.maps.Polygon({
            paths: points,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            editable: false
        });

    }

    function load_satellites(satellites) {
        $.each(satellites, function (index, sat) {

            var marker = new google.maps.Marker({
                map: map,
                icon: 'img/satellite2.png',
                title: sat.name
            });

            var title = marker.getTitle();

            marker.addListener('click', function(){
                changeSelectedSatellite(marker.getTitle());
            });

            satellitesMarkers[sat.name] = marker;
            satellitesTLEs[sat.name] = [sat.tleline1, sat.tleline2];
            setInterval(function () {
                draw_satellite(sat);
            }, 400);
        })
    }

    function draw_satellite(sat) {

        var marker = satellitesMarkers[sat.name];
        marker.setMap(null);

        // Initialize a satellite record
        var satrec = satellite.twoline2satrec(sat.tleline1, sat.tleline2);

        //  Or you can use a calendar date and time (obtained from Javascript Date).
        var now = new Date();
        // NOTE: while Javascript Date returns months in range 0-11, all satellite.js methods require
        // months in range 1-12.
        var positionAndVelocity = satellite.propagate(
                satrec,
                now.getUTCFullYear(),
                now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds()
        );

        var positionEci = positionAndVelocity.position;

        var gmst = satellite.gstime_from_date(
                now.getUTCFullYear(),
                now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds()
        );

        var positionGd = satellite.eci_to_geodetic(positionEci, gmst);

        var latitude = positionGd.latitude;
        var longitude = positionGd.longitude;

        var myLatLng = {lat: satellite.degrees_lat(latitude), lng: satellite.degrees_long(longitude)};

        marker.setPosition(myLatLng);
        marker.setMap(map);
    }

    function drawPolygon(myPoints) {
        points = []
        points = myPoints.slice();
        poly.setPath(points);
        poly.setMap(null);
        poly.setMap(map);
    }

    function changeSelectedSatellite(satellite) {
        satellite_clicked = satellite;
        setInterval(function(){
            updateInfoBox();
        }, 500);
    }

    function updateInfoBox() {
        var tles = satellitesTLEs[satellite_clicked];

        //  var infosat = Orb.generateCurrentPosition(satellite_clicked, tles[0], tles[1]);

        // Initialize a satellite record
        var satrec = satellite.twoline2satrec(tles[0], tles[1]);

        //  Or you can use a calendar date and time (obtained from Javascript Date).
        var now = new Date();
        // NOTE: while Javascript Date returns months in range 0-11, all satellite.js methods require
        // months in range 1-12.
        var positionAndVelocity = satellite.propagate(
                satrec,
                now.getUTCFullYear(),
                now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds()
        );

        var positionEci = positionAndVelocity.position;

        var gmst = satellite.gstime_from_date(
                now.getUTCFullYear(),
                now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds()
        );

        var positionGd = satellite.eci_to_geodetic(positionEci, gmst);

        var latitude = positionGd.latitude;
        var longitude = positionGd.longitude;

        $('#latitude').html(satellite.degrees_lat(latitude));
        $('#longitude').html(satellite.degrees_long(longitude));
        $('#altitude').html(positionGd.height);
        $('#velocity').html(positionAndVelocity.velocity);
        $('#satellite_name').html(satellite_clicked);
    }

</script>
<script>
    $(document).ready(function () {
        initialize();
        var sats = {{!satellites}};
        load_satellites(sats);
        get_area(drawPolygon);
    });
</script>
</body>
</html>
