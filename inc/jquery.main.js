var owner = 1;
var origin = 1;

$(document).ready(function()
{
	apiQuery(origin);

	$("vessel").live("click", function(){ 
		targetLocation = $(this).attr("data");
		apiQuery(targetLocation);
	}); 

});

function apiQuery(location)
{
	clear();

	$.ajax({ type: "POST", url: "http://api.xxiivv.com/paradise/beholder", data: { values:"{\"owner\":\""+owner+"\",\"location\":\""+location+"\"}" }
	}).done(function( content_raw ) {

		var parsed = JSON.parse(content_raw);
		var parsed_location = null;
		var parsed_vessels = [];

		i = 0;
		while( i<parsed.length){
			if(parsed[i][0] == location){
				parsed_location = parsed[i];
			}
			else{
				parsed_vessels.push(parsed[i]);
			}
			i++;
		}

		$("#location").html(parsed_location[1]);
		$("#note").html(parsed_location[4]);

		i = 0;
		while( i<parsed_vessels.length){
			$("#vessels").append("<vessel data='"+parsed_vessels[i][0]+"'>"+parsed_vessels[i][1]+"</vessel><br />");
			i++;
		}
	});
}

function clear()
{
	$("#location").html("");
	$("#note").html("");
	$("#vessels").html("");
}