Mast.components.SettingsComponent  = Mast.Component.extend({

	template: '.settings-template',
	outlet: '#content'

});

function autoclick(id) {
	document.getElementById(id).click();
}


function cssFileSelected(input) {
	var fullPath = document.getElementById('css_file').value;
	if (fullPath) {
		var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
		var filename = fullPath.substring(startIndex);
		if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
			filename = filename.substring(1);
		}

		var tbox = document.getElementById('css_file_input');
		tbox.value = filename;
       
	}
}

function fileSelected(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			$('#profImage').attr('src', e.target.result);
		};

		reader.readAsDataURL(input.files[0]);
	}
}
