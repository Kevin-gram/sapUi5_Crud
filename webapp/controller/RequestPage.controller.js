sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Text",
    "sap/ui/model/odata/v2/ODataModel"
], function (Controller, MessageToast, Text, ODataModel) {
    "use strict";

    return Controller.extend("crud.controller.RequestPage", {
        onInit: function () {
            const oModel = new ODataModel("http://localhost:4000/odata", {
                defaultBindingMode: "TwoWay",
                useBatch: true,
                headers: {
                    "Content-Type": "application/atom+xml"
                },
                json: false,
                maxDataServiceVersion: "3.0"
            });
            this.getView().setModel(oModel);

            // Fetch persons
            oModel.read("/Persons", {
                urlParameters: {
                    "$expand": "PersonDetail"
                },
                success: (data) => {
                    console.log("Persons data:", data); // Log the response to verify the structure
                    let personsData = data.results.map(person => ({
                        ID: person.ID,
                        Name: person.Name
                    }));
                    let personModel = new sap.ui.model.json.JSONModel(personsData);
                    this.getOwnerComponent().setModel(personModel, "persons");
                },
                error: (error) => {
                    console.error("Error fetching persons:", error);
                }
            });

            // Fetch suppliers
            oModel.read("/Suppliers", {
                success: (data) => {
                    let supplierModel = new sap.ui.model.json.JSONModel(data.results);
                    this.getOwnerComponent().setModel(supplierModel, "suppliers");
                },
                error: (error) => {
                    console.error("Error fetching suppliers:", error);
                }
            });

            // Fetch products
            oModel.read("/Products", {
                success: (data) => {
                    let productModel = new sap.ui.model.json.JSONModel(data.results);
                    this.getOwnerComponent().setModel(productModel, "products");
                },
                error: (error) => {
                    console.error("Error fetching products:", error);
                }
            });
        },

        onSubmit: function () {
            const personName = this.byId("personName").getValue();
            const supplier = this.byId("supplier").getValue();
            const product = this.byId("product").getValue();
            const description = this.byId("description").getValue();

            // Display the submitted data in the second column
            const submittedDataBox = this.byId("submittedDataBox");
            submittedDataBox.removeAllItems();
            submittedDataBox.addItem(new Text({ text: "Person's Name: " + personName }));
            submittedDataBox.addItem(new Text({ text: "Supplier: " + supplier }));
            submittedDataBox.addItem(new Text({ text: "Product: " + product }));
            submittedDataBox.addItem(new Text({ text: "Description: " + description }));

            // Navigate to the second column
            const flexibleColumnLayout = this.byId("flexibleColumnLayout");
            flexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);

        },

        onCancel: function () {
            // Handle form cancellation logic here
        },

        onPersonHelp: function () {
            // Open the value help dialog for person's name
            this.byId("personHelpDialog").open();
        },

        onSupplierHelp: function () {
            // Open the value help dialog for supplier
            this.byId("supplierHelpDialog").open();
        },

        onProductHelp: function () {
            // Open the value help dialog for product
            this.byId("productHelpDialog").open();
        },

        onPersonSelect: function (oEvent) {
            // Get the selected person and set it to the input field
            const selectedPerson = oEvent.getParameter("listItem").getTitle();
            this.byId("personName").setValue(selectedPerson);
            this.byId("personHelpDialog").close();
        },

        onSupplierSelect: function (oEvent) {
            // Get the selected supplier and set it to the input field
            const selectedSupplier = oEvent.getParameter("listItem").getTitle();
            this.byId("supplier").setValue(selectedSupplier);
            this.byId("supplierHelpDialog").close();
        },

        onProductSelect: function (oEvent) {
            // Get the selected product and set it to the input field
            const selectedProduct = oEvent.getParameter("listItem").getTitle();
            this.byId("product").setValue(selectedProduct);
            this.byId("productHelpDialog").close();
        },

        onClosePersonHelp: function () {
            // Close the value help dialog for person's name
            this.byId("personHelpDialog").close();
        },

        onCloseSupplierHelp: function () {
            // Close the value help dialog for supplier
            this.byId("supplierHelpDialog").close();
        },

        onCloseProductHelp: function () {
            // Close the value help dialog for product
            this.byId("productHelpDialog").close();
        },
       onCloseDetailColumn: function () {
            // Close the detail column
            const flexibleColumnLayout = this.byId("flexibleColumnLayout");
            flexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
        }
    });
});