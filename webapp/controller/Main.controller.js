sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Core",
    "sap/ui/core/Fragment" // Ensure Fragment is imported
], function (BaseController, MessageBox, MessageToast, ODataModel, Filter, FilterOperator, Core, Fragment) { // Add Fragment to the function parameters
    "use strict";

    return BaseController.extend("crud.controller.Main", {
        onInit() {
            let oModel = new ODataModel("http://localhost:4000/odata", {
                defaultBindingMode: "TwoWay",
                useBatch: false,
                headers: {
                    "Content-Type": "application/atom+xml",
                },
                json: false,
                maxDataServiceVersion: "3.0"
            });
            this.getView().setModel(oModel);
            oModel.read("/Products", {
                success(data) {
                    console.log("Fetched products:", data);
                },
                error(error) {
                    console.error("Error fetching products:", error);
                }
            });
        },

        onThemeToggle: function () {
            const currentTheme = Core.getConfiguration().getTheme();
            const isDarkTheme = currentTheme.toLowerCase().includes("dark");
            const newTheme = isDarkTheme ? "sap_belize" : "sap_belize_dark";
            this._changeTheme(newTheme);
        },

        _changeTheme: function (theme) {
            Core.applyTheme(theme);
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
                    break;
            }

            oBinding.filter(aFilters);
        },        onSearch(event) {
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

        onLiveChange: function(oEvent) {
            let query = oEvent.getParameter("newValue");
            let table = this.byId("odataTable");
            let binding = table.getBinding("items");

            let aFilters = [];

            if (query) {
                let queryNumber = parseFloat(query);

                if (!isNaN(queryNumber)) {
                    aFilters.push(
                        new Filter({
                            filters: [
                                new Filter("ID", FilterOperator.EQ, queryNumber),
                                new Filter("Price", FilterOperator.EQ, queryNumber),
                                new Filter("Rating", FilterOperator.EQ, queryNumber)
                            ],
                            and: false
                        })
                    );
                } else {
                    aFilters.push(
                        new Filter("Name", FilterOperator.Contains, query)
                    );
                }
            }

            binding.filter(aFilters);
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
        },        onShowProductDialog: function () {
            if (!this.byId("idCreateProductDialog")) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "crud.view.fragments.createProduct", // Corrected file name
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this)).catch(function (oError) {
                    console.error("Error loading fragment: ", oError);
                });
            } else {
                this.byId("idCreateProductDialog").open();
            }
        },

        onCloseProductDialog: function () {
            this.byId("idCreateProductDialog").close();
        },

        onShowProductWithDetailsDialog() {
            this.byId("createProductWithDetailsDialog").open();
        },

        onCloseProductWithDetailsDialog() {
            this.byId("createProductWithDetailsDialog").close();
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
        },                onCreate: async function () {
                    const ID = this.byId("newProductId").getValue();
                    const Name = this.byId("newProductName").getValue();
                    const Price = this.byId("newProductPrice").getValue();
                    const Rating = this.byId("newProductRating").getValue();
                    const ReleaseDate = this.byId("newProductReleaseDate").getValue();
        
                    if (!ID || isNaN(ID) || parseInt(ID) <= 0) {
                        MessageBox.error("Please enter a valid Product ID.");
                        return;
                    }
        
                    if (!Name || Name.trim() === "") {
                        MessageBox.error("Please enter a valid Product Name.");
                        return;
                    }
        
                    if (!Price || isNaN(Price) || parseFloat(Price) <= 0) {
                        MessageBox.error("Please enter a valid Product Price.");
                        return;
                    }
        
                    if (!Rating || isNaN(Rating) || parseInt(Rating) < 1 || parseInt(Rating) > 5) {
                        MessageBox.error("Please enter a valid Rating (1 to 5).");
                        return;
                    }
        
                    if (!ReleaseDate || !this.isValidDate(ReleaseDate)) {
                        MessageBox.error("Please enter a valid Release Date.");
                        return;
                    }
        
                    try {
                        const response = await fetch("http://localhost:4000/odata/Products", {
                            headers: {
                                "Accept": "application/json"
                            }
                        });
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        const existingProducts = data.value;
        
                        if (existingProducts.some(product => product.ID === parseInt(ID))) {
                            MessageBox.error("A product with the same ID already exists.");
                            return;
                        }
        
                        if (existingProducts.some(product => product.Name === Name)) {
                            MessageBox.error("A product with the same Name already exists.");
                            return;
                        }
                    } catch (error) {
                        MessageBox.error("Error fetching existing products: " + error.message);
                        return;
                    }
        
                    const formattedReleaseDate = this.formatDateForOData(ReleaseDate);
        
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
                                <d:ReleaseDate m:type="Edm.DateTime">${formattedReleaseDate}</d:ReleaseDate>
                                <d:DiscontinuedDate m:null="true"/>
                                <d:Rating m:type="Edm.Int16">${parseInt(Rating)}</d:Rating>
                                <d:Price m:type="Edm.Double">${parseFloat(Price)}</d:Price>
                            </m:properties>
                        </content>
                    </entry>`;
        
                    fetch("http://localhost:4000/odata/Products", {
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
        
                isValidDate(dateString) {
                    const date = new Date(dateString);
                    return !isNaN(date.getTime());
                },
        
                onDeletePress(oEvent) {
                    const button = oEvent.getSource();
                    const listItem = button.getParent();
                    const context = listItem.getBindingContext();
                    const productId = context.getObject().ID;
        
                    this.getView().getModel().remove(`/Products(${productId})`, {
                        success: () => {
                            MessageToast.show("Product deleted successfully!");
                            this.getView().getModel().refresh(true);
                        },
                        error: (error) => {
                            MessageToast.show("Error deleting product: " + error.message);
                        }
                    });
                },
        
                onSeePersons: function () {
                    const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("persons");
                },
        
                onSeeSuppliers: function () {
                    const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("supplyersrsPage");
                },
        
                onOpenLoginPage: function () {
                    const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("loginPage");
                },
        
                onViewChart: function () {
                    const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("chartPage");
                },
        
                onOpenRequestproducts: function () {
                    const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("requestPage");
                },
        
                onLogout: function () {
                    localStorage.removeItem("loggedInUser");
                    MessageToast.show("Logged out successfully!");
                    this.getRouter().navTo("loginPage");
                },
                           onShowEditingDialog: function (oEvent) {
                if (!this.byId("idEditProductDialog")) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "crud.view.fragments.EditProductDialog", // Corrected file name
                        controller: this
                    }).then(function (oDialog) {
                        this.getView().addDependent(oDialog);
                        this._openEditDialog(oEvent);
                    }.bind(this)).catch(function (oError) {
                        console.error("Error loading fragment: ", oError);
                    });
                } else {
                    this._openEditDialog(oEvent);
                }
            },
            
            _openEditDialog: function (oEvent) {
                const button = oEvent.getSource();
                const listItem = button.getParent();
                const context = listItem.getBindingContext();
                const productData = context.getObject();
            
                this._selectedProductId = productData.ID;
            
                const dialog = this.byId("idEditProductDialog");
                this.byId("productNameText").setValue(productData.Name);
                this.byId("productPriceText").setValue(productData.Price);
                this.byId("productRatingText").setValue(productData.Rating);
                this.byId("productReleaseDateText").setValue(productData.ReleaseDate);
            
                dialog.open();
            },
            
            onCloseEditingDialog: function () {
                this.byId("idEditProductDialog").close();
            },
            
            onEditPress: function () {
                const Name = this.byId("productNameText").getValue();
                const Price = this.byId("productPriceText").getValue();
                const Rating = this.byId("productRatingText").getValue();
                const ReleaseDate = this.byId("productReleaseDateText").getValue();
                const productId = this._selectedProductId;
            
                if (!Name) {
                    sap.m.MessageToast.show("Product Name cannot be empty.");
                    return;
                }
            
                if (!Price || isNaN(Price) || parseFloat(Price) <= 0) {
                    sap.m.MessageToast.show("Please enter a valid price greater than 0.");
                    return;
                }
            
                if (!Rating || isNaN(Rating) || parseInt(Rating) < 1 || parseInt(Rating) > 5) {
                    sap.m.MessageToast.show("Please enter a valid rating between 1 and 5.");
                    return;
                }
            
                if (!ReleaseDate) {
                    sap.m.MessageToast.show("Release Date cannot be empty.");
                    return;
                }
            
                const formattedReleaseDate = this.formatDateForOData(ReleaseDate);
            
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
                            <d:ReleaseDate m:type="Edm.DateTime">${formattedReleaseDate}</d:ReleaseDate>
                            <d:DiscontinuedDate m:null="true"/>
                            <d:Rating m:type="Edm.Int16">${parseInt(Rating)}</d:Rating>
                            <d:Price m:type="Edm.Double">${parseFloat(Price)}</d:Price>
                        </m:properties>
                    </content>
                </entry>`;
            
                fetch(`http://localhost:4000/odata/Products(${productId})`, {
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
            });
        });