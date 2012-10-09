function acsLoginShow(e) {
    acsViewModel.getIdps();
}

function todosPageInit(e) {
    $("#done").kendoMobileSwitch({
        onLabel: "YES",
        offLabel: "NO"
    });

    todosViewModel.loadTodos();
}

var addTodoPageValidator;

function addTodoPageInit() {
    addTodoPageValidator = $("#addTodoPage").kendoValidator({
        messages: {
            required: function (input) {
                input.attr("placeholder", input.attr("name") + " is req.");
            }
        }
    }).data("kendoValidator");
}

function addTodoPageShow(e) {
    var imagePane = $("#capturedImagePane");
    imagePane.hide();
}

function beforePageShow(e) {
    if (!authenticationViewModel.authenticated) {
        e.preventDefault();
        window.kendoMobileApplication.navigate("#loginDialog");
    }
}

var loaderElement;

function setLoaderText(text) {
    loaderElement = window.kendoMobileApplication.pane.loader.element.find("h1");
    loaderElement.text(text).addClass("loaderHeading");
}