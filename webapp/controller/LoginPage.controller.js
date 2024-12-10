sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
], function (BaseController, MessageToast) {
    "use strict";

    return BaseController.extend("crud.controller.LoginPage", {
        onInit: function () {
            // Check if user is already logged in
            const loggedInUser = localStorage.getItem("loggedInUser");
            if (loggedInUser) {
                MessageToast.show("Welcome back, " + loggedInUser);
                // Navigate to the main page or dashboard
                this.getRouter().navTo("Main");
            }
        },

        onLogin: function () {
            const username = this.byId("username").getValue();
            const password = this.byId("password").getValue();

            // Validate the login credentials
            if (this._validateLogin(username, password)) {
                // Store the logged-in user in local storage
                localStorage.setItem("loggedInUser", username);
                MessageToast.show("Login successful!");

                // Navigate to the main page or dashboard
                this.getRouter().navTo("main");
            } else {
                MessageToast.show("Invalid username or password.");
            }
        },

        onNavigateToSignup: function () {
            this.getRouter().navTo("signupPage");
        },

        _validateLogin: function (username, password) {
            // Get existing users from local storage
            const users = JSON.parse(localStorage.getItem("users")) || [];

            // Check if the username and password match any user in the local storage
            return users.some(user => user.username === username && user.password === password);
        }
    });
});