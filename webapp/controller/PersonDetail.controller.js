sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("crud.controller.PersonDetail", {
        onInit: function () {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            const oRoute = oRouter.getRoute("personDetail");
            oRoute.attachPatternMatched(this._onPersonMatched, this);
        },
        
        _onPersonMatched: function (oEvent) {
            const personId = oEvent.getParameter("arguments").personId; // Get the personId from the URL
            const oModel = this.getOwnerComponent().getModel("persons");
        
            // Assuming the "persons" model is an array of persons, bind to the correct person using personId
            const oBindingContext = oModel.createBindingContext("/" + personId); // Use the correct path for the personId
            
            // Bind the view to the selected person
            this.getView().setBindingContext(oBindingContext, "persons");
        }
        ,
        

       
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