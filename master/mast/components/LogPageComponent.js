Mast.registerComponent('LogPage', {
    template: '.log-page-template',
    outlet: '#content',
    regions: {
        '.log-table-region': 'LogTable'
    },
    init: function () {
        console.log(window.location);
        

    },
});