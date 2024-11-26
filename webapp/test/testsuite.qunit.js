sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: crud",
		defaults: {
			page: "ui5://test-resources/crud/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "crud/",
				never: "test-resources/crud/"
			},
			loader: {
				paths: {
					"crud": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for crud"
			},
			"integration/opaTests": {
				title: "Integration tests for crud"
			}
		}
	};
});
