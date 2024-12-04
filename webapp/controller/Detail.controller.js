sap.ui.define([
    "./BaseController",
    "sap/ui/model/odata/v2/ODataModel"
], function (BaseController, ODataModel) {
    "use strict";

    return BaseController.extend("crud.controller.Detail", {
        onInit: function () {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
            let oModel = new ODataModel("http://localhost:3000/odata", {
                maxDataServiceVersion: "3.0"
            });
            this.getView().setModel(oModel);
        },

        onObjectMatched: function (oEvent) {
            const productId = oEvent.getParameter("arguments").productId;
            const model = this.getView().getModel();

            model.read(`/Products(${productId})`, {
                success: (data) => {
                    console.log("Product Data:", data); // Log product data to console for testing
                    this.getView().setModel(new sap.ui.model.json.JSONModel(data), "product");
                    this.byId("productId").setText("Product ID: " + data.ID);
                    this.byId("productName").setText("Name: " + data.Name);
                    this.byId("productPrice").setText("Price: " + data.Price);
                    this.byId("productRating").setText("Rating: " + data.Rating);
                    this.byId("productReleaseDate").setText("Release Date: " + data.ReleaseDate);
                },
                error: (error) => {
                    console.error("Error fetching product data:", error);
                }
            });
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