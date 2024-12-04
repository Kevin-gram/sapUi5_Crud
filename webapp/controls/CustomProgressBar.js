sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";
    return Control.extend("crud.controls.CustomProgressBar", {
        metadata: {
            properties: {
                value: { type: "int", defaultValue: 0 },
                maxValue: { type: "int", defaultValue: 100 }
            }
        },
        renderer: function (oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("customProgressBar");
            oRm.writeClasses();
            oRm.write(">");
            
            oRm.write("<div class='customProgressBarFill' style='width:" + (oControl.getValue() / oControl.getMaxValue() * 100) + "%;'></div>");
            
            oRm.write("</div>");
        }
    });
});