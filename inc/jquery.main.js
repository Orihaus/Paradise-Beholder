var owner = 1;
var origin = 1;

$(document).ready(function()
{
	apiQuery(origin);
});

function apiQuery(location)
{
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
		
		console.log("location");
		console.log(parsed_location);
		console.log("vessels");
		console.log(parsed_vessels);

		$("#location").html(parsed_location[1]);
		$("#note").html(parsed_location[4]);

		i = 0;
		while( i<parsed_vessels.length){
			$("#vessels").append("<a href=''>"+parsed_vessels[i][1]+"</a><br />");
			i++;
		}
	});
}