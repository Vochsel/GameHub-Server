

function CreateRegExSearch(lIdentifier, rIdentifier)
{
//    return new RegExp('\\' + lIdentifier + "(.*?)\\" + rIdentifier, 'g');
    return new RegExp('\\' + lIdentifier + "([\\s\\S]*?)\\" + rIdentifier, 'g');
}

function SearchForRegEx(regex, callback)
{
    match = regexSearch.exec(source);
    while (match != null) {
        
        callback(match);

        match = regexSearch.exec(source);
    }
}

exports.Valid = function(a_object) {
    if(typeof a_object === "string")
        return (a_object && a_object.length !== "");
    else
        return (a_object && a_object !== null && a_object !== undefined);
}

exports.MapFromObject = function(a_object) {
    //Create empty map
    var m = new Map();

    //Iterate object keys and insert into map
    Object.keys(a_object).forEach(key => {
        m.set(key, a_object[key]);
    });


    return m;
}

//Replace injection literals with data
exports.FormatStringWithData = function(source, data)
{
    var regexSearch = CreateRegExSearch('{', '}');

    //Search for all valid injection literals
    var match = regexSearch.exec(source);
    while (match != null) {
        // -- Found match
        
        //Injection literal path
        var injVarPath = match[1];

        //Search for injection literal in supplied data object
        var val = Object.byString(data, injVarPath);

        if(val)
        {
            
            //Check if obj is array, then look for [ asdasd ]
            if(typeof val === 'object')
            {
                val = Object.values(val); 
                //console.log("Arr:" + val);  
            }

            //console.log(injVarPath + " = " + JSON.stringify(val))
            
            if(Array.isArray(val))
            {
                //console.log(match);
                var templateSearch = CreateRegExSearch('[', ']');
                var templateSearchSrc = source.substring(match.index);

                var res = "";

                var templateLength = 0;

                var templateMatch = templateSearch.exec(templateSearchSrc);
                while (templateMatch != null) {
                    var templateSrc = templateMatch[1];
                    templateLength += templateMatch[0].length;

                    for(var i = 0; i < val.length; i++)
                    {
                        var v = val[i];
                        var idata = exports.InjectData(templateSrc, v);
                        //console.log(idata);

                        res += idata;

                        //var s = templateSrc.substring(0, templateMatch.index) + val + source.substring(match.index + match[0].length);

                        //Maybe check if object?
                    }

                    templateMatch = templateSearch.exec(templateSearchSrc);
                }
                
                source = source.substring(0, match.index) + res + source.substring(match.index + match[0].length + templateLength);
            } else {
                //Basic replacement
                source = source.substring(0, match.index) + val + source.substring(match.index + match[0].length);
            }

        }

        match = regexSearch.exec(source);
    }

    return source;
}