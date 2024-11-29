sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("crud.controller.PersonDetail", {
        onInit: function () {
            let personModel = this.getOwnerComponent().getModel("person");
            this.getView().setModel(personModel );
            console.log(personModel);

        },

        _onObjectMatched: function (oEvent) {
            const sPersonData = oEvent.getParameter("arguments").personData;
            console.log("Received personData:", sPersonData); // Debugging

            if (!sPersonData) {
                console.error("personData is undefined or empty.");
                return;
            }

            try {
                const oPersonData = JSON.parse(sPersonData);
                this.getView().setModel(new JSONModel(oPersonData), "person");
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        },

        onNavBack: function () {
            const oHistory = sap.ui.core.routing.History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("main", {}, true);
            }
        }
    });
});