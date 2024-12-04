sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("crud.controller.PersonDetail", {
        onInit: function () {
            // Initialization logic
        },
        onCustomPress: function () {
            // Additional actions to be performed on button press
            MessageToast.show("Custom button pressed!");
            // Add your extra logic here
        }
    });
});