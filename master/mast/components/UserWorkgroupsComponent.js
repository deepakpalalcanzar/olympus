Mast.registerTree('UserWorkgroup', {
    template: '.workgroup-template',
    model: {
        column1: {
            name: 'Workgroups',
            className: 'user-column'
        },
        selectedModel: null
    },
    emptyHTML: '<div class="loading-spinner"></div>',
    branchComponent: 'WorkgroupRow',
    branchOutlet: '.workgroup-outlet',
    collection: 'UsersWorkgroup',
    events: {
        'click .assign_workgroup': 'createUploadDialog',
        'click .delete-workgroup': 'deleteWorkgroupPermission'
    },
//create a dialog to search for workgroup
    createUploadDialog: function (e) {
        var searchDialog = new Mast.components.SearchDialogComponent();
        e.stopPropagation();
    },
    init: function () {
        var self = this;
        var userId = {id: Mast.Session.User.id};
        this.collection.reset();
        this.collection.fetchWorkgroup(userId, function (res, err) {
        });
    },
    deleteWorkgroupPermission: function (e) {
        var self = this.collection;
        var workgroup = $(e.target).data('id');

        if (confirm('Are you sure you want to delete?')) {
            Mast.Socket.request('/account/deletePermission', {workgroup_id: workgroup, user_id: Mast.Session.User.id}, function (res, err) {

               // alert('Permission Successfully Removed');
                Mast.history.loadUrl();


            });
        }
    }

});

// user row component
Mast.registerComponent('WorkgroupRow', {
    template: '.workgroup-row-template',
});