sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("crud.controller.Chart", {
        onInit: function () {
            // Sample data for the pie chart
            var oData = {
                RatingDistribution: [
                    { Category: "High", Count: 10 },
                    { Category: "Medium", Count: 20 },
                    { Category: "Low", Count: 5 }
                ]
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
        }
    });
});