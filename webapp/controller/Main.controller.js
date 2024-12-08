sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, MessageBox, ODataModel, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("crud.controller.Main", {
               onInit() {
            this._iPageSize = 5; // Number of items to load per request
            this._iCurrentPage = 1; // Current page number
            this._bLoading = false; // Flag to prevent multiple requests
        
            const sServiceUrl = "http://localhost:3000/odata"; // Replace with your OData service URL
            const oModel = new ODataModel(sServiceUrl, {
                useBatch: false, // Disable batch processing for simplicity
                defaultBindingMode: "TwoWay",
                defaultCountMode: "Inline",
                loadMetadataAsync: true
            });
        
            oModel.attachMetadataFailed((oEvent) => {
                const oParams = oEvent.getParameters();
                MessageBox.error("Failed to load OData metadata: " + oParams.message);
                console.error("Failed to load OData metadata:", oParams);
            });
        
            oModel.attachRequestFailed((oEvent) => {
                const oParams = oEvent.getParameters();
                MessageBox.error("Failed to load data: " + oParams.message);
                console.error("Failed to load data:", oParams);
            });
        
            this.getView().setModel(oModel);
            this._loadData();
        },

        _loadData() {
            if (this._bLoading) return;
            this._bLoading = true;
            const oModel = this.getView().getModel();
            const iStartIndex = (this._iCurrentPage - 1) * this._iPageSize;
            const iEndIndex = iStartIndex + this._iPageSize;

            oModel.read("/Products", {
                urlParameters: {
                    "$skip": iStartIndex,
                    "$top": this._iPageSize
                },
                success: (oData) => {
                    let aProducts = oModel.getProperty("/Products") || [];
                    aProducts = aProducts.concat(oData.results);
                    oModel.setProperty("/Products", aProducts);
                    this._iCurrentPage++;
                    this._bLoading = false;
                    console.log("Loaded Products:", oModel.getProperty("/Products"));
                },
                error: () => {
                    this._bLoading = false;
                    console.error("Failed to load data");
                }
            });
        },

        onScroll: function (oEvent) {
            let oScrollContainer = oEvent.getSource();
            let oDomRef = oScrollContainer.getDomRef();
            if (oDomRef.scrollTop + oDomRef.clientHeight >= oDomRef.scrollHeight) {
                this._loadData();
            }
        },

        onFilterSelect: function (oEvent) {
            const sKey = oEvent.getParameter("key");
            const oTable = this.byId("odataTable");
            const oBinding = oTable.getBinding("items");
            let aFilters = [];

            switch (sKey) {
                case "highRating":
                    aFilters.push(new Filter("Rating", FilterOperator.GT, 4));
                    break;
                case "highPrice":
                    aFilters.push(new Filter("Price", FilterOperator.GT, 100));
                    break;
                default:
                    // No filter for "All"
                    break;
            }

            oBinding.filter(aFilters);
        },

        onSearch(event) {
            const aFilter = [];
            const sQuery = event.getParameter("query");

            if (sQuery) {
                aFilter.push(new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery));
            }

            const oList = this.byId("odataTable");
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);

            if (event.getParameter("searchButtonPressed")) {
                sap.m.MessageToast.show("'search' event fired with 'searchButtonPressed' parameter");
            }
        },

        onShowData(event) {
            const item = event.getSource();
            const bindingContext = item.getBindingContext();
            if (!bindingContext) {
                console.error("Binding context is undefined");
                return;
            }
            const productId = bindingContext.getProperty("ID");

            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("detail", { productId: productId });

            const oFlexibleColumnLayout = this.byId("layout");
            oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);

            const oDetailPage = this.byId("layout").getMidColumnPages()[0];
            oDetailPage.setBindingContext(bindingContext);
        },

        onOpenDetailColumn() {
            const oFlexibleColumnLayout = this.byId("layout");
            oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);
        },

        onOpenEndColumn() {
            const oFlexibleColumnLayout = this.byId("layout");
            oFlexibleColumnLayout.setLayout(sap.f.LayoutType.ThreeColumnsMidExpanded);
        },

        onCloseDetailColumn() {
            const oFlexibleColumnLayout = this.byId("layout");
            oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
        },

        onCloseEndColumn() {
            const oFlexibleColumnLayout = this.byId("layout");
            oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);
        },

        onShowProductDialog() {
            this.byId("createProductDialog").open();
        },

        onCloseProductDialog() {
            this.byId("createProductDialog").close();
        },

        onShowEditingDialog(oEvent) {
            const button = oEvent.getSource();
            const listItem = button.getParent();
            const context = listItem.getBindingContext();
            const productData = context.getObject();

            this._selectedProductId = productData.ID;

            const dialog = this.byId("updateDialog");
            this.byId("productNameText").setValue(productData.Name);
            this.byId("productPriceText").setValue(productData.Price);
            this.byId("productRatingText").setValue(productData.Rating);
            this.byId("productReleaseDateText").setValue(productData.ReleaseDate);

            dialog.open();
        },

        onCloseEditingDialog() {
            this.byId("updateDialog").close();
        },

        formatDateForOData(date) {
            if (!date) return null;
            const d = date instanceof Date ? date : new Date(date);
            return d.getFullYear() + '-' +
                String(d.getMonth() + 1).padStart(2, '0') + '-' +
                String(d.getDate()).padStart(2, '0');
        },

        onCreate() {
            const ID = this.byId("newProductId").getValue();
            const Name = this.byId("newProductName").getValue();
            const Price = this.byId("newProductPrice").getValue();
            const Rating = this.byId("newProductRating").getValue();
            const ReleaseDate = this.formatDateForOData(this.byId("newProductReleaseDate").getValue());

            const atomXml = `<?xml version="1.0" encoding="utf-8"?>
            <entry xmlns="http://www.w3.org/2005/Atom" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">
                <category term="ODataDemo.Product" scheme="http://schemas.microsoft.com/ado/2007/08/dataservices/scheme"/>
                <title type="text">${Name}</title>
                <updated>${new Date().toISOString()}</updated>
                <author><name/></author>
                <content type="application/xml">
                    <m:properties>
                        <d:ID m:type="Edm.Int32">${parseInt(ID)}</d:ID>
                        <d:Name>${Name}</d:Name>
                        <d:Description>New Product</d:Description>
                        <d:ReleaseDate m:type="Edm.DateTime">${ReleaseDate}</d:ReleaseDate>
                        <d:DiscontinuedDate m:null="true"/>
                        <d:Rating m:type="Edm.Int16">${parseInt(Rating)}</d:Rating>
                        <d:Price m:type="Edm.Double">${parseFloat(Price)}</d:Price>
                    </m:properties>
                </content>
            </entry>`;

            fetch("http://localhost:3000/odata/Products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/atom+xml",
                },
                body: atomXml
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(errorText => {
                            throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
                        });
                    }
                    MessageBox.success("Product created successfully!");
                    this.onCloseProductDialog();
                    this.getView().getModel().refresh(true);
                })
                .catch(error => {
                    MessageBox.error("Error creating product: " + error.message);
                });
        },

        onEditPress() {
            const Name = this.byId("productNameText").getValue();
            const Price = this.byId("productPriceText").getValue();
            const Rating = this.byId("productRatingText").getValue();
            const ReleaseDate = this.formatDateForOData(this.byId("productReleaseDateText").getValue());
            const productId = this._selectedProductId;

            const atomXml = `<?xml version="1.0" encoding="utf-8"?>
            <entry xmlns="http://www.w3.org/2005/Atom" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">
                <category term="ODataDemo.Product" scheme="http://schemas.microsoft.com/ado/2007/08/dataservices/scheme"/>
                <title type="text">${Name}</title>
                <updated>${new Date().toISOString()}</updated>
                <author><name/></author>
                <content type="application/xml">
                    <m:properties>
                        <d:ID m:type="Edm.Int32">${productId}</d:ID>
                        <d:Name>${Name}</d:Name>
                        <d:Description>Updated Product</d:Description>
                        <d:ReleaseDate m:type="Edm.DateTime">${ReleaseDate}</d:ReleaseDate>
                        <d:DiscontinuedDate m:null="true"/>
                        <d:Rating m:type="Edm.Int16">${parseInt(Rating)}</d:Rating>
                        <d:Price m:type="Edm.Double">${parseFloat(Price)}</d:Price>
                    </m:properties>
                </content>
            </entry>`;

            fetch(`http://localhost:3000/odata/Products(${productId})`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/atom+xml",
                },
                body: atomXml
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(errorText => {
                            throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
                        });
                    }
                    MessageBox.success("Product updated successfully!");
                    this.onCloseEditingDialog();
                    this.getView().getModel().refresh(true);
                })
                .catch(error => {
                    MessageBox.error("Error updating product: " + error.message);
                });
        },

        onSeePersons: function () {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("persons");
        },

        onOpenLoginPage: function () {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("loginPage");
        },

        onOpenRequestproducts: function () {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("requestPage");
        },

        onDeletePress(oEvent) {
            const button = oEvent.getSource();
            const listItem = button.getParent();
            const context = listItem.getBindingContext();
            const productId = context.getObject().ID;

            this.getView().getModel().remove(`/Products(${productId})`, {
                success: () => {
                    MessageBox.success("Product deleted successfully!");
                    this.getView().getModel().refresh(true);
                },
                error: (error) => {
                    MessageBox.error("Error deleting product: " + error.message);
                }
            });
        }
    });
});