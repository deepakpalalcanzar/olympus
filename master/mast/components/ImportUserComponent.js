/*Mast.components.AddUserComponent  = Mast.Component.extend({*/

Mast.registerComponent('ImportUserComponent', {
    template: '.import-user-template',
    outlet: '#content',
    events: {
        'click.setting-save-button': 'importUser',
    },
    model: {
        superadmin: false,
    },
    collection: 'Account',
    importUser: function () {

        var self = this;
        var userData = this.getFormData();

        if (self.validateForm()) {
            //console.log(userData.filepath);
            Mast.Socket.request('/profile/checkUsersLimit', null, function (re, er) {
                if (re.not_subscriber && Mast.Session.Account.isSuperAdmin != true) {
                    alert('You have not subscribed any plan yet!');
                    Mast.navigate('#account/subscription');
                } else {
                    if (re.error) {
                        self.clearForm();
                        $("#msgid").html("");
                        $(".user-file").css({"border": "1px solid LightGray"});
                        alert('You have reaced maximum limit of creating users');
                    } else {
                        Mast.Socket.request('/account/readCSVFile', {filepath: userData.filepath}, function (reso, er) {
                            if (reso) {
                                self.clearForm();
                                $("#msgid").html("");
                                $(".user-file").css({"border": "1px solid LightGray"});
                                alert('Successfully Saved!');
                                Mast.navigate('#listusers');
                            }
                        });
                    }
                }
            });
        }
    },
    getFormData: function () {
        var file = this.$('input[name="file"]').val();
        return {
            filepath: this.$('input[name="file"]').val()
        };
    },
    clearForm: function () {
        this.$('input[name="file"]').val('');
    },
    validateForm: function () {
        this.clearFormCSS();
        if (this.$('input[name="file"]').val() === '') {
            $("#msgid").html("<span class='error_span'> Please Select file. </span>");
            $(".user-file").css({"border": "1px solid red"});
            return false;
        } else {

            var file = this.$('input[name="file"]').val();
            var filename = file.split('\\').pop();
            var ext = filename.split('.').pop();
            if (ext != 'csv') {
                $("#msgid").hide();
                alert("Please upload only CSV files.");
                return false;
            }
        }
        return true;
    },
    clearFormCSS: function () {
//        alert('called');
//        $(".file").removeClass();
//        $(".error_span").removeClass();
//        $(".user-file").removeClass();
    },
});
