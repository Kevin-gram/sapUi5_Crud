sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";
    return BaseController.extend("crud.controller.SupplyersrsPage", {
        onInit: function () {
            // Load the mock data
            let oModel = new JSONModel();
            oModel.loadData("suppliersData.json");
            this.getView().setModel(oModel, "suppliers");
        }
    });
});
