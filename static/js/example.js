var autosave;
var changed 		= false;
var updateInterval 	= 250; // check if changed = true
var maps 			= [];
var layers 			= [];

function getCurrentTab() {return tabsManager.options[tabsManager.selected]}

// go!
$(function(){
	
	//$('body').html('<div id="wrapper"><div id="header"><h1>Lambeth in Numbers | <a href="/mapmydata">Map my data</a></h1></div><div id="tabs"></div><div id="content"></div></div>');
	
	console.log('loading data via ajax..');
	
	$.ajax({
		 url: "/map/load/",
		 dataType: 'json',
		 success:  function(response) 
		 {	
		 	console.log('success');
		 
		 	// comment out to reset back to testing		 
		 	tabsManager = response;
		 	
			//
			autoSave();	
			
			//
			buildTabs(tabsManager.selected);
			switchTab(tabsManager.selected);
	
		 }			
	});
	
	
});


function autoSave()
{	
	if (changed)
	{
		console.log('data changed.. send ajax call');
		
		changed = false; // reset
						
		$.ajax({
			 url: "/map/save/",
			 type: 'POST',
			 data: $.param(tabsManager),
			 success:  function(response) {console.log('saved');}			
		});
	}

	autosave = setTimeout('autoSave()', updateInterval);
}

function buildTabs(tabIndex)
{
	console.log('building tabs..');
	
	var html = '';

	for (var i in tabsManager.options)
	{
		var tab = tabsManager.options[i];
		html += '<li><a id="tab'+i+'" '+(tabIndex == i ? 'class="active"' : '')+' href="#" onclick="switchTab(' + i + '); return false">' + tab.name + '</a></li>';
	}
	
	// Future...
	// html += '<li><a id="add_tab">+</a></li>';
	
	$('#tabs').append(html);
	
	// Future...
	//$( "#add_tab" ).click(function() {
	//	console.log('Add tab');
	//});
}	

function switchRender(obj)
{
	var tab = getCurrentTab();
	tab.layout = obj.value;
	
	// re-render
	switchTab(tabsManager.selected)
}

function switchTab(tabIndex)
{
	console.log('Tab switched to ' + tabIndex);

	// change highlighting on tab 	
 	$('#tabs a').removeClass("active");
 	$('a#tab'+tabIndex).addClass("active");
 	
 	// save tab selection
	tabsManager.selected = tabIndex;
	changed = true;
	
	// get tab
	var tab = getCurrentTab();
	
	// set the #layout-switch 
	var	html = '<div id="layout-switch">';
	for(var i in layouts)
	{
		var layout = layouts[i];

		html += '<label><input '+(tab.layout == i ? ' checked="checked"' : '')+' type="radio" onclick="switchRender(this)" name="render" value="'+i+'" /> '+layout.name+'</label>';
	}
	html += '</div>';
	
	// render html of layout
	html += window[layouts[tab.layout].render]();
	$('#content').html(html);
		
	// start the marker options off at the same height
	if (tab.layout == 1)
		equalHeights();	
		
	// add menu script
	selectMenus();
	
	// add map script
	buildMaps();	
	
	//
	buildCharts();
	
	// tmp
	updateMapMarkers(1);
	updateMapMarkers(2);
}

function equalHeights()
{
	var currentTallest = 0;
	$('.marker-options').each(function(){
		// reset back to natural height
		$(this).css({'min-height': 'inherit'});	
		// which is the tallest
		if ($(this).height() > currentTallest) { currentTallest = $(this).height(); }		
	});
	// set them both to the tallest
	$('.marker-options').each(function(){
		$(this).css({'min-height': currentTallest});	
	});	
}

function mapComparison()
{
	var html = '';
	html +='<div id="panels">';
		html += '<div id="panel-1">';
			html += buildBaseLayerMenu(1);
			html += buildOverlayMarkerMenu(1);
			html += buildMap(1);
		html += '</div>';
		html += '<div id="panel-2">';
			html += buildBaseLayerMenu(2);
			html += buildOverlayMarkerMenu(2);
			html += buildMap(2);
		html += '</div>';
	html += '</div>';
	return html;
}

function mapWithCharts()
{
	var html = '';
	html +='<div id="panels">';
		html += '<div id="panel-1">';
			html += buildBaseLayerMenu(1);
			html += buildOverlayMarkerMenu(1);			
			html += buildMap(1);
		html += '</div>';
		html += '<div id="panel-2">';
			html += buildChart(2);
		html += '</div>';
	html += '</div>';
	return html;
}

