sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";
    return Control.extend("crud.controls.CustomButton", {
        metadata: {
            properties: {
                text: { type: "string", defaultValue: "" },
                customProperty: { type: "string", defaultValue: "" },
                width: { type: "sap.ui.core.CSSSize", defaultValue: "auto" },
                padding: { type: "sap.ui.core.CSSSize", defaultValue: "0px" },
                backgroundColor: { type: "sap.ui.core.CSSColor", defaultValue: "transparent" }
            },
            events: {
                customPress: {}
            }
        },
        renderer: function (oRm, oControl) {
            oRm.write("<button");
            oRm.writeControlData(oControl);
            oRm.addStyle("width", oControl.getWidth());
            oRm.addStyle("padding", oControl.getPadding());
            oRm.addStyle("background-color", oControl.getBackgroundColor());
            oRm.addStyle("margin", "5px");
            oRm.addStyle("border-radius", "8px");
            oRm.writeStyles();
            oRm.write(">");
            oRm.writeEscaped(oControl.getText());
            oRm.write("</button>");
        },
        onAfterRendering: function () {
            this.$().on("click", function () {
                this.fireCustomPress();
            }.bind(this));
        }
    });
});