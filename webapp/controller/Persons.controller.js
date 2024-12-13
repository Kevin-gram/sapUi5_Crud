sap.ui.define(["./BaseController", "sap/ui/model/odata/v2/ODataModel"], function (BaseController, ODataModel) {
    "use strict";
    return BaseController.extend("crud.controller.Persons", {
        onInit: function () {
            // Correctly declare the variable and initialize the OData model
            let oModel = new ODataModel("http://localhost:3000/odata", {
                defaultBindingMode: "TwoWay", // Corrected property name
                maxDataServiceVersion: "3.0"
            });
            // Correctly set the model to the view
            this.getView().setModel(oModel); // Corrected method name
        }
    });
});