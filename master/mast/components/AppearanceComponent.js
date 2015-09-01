Mast.registerComponent('AppearanceComponent',{

	template: '.account-appearance-template',

	events: {
		'change .fontfamily' : 'fontChange',
		'click .submit-appearance' : 'saveConfiguration'
	},

	model : {
		header_background 	: '#ffffff',
		navigation_color	: '#4f7ba9',
		body_background		: '#f9f9f9',
		footer_background	: '#f9f9f9',
		font_color			: '#547aa4',
		font_family			: 'ProzimanovaRegular, Helvetica, Ariel, sans-serif'
	}, 

	finalizeHeaderColor: function(){
		var workArea = $('.colpick_submit').parent().parent().attr('class');
		var x = $('.colpick_hex_field > input').val();
		if(workArea == 'olympusHeader'){
			$("#top-nav").css({ 'background-color' : "#"+x });
		}else if (workArea == 'olympusBody'){
			$("#content").css({ 'background-color' : "#"+x });
		}else if (workArea == 'olympusFooter'){
			$("#footer").css({ 'background-color' : "#"+x });
		}
	},

	fontChange: function(){
		$("body, p, a, h1, h2, h3, h4, h5, h6, label").css({ 'font-family' : this.$('select[name="fontFamily"]').val() });
	},

	saveConfiguration: function(){
		var themeChanges = this.getThemeColors();
		Mast.Socket.request('/theme/updateColor', themeChanges, function(req, err){
			console.log("laksdklasdsjladssakdasjdlasdjljklsadljkasjasjs");
		});
	},

	// get theme changes 
	getThemeColors: function() {
		var header, nav, body, footer, fontColor, fontFamily;
		return {
			header 		: $('.olympusHeader .colpick_hex_field input').val(),
			nav 		: $('.olympusNav .colpick_hex_field input').val(),
			body 		: $('.olympusBody .colpick_hex_field input').val(),
			footer 		: $('.olympusFooter .colpick_hex_field input').val(),
			fontColor 	: $('.olympusFont .colpick_hex_field input').val(),
			fontFamily 	: $('select[name="fontFamily"]').val()
		};
	},


});

