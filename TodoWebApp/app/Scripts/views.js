﻿/// <reference path="../js/_references.js" />

// View initializations and configurations

function acsLoginShow(e) {
    acsViewModel.getIdps();
}

function todosPageInit(e) {
    e.view.element.find("#tasksList li").kendoMobileSwipe(function (e) {
        // If we need swipe...
        },
        { surface: e.view.element.find("#tasksList") }
    );

    $("#done").kendoMobileSwitch({
        onLabel: "YES",
        offLabel: "NO"
    });

    todosViewModel.loadTodos();
}

function todosPageShow(e) {    
}

function beforePageShow(e) {
    if (!authenticationViewModel.authenticated) {
        e.preventDefault();
        window.kendoMobileApplication.navigate("#loginDialog");
    }
}