function buildBaseLayerMenu(panel)
{
	var tab = getCurrentTab();
			
	var html = '';
	html +='<div class="block">';
		html +='<div class="num">1</div>';
		html +='<div class="selection">';					
			html +='<div class="header">';
				html +='<div class="choose">Choose base layer...</div>';
			html +='</div>';
			
			html +='<div class="layer-choice">';
				
			//		
			var selected 	= tab.panels[panel].baseLayers.selected;	
			var options 	= tab.panels[panel].baseLayers.options;
								
			html +='<div class="base-select"><select>';				
			for (var i in baseLayers)
			{
				html +='<option value="'+panel+'-'+i+'" ' + (i == selected ? ' selected="selected"' : '') + '>'+baseLayers[i].name+'</option>';
			}				
			html +='</select></div>';			
						
			html +='<div class="options-select"><select>';			
			for (var i in baseLayers[selected].options)
			{
				html +='<option value="'+panel+'-'+i+'" ' + (i == options ? ' selected="selected"' : '') + '>'+baseLayers[selected].options[i].name+'</option>';
			}
			html +='</select></div>';
			
			
			html +='</div>';
			
		html +='</div>';
	html +='</div>';
	
	return html;
}


function buildOverlayMarkerMenu(panel)
{
	var tab = getCurrentTab();
		
	var html = '';
	html +='<div class="block">';
		html +='<div class="num">2</div>';
		html +='<div class="selection">';					
			html +='<div class="header">';
				html +='<div class="choose">Choose markers...</div>';									
				html +='<div class="include-users"><label>Include user submitted data <input onclick="updateMapUserData(this, '+panel+')" type="checkbox" '+ (tab.panels[panel].includeUserData == 1 ? ' checked="checked"' : '') +' /></label></div>';
			html +='</div>';

			html +='<div class="marker-group"><select>';
			
			var selected = tab.panels[panel].overlayMarkers.selected;
			
			for (var i in overlayMarkerGroups)
			{
				html +='<option value="'+panel+'-'+i+'" ' + (i == selected ? ' selected="selected"' : '') + '>'+overlayMarkerGroups[i].name+'</option>';
			}			
			html +='</select></div>';				
			
			
			//
			html +='<div class="marker-options"><div>';
			
			for (var i in overlayMarkerGroups[selected].options)
			{
				var option = overlayMarkerGroups[selected].options[i];							
				html += '<span><input ' + (hasValue(tab.panels[panel].overlayMarkers.options, option) ? ' checked="checked"' : '') + ' type="checkbox" onclick="updateMapOption(this, '+ option +','+panel+')" id="marker-'+ panel +'-'+ option +'" /> <label for="marker-'+ panel +'-'+ option +'">' + overlayMarkerOptions[option].name + '</label></span> '; // needs the extra single whitespace
			}			
			
			html +='</div></div>';	
			
			
		html +='</div>';
	html +='</div>';
	
	return html;
}

function hasValue(a, v)
{
   if (!a) return false;
  for (var i=0; i<a.length; i++) { if (a[i] == v) return true; }
  return false;
}


function updateMapOption(obj, option, panel)
{
	var tab = getCurrentTab();

	 //console.log(obj.checked, option, panel);
	
	if (obj.checked)
	{
		// check to see if the option selected is already in the array if not found then push it in
		var found = false;
	
		for(var i in tab.panels[panel].overlayMarkers.options)
		{
			if (tab.panels[panel].overlayMarkers.options[i] == option)
			{
				found = true;
				break;
			}
		}	
		
		// if it can't be found then add it
		if (!found)
		{
			// it'll complain if the options aren't set yet so make an array if undef
			if (!tab.panels[panel].overlayMarkers.options)
				tab.panels[panel].overlayMarkers.options = [];
			
			tab.panels[panel].overlayMarkers.options.push(option);
		}
	}
	else 
	{
		// make a new array for the options and reassign
		var tmpArray = [];
		
		for(var i in tab.panels[panel].overlayMarkers.options)
		{		
			if (tab.panels[panel].overlayMarkers.options[i] != option)
			{
				tmpArray.push(tab.panels[panel].overlayMarkers.options[i]);
			}
		}
		
		tab.panels[panel].overlayMarkers.options = tmpArray;	
	}
			
	//	
	//console.log(tab.panels[panel].overlayMarkers.options);
			

	changed = true;
	updateMapMarkers(panel);
}

function updateMapUserData(obj, panel)
{
	var tab = getCurrentTab();
	tab.panels[panel].includeUserData = (obj.checked ? 1 : 0);
	
	changed = true;
	updateMapMarkers(panel);
}


var markerIcons = [];

// This function needs to be changed so it polls the system CRUD rather than ajax EVERY single time :/
function updateMapMarkers(panel)
{
	var tab = getCurrentTab();
	
	// tmp clear
	for (var i in markerIcons[panel])
	{	
		markerIcons[panel][i].setMap(null);
	}
	// reset
	markerIcons[panel] = [];
	
	
	// loop through the current selection
	for (var i in tab.panels[panel].overlayMarkers.options)
	{
		var option = tab.panels[panel].overlayMarkers.options[i];		
		
		// get the markers..
		$.ajax({
			url: '/map/get_markers/',
			dataType: 'json',
			type: 'POST',		
			data: 'marker_type_id=' + option,
			success: function(response)
			{
				// store
				for (var i in response.markers)
				{
					var marker  		= response.markers[i];
				
					// tmp test to include markers other than user_id 1 = system
					if (tab.panels[panel].includeUserData != 1)
					{
						if (marker[9] != 1)
							continue;
					}
									
					var marker_type_id 	= marker[8];
					var icon			= overlayMarkerOptions[marker_type_id].icon;
					
					var tmp_marker = new google.maps.Marker({
						marker_id: 	marker[0],
						title: 		marker[1],
					    position: 	new google.maps.LatLng(marker[2], marker[3]),
					    map: 		maps[panel],
					    icon: 		'/static/img/icons/'+icon+'.png'		   
					});
										
					markerIcons[panel].push(tmp_marker);				
				}	
				
			}
		});
		
	}	
}




function buildChart()
{
	return '<div id="chart_div"></div>';
}


var bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(51.39785939188926,-0.191999714843746),
    new google.maps.LatLng(51.524064096610815, -0.040937703124996005)
);
var lastKnownInBounds = bounds.getCenter();

function buildMaps()
{
	var tab = getCurrentTab();
	var mapcfg = tab.panels[1].map;
	
	
	// panel 1	
	maps[1] = new google.maps.Map(document.getElementById('map1'), {
		center: new google.maps.LatLng(mapcfg.center[0], mapcfg.center[1]),
		zoom: parseInt(mapcfg.zoom),
		minZoom: 12,
		maxZoom: 18,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false,
		panControl: false,
		streetViewControl: false,
		scrollwheel: false,
		disableDoubleClickZoom : false
	});
	
	
	// debug
	// google.maps.event.addListenerOnce(maps[1], 'click', function(){
	//	console.log(this.getBounds());
	//});	
	
	google.maps.event.addListenerOnce(maps[1], 'idle', function(){
		
		google.maps.event.addListener(maps[1], 'center_changed', function() { 
			var center 	= this.getCenter();
					
			if (bounds.contains(center))
				lastKnownInBounds = center;
			else
			{
				this.setCenter(lastKnownInBounds);
				return;
			}	
							
			mapcfg.center = [center.Xa, center.Ya];
			
			console.log('center_changed');
			
			changed = true;
				
			if (tab.layout == 1)
				maps[2].panTo(center);		
		});
		
		google.maps.event.addListener(maps[1], 'zoom_changed', function() { 
			var zoom	= this.getZoom();			
			mapcfg.zoom = zoom;
			
			console.log('zoom_changed');
			
			changed = true;
				
			if (tab.layout == 1)
				maps[2].setZoom(zoom);	
		});
	});

    renderLayer(1);    
    addLegend(1);
    updateCaption(1);

	// if second map panel
	if (tab.layout == 1)
	{	
		maps[2] = new google.maps.Map(document.getElementById('map2'), {
			center: new google.maps.LatLng(mapcfg.center[0], mapcfg.center[1]),
			zoom: parseInt(mapcfg.zoom),
			minZoom: 12,
			maxZoom: 18,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
			scrollwheel: false,
			disableDoubleClickZoom : true
		});
		
		google.maps.event.addListener(maps[2], 'center_changed', function() {
			maps[1].panTo(this.getCenter());
		});
		
		google.maps.event.addListener(maps[2], 'zoom_changed', function() { 
			console.log("zoom called map 2");
		});		
		
	    renderLayer(2);    
	    addLegend(2);
	    updateCaption(2);
	}
}

function buildCharts()
{
	var tab = getCurrentTab();
	var chartdata = charts[tab.panels[1].baseLayers.selected];
		
	if (tab.layout == 2)
	{
		if(chartdata != undefined)
		{		
			var type 	= chartdata.type;			
			var options = chartdata.options;
			var cols	= chartdata.cols;
			var rows	= chartdata.rows;
		
			var data = new google.visualization.DataTable();
			for (var i in cols)
				data.addColumn(cols[i][0], cols[i][1]);
			data.addRows(rows);
			
			if (chartdata.percent != undefined)
			{
				var formatter = new google.visualization.NumberFormat({ pattern: '#%', fractionDigits: 2});
				formatter.format(data, chartdata.percent);
			}
			
			$('#chart_div').html('<h2>'+chartdata.title+'</h2><p>'+chartdata.desc+'</p><div id="chart"></div>');	
			var chart = new google.visualization[type](document.getElementById('chart'));
			chart.draw(data, options);
		}
		else 
		{
			$('#chart_div').html(':/');	
		}
	}
}






function selectMenus()
{
	$('.base-select select').selectmenu({
	    change: function(e, object){
	    
	    	var tab = getCurrentTab();
	    
	    	console.log('baseLayer');
	    	
			var selectedColumn = object.value.split("-");	   			
			var panel 	= selectedColumn[0];
			var option 	= selectedColumn[1];
			
			tab.panels[panel].baseLayers.selected 	= option;
			tab.panels[panel].baseLayers.options 	= 1; // first option
			
			changed = true;
			
			// remove the options for this base
			$('#panel-'+panel+' .options-select select').remove();	
		
			
			var html ='<select>';
			for (var i in baseLayers[option].options)
			{
				html +='<option value="'+panel+'-'+i+'" ' + (i == 1 ? ' selected="selected"' : '') + '>'+baseLayers[option].options[i].name+'</option>';
			}
			html +='</select>';					
			$('#panel-'+panel+' .options-select').html(html);
			
			
			// rebuild the options
			doOptionsSelect(panel);
					
			// change layer on map
			layers[panel].setMap(null);			
		  	renderLayer(panel);	
		  	updateLegend(panel);
		  	updateCaption(panel)
		  	
		  	buildCharts();	
	    }
	});
	
	//
	doOptionsSelect(1);
	doOptionsSelect(2);
	
	
	// marker-group
	$('.marker-group select').selectmenu({
	    change: function(e, object){
	    	    
	    	var tab = getCurrentTab();
	    	    	
			var selectedColumn = object.value.split("-");	   			
			var panel 		= selectedColumn[0];
			var selected 	= selectedColumn[1];

			console.log(selectedColumn);			
			
			tab.panels[panel].overlayMarkers.selected 	= selected;
			changed = true;
				
			var html = '<div>';			
			for (var i in overlayMarkerGroups[selected].options)
			{
				var option = overlayMarkerGroups[selected].options[i];								
				html += '<span><input ' + (hasValue(tab.panels[panel].overlayMarkers.options, option) ? ' checked="checked"' : '') + ' type="checkbox" onclick="updateMapOption(this, '+ option +','+panel+')" id="marker-'+ panel +'-'+ option +'" /> <label for="marker-'+ panel +'-'+ option +'">' + overlayMarkerOptions[option].name + '</label></span> ';
			}					
			html += '</div>';
			
			// make the visual changes to the second panel
			//if (tab.layout == 2)
			//	panel = 2;

			// remove the marker checkboxes for this group
			$('#panel-'+panel+' .marker-options div').remove();	
			$('#panel-'+panel+' .marker-options').html(html);
		
			// keep both panels the same height
			if (tab.layout == 1)
				equalHeights();
				
		}
	});	
}

function doOptionsSelect(panel)
{
	$('#panel-'+panel+' .options-select select').selectmenu({
	    change: function(e, object){
	    
	    	var tab = getCurrentTab();
	    
	    	console.log('options');
	    	
			var selectedColumn = object.value.split("-");	   			
			var panel 	= selectedColumn[0];
			var option 	= selectedColumn[1];
			
			tab.panels[panel].baseLayers.options = option;		
			changed = true;   
			
			// change layer on map
			layers[panel].setMap(null);			
		  	renderLayer(panel);	     
		  	updateLegend(panel);
		  	updateCaption(panel);		  	
	    }
	});
}

function addLegend(panel)
{
	console.log('addLegend' + panel);
	
	var legendWrapper = document.createElement('div');
    legendWrapper.id = 'legendWrapper' + panel;
    legendWrapper.index = 1;	
	maps[panel].controls[google.maps.ControlPosition.RIGHT_TOP].push(legendWrapper);
	legendContent(legendWrapper, panel);
}

function updateLegend(panel)
{
	console.log('updateLegend' + panel);
	
	var legendWrapper = document.getElementById('legendWrapper' + panel);
	var legend = document.getElementById('legend'+panel);
	legendWrapper.removeChild(legend);
	legendContent(legendWrapper, panel);
}



function renderLayer(panel)
{
	var tab = getCurrentTab();
	
    layers[panel] = new google.maps.FusionTablesLayer({
      query: {
        select: 'geometry',
        from: baseLayers[tab.panels[panel].baseLayers.selected].fusion
      }
    });
    layers[panel].setMap(maps[panel]);
    
    //
   	var styles = [];
   	
   	var baseLayer			= baseLayers[tab.panels[panel].baseLayers.selected];
   	var baseLayersOptions 	= baseLayer.options[tab.panels[panel].baseLayers.options];
	
	var stylesRanges 		= baseLayersOptions.styles;
	var col 				= baseLayersOptions.col;   
	var reverseRange		= (baseLayer.reverseRange ? baseLayer.reverseRange : false);

	   
    for (var i in colorRange) 
    {   	
    	var low 	= stylesRanges[i];
    	var next	= parseFloat(i)+1;
    	var high 	= stylesRanges[next];
    
    	var style = {
	    	where: (reverseRange ? "'"+col+"'<="+low+" AND '"+col+"'>="+high : "'"+col+"'>="+low+" AND '"+col+"'<="+high),
	    	polygonOptions: {
	      		fillColor: colorRange[i],
	      		fillOpacity: 0.6
	    	}
	    };
	    
    	styles.push(style);
    }
    
    layers[panel].set('styles', styles);       
}

function legendContent(legendWrapper, panel)
{
	var tab = getCurrentTab();
	
 	var legend = document.createElement('div');
    legend.id = 'legend'+panel;
    
   	var baseLayer			= baseLayers[tab.panels[panel].baseLayers.selected];
   	var baseLayersOptions 	= baseLayer.options[tab.panels[panel].baseLayers.options];
	var stylesRanges 		= baseLayersOptions.styles;
	
    for (var i in colorRange) 
    {   
		var low 	= stylesRanges[i];
		var next	= parseFloat(i)+1;
		var high 	= stylesRanges[next];
		
		var legendItem = document.createElement('div');
		
		var color = document.createElement('span');
		color.setAttribute('class', 'color');
		color.style.backgroundColor = colorRange[i];
		legendItem.appendChild(color);	
		
		var minMax = document.createElement('span');
		minMax.innerHTML = low + ' - ' + high;
		legendItem.appendChild(minMax);
		
		legend.appendChild(legendItem);
    }
    
    legendWrapper.appendChild(legend);
}


/* */
function updateCaption(panel)
{
	var tab = getCurrentTab();
   	var baseLayer			= baseLayers[tab.panels[panel].baseLayers.selected];
   	var baseLayersOptions 	= baseLayer.options[tab.panels[panel].baseLayers.options];
   	
	$('#panel-'+panel+' .about span').html(baseLayersOptions.about);
	$('#panel-'+panel+' .source span').html(baseLayersOptions.source);	
	
	var currentTallest = 0;
	$('.about').each(function(){
		// reset back to natural height
		$(this).css({'min-height': 'inherit'});	
		// which is the tallest
		if ($(this).height() > currentTallest) { currentTallest = $(this).height(); }		
	});
	// set them both to the tallest
	$('.about').each(function(){
		$(this).css({'min-height': currentTallest});	
	});		
}

function buildMap(panel)
{
	var html = '<div class="about"><strong>Layers:</strong> <span></span></div>';
	html += '<div id="map'+panel+'" class="map"></div>';
	html += '<div class="source"><strong>Source:</strong> <span></span></div>';
	return html;
}