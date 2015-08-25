// Config

var universeId = 1;

// World

var universeArray = [];

// User

var userLocation = 1;

$(document).ready(function()
{
	loadUniverse(universeId);

	console.log( universeArray )

	inquisitorParse( worldLocation, finishedParsing );

	$("vessel").live("click", function(){ 
		targetLocation = $(this).attr("data");
		currentWorldLocationID = targetLocation;
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
	//console.log(universeArray);
	//displayWorld();
}

var worldLocation = 'ToBurninMemory_World.inq';
var world;
var currentWorldLocationID = 24;

function finishedParsing( result )
{
    world = result;
    console.log( world );
    displayWorld();
}

function displayWorld()
{
	clear();
	
	$( "#location" ).html( world.rawlocations[currentWorldLocationID].name );
	$( "#parent" ).html( "- " + world.rawlocations[currentWorldLocationID].region + " -" );
	$( "#note" ).html( world.rawlocations[currentWorldLocationID].desc );

	var child = 0;
	for ( var objectname in world.rawlocations[currentWorldLocationID].parent )
	{
	    if ( child > 0 )
	    {
	        var childid = world.rawlocations[currentWorldLocationID].parent[objectname].id;

	        if ( childid != -1 )
	        {
	            console.log( "inquisitor: Enumerating Sibling: " + childid );
	            $( "#vessels" ).append( "<vessel data='" + childid + "'>" + world.rawlocations[childid].name + "</vessel><br />" );
	        }
	    }
	    child++;
	}

    //
}

function clear()
{
	$("#location").html("");
	$("#note").html("");
	$("#vessels").html("");
}