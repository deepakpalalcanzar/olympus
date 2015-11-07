Mast.registerTree('LogTable', {
    extendsFrom: 'UITableComponent',
    model: {
        column1: {
            name: 'User Name',
            className: 'log-user-column'
        },
        column2: {
            name: 'Activity',
            className: 'log-activity-column'
        },
        column3: {
            name: 'ClientIp',
            className: 'log-clientip-column'
        },
        column4: {
            name: 'Date',
            className: 'log-date-column'
        },
     
        selectedModel: null,
        page : '1'
    },
    template: '.log-template',
    events: {
        'click .search-details': 'searchdata',
    },
  
    init: function () {
 
        $('.upload-file').hide();
        this.collection.fetch();
        Mast.Socket.request('/logging/listLog/'+window.location.hash.split( '/' )['1'], null, function (res, err) {
            if (res) {
                var options = "";
                $.each(res, function (i, val) {
                    options = val.Paginator;
                });
                $('#list_pagignation').html(options);
            }
        });
        
    },
    
      // branch properties
    emptyHTML: '<div class="loading-spinner"></div>',
    branchComponent: 'LogRow',
    branchOutlet: '.log-outlet',
    
    collection: {
        initialize: function(options) {
            console.log(Mast.Session.page);
              this.url = '/logging/listLog/'+Mast.Session.page;
          
        },
        autoFetch: false,
        model: Mast.Model.extend({
            defaults: {
                highlighted: false,
                name: "-",
                ent_name: "-",
                text_message: "-",
                ip_address: "-",
                platform: "-",
                created_at: "Default"
            },
            selectedModel: this
        })
    },
    
   
    
    searchdata: function () {
        Mast.Session.from = $('input[name="from"]').val();
        Mast.Session.to = $('input[name="to"]').val();
        Mast.Session.activity = $('select[name="activity"]').val();
        Mast.Session.from_page = window.location.hash;
        Mast.navigate('searchdate');
    },
});

// log row component
Mast.registerComponent('LogRow', {
    template: '.log-row-template',
    events: {
        'click .log-user-column': 'logUserDetails'
    },
    logUserDetails: function () {
        this.model.attributes.id = this.model.attributes.user_id;
        Mast.Session.User = this.model.attributes;
        Mast.navigate('#user/details');
    },
});
