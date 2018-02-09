var Orb = 
	{
		satelliteMarkers: new Array(),

		startTracking: function(homeLat, homeLng)
		{
			PLib.InitializeData();
			Orb.setHomeCoordinates(homeLat, homeLng);
		},

		setHomeCoordinates: function(homeLat, homeLng)
		{
			PLib.configureGroundStation(homeLat, homeLng);
		},

		crossBrowserSetStyle: function(element, css, append)
		{
			var obj, attributeName;
			var useStyleObject = element.style.setAttribute;

			obj = useStyleObject ? element.style : element;
			attributeName = useStyleObject ? "cssText" : "style";

			if (append)
				css += obj.getAttribute(attributeName);

			obj.setAttribute(attributeName, css);
		},

		createCell: function(tr, className, txt)
		{
			var td = document.createElement("td");
			td.className = className;
			txt = document.createTextNode(txt);
			td.appendChild(txt);
			tr.appendChild(td);
		},

		createHeaderColumn: function(tr, txt)
		{
			var th = document.createElement("th");
			th.className = "table-header";
			txt = document.createTextNode(txt);
			th.appendChild(txt);
			tr.appendChild(th);
		},

		generateTable: function(divTable)
		{
			var tr, visibilityText, detailClassName;
			var frag = document.createDocumentFragment();
			var satInfoColl = PLib.getTodaysPasses();
			
			while (divTable.childNodes.length > 0)
			{
			    divTable.removeChild(divTable.firstChild);
			}
			
			var tbl = document.createElement("table");
			Orb.crossBrowserSetStyle(tbl, "border-collapse: collapse; margin-left: auto; margin-right: auto;", false);
			
			var thead = document.createElement("thead");
			tr = document.createElement("tr");
			
			Orb.createHeaderColumn(tr, 'Satellite Number ID (TLE file input order)');
			Orb.createHeaderColumn(tr, 'Name');
			Orb.createHeaderColumn(tr, 'Pass Number');
			Orb.createHeaderColumn(tr, 'Date');
			Orb.createHeaderColumn(tr, 'Local Time');
			Orb.createHeaderColumn(tr, 'Peak Elev.');
			Orb.createHeaderColumn(tr, 'Azimuth');
			Orb.createHeaderColumn(tr, 'Range (km)');
			Orb.createHeaderColumn(tr, 'Visibility');
			
			thead.appendChild(tr);
			tbl.appendChild(thead);
			
			var tbody = document.createElement("tbody");
			
			for (var i = 0; i < satInfoColl.length; i++)
			{
				tr = document.createElement("tr");
				
				detailClassName = satInfoColl[i].visibility == "+" ? "table-detailVisible" : "table-detail";
				
				Orb.createCell(tr, detailClassName, satInfoColl[i].number);
				Orb.createCell(tr, detailClassName, satInfoColl[i].name);
				Orb.createCell(tr, detailClassName, satInfoColl[i].passNo);
				Orb.createCell(tr, detailClassName, PLib.formatDateOnly(satInfoColl[i].dateTimeStart));
				Orb.createCell(tr, detailClassName, PLib.formatTimeOnly(satInfoColl[i].dateTimeStart) + " - " + PLib.formatTimeOnly(satInfoColl[i].dateTimeEnd));
				Orb.createCell(tr, detailClassName, satInfoColl[i].peakElevation + "\u00B0");
				Orb.createCell(tr, detailClassName, satInfoColl[i].riseAzimuth + ", " + satInfoColl[i].peakAzimuth + ", " + satInfoColl[i].decayAzimuth);
				Orb.createCell(tr, detailClassName, satInfoColl[i].riseRange + ", " + satInfoColl[i].peakRange + ", " + satInfoColl[i].decayRange);
				
				switch(satInfoColl[i].visibility)
				{
					case "+":
						visibilityText = 'Visible';
						break;    
					case "*":
						visibilityText = 'Not Visible';
						break;
					default:
						visibilityText = 'Eclipsed';
				}
				
				Orb.createCell(tr, detailClassName, visibilityText);
				
				tbody.appendChild(tr);
			}
			
			tbl.appendChild(tbody);
			frag.appendChild(tbl);
			divTable.appendChild(frag);
		},		
			
		generateCurrentPositionTable: function(divTable)
		{
			var tr, visibilityText, detailClassName;
			var frag = document.createDocumentFragment();
			var satInfoColl = PLib.getTodaysPasses();
			var satInfo;
			
			while (divTable.childNodes.length > 0)
			{
			    divTable.removeChild(divTable.firstChild);
			}
			
			var tbl = document.createElement("table");
			Orb.crossBrowserSetStyle(tbl, "border-collapse: collapse; margin-left: auto; margin-right: auto;", false);
			
			var thead = document.createElement("thead");
			tr = document.createElement("tr");
			
			Orb.createHeaderColumn(tr, 'Name');
			Orb.createHeaderColumn(tr, 'Latitude');
			Orb.createHeaderColumn(tr, 'Longitude');
			Orb.createHeaderColumn(tr, 'Azimuth');
			Orb.createHeaderColumn(tr, 'Elevation');
			Orb.createHeaderColumn(tr, 'Slant Range');
			Orb.createHeaderColumn(tr, 'Orbital Phase');
			Orb.createHeaderColumn(tr, 'Visibility');
			
			thead.appendChild(tr);
			tbl.appendChild(thead);
			
			var tbody = document.createElement("tbody");
			
			for (var i = 0; i < PLib.sat.length; i++)
			{
				satInfo = PLib.QuickFind(PLib.sat[i].name);

				tr = document.createElement("tr");
				
				detailClassName = satInfoColl[i].visibility == "+" ? "table-detailVisible" : "table-detail";
				
				Orb.createCell(tr, detailClassName, PLib.sat[i].name);
				Orb.createCell(tr, detailClassName, satInfo.latitude);
				Orb.createCell(tr, detailClassName, satInfo.longitude);
				Orb.createCell(tr, detailClassName, satInfo.azimuth);
				Orb.createCell(tr, detailClassName, satInfo.elevation);
				Orb.createCell(tr, detailClassName, satInfo.slantRange);
				Orb.createCell(tr, detailClassName, satInfo.orbitalPhase);
				
				switch(satInfoColl[i].visibility)
				{
					case "+":
						visibilityText = 'Visible';
						break;    
					case "*":
						visibilityText = 'Not Visible';
						break;
					default:
						visibilityText = 'Eclipsed';
				}
				
				Orb.createCell(tr, detailClassName, visibilityText);
				
				tbody.appendChild(tr);
			}
			
			tbl.appendChild(tbody);
			frag.appendChild(tbl);
			divTable.appendChild(frag);
		},

		generateCurrentPosition: function(satname, tle1, tle2)
		{
			var currentDate = new Date();
			return PLib.QuickFind(satname, currentDate, tle1, tle2);
		},

		generateCurrentPositionArray: function(startDate, stopDate, minutesInterval)
		{
			var satInfo;
			var satInfoArray = new Array();

			var currentDate = startDate;
			while (currentDate <= stopDate) {
				currentDate = Orb.addMinutes(currentDate, minutesInterval);

				for (var i = 0; i < PLib.sat.length; i++)
				{
					satInfoArray.push(satInfo = PLib.QuickFind(PLib.sat[i].name, currentDate));
				}

			}
			return satInfoArray;
		},

		generateCurrentPositionArray: function(satname, tle1, tle2, startDate, stopDate, minutesInterval)
		{
			var satInfo;
			var satInfoArray = new Array();

			var currentDate = startDate;
			while (currentDate <= stopDate) {
				currentDate = Orb.addMinutes(currentDate, minutesInterval);
				satInfoArray.push(satInfo = PLib.QuickFind(satname, currentDate, tle1, tle2));
			}
			return satInfoArray;
		},

		addMinutes: function (oldDateObj, minutes) {
			var newDateObj = new Date();
			newDateObj.setTime(oldDateObj.getTime() + (minutes * 60 * 1000));
			return newDateObj;
		}

	}