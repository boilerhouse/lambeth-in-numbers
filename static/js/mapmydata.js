var autosave;
var changed 		= false;
var updateInterval 	= 250; // check if changed = true

var lastChecked;
var map;
var markerIcons = [];
var tmp_marker;
var infowindow = new google.maps.InfoWindow();
var locked = false;

var graystyles = [{stylers: [{saturation: -95}]}];
var normalstyles = [{stylers: [{saturation: 0}]}];

var config = {};

//
function lockMap()
{
	locked = true;
	map.setOptions({
    	disableDoubleClickZoom: true,
    	draggable: false,
    	navigationControl: false
	});
	map.setMapTypeId('gray');
}
function unlockMap()
{
	locked = false;
	map.setOptions({
   		disableDoubleClickZoom: false,
    	draggable: true,
    	navigationControl: true
  	});	
	map.setMapTypeId('normal');
}


function drawMap()
{
	
	map = new google.maps.Map(document.getElementById('map1'), {
		center: new google.maps.LatLng(config.center[0], config.center[1]),
		zoom: parseInt(config.zoom),
		minZoom: 12,
		maxZoom: 18,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false,
		panControl: false,
		streetViewControl: false,
		scrollwheel: false,
		disableDoubleClickZoom : false
	});
	
	//
	var layer = new google.maps.FusionTablesLayer({
      query: {
      	select: 't',
        from: '1WlXk5RnE3oVRtrsqnm48V75pfN66Do0nbIw2xX8',
         where: "name NOT EQUAL TO 'Lambeth'"
      }
    });	
	layer.setMap(map);
	
	var styles = [
    	{polygonOptions: {
      		fillColor: '#42505D',
      		fillOpacity: 0.3,
      		strokeColor: '#00B259', 
            strokeWeight: 2
    	}}
	];
 	layer.set('styles', styles); 
	 
	//
	map.mapTypes.set('gray', new google.maps.StyledMapType(graystyles));
	map.mapTypes.set('normal', new google.maps.StyledMapType(normalstyles));




	google.maps.event.addListenerOnce(map, 'idle', function(){
		
		google.maps.event.addListener(map, 'center_changed', function() { 
			var center 	= this.getCenter();
					
			config.center = [center.Xa, center.Ya];			
			changed = true;

		});
		
		google.maps.event.addListener(map, 'zoom_changed', function() { 
			var zoom	= this.getZoom();			
			
			config.zoom = zoom;
			changed = true;
		});
	});





	//
	google.maps.event.addListener(map, 'click', function(event) {
	
		if (locked)
			return;
		
		// lock to prevent anything else happening	
		lockMap();
			
		addMarker(event);	
	});	
		
	// Load existing markers
	$.ajax({
		 url: "/mapmydata/load/",
		 dataType: 'json',
		 success:  function(response) 
		 {	 			 		 
		 	lastChecked = response.last_checked;
		 
		 	//
			for (var i in response.markers)
			{
				var marker = response.markers[i];
				
				//(function(i, marker) {setTimeout(function(){
						
					dropMarker(marker);
								
				//}, i * 250);}(i, marker));
					
			}			
			
			// start checking now for changes
			autoCheck();
		 }			
	});		
		
	// if they click the X
	google.maps.event.addListener(infowindow,'closeclick',function(){
		
		// if they closed it without saving
		if (tmp_marker != null)
		{
			tmp_marker.setMap(null);
			tmp_marker = null;
		}
		
		//
		unlockMap();
	});
		
}



function openInfoWindow(event, contentString)
{
	infowindow.setContent('<div id="infowindow">' +contentString+ '</div>');
	
	// 		
	infowindow.setPosition(event.latLng);
	infowindow.open(map);
	
	// activate the select style	
	// focus the cursor
	google.maps.event.addListener(infowindow, 'domready', function() {
	
		$('select').selectmenu();

    	$("#title").focus();
    });			
}

function addMarker(event)
{
	var latLng = event.latLng;
	var options = {marker_id: null, title: 'untitled', marker_type_id: null};
	tmp_marker = newMarker(options, latLng);

	// leave a lil time for it to fall before opening for effect
	setTimeout(function(){
		var contentString = '<form onsubmit="save(this); return false;">';
		contentString += '<p><label>Title<br /><input id="title" type="text" name="title" size="35" class="text" /></label></p>';
		
		
		// categories
		contentString += '<p style="margin-bottom: 0"><label>Marker type:</label></p>';
		contentString += '<div class="marker-type-id">';
		contentString += '<select name="marker_type_id">';
		
		for (var i in overlayMarkerOptions)
		{
			contentString += '<option value="'+i+'">'+overlayMarkerOptions[i].name+'</option>';
			// contentString += '<span><label><input type="checkbox" name="categories[]" value="'+i+'" /> '+overlayMarkerOptions[i].name+'</label></span> ';
		}
		contentString += '</select>';
		contentString += '</div>';
		
		contentString += '<p><br /><input type="hidden" name="latitude" value="'+event.latLng.Xa+'" /><input type="hidden" name="longitude" value="'+event.latLng.Ya+'" /><input type="submit" name="submit" class="submit" value="Save" /></label></p>';
		contentString += '</form>';
		openInfoWindow(event, contentString);
	}, 500);

}	

function newMarker(options, latLng)
{
	var icon = (overlayMarkerOptions[options.marker_type_id] != undefined ? overlayMarkerOptions[options.marker_type_id].icon : 'star-3-grey');
	
	return new google.maps.Marker({
		marker_id: 	options.marker_id,
		title: 		options.title,
	    position: 	latLng,
	    map: 		map,
	    animation: 	google.maps.Animation.DROP,
	    draggable: 	true,
	    icon: 		'/static/img/icons/'+icon+'.png'		   
	});	
}


function save(obj)
{
	var fail = false;
	obj.submit.value= 'Saving...';
	
	// valid
	if (obj.title.value == '')
	{
		//
		fail = true;
	}

	
	if (fail)
	{
		obj.submit.value = 'Save';
		return; // prevent submit
	}
	
	console.log($(obj).serialize());
			
	$.ajax({
	 url: "/mapmydata/save_marker/",
	 type: 'POST',
	 data: $(obj).serialize(),
	 dataType: 'json',
	 success:  function(response) 
	 {	
	 	console.log(response);
	 
	 	var marker_id = response.marker_id;
	 	
	 	// update tmp obj
	 	tmp_marker.marker_id 	= marker_id;
	 	tmp_marker.title 		= obj.title.value;
	 	
	 	// change icon
	 	tmp_marker.setIcon('/static/img/icons/'+overlayMarkerOptions[obj.marker_type_id.value].icon+'.png');
	 	
	 	//
	 	markerIcons[marker_id] = tmp_marker;
	 	
	 	// now attach events
		attachEvents(marker_id);
		
	 	// no longer needed
	 	tmp_marker = null;
		
		// close window
		infowindow.close();
		
		// unlock
		unlockMap();			 	
	 }
	});
}

function remove(obj)
{
	// DELETE!
	var marker_id = obj.marker_id.value;
	
	// start deleting...
	markerIcons[marker_id].setIcon('/static/img/icons/star-3-red.png');
	markerIcons[marker_id].setAnimation(google.maps.Animation.BOUNCE);
	
	// instant remove		
	$.ajax({
	 url: "/mapmydata/delete_marker/",
	 type: 'POST',
	 data: "marker_id=" + marker_id,
	 dataType: 'json',
	 success:  function(response) 
	 {			
	 	console.log(response);
	 	
	 	// assume deleted..
		deleteMarker(response.marker_id);
		
		// close window
		infowindow.close();
		
		// unlock
		unlockMap();
		
	 }
	});	
	
}


function attachEvents(marker_id)
{
 	// now attach the method for removing
	google.maps.event.addListener(markerIcons[marker_id], 'click', function(event) {

		if (locked) return;
				
		// lock to prevent anything else happening	
		lockMap();
		
		var contentString = '<form onsubmit="remove(this); return false;">';
		contentString += '<p><input type="hidden" name="marker_id" value="'+marker_id+'" /><input type="submit" name="submit" class="delete" value="Delete" /></label></p>';
		contentString += '</form>';
		openInfoWindow(event, contentString);
	});	
	
	
	google.maps.event.addListener(markerIcons[marker_id], 'dragend', function(event) {
						
		$.ajax({
		 url: "/mapmydata/update_marker/",
		 type: 'POST',
		 data: "marker_id=" + this.marker_id + "&latitude="+event.latLng.Xa+"&longitude="+event.latLng.Ya,
		 dataType: 'json',
		 success:  function(response) 
		 {	
			// no need to move as it's already there duh...
		 }
		});	
		
	});	
}

function dropMarker(marker)
{
	var marker_id = marker[0];
	var latLng = new google.maps.LatLng(marker[2],marker[3]);
	var options = { marker_id: marker_id, title: marker[1], marker_type_id: marker[8]}

	markerIcons[marker_id] = newMarker(options, latLng);	
	attachEvents(marker_id);
}

function deleteMarker(marker_id)
{	
	// remove off map straightaway
	if (markerIcons[marker_id] && markerIcons[marker_id].setMap !== undefined)
		markerIcons[marker_id].setMap(null);

	// update to say that it's been removed so the ajax doesn't need to do anything on next check
	delete markerIcons[marker_id];
}

function moveMarker(marker_id, latitude, longitude)
{
	var latLng = new google.maps.LatLng(latitude, longitude);
	
	if (markerIcons[marker_id] && markerIcons[marker_id].setPosition !== undefined)
		markerIcons[marker_id].setPosition(latLng);
}

function autoCheck()
{
	$.ajax({
	 url: "/mapmydata/check/",
	 type: 'POST',
	 data: "last_checked=" + lastChecked,
	 dataType: 'json',
	 success:  function(response) 
	 {		
	 	// update the last checked time
	 	lastChecked = response.last_checked;

	 	if (response.markers.length > 0)
	 	{
			for (var i in response.markers)
			{
				var marker = response.markers[i];
				
				var marker_id = marker[0];
				
				if (marker[7] != null)
				{
					console.log('delete' + marker_id);
					if (markerIcons[marker_id] !== undefined)
					{
						console.log("Yep exists so delete!");
						deleteMarker(marker_id)
					}					
				}
				else if (marker[6] != null) 
				{
					console.log('update' + marker_id);					
					moveMarker(marker_id, marker[2], marker[3]);								
				}
				else 
				{
					console.log('create' + marker_id);
					if (markerIcons[marker_id] === undefined)
					{
						console.log("Doesnt exist so create!");
						dropMarker(marker);
					}					
				}				
			}	 		
	 	}
	 	
	 	setTimeout('autoCheck()', 500);
	 }
	});	
		
}
	
function autoSave()
{	
	if (changed)
	{
		console.log('data changed.. send ajax call');
		
		changed = false; // reset
						
		$.ajax({
			 url: "/mapmydata/saveconfig/",
			 type: 'POST',
			 data: $.param(config),
			 success:  function(response) {console.log('saved');}			
		});
	}

	autosave = setTimeout('autoSave()', updateInterval);
}

$(function(){

	var html = '<div id="wrapper">';
	html += '<div id="header"><h1><a href="/">Lambeth in Numbers</a> | Map my data</h1></div>';
	html += '<div id="content"></div>';
	html += '</div>';
	
	//$('body').html(html);
	
	$('#content').html('<div id="panels"><div id="map1" class="map"></div></div>');
	
	$.ajax({
		 url: "/mapmydata/mapconfig/",
		 dataType: 'json',
		 error: function(response, msg) 
		 {	
		 	//console.log(response, msg);
		 },
		 success:  function(response) 
		 {	
		 	console.log('success');
		 
		 	//		 
		 	config = response;
		 	
			//
			drawMap();
			autoSave();
		 }			
	});

		
			
});