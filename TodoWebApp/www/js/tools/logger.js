ttTools.logger = log4javascript.getLogger();
var ajaxAppender = new log4javascript.JsonAppender(endpoints.log);
ajaxAppender.setThreshold(log4javascript.Level.INFO);
ttTools.logger.addAppender(ajaxAppender);
var consoleAppender = new log4javascript.BrowserConsoleAppender();
var patternLayout = new log4javascript.PatternLayout("%d{HH:mm:ss,SSS} %l{s:l} %-5p - %m{1}%n");
consoleAppender.setLayout(patternLayout);
ttTools.logger.addAppender(consoleAppender);