const Debug = require('./debug.js');
const fs = require('fs');

// -- Private Utility Functions

//Create regexpression from left and right bracket identifiers
function CreateRegExSearch(lIdentifier, rIdentifier)
{
    return new RegExp('\\' + lIdentifier + "([\\s\\S]*?)\\" + rIdentifier, 'g');
}

//Iterate all matches of regex
function SearchForRegEx(a_regex, a_source, a_callback)
{
    var match = a_regex.exec(a_source);
    while (match != null) {
        
        a_callback(match);

        match = a_regex.exec(a_source);
    }
}

// -- Public Utility Functions

//Checks if object is valid
exports.Valid = function(a_object) {
    if(typeof a_object === "string")
        return (a_object && a_object.length !== "");
    else
        return (a_object && a_object !== null && a_object !== undefined);
}

//Context aware function to return length of object
exports.Length = function(a_object) {
    if(a_object) {
        if(Object.is(a_object))
            return Object.values(a_object).length;
        else if(Array.isArray(a_object))
            return a_object.length;
    }
    else 
        return null;
}

//Converts object to a map
exports.MapFromObject = function(a_object) {
    //Create empty map
    var m = new Map();

    //Iterate object keys and insert into map
    Object.keys(a_object).forEach(key => {
        m.set(key, a_object[key]);
    });

    //Return map
    return m;
}

//Replace injection literals with data
exports.FormatStringWithData = function(source, a_data)
{
    //Create regex search for variables
    var regexSearch = CreateRegExSearch('{', '}');

    //Search for all valid injection literals

    var match = regexSearch.exec(source);
    while (match != null) {
        // -- Found match
        
        //Injection literal path
        var injVarPath = match[1];

        //Search for injection literal in supplied data object
        var val = Object.byString(a_data, injVarPath);
        if(val)
        {
            //If val is an object, convert to array of values
            if(typeof val === 'object')
            {
                val = Object.values(val);
            }
            
            if(Array.isArray(val))
            {
                //If val is array, use template replacement: {array}[<p>{ben}</p>]

                //Create regex search for [ ] 
                var templateSearch = CreateRegExSearch('[', ']');
                var templateSearchSrc = source.substring(match.index);

                //String to store entire result
                var res = "";

                var templateLength = 0;

                //Search for square brackets
                var templateMatch = templateSearch.exec(templateSearchSrc);
                while (templateMatch != null) {
                    var templateSrc = templateMatch[1];

                    //Store length of template string
                    templateLength += templateMatch[0].length;

                    //Insert formatted template for each value in array
                    for(var i = 0; i < val.length; i++)
                    {
                        var v = val[i];
                        //Format template src with array iteration {}
                        var idata = exports.FormatStringWithData(templateSrc, v);

                        res += idata;                        
                        
                        //Maybe check if object?
                    }
                    
                    //Look for next match
                    templateMatch = templateSearch.exec(templateSearchSrc);
                }
                //Array replacement
                source = source.substring(0, match.index) + res + source.substring(match.index + match[0].length + templateLength);
                //Check source one more time... Could be better with recursion...
                source = exports.FormatStringWithData(source, a_data);
            } else {
                //Otherwise use direct replacement
                source = source.substring(0, match.index) + val + source.substring(match.index + match[0].length);
                //Check source one more time... Could be better with recursion...
                source = exports.FormatStringWithData(source, a_data);
            }

        } else {

            Debug.Error("[Formatter] Could not find any variable called " + injVarPath + " in data supplied!");
        }
        //Solves recursion problem, likely will introduce other problems...
        //source = exports.FormatStringWithData(source, a_data);
        
        //Look for next match
        match = regexSearch.exec(source);
    }

    //Return formatted source
    return source;
}

exports.LoadFile = function(a_path) {
    //Store ref to this for callback
    var self = this;

    //Read file asynchronously
    fs.readFileSync(this.url, function read(a_err, a_data) {

        //Error loading file
        if (a_err) {
            //Log out error message
            Debug.Error("[Resource] Error reading file!");
            Debug.Error("[Resource] " + a_err);

            //Emit error event
            self.emit("error", a_err);

            //Throw Error?
            throw a_err;
        }

        //Store file contents
        return a_data;
    });
}