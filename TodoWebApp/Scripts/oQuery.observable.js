/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.4.4-vsdoc.js"/>
/// <reference path="/Scripts/rx.js"/> 
/// <reference path="/datajs-0.0.1.js"/> 

//
// MICROSOFT PUBLIC LICENSE (Ms-PL)
//

oQuery.prototype.toObservable = function () {
    /// <summary>
    /// this implementation of toObservable uses the oData js library from <!-- http://datajs.codeplex.com/ --> for the toObservable()
    /// </summary>
    /// <returns type="IObservable" />
    var observableSubject = new Rx.AsyncSubject();

    var store = {
        success: function (data, response) {
            // pass on data to observable
            observableSubject.OnNext(data.results);

            // if there is continuition link
            if (data.__next) {
                // execute the next query
                OData.read(data.__next, store.success, store.error);
            }
            else {
                // tell the observable we are done
                observableSubject.OnCompleted();
            }
        },

        error: function (error) {
            // tell teh ovservable we had an error
            observableSubject.OnError({
                error: error,
                userContext: userContext,
                operation: operation
            });
        }
    };

    var url = this.toUri();
    OData.defaultHttpClient.enableJsonpCallback = true;
    OData.read(url, store.success, store.error);
    return observableSubject;
}
