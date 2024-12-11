sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
], function (BaseController, MessageToast) {
    "use strict";

    return BaseController.extend("crud.controller.SignupPage", {
        onSignup: function () {
            const username = this.byId("signupUsername").getValue();
            const password = this.byId("signupPassword").getValue();

            if (username && password) {
                // Get existing users from local storage
                let users = localStorage.getItem("users");
                users = users ? JSON.parse(users) : [];

                // Check if the username already exists
                if (users.some(user => user.username === username)) {
                    MessageToast.show("Username already exists.");
                    return;
                }

                // Add the new user to the users array
                users.push({ username: username, password: password });

                // Store the updated users array in local storage
                localStorage.setItem("users", JSON.stringify(users));

                MessageToast.show("Signup successful! Please log in.");

                // Navigate back to the login page
                this.getRouter().navTo("loginPage");
            } else {
                MessageToast.show("Please enter a username and password.");
            }
        },

        onNavBack: function () {
            this.getRouter().navTo("loginPage");
        }
    });
});