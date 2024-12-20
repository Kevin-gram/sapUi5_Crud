sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, MessageToast) {
    "use strict";
    return BaseController.extend("crud.controller.SupplyersrsPage", {
        onInit: function () {
            // Load the data from the correct endpoint
            let oModel = new JSONModel();
            oModel.loadData("http://localhost:3001/suppliers", null, false);
            oModel.attachRequestCompleted(function() {
                console.log("Suppliers data fetched:", oModel.getData());
            });
            oModel.attachRequestFailed(function() {
                console.error("Failed to fetch suppliers data");
            });
            this.getView().setModel(oModel, "suppliers");
        },

        onShowAddSupplierDialog: function () {
            const oView = this.getView();
            const oDialog = oView.byId("addSupplierDialog");
            if (oDialog) {
                oDialog.open();
            }
        },

        onShowEditSupplierDialog: function (oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oContext = oItem.getBindingContext("suppliers");
            const oSupplier = oContext.getObject();

            const oView = this.getView();
            const oDialog = oView.byId("editSupplierDialog");
            if (oDialog) {
                this._populateEditDialog(oSupplier);
                oDialog.open();
            }
        },

        onSaveNewSupplier: function () {
            const oView = this.getView();
            const oModel = oView.getModel("suppliers");

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
            fetch('http://localhost:3001/suppliers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(oNewSupplier)
            }).then(response => {
                if (response.ok) {
                    return response.text(); // Expecting a text response
                } else {
                    throw new Error('Failed to save supplier');
                }
            }).then(() => {
                // Fetch the updated suppliers data
                oModel.loadData("http://localhost:3001/suppliers", null, true);
                MessageToast.show("Supplier added successfully!");
                oView.byId("addSupplierDialog").close();
            }).catch(error => {
                MessageToast.show("Error saving supplier: " + error.message);
            });
        },

        onSaveEditSupplier: function () {
            const oView = this.getView();
            const oModel = oView.getModel("suppliers");

            const oEditedSupplier = {
                ID: oView.byId("editSupplierId").getValue(),
                Name: oView.byId("editSupplierName").getValue(),
                Address: {
                    Street: oView.byId("editSupplierStreet").getValue(),
                    City: oView.byId("editSupplierCity").getValue(),
                    State: oView.byId("editSupplierState").getValue(),
                    ZipCode: oView.byId("editSupplierZipCode").getValue(),
                    Country: oView.byId("editSupplierCountry").getValue()
                }
            };

            // Send the updated supplier data to the backend service
            fetch(`http://localhost:3001/suppliers/${oEditedSupplier.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(oEditedSupplier)
            }).then(response => {
                if (response.ok) {
                    return response.text(); // Expecting a text response
                } else {
                    throw new Error('Failed to update supplier');
                }
            }).then(() => {
                // Fetch the updated suppliers data
                oModel.loadData("http://localhost:3001/suppliers", null, true);
                MessageToast.show("Supplier updated successfully!");
                oView.byId("editSupplierDialog").close();
            }).catch(error => {
                MessageToast.show("Error updating supplier: " + error.message);
            });
        },

        onCancelAddSupplierDialog: function () {
            this.getView().byId("addSupplierDialog").close();
        },

        onCancelEditSupplierDialog: function () {
            this.getView().byId("editSupplierDialog").close();
        },

        _populateEditDialog: function (oSupplier) {
            const oView = this.getView();
            oView.byId("editSupplierId").setValue(oSupplier.ID);
            oView.byId("editSupplierName").setValue(oSupplier.Name);
            oView.byId("editSupplierStreet").setValue(oSupplier.Address.Street);
            oView.byId("editSupplierCity").setValue(oSupplier.Address.City);
            oView.byId("editSupplierState").setValue(oSupplier.Address.State);
            oView.byId("editSupplierZipCode").setValue(oSupplier.Address.ZipCode);
            oView.byId("editSupplierCountry").setValue(oSupplier.Address.Country);
        },

        onDeleteSupplier: function (oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oContext = oItem.getBindingContext("suppliers");
            const sSupplierId = oContext.getProperty("ID");

            // Send the delete request to the backend service
            fetch(`http://localhost:3001/suppliers/${sSupplierId}`, {
                method: 'DELETE'
            }).then(response => {
                if (response.ok) {
                    // Fetch the updated suppliers data
                    const oModel = this.getView().getModel("suppliers");
                    oModel.loadData("http://localhost:3001/suppliers", null, true);
                    MessageToast.show("Supplier deleted successfully!");
                } else {
                    throw new Error('Failed to delete supplier');
                }
            }).catch(error => {
                MessageToast.show("Error deleting supplier: " + error.message);
            });
        }
    });
});