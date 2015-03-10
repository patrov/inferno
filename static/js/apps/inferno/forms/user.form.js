define(["Kimo.FormManager"], function (FormManager) {
    var UserForm = FormManager.createForm("BookImport", {

        data: {},

        validator: function (data) {
            var isValid = true,
                errors = [],
                re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
            if (!$.trim(data.login).length) {
                isValid = false;
                errors.push({field:"login", message:"Chan sa a pa dwe vid!"});
            }
            if (!$.trim(data.password).length) {
                isValid = false;
                errors.push({field:"password", message:"Chan sa a pa dwe vid!"});
            }
            if (!$.trim(data.email).length) {
                isValid = false;
                errors.push({field:"email", message:"Chan sa a pa dwe vid!"});
            }
            if (!re.test(data.email)) {
                isValid = false;
                errors.push({field:"email", message:"Imel sa a pa valid!"});
            }
            if(!isValid) {
                this.handleError(errors);
            }
            return isValid;
        },

        map: {
            login: {
                label: "Idantifyan",
                type: "text",
                placeholder: "Login",
                collapsible: true
            },
            password: {
                label: "Modpas",
                type: "password",
                placeholder: "Password"
            },
            email: {
                label: "imel",
                type: "text",
                placeholder: "adrès imel"
            }
        },

        buttons: [{
            text: "Create",
            type: "submit"
        }]
    });
    return UserForm;
});