// sap.ui.define([
//     "sap/m/Button",
//     "sap/ui/core/Control"
// ], function (Button, Control) {
//     "use strict";

//     return Button.extend("custom.controls.CustomButton", {
//         metadata: {
//             properties: {
//                 customProperty: { type: "string", defaultValue: "defaultValue" },
//                 width: { type: "sap.ui.core.CSSSize", defaultValue: "auto" },
//                 padding: { type: "sap.ui.core.CSSSize", defaultValue: "0px" },
//                 backgroundColor: { type: "sap.ui.core.CSSColor", defaultValue: "transparent" }
//             },
//             events: {
//                 customPress: {}
//             }
//         },

//         renderer: {
//             apiVersion: 2, // Use the latest rendering API
//             render: function (oRm, oControl) {
//                 oRm.openStart("button", oControl);
//                 oRm.style("width", oControl.getWidth());
//                 oRm.style("padding", oControl.getPadding());
//                 oRm.style("background-color", oControl.getBackgroundColor());
//                 oRm.class("sapMBtn");
//                 oRm.openEnd();
//                 oRm.text(oControl.getText());
//                 oRm.close("button");
//             }
//         },

//         onAfterRendering: function () {
//             if (Button.prototype.onAfterRendering) {
//                 Button.prototype.onAfterRendering.apply(this, arguments);
//             }

//             // Custom behavior after rendering
//             this.$().on("click", function () {
//                 this.fireCustomPress();
//             }.bind(this));
//         },

//         fireCustomPress: function () {
//             this.fireEvent("customPress");
//         }
//     });
// });