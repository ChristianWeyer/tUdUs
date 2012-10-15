todosApp.Views.acsLoginShow = function() {
    acsViewModel.getIdps();
};

todosApp.Views.todosPageInit = function() {
    $("#done").kendoMobileSwitch({
        onLabel: "YES",
        offLabel: "NO"
    });

    todosViewModel.loadTodos();
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
    
    navigator.geolocation.getCurrentPosition(function (p) {
        var options = {
            center: new google.maps.LatLng(p.coords.latitude, p.coords.longitude),
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var mapElement = $("#mapCanvas");
        var map = new google.maps.Map(mapElement[0], options);
    });
};

todosApp.Views.addTodoPageShow = function () {
    newTodoItemViewModel.set("pictureUrl", images.DefaultItemPicture);
};

todosApp.Views.beforePageShow = function (e) {
    if (!authenticationViewModel.authenticated) {
        e.preventDefault();
        window.kendoMobileApplication.navigate("#loginDialog");
    }
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
