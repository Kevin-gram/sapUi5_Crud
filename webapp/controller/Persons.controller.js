sap.ui.define([
    "./BaseController",
    "sap/ui/model/odata/v2/ODataModel"
], function (BaseController,ODataModel) {
    "use strict";

    return BaseController.extend("crud.controller.Persons", {
        onInit: function () {
            // Ensure model is set up correctly
            let oModel = new ODataModel("http://localhost:3000/odata",{
                defaultBindingMode:"TwoWay",
                maxDataServiceVersion:"3.0"
            })
           this.getView().setModel(oModel)
        },

    })   
});