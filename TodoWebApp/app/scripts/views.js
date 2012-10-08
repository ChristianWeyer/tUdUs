﻿function acsLoginShow(e) {
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
            required: "Title is required."
        }
    }).data("kendoValidator");
}

function beforePageShow(e) {
    if (!authenticationViewModel.authenticated) {
        e.preventDefault();
        window.kendoMobileApplication.navigate("#loginDialog");
    }
}
