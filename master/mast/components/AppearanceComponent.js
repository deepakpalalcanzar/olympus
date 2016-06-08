Mast.registerComponent('AppearanceComponent',{

	template: '.account-appearance-template',

	events: {
		'change .fontfamily' : 'fontChange',
		'click .submit-appearance' : 'saveConfiguration',
		'click .reset-appearance' : 'resetConfiguration'
	},

	model : {
		header_background 	: '#ffffff',
		navigation_color	: '#4f7ba9',
		body_background		: '#f9f9f9',
		footer_background	: '#f9f9f9',
		font_color			: '#547aa4',
		font_family			: 'ProzimanovaRegular, Helvetica, Ariel, sans-serif'
	},

	afterRender: function() {

		Mast.Socket.request('/theme/getCurrentTheme', null, function(res, err, next) {

			$('.olympusHeader').colpick({
				color: res.theme.header,
	            flat: true,
	            layout: 'hex',
	            submit: 0,
	            onChange: function (hsb, hex, rgb, el, bySetColor) {
	                $("#topbar").css({'background-color': "#" + hex});
	                $("#main-nav li a").css({
	                    background: "#" + hex,
	                    border: "#" + hex
	                });
	            }
	        });
	        $('.olympusBody').colpick({
	        	color: res.theme.body,
	            flat: true,
	            layout: 'hex',
	            submit: 0,
	            onChange: function (hsb, hex, rgb, el, bySetColor) {
	                $("#content").css({'background-color': "#" + hex});
	                $("#content > div").css({'background': "#" + hex});
	                $(".wrapper").css({'background-color': "#" + hex});
	                $('.listusers-outlet, .log-outlet, .dropdownActions-outlet').css({'background': "#" + hex});
	            }
	        });
	        $('.olympusFooter').colpick({
	        	color: res.theme.footer,
	            flat: true,
	            layout: 'hex',
	            submit: 0,
	            onChange: function (hsb, hex, rgb, el, bySetColor) {

	                $("#footer").css({'background-color': "#" + hex});
	            }
	        });
	        $('.olympusNav').colpick({
	        	color: res.theme.navcolor,
	            flat: true,
	            layout: 'hex',
	            submit: 0,
	            onChange: function (hsb, hex, rgb, el, bySetColor) {
	                $(".upload-search-template").css({'background': "#" + hex});
	            }
	        });
	        $('.olympusFont').colpick({
	        	color: res.theme.font_color,
	            flat: true,
	            layout: 'hex',
	            submit: 0,
	            onChange: function (hsb, hex, rgb, el, bySetColor) {

	                $(".inode-name").removeAttr("style");

	                $('body').css({'color': "#" + hex});
	                $('a').css({'color': "#" + hex});
	                $('p, label, span').css({'color': "#" + hex});
	                $('h1, h2, h3, h4, h5, h6').css({'color': "#" + hex});
	            }
	        });

	        console.log(res.theme.font_family);
	        console.log($('select[name="fontFamily"]').length);
	        console.log($('select[name="fontFamily"] option[value="'+res.theme.font_family+'"]').length);
	        $('select[name="fontFamily"] option[value="'+res.theme.font_family+'"]').prop('selected', true);
		});
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
			if(req.type === 'success'){
				alert("Theme updated successfully.");
			}
		});
	},

	resetConfiguration: function(){

		//Reset Header color
        $("#topbar").css({'background-color': "#ffffff"});
        $("#main-nav li a").css({
            background: "#ffffff",
            border: "#ffffff"
        });

        //Reset Body color
        $("#content").css({'background-color': "#f9f9f9"});
        $("#content > div").css({'background': "#f9f9f9"});
        $(".wrapper").css({'background-color': "#f9f9f9"});
        $('.listusers-outlet, .log-outlet, .dropdownActions-outlet').css({'background': "#f9f9f9"});
        
        //Reset Footer color
        $("#footer").css({'background-color': "#f9f9f9"});
        
        //Reset nav color
        $(".upload-search-template").css({'background': "#4f7ba9"});
        
        //Reset font color
        $(".inode-name").removeAttr("style");
        $('body').css({'color': "#547aa4"});
        $('a').css({'color': "#547aa4"});
        $('p, label, span').css({'color': "#547aa4"});
        $('h1, h2, h3, h4, h5, h6').css({'color': "#547aa4"});
        
        //Reset font style
        $("body, p, a, h1, h2, h3, h4, h5, h6, label").css({ 'font-family' : 'ProzimanovaRegular, Helvetica, Ariel, sans-serif' });

		//save the reset theme permanently
		var themeChanges = {
			header 		: '#ffffff',
			nav 		: '#4f7ba9',
			body 		: '#f9f9f9',
			footer 		: '#f9f9f9',
			fontColor 	: '#547aa4',
			fontFamily 	: 'ProzimanovaRegular, Helvetica, Ariel, sans-serif'
		};

		Mast.Socket.request('/theme/updateColor', themeChanges, function(req, err){
			if(req.type === 'success'){
				alert("Theme has been reset successfully.");
			}
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

