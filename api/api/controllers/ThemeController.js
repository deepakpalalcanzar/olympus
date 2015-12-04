var request = require('request');
var ThemeController = {

    updateColor: function (req, res) {

    	var options = {
            uri: 'http://localhost:1337/theme/updateColors' ,
            method: 'POST',
        };

        options.json =  {
            headerColor : "#"+req.param('header'),
            navColor	: "#"+req.param('nav'),
            bodyColor   : "#"+req.param('body'),
            footerColor : "#"+req.param('footer'),
            fontColor	: "#"+req.param('fontColor'),
            fontFamily	: req.param('fontFamily'),
            account_id	: req.session.Account.id,
        };

        request(options, function(err, response, body) {
			if(err) return res.json({ error: err.message, type: 'error' }, response && response.statusCode);        
		});

	},

   getThemeConfiguration: function (req, res) {

        var sql = "SELECT account_id FROM accountdeveloper WHERE access_token=?";
        sql = Sequelize.Utils.format([sql, req.params.authorization]);
        sequelize.query(sql, null, {
            raw: true
        }).success(function (accountDev) {
            if (accountDev.length) {
                var options = {
                    uri: 'http://localhost:1337/theme/getThemeConfiguration',
                    method: 'GET',
                };

                options.json = {
                    account_id: accountDev[0]['account_id'],
                };

                request(options, function (err, response, body) {
                    if (err)
                        return res.json(response);
                });
            } else {
                res.json({notAuth: 'not autorized'});
            }
        });
    }

};
module.exports = ThemeController;
