sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";
    return Control.extend("crud.controls.ThemeToggleButton", {
        metadata: {
            properties: {
                text: { type: "string", defaultValue: "Toggle Theme" }
            },
            events: {
                themeToggle: {}
            }
        },
        renderer: function (oRm, oControl) {
            oRm.write("<button");
            oRm.writeControlData(oControl);
            oRm.write(">");
            oRm.writeEscaped(oControl.getText());
            oRm.write("</button>");
        },
        onAfterRendering: function () {
            this.$().on("click", function () {
                this.fireThemeToggle();
            }.bind(this));
        }
    });
});