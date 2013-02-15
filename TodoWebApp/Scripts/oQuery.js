
var oQuery = function (serviceUrl) {
    /// <summary>Create oQuery object</summary>
    /// <param name="serviceUrl" type="String">
    ///     (optional) fragment root http://myservice/data.svc
    ///    if you don't specify then just the fragment will be created
    /// </param>
    this._serviceUrl = "";
    this._collection = "";
    this._whereClauses = new Array();
    this._orderByClauses = new Array();
    this._expandClauses = new Array();
    this._letmap = new Object();
    this._iCh = 0;
    this._newClause = "";

    if (serviceUrl)
        this._serviceUrl = serviceUrl;
}

oQuery.prototype.From = function (collectionName) {
    /// <summary>
    /// From(CollectionName)
    /// </summary>
    /// <param name="collectionName" type="String">
    ///     The name of the collection to query, Example"Items"
    /// </param>
    /// <returns type="oQuery" />
    if (collectionName[0] != '/')
        this._collection = "/" + collectionName;
    else
        this._collection = collectionName;
    return this;
};

oQuery.prototype.Let = function (name, value) {
    /// <summary>
    /// Allows you to assign "local" names so you can refer to them from the where clause
    /// Example:
    ///     var foobar=123.0;
    ///  oQuery.From("Items")
    ///         .Let("x", foobar)
    ///         .Where("$.Length > $foobar")
    /// </summary>
    /// <param name="name" type="String">
    ///     The name you want to give the expression
    /// </param>
    /// <param name="value" type="object">
    ///     The value  you want to have substitued in the where clause
    /// </param>
    /// <returns type="oQuery" />
    this._letmap[name] = value;
    return this;
}

oQuery.prototype.Take = function (count) {
    /// <summary>
    /// Allows you to limit the result set to count items
    /// Example:
    ///  oQuery.From("Items")
    ///         .Take(10)
    /// </summary>
    /// <param name="count" type="number">
    ///     The count of items to take
    /// </param>
    /// <returns type="oQuery" />
    this._top = count;
    return this;
}

oQuery.prototype.Skip = function (count) {
    /// <summary>
    /// Allows you to skip count items
    /// Example:
    ///  oQuery.From("Items")
    ///         .Skip(10)
    /// </summary>
    /// <param name="count" type="number">
    ///     The count of items to skip
    /// </param>
    /// <returns type="oQuery" />
    this._skip = count;
    return this;
}

oQuery.prototype.Expand = function (propertyList) {
    /// <summary>
    /// Allows you to expand property 
    /// Example:
    ///  oQuery.From("Items")
    ///         .Expand("Foo.Bar, Blat.Blot")
    /// </summary>
    /// <param name="propertyList" type="string">
    ///     comma delimited list of property paths with a . as a seperator
    /// </param>
    /// <returns type="oQuery" />
    var properties = propertyList.split(',');
    for (var prop in properties)
        this._expandClauses[this._expandClauses.length] = prop;

    return this;
}

oQuery.prototype.Orderby = function (property) {
    /// <summary>
    /// Allows you to specify orderby clause
    /// Example:
    ///  oQuery.From("Items")
    ///         .OrderBy("Foo.Bar")
    /// </summary>
    /// <param name="propertyList" type="string">
    ///     property paths with a . as a seperator
    /// </param>
    /// <returns type="oQuery" />
    this._orderByClauses[this._orderByClauses.length] = this._parsePropertyPath(property);
    return this;
}

oQuery.prototype.OrderbyDesc = function (property) {
    /// <summary>
    /// Allows you to specify orderby clause with descending order
    /// Example:
    ///  oQuery.From("Items")
    ///         .OrderByDesc("Foo.Bar")
    /// </summary>
    /// <param name="property" type="string">
    ///     property paths with a . as a seperator
    /// </param>
    /// <returns type="oQuery" />
    this._orderByClauses[this._orderByClauses.length] = this._parsePropertyPath(property) + " desc";
    return this;
}

oQuery.prototype.Where = function (clause) {
    /// <summary>
    /// Allows you to specify a WHERE clause
    /// Example:
    ///  oQuery.From("Items")
    ///         .Where("$.x.Y > 13 && $.foo.Contains('blat')")
    /// NOTE: If you call WHERE multiple times there is an implicit AND between the clauses
    /// </summary>
    /// <param name="clause" type="string">
    ///     a string which represents the expression in C# style syntax
    ///  Property references to the object in the collection are via $.Property1.Property2 syntax
    ///  LET property references are simply $NAME where NAME is the value given to the LET clause
    ///  All functions which are in C# style will get mapped correctly to ODATA URI format
    //      Example: "$.foo.blat.Contains('text')" becomes substringof(foo/blat, 'text')
    /// </param>
    /// <returns type="oQuery" />

    this._whereClauses[this._whereClauses.length] = clause;
    return this;
}

oQuery.prototype.Select = function (propertyList) {
    /// <summary>
    /// Allows you to specify the projection and also returns the URI fragment for the whole oQuery 
    /// Example:
    ///  oQuery.From("Items")
    ///         .OrderByDesc("Foo.Bar, Blat.Blot")
    ///         .Select()
    /// </summary>
    /// <param name="propertyList" type="string">
    ///     comma delimited list of property paths with a . as a seperator
    /// </param>
    /// <returns type="oQuery" />
    this._select = propertyList;
    return this;
}


oQuery.prototype.toUri = function () {
    /// <summary>
    /// returns URI representation of query
    /// </summary>
    /// <returns type="string">string for uri that can be used to submit to ODATA service</returns>
    var uri = this._serviceUrl + this._collection;

    var clauseConnector = "";
    if (uri.length > 0)
        clauseConnector = "?";

    // $filter
    if (this._whereClauses.length > 0) {
        uri += clauseConnector + "$filter=";
        var whereClause = "";
        for (var iWhere = 0; iWhere < this._whereClauses.length; iWhere++) {
            if (iWhere > 0)
                whereClause += " and ";
            whereClause += "(" + this._parseFilter(this._whereClauses[iWhere]) + ")";
        }
        // uri += escape(whereClause);
        uri += whereClause;
        clauseConnector = "&";
    }

    // $orderby
    if (this._orderByClauses.length > 0) {
        uri += clauseConnector + "$orderby=";
        for (var iOrderBy = 0; iOrderBy < this._orderByClauses.length; iOrderBy++) {
            if (iOrderBy > 0)
                uri += ",";
            uri += this._parsePropertyPath(this._orderByClauses[iOrderBy]);
        }
        clauseConnector = "&";
    }

    // $skip
    if (this._skip) {
        uri += clauseConnector + "$skip=" + this._skip;
        clauseConnector = "&";
    }

    // $top
    if (this._top) {
        uri += clauseConnector + "$top=" + this._top;
        clauseConnector = "&";
    }

    // $expand
    if (this._expandClauses.length > 0) {
        uri += clauseConnector + "$expand=";
        for (var iExpand = 0; iExpand < this._expandClauses.length; iExpand++) {
            if (iExpand > 0)
                uri += ",";
            uri += this._parsePropertyPath(this._expandClauses[iExpand]);
        }
        clauseConnector = "&";
    }

    // select
    if (this._select) {
        var selectPaths = this._select.split(',');

        uri += clauseConnector + "$select=";

        for (var iSelect = 0; iSelect < selectPaths.length; iSelect++) {
            if (iSelect > 0)
                uri += ",";
            uri += this._parsePropertyPath(selectPaths[iSelect]);
        }
        clauseConnector = "&";
    }

    return uri;
}

oQuery.prototype._parseFilter = function (whereClause) {
    if (jQuery.isFunction(whereClause)) {
        return this._parseFunctionFilter(whereClause);
    }
    else {
        return this._parseLamdaFilter(whereClause);
    }
}

oQuery.prototype._parseFunctionFilter = function (whereClause) {
    this._iCh = 0;
    this._newClause = "";

    var clause = whereClause.toString();

    // find itemreference
    var i = clause.indexOf("function");
    clause = clause.substring(i + 8).trim();
    i = clause.indexOf("(");
    if (i >= 0)
        clause = clause.substring(i + 1).trim();
    i = clause.indexOf(")");

    this._itemReference = clause.substring(0, i).trim() + ".";

    // function definition
    i = clause.indexOf("{");
    var iEnd = clause.lastIndexOf(";");
    clause = clause.substring(i + 1, iEnd).trim();

    i = clause.indexOf("return ");
    if (i >= 0)
        clause = clause.substring(i + 7).trim();


    this._clause = clause;

    this._parse();

    return this._newClause;
}

oQuery.prototype._parseLamdaFilter = function (whereClause) {
    this._iCh = 0;
    this._newClause = "";

    var i = whereClause.indexOf('=>');
    if (i >= 0) {
        this._itemReference = whereClause.substring(0, i).trim() + ".";
        this._clause = whereClause.substring(i + 2);
    }

    this._parse();

    return this._newClause;
}

oQuery.prototype._parse = function () {

    for (; this._iCh < this._clause.length; this._iCh++) {
        var ch = this._clause[this._iCh];

        switch (ch) {
            case "$":
                // then it's a LET reference
                this._parseLetReference();
                break;

            case "+":
                this._newClause += " add ";
                break;

            case "-":
                this._newClause += " sub ";
                break;

            case "*":
                this._newClause += " mul ";
                break;

            case "/":
                this._newClause += " div ";
                break;

            case "%":
                this._newClause += " mod ";
                break;

            case ">":
                var ch2 = this._clause[this._iCh + 1];
                if (ch2 == "=") {
                    this._newClause += " ge ";
                    this._iCh++;
                }
                else {
                    this._newClause += " gt ";
                }
                break;

            case "<":
                var ch2 = this._clause[this._iCh + 1];
                if (ch2 == "=") {
                    this._newClause += " le ";
                    this._iCh++;
                }
                else {
                    this._newClause += " lt ";
                }
                break;

            case "=":
                var ch2 = this._clause[this._iCh + 1];
                if (ch2 == "=") {
                    this._newClause += " eq ";
                    this._iCh++;
                }
                else {
                    // THIS IS INVALID, SHOULD I ALLOW?
                    this._newClause += ch;
                }
                break;

            case "!":
                var ch2 = this._clause[this._iCh + 1];
                if (ch2 == "=") {
                    this._newClause += " neq ";
                    this._iCh++;
                }
                else {
                    // THIS IS INVALID, SHOULD I ALLOW?
                    this._newClause += " ! ";
                }
                break;

            case "|":
                var ch2 = this._clause[this._iCh + 1];
                if (ch2 == "|") {
                    this._newClause += " or ";
                    this._iCh++;
                }
                else {
                    // THIS IS INVALID, SHOULD I ALLOW?
                    this._newClause += " | ";
                }
                break;

            case "&":
                var ch2 = this._clause[this._iCh + 1];
                if (ch2 == "&") {
                    this._newClause += " and ";
                    this._iCh++;
                }
                else {
                    // THIS IS INVALID, SHOULD I ALLOW?
                    this._newClause += " & ";
                }
                break;

            case "'":
                this._parseQuotedString();
                break;


            default:
                //if (this._clause.substr(this._iCh, this._itemReference.length) == this._itemReference)
                if (this._clause.indexOf(this._itemReference, this._iCh) == this._iCh) {
                    this._iCh += this._itemReference.length;
                    this._parseObjectReference();
                }
                else
                    this._newClause += ch;
                break;
        }
    }
}

oQuery.prototype._parseQuotedString = function () {
    // add quote
    var ch = this._clause[this._iCh++];
    this._newClause += ch;

    for (; this._iCh < this._clause.length; this._iCh++) {
        var ch = this._clause[this._iCh];
        if (ch == "'") {
            // check for double quote
            if ((this._iCh + 1) < this._clause.length) {
                var ch2 = this._clause[this._iCh + 1];
                if (ch2 != "'") {
                    this._newClause += ch;
                    return; // all done
                }
                else {
                    this._newClause += ch + ch2;
                    this._iCh++;
                }
            }
            else {
                this._newClause += ch;
                return; // all done
            }
        }
        else
            this._newClause += ch;
    }
}


oQuery.prototype._parseLetReference = function () {
    // skip "$"
    this._iCh++;

    var reference = "";
    for (; this._iCh < this._clause.length; this._iCh++) {
        var ch = this._clause[this._iCh];
        if (!isAlphaDigit(ch)) {
            this._iCh--; // move cursor back so other functions can use it
            break;
        }
        else
            reference += ch;
    }

    if (this._letmap[reference]) {
        var value = this._letmap[reference];
        switch ($.type(value)) {
            case "date":
                this._newClause += "datetime'" + ISODateString(value) + "'";
                break;
            case "number":
                this._newClause += value.toString();
                break;
            case "string":
                // TODO Need better quote handling for escaping, this is not correct
                this._newClause += "'" + value.replace("'", "''") + "'";
                break;
        }
    }
    else {
        this._newClause += "$" + reference;
        return;
    }

}

oQuery.prototype._parseObjectReference = function () {
    var reference = "";

    for (; this._iCh < this._clause.length; this._iCh++) {
        var ch = this._clause[this._iCh];
        // replace . with /
        if (ch == ".") {
            var current = this._clause.substring(this._iCh);
            if (this._mapFunctionSwap(current, reference, "Contains", "substringof"))
                return;
            if (this._mapFunction(current, reference, "EndsWith"))
                return;
            if (this._mapFunction(current, reference, "StartsWith"))
                return;
            if (this._mapFunction(current, reference, "Length"))
                return;
            if (this._mapFunction(current, reference, "IndexOf"))
                return;
            if (this._mapFunction(current, reference, "Replace"))
                return;
            if (this._mapFunction(current, reference, "Substring"))
                return;
            if (this._mapFunction(current, reference, "ToLower"))
                return;
            if (this._mapFunction(current, reference, "ToUpper"))
                return;
            if (this._mapFunction(current, reference, "Trim"))
                return;
            if (this._mapFunction(current, reference, "Concat"))
                return;
            if (this._mapProperty(current, reference, "Day"))
                return;
            if (this._mapProperty(current, reference, "Hour"))
                return;
            if (this._mapProperty(current, reference, "Minute"))
                return;
            if (this._mapProperty(current, reference, "Month"))
                return;
            if (this._mapProperty(current, reference, "Second"))
                return;
            if (this._mapProperty(current, reference, "Year"))
                return;
            reference += "/";
        }
        else if (isAlphaDigit(ch))
            reference += ch;
        else {
            this._iCh--; // move cursor back so next function can use it
            // this could be a function invocation
            this._newClause += reference;
            return reference; // all done
        }
    }
    return reference;
}


oQuery.prototype._parsePropertyPath = function (propertyPath) {
    var reference = "";

    if (propertyPath.startsWith("$."))
        propertyPath = propertyPath.substring(2);
    return propertyPath.replace(/[.]/, "/");
}

oQuery.prototype._mapFunction = function (current, reference, inFunction, outFunction) {
    var f = "." + inFunction + "(";

    if (!outFunction)
        outFunction = inFunction.toLowerCase();

    if (current.startsWith(f)) {
        this._newClause += outFunction + "(" + reference + ",";
        this._iCh += f.length - 1;
        return true;
    }
    return false;
}

oQuery.prototype._mapFunctionSwap = function (current, reference, inFunction, outFunction) {
    var f = "." + inFunction + "(";

    if (!outFunction)
        outFunction = inFunction.toLowerCase();

    if (current.startsWith(f)) {
        var value = current.substring(f.length);
        var iEnd = value.indexOf('\'', 1);
        value = value.substring(0, iEnd + 1);
        this._newClause += outFunction + "(" + value + "," + reference;
        this._iCh += f.length + iEnd;
        return true;
    }
    return false;
}

oQuery.prototype._mapProperty = function (current, reference, inFunction, outFunction) {
    var f = "." + inFunction;

    if (!outFunction)
        outFunction = inFunction.toLowerCase();

    var chEnd = current[f.length];
    if (current.startsWith(f) &&
        !isAlphaDigit(chEnd) &&
        (chEnd != ".")) {
        this._newClause += outFunction + "(" + reference + ")";
        this._iCh += f.length;
        return true;
    }
    return false;
}



// helper functions
function isDigit(ch) {
    return (ch >= '0' && ch <= '9');
}

function isAlpha(ch) {
    return (ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z');
}

function isAlphaDigit(ch) {
    return isDigit(ch) || isAlpha(ch);
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
        return (this.indexOf(str) === 0);
    }
}


function ISODateString(d) {
    function pad(n) {
        return n < 10 ? '0' + n : n
    }
    return d.getUTCFullYear() + '-'
            + pad(d.getUTCMonth() + 1) + '-'
            + pad(d.getUTCDate()) + 'T'
            + pad(d.getUTCHours()) + ':'
            + pad(d.getUTCMinutes()) + ':'
            + pad(d.getUTCSeconds()) + 'Z'
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    }
}

if (!String.prototype.ltrim) {
    String.prototype.ltrim = function () {
        return this.replace(/^\s+/, "");
    }
}
if (!String.prototype.rtrim) {
    String.prototype.rtrim = function () {
        return this.replace(/\s+$/, "");
    }
}
