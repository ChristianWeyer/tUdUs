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

todosApp.Views.todoDetailsPageShow = function (e) {
    e.view.model.set("currentItem", todosViewModel.todosSource.get(e.view.params.id));
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

todosApp.Views.addTodoPageShow = function() {
    var imagePane = $("#capturedImagePane");
    imagePane.hide();
};

todosApp.Views.beforePageShow = function(e) {
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
