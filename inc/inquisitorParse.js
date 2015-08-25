var inquisitorParse = function ( source, callback )
{
    var result =
    {
        regions: {},
        rawlocations: []
    };

    var at = 0, ch, escapee =
    {
        '"': '"',
        '\\': '\\',
        '/': '/',
        b: '\b',
        f: '\f',
        n: '\n',
        r: '\r',
        t: '\t'
    }, text;

    var finished = false;

    var error = function ( m )
    {
        throw {
            name: 'SyntaxError',
            message: m,
            at: at,
            text: text
        };
    };

    var previous = function ()
    {
        at -= 1;
        ch = text.charAt( at );
        return ch;
    };

    var next = function ( c )
    {
        if ( c && c !== ch )
        {
            error( "Expected '" + c + "' instead of '" + ch + "'" );
        }

        ch = text.charAt( at );

        at += 1;
        return ch;
    };

    var white = function ()
    {
        while ( ch && ch <= ' ' )
        {
            next();
        }
    };

    var value;  // Place holder for the value function.

    var regions = [];

    var location = function ()
    {
        console.log( "inquisitorParse: Processing Location" );

        var key,
            location = {};
        location.name = "";
        location.fullname = "";
        location.desc = "";
        location.namesegments = [];
        location.id = result.rawlocations.length;

        if ( ch === '~' )
        {
            next( '~' );

            var namesegmentid = 0;
            var namesegmentcurrent = "";
            var namesegmentcurrentposition = 0;
            while ( at < text.length )
            {
                if ( namesegmentid == 0 || namesegmentcurrentposition > 1 )
                {
                    namesegmentcurrent += ch;
                }
                location.fullname += ch;
                next();

                namesegmentcurrentposition++;
                if ( ch === '-' || ch === '\n' )
                {
                    namesegmentid++;
                    location.namesegments.push( namesegmentcurrent.trim() );
                    namesegmentcurrent = "";
                    namesegmentcurrentposition = 0;
                }

                if ( ch === '\n' )
                {
                    break;
                }
            }
            console.log( "inquisitorParse: Creating location: " + location.fullname + " with ID: " + location.id );
            console.log( "inquisitorParse: Found " + namesegmentid + " name segments." );

            location.region = location.namesegments[0];
            location.name = location.namesegments[namesegmentid - 1];

            console.log( "inquisitorParse: Found location region: " + location.region );
            console.log( "inquisitorParse: Found location name: " + location.name );

            //

            while ( ch !== '~' && at < text.length && ch !== '/' )
            {
                location.desc += ch;
                next();
            }
            console.log( "inquisitorParse: Found location description: " + location.desc );

            //

            var regionceptiondepth = 0;
            var parentregionception;
            var regionception = result.regions;

            while ( regionceptiondepth < namesegmentid )
            {
                if ( !( regionception.hasOwnProperty( location.namesegments[regionceptiondepth] ) ) )
                {
                    console.log( "inquisitorParse: Creating new Region: " + location.namesegments[regionceptiondepth] + ". Depth: " + regionceptiondepth );
                    regionception[location.namesegments[regionceptiondepth]] = { id: regionceptiondepth == namesegmentid - 1 ? location.id : -1 };
                }
                else
                {
                    console.log( "inquisitorParse: Found parent Region: " + location.namesegments[regionceptiondepth] + ". Depth: " + regionceptiondepth );
                    if ( regionceptiondepth == namesegmentid - 1 )
                    {
                        regionception[location.namesegments[regionceptiondepth]].id = location.id;
                    }
                }

                parentregionception = regionception;
                regionception = regionception[location.namesegments[regionceptiondepth]];
                regionceptiondepth++;
            }

            location.parent = parentregionception;
            result.rawlocations.push( location );

            return location;
        }

        error( "Bad Location" );
    };

    var value = function ()
    {
        console.log( "inquisitorParse: Finding object to process" );

        switch ( ch )
        {
            case '~':
                return location();
            default:
                next();
                return '';
        }
    };

    console.log( "inquisitorParse: Began parser." );

    //

    var client = new XMLHttpRequest();
    client.open( 'GET', source );

    client.onreadystatechange = function ()
    {
        if ( this.readyState == this.DONE )
        {
            text = client.responseText;
            next();
            console.log( "inquisitorParse: Loaded source. Length: " + text.length + " characters." );

            //

            while ( at < text.length )
            {
                value();
            }

            callback( result );
        }
    }

    client.send();

}