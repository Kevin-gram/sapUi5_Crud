sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";
    return Control.extend("crud.controls.CustomCard", {
        metadata: {
            properties: {
                title: { type: "string", defaultValue: "" },
                description: { type: "string", defaultValue: "" },
                imageUrl: { type: "string", defaultValue: "" }
            },
            aggregations: {
                actions: { type: "sap.ui.core.Control", multiple: true, singularName: "action" }
            }
        },
        renderer: function (oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("customCard");
            oRm.addClass("width");
            oRm.addClass("height");
            oRm.writeClasses();
            oRm.write(">");
            
            oRm.write("<div class='customCardHeader'>");
            oRm.writeEscaped(oControl.getTitle());
            oRm.write("</div>");
            
            oRm.write("<div class='customCardContent'>");
            if (oControl.getImageUrl()) {
                oRm.write("<img src='" + oControl.getImageUrl() + "' class='customCardImage' />");
            }
            oRm.writeEscaped(oControl.getDescription());
            oRm.write("</div>");
            
            oRm.write("<div class='customCardActions'>");
            var aActions = oControl.getActions();
            for (var i = 0; i < aActions.length; i++) {
                oRm.renderControl(aActions[i]);
            }
            oRm.write("</div>");
            
            oRm.write("</div>");
        }
    });
});