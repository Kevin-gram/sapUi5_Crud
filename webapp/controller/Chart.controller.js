sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel"
], function (BaseController, JSONModel, ODataModel) {
    "use strict";

    return BaseController.extend("crud.controller.Chart", {
        onInit: function () {
            this._loadChartData();
        },

        _loadChartData: function () {
            let oModel = new ODataModel("http://localhost:3000/odata", {
                defaultBindingMode: "TwoWay",
                useBatch: false,
                headers: {
                    "Content-Type": "application/atom+xml",
                },
                json: false,
                maxDataServiceVersion: "3.0"
            });

            oModel.read("/Products", {
                success: (data) => {
                    console.log("Fetched products:", data);
                    let ratingDistribution = {
                        RatingDistribution: [
                            { Category: "High", Count: 0, Products: [] },
                            { Category: "Medium", Count: 0, Products: [] },
                            { Category: "Low", Count: 0, Products: [] }
                        ]
                    };

                    data.results.forEach(function (product) {
                        if (product.Rating >= 4) {
                            ratingDistribution.RatingDistribution[0].Count++;
                            ratingDistribution.RatingDistribution[0].Products.push({ ID: product.ID, Name: product.Name });
                        } else if (product.Rating >= 2) {
                            ratingDistribution.RatingDistribution[1].Count++;
                            ratingDistribution.RatingDistribution[1].Products.push({ ID: product.ID, Name: product.Name });
                        } else {
                            ratingDistribution.RatingDistribution[2].Count++;
                            ratingDistribution.RatingDistribution[2].Products.push({ ID: product.ID, Name: product.Name });
                        }
                    });

                    let oRatingModel = new JSONModel(ratingDistribution);
                    this.getView().setModel(oRatingModel);

                    // Hide the BusyIndicator and show the content
                    this.byId("busyIndicator").setVisible(false);
                    this.byId("contentVBox").setVisible(true);
                },
                error: (error) => {
                    console.error("Error fetching products:", error);
                    // Hide the BusyIndicator even if there is an error
                    this.byId("busyIndicator").setVisible(false);
                }
            });
        },

        onProductPress: function (oEvent) {
            const oItem = oEvent.getSource();
            const oBindingContext = oItem.getBindingContext();
            const sPath = oBindingContext.getPath();
            const oProduct = oBindingContext.getModel().getProperty(sPath);

            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("detail", { productId: oProduct.ID });
        }
    });
});