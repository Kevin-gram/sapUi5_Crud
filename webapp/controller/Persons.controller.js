sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageBox, ODataModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("crud.controller.Persons", {
        onInit: function () {
            const oModel = new ODataModel("http://localhost:3000/odata", {
                defaultBindingMode: "TwoWay",
                useBatch: true,
                headers: {
                    "Content-Type": "application/atom+xml"
                },
                json: false,
                maxDataServiceVersion: "3.0"
            });
            this.getView().setModel(oModel);
            oModel.read("/Persons", {
                urlParameters: {
                    "$expand": "PersonDetail"
                },
                success: (data) =>{
                    console.log(data);
                    let personsData = data.results.map(person=>person.PersonDetail);
                    let personModel = new sap.ui.model.json.JSONModel(personsData);
                    this.getOwnerComponent().setModel(personModel, "persons");
                    // Iterate over each person and log their data
                    data.results.forEach(function (person) {
                        console.log("Person:", person);
                    });
                }
            });
        },

        onSearch: function (e) {
            // Build filter array
            const aFilter = [];
            const sQuery = e.getParameter("query");

            if (sQuery) {
                // Create a filter for the Name field
                aFilter.push(new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery));
            }

            // Filter binding
            const oList = this.byId("personsTable");
            if (!oList) {
                console.error("Element with ID 'personsTable' not found.");
                return;
            }

            const oBinding = oList.getBinding("items");
            if (!oBinding) {
                console.error("Binding not found for 'personsTable' items.");
                return;
            }

            oBinding.filter(aFilter);

            if (e.getParameter("searchButtonPressed")) {
                sap.m.MessageToast.show("'search' event fired with 'searchButtonPressed' parameter");
            }
        },

        onPersonPress: function (oEvent) {
            const oItem = oEvent.getSource();
            const oBindingContext = oItem.getBindingContext();
            const oPersonData = oBindingContext.getObject();
            const personId = oPersonData.ID; // Assuming ID is the personId

            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("personDetail", {
                personId: personId // Pass the personId parameter
            });
        }
    });
});