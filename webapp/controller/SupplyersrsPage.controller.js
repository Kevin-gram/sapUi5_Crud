sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (BaseController, JSONModel, MessageToast, Fragment) {
    "use strict";
    return BaseController.extend("crud.controller.SupplyersrsPage", {
        onInit: function () {
            // Load the mock data
            let oModel = new JSONModel();
            oModel.loadData("/suppliers");
            this.getView().setModel(oModel, "suppliers");
        },

        onShowSupplierDialog: function () {
            if (!this._oDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "crud.view.AddSupplierDialog",
                    controller: this
                }).then(function (oDialog) {
                    this._oDialog = oDialog;
                    this.getView().addDependent(this._oDialog);
                    this._oDialog.open();
                }.bind(this));
            } else {
                this._oDialog.open();
            }
        },

        onSaveSupplier: function () {
            const oView = this.getView();
            const oModel = oView.getModel("suppliers");
            const aSuppliers = oModel.getProperty("/value");

            const oNewSupplier = {
                ID: oView.byId("newSupplierId").getValue(),
                Name: oView.byId("newSupplierName").getValue(),
                Address: {
                    Street: oView.byId("newSupplierStreet").getValue(),
                    City: oView.byId("newSupplierCity").getValue(),
                    State: oView.byId("newSupplierState").getValue(),
                    ZipCode: oView.byId("newSupplierZipCode").getValue(),
                    Country: oView.byId("newSupplierCountry").getValue()
                }
            };

            // Send the new supplier data to the backend service
            fetch('/suppliers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(oNewSupplier)
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to save supplier');
                }
            }).then(() => {
                // Fetch the updated suppliers data
                oModel.loadData("/suppliers", null, true);
                MessageToast.show("Supplier added successfully!");
                this._oDialog.close();
            }).catch(error => {
                MessageToast.show("Error saving supplier: " + error.message);
            });
        },

        onCancelSupplierDialog: function () {
            this._oDialog.close();
        }
    });
});