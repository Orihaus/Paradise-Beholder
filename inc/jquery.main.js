// Config

var universeId = 1;

// World

var universeArray = [];

// User

var userLocation = 1;

$(document).ready(function()
{
	loadUniverse(universeId);

	console.log(universeArray)

	$("vessel").live("click", function(){ 
		targetLocation = $(this).attr("data");
		userLocation = targetLocation;
		displayWorld();
	}); 
});

function loadUniverse(location)
{
	clear();

	$.ajax({ type: "POST", url: "http://api.xxiivv.com/paradise/beholder", data: { values:"{\"owner\":\""+universeId+"\",\"location\":\""+location+"\"}" }
	}).done(function( content_raw ) {
		var parsed = JSON.parse(content_raw);
		universeArray = parsed;
		saveWorld(universeArray);
	});
}

function saveWorld(universeArray)
{
	console.log(universeArray);
	displayWorld();
}

function displayWorld()
{
	clear();
	
	var parsed_location = null;
	var parsed_visibles = [];

	i = 0;
	while( i<universeArray.length){
		if( universeArray[i][0] == userLocation ){
			parsed_location = universeArray[i];
		}
		else if( universeArray[i][3] == userLocation ){
			parsed_visibles.push(universeArray[i]);
		}
		i++;
	}

	$("#location").html(parsed_location[1]);
	$("#note").html(parsed_location[4]);

	i = 0;
	while( i < parsed_visibles.length){
		$("#vessels").append("<vessel data='"+parsed_visibles[i][0]+"'>"+parsed_visibles[i][1]+"</vessel><br />");
		i++;
	}
}

function clear()
{
	$("#location").html("");
	$("#note").html("");
	$("#vessels").html("");
}