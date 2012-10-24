﻿todosApp.Views.acsLoginShow = function() {
    acsViewModel.getIdps();
};

todosApp.Views.todosPageInit = function() {
    $("#done").kendoMobileSwitch({
        onLabel: "YES",
        offLabel: "NO"
    });
};

todosApp.Views.todoDetailsShow = function(e) {
    todosViewModel.set("currentItem", todosViewModel.todosSource.get(e.view.params.id));
    e.view.scroller.reset();

    var coords = todosViewModel.get("currentItem.location").split(",");
    todosApp.Views.createMap(coords[0], coords[1], "detailsMap");
};

todosApp.Views.addTodoPageValidator = {};

todosApp.Views.addTodoPageInit = function() {
    todosApp.Views.addTodoPageValidator = $("#addTodoPage").kendoValidator({
        messages: {
            required: function(input) {
                input.attr("placeholder", input.attr("name") + " is req.");
            }
        }
    }).data("kendoValidator");

};

todosApp.Views.addTodoPageShow = function (e) {
    newTodoItemViewModel.set("pictureUrl", images.DefaultItemPicture);
    e.view.scroller.reset();
    
    navigator.geolocation.getCurrentPosition(function (p) {
        newTodoItemViewModel.set("location", p.coords.latitude + "," + p.coords.longitude);
        todosApp.Views.createMap(p.coords.latitude, p.coords.longitude, "newMap");
    });
};

todosApp.Views.beforePageShow = function (e) {
    if (!authenticationViewModel.authenticated) {
        e.preventDefault();
        window.kendoMobileApplication.navigate("index.html#loginDialog");
        $("#navigationTabStrip").data("kendoMobileTabStrip").switchTo("index.html");
    }
};

todosApp.Views.createMap = function (lat, lng, element) {
    var options = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var mapElement = $("#" + element);
    var map = new google.maps.Map(mapElement[0], options);
};

todosApp.Views.graphInit = function() {
    setTimeout(function() {
        $("#chart").kendoChart({
            title: {
                text: "Items (total) - fake"
            },
            legend: { visible: false },

            series: [
                { data: [200, 275, 300, 125] }
            ],
            categoryAxis: {
                categories: [2009, 2010, 2011, 2012]
            }
        });
    }, 400);
};

todosApp.Views.loaderElement = {};

todosApp.Views.showLoader = function (text) {
    todosApp.Views.loaderElement = window.kendoMobileApplication.pane.loader.element.find("h1");
    todosApp.Views.loaderElement.text(text).addClass("loaderHeading");
    window.kendoMobileApplication.showLoading();
};

todosApp.Views.hideLoader = function () {    
    todosApp.Views.loaderElement.text("Loading...").addClass("loaderHeading");
    window.kendoMobileApplication.hideLoading();
};