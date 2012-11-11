ttTools.logger = log4javascript.getLogger();
var ajaxAppender = new log4javascript.JsonAppender(endpoints.log);
ajaxAppender.setThreshold(log4javascript.Level.INFO);
ttTools.logger.addAppender(ajaxAppender);