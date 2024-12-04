sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/Text",
    "sap/m/ColumnListItem"
], function (Control, Table, Column, Text, ColumnListItem) {
    "use strict";
    return Control.extend("crud.controls.CustomTable", {
        metadata: {
            properties: {
                headerText: { type: "string", defaultValue: "" },
                items: { type: "object", defaultValue: [] }
            }
        },
        init: function () {
            this._oTable = new Table({
                headerText: this.getHeaderText(),
                columns: [
                    new Column({ header: new Text({ text: "Product ID" }) }),
                    new Column({ header: new Text({ text: "Name" }) }),
                    new Column({ header: new Text({ text: "Price" }) }),
                    new Column({ header: new Text({ text: "Rating" }) }),
                    new Column({ header: new Text({ text: "Release Date" }) })
                ]
            });
        },
        setItems: function (aItems) {
            this.setProperty("items", aItems, true);
            var aListItems = aItems.map(function (oItem) {
                return new ColumnListItem({
                    cells: [
                        new Text({ text: oItem.ID }),
                        new Text({ text: oItem.Name }),
                        new Text({ text: oItem.Price }),
                        new Text({ text: oItem.Rating }),
                        new Text({ text: oItem.ReleaseDate })
                    ]
                });
            });
            this._oTable.removeAllItems();
            this._oTable.addItems(aListItems);
        },
        renderer: function (oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("customTable");
            oRm.writeClasses();
            oRm.write(">");
            oRm.renderControl(oControl._oTable);
            oRm.write("</div>");
        }
    });
});