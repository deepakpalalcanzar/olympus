/*---------------------
	:: Theme 
	-> controller
---------------------*/
var ThemeController = {
	updateColors: function(req, res){
		Theme.saveColors(req.body, function(err, theme) {
            if (err) return res.json({error: 'Error creating adminuser',type: 'error'});
            return  res.json({ id: theme.id });
        });
	}
};
module.exports = ThemeController;