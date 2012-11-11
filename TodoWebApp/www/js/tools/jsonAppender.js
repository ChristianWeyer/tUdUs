function JsonAppender(url) {
    var isSupported = true;
    var successCallback = function(data, textStatus, jqXHR) { return; };
    if (!url) {
        isSupported = false;
    }
    this.setSuccessCallback = function(successCallbackParam) {
        successCallback = successCallbackParam;
    };
    this.append = function (loggingEvent) {
        if (!isSupported) {
            return;
        }
        $.ajax({
            url: url,
            type: httpVerbs.POST,
            dataType: dataTypes.JSON,
            contentType: "application/json",
            data: JSON.stringify({
                'logger': loggingEvent.logger.name,
                'timestamp': loggingEvent.timeStampInMilliseconds,
                'level': loggingEvent.level.name,
                'url': window.location.href,
                'message': loggingEvent.getCombinedMessages(),
                'exception': loggingEvent.getThrowableStrRep()
            })
        });
    };
}

JsonAppender.prototype = new log4javascript.Appender();
JsonAppender.prototype.toString = function() {
    return 'JsonAppender';
};
log4javascript.JsonAppender = JsonAppender;