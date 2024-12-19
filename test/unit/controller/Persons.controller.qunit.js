sap.ui.define([
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit",
    "crud/controller/Persons.controller",
    "sap/ui/model/odata/v2/ODataModel"
], function (sinon, sinonQunit, PersonsController, ODataModel) {
    "use strict";

    QUnit.module("Persons Controller", {
        beforeEach: function () {
            this.oController = new PersonsController();
            this.oViewStub = {
                setModel: sinon.stub()
            };
            sinon.stub(this.oController, "getView").returns(this.oViewStub);
        },
        afterEach: function () {
            this.oController.destroy();
            this.oController = null;
        }
    });

    QUnit.test("Should initialize the OData model and set it to the view", function (assert) {
        // Arrange
        var oModelStub = sinon.createStubInstance(ODataModel);
        sinon.stub(ODataModel.prototype, "constructor").returns(oModelStub);

        // Act
        this.oController.onInit();

        // Assert
        assert.ok(this.oViewStub.setModel.calledOnce, "The setModel method was called once");
        assert.ok(this.oViewStub.setModel.calledWith(oModelStub), "The setModel method was called with the OData model");

        // Restore the stubbed constructor
        ODataModel.prototype.constructor.restore();
    });
});