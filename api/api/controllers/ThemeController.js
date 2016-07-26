/*---------------------
 :: Theme 
 -> controller
 ---------------------*/
var ThemeController = {
    updateColors: function (req, res) {
        Theme.saveColors(req.body, function (err, theme) {
            if (err) return res.json({error: 'Error creating adminuser', type: 'error'});
            return res.json({id: theme.id});
        });
    },
    /*getThemeConfiguration: function (req, res) {

        function hexToRgb(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        var id = req.body.account_id;
        if (id) {

            Account.findOne(id).done(function (err, account_enter) {

                if (!account_enter.id) {
                    return res.json({
                        error: 'Enterprise Data not found',
                        type: 'error'
                    }, 400);
                }

                Theme.findOne({account_id: account_enter.id}).done(function (err, dir) {
                    if (err)
                        res.json({success: false, error: err});
                    if (!dir) {

                        return 	res.json({
					success: true, 
					enterprise_fsname: account_enter.enterprise_fsname, 
					enterprise_mimetype: account_enter.enterprise_mimetype, 
					header_background: "null", 
					footer_background: "null", 
					body_background: "null", 
                    			navigation_color: "null", 
					font_color: "null", 
					font_family: "null", 
					adaptor: sails.config.receiver,
					bucket              : "app.olympus.io",
					api_key             : "AKIAIEURF2O4FGCDDK6A",
					api_secret_key      : "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"

				});
                    }

                    var Rgb_header_background = ""+ (hexToRgb(dir.header_background).r)+","+(hexToRgb(dir.header_background).g)+","+(hexToRgb(dir.header_background).b)+"";
                    var Rgb_footer_background = ""+ (hexToRgb(dir.footer_background).r)+","+(hexToRgb(dir.footer_background).g)+","+(hexToRgb(dir.footer_background).b)+"";
                    var Rgb_body_background = ""+ (hexToRgb(dir.body_background).r)+","+(hexToRgb(dir.body_background).g)+","+(hexToRgb(dir.body_background).b)+"";
                    var Rgb_navigation_color = ""+ (hexToRgb(dir.navigation_color).r)+","+(hexToRgb(dir.navigation_color).g)+","+(hexToRgb(dir.navigation_color).b)+"";
                    var Rgb_font_color = ""+ (hexToRgb(dir.font_color).r)+","+(hexToRgb(dir.font_color).g)+","+(hexToRgb(dir.font_color).b)+"";
                    
                    return 	res.json({
					success: true, 
					enterprise_fsname: account_enter.enterprise_fsname, 
					enterprise_mimetype: account_enter.enterprise_mimetype,
		                	header_background: Rgb_header_background, 
					footer_background: Rgb_footer_background, 
					body_background: Rgb_body_background, 
		            		navigation_color: Rgb_navigation_color, 
					font_color: Rgb_font_color, 
					font_family: dir.font_family, 
					adaptor: sails.config.receiver,
					bucket              : "app.olympus.io",
					api_key             : "AKIAIEURF2O4FGCDDK6A",
					api_secret_key      : "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"

			 	});
                });
            })

        }
    }*/


    getThemeConfiguration: function (req, res) {

         /*function hexToRgb(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }*/

        var id = req.body.account_id;
        if (id) {

            Account.findOne(id).done(function (err, account_enter) {

                if (!account_enter.id) {
                    console.log('Enterprise Data not found');
                    return res.json({
                        error: 'Enterprise Data not found',
                        type: 'error'
                    }, 400);
                }
                Theme.findOne({account_id: account_enter.id}).sort('createdAt DESC').done(function (err, dir) {
                    if (err)
                        res.json({success: false, error: err});

                    TransactionDetails.findOne({
                        account_id: account_enter.id
                    }).sort('createdAt DESC').done(function(err, trans){
                        if (!dir) {
                            if(!account_enter.created_by){//is null
                                ThemeController.sendthemeResponse(res, dir, account_enter, trans);
                            }else{
                                //if no theme found, check parent enterprise account
                                Account.findOne(account_enter.created_by).done(function (err, account_enter) {

                                    if (!account_enter.id) {
                                        console.log('Enterprise Data not found');
                                        return res.json({
                                            error: 'Enterprise Data not found',
                                            type: 'error'
                                        }, 400);
                                    }
                                    Theme.findOne({account_id: account_enter.id}).sort('createdAt DESC').done(function (err, dir) {
                                        if (err)
                                            res.json({success: false, error: err});

                                        if (!dir || !account_enter.is_enterprise) {
                                            ThemeController.sendthemeResponse(res, dir, account_enter, trans);
                                            /*return  res.json({
                                                success             : true, 
                                                enterprise_fsname   : (account_enter.enterprise_fsname)?account_enter.enterprise_fsname:"null", 
                                                enterprise_mimetype : (account_enter.enterprise_mimetype)?account_enter.enterprise_mimetype:"null", 
                                                header_background   : "null", 
                                                footer_background   : "null", 
                                                body_background     : "null", 
                                                navigation_color    : "null", 
                                                font_color          : "null", 
                                                font_family         : "null",
                                                adaptor             : sails.config.receiver,
                                                users_limit         : (trans.users_limit === 'undefined') ? null :trans.users_limit,
                                                quota               : (trans.quota === 'undefined') ? null :trans.quota,
                                                plan_name           : (trans.plan_name === 'undefined') ? null :trans.plan_name,
                                                duration            : (trans.duration === 'undefined') ? null :trans.duration,
                                                account_id          : account_enter.id,

                                            });*/
                                        }

                                        ThemeController.sendthemeResponse(res, dir, account_enter, trans);
                                        /*var Rgb_header_background   = ""+ (dir.header_background === '#undefined' ? null : (hexToRgb(dir.header_background).r)) +","+(dir.header_background === '#undefined' ? null : (hexToRgb(dir.header_background).g))+","+(dir.header_background === '#undefined' ? null : (hexToRgb(dir.header_background).b))+"";
                                        var Rgb_footer_background   = ""+ (dir.footer_background === '#undefined' ? null : (hexToRgb(dir.footer_background).r)) +","+(dir.footer_background === '#undefined' ? null : (hexToRgb(dir.footer_background).g))+","+(dir.footer_background === '#undefined' ? null : (hexToRgb(dir.footer_background).b))+"";
                                        var Rgb_body_background     = ""+ (dir.body_background === '#undefined' ? null : (hexToRgb(dir.body_background).r)) +","+(dir.body_background === '#undefined' ? null : (hexToRgb(dir.body_background).g))+","+(dir.body_background === '#undefined' ? null : (hexToRgb(dir.body_background).b))+"";
                                        var Rgb_navigation_color    = ""+ (dir.navigation_color === '#undefined' ? null : (hexToRgb(dir.navigation_color).r)) +","+(dir.navigation_color === '#undefined' ? null : (hexToRgb(dir.navigation_color).g))+","+(dir.navigation_color === '#undefined' ? null : (hexToRgb(dir.navigation_color).b))+"";
                                        var Rgb_font_color          = ""+ (dir.font_color === '#undefined' ? null : (hexToRgb(dir.font_color).r)) +","+(dir.font_color === '#undefined' ? null : (hexToRgb(dir.font_color).g))+","+(dir.font_color === '#undefined' ? null : (hexToRgb(dir.font_color).b))+"";                                
                                        return  res.json({
                                            success             : true, 
                                            enterprise_fsname   : account_enter.enterprise_fsname, 
                                            enterprise_mimetype : account_enter.enterprise_mimetype,
                                            header_background   : Rgb_header_background, 
                                            footer_background   : Rgb_footer_background, 
                                            body_background     : Rgb_body_background, 
                                            navigation_color    : Rgb_navigation_color, 
                                            font_color          : Rgb_font_color, 
                                            font_family         : dir.font_family, 
                                            adaptor             : sails.config.receiver,
                                            users_limit         : trans.users_limit,
                                            quota               : trans.quota,
                                            plan_name           : trans.plan_name,
                                account_id  :account_enter.id,
                                            duration            : trans.duration,

                                        });*/
                                    });
                                });
                            }
                        }else{

                            ThemeController.sendthemeResponse(res, dir, account_enter, trans);ThemeController.sendthemeResponse(res, dir, account_enter, trans);
                            /*var Rgb_header_background   = ""+ (dir.header_background === '#undefined' ? null : (hexToRgb(dir.header_background).r)) +","+(dir.header_background === '#undefined' ? null : (hexToRgb(dir.header_background).g))+","+(dir.header_background === '#undefined' ? null : (hexToRgb(dir.header_background).b))+"";
                            var Rgb_footer_background   = ""+ (dir.footer_background === '#undefined' ? null : (hexToRgb(dir.footer_background).r)) +","+(dir.footer_background === '#undefined' ? null : (hexToRgb(dir.footer_background).g))+","+(dir.footer_background === '#undefined' ? null : (hexToRgb(dir.footer_background).b))+"";
                            var Rgb_body_background     = ""+ (dir.body_background === '#undefined' ? null : (hexToRgb(dir.body_background).r)) +","+(dir.body_background === '#undefined' ? null : (hexToRgb(dir.body_background).g))+","+(dir.body_background === '#undefined' ? null : (hexToRgb(dir.body_background).b))+"";
                            var Rgb_navigation_color    = ""+ (dir.navigation_color === '#undefined' ? null : (hexToRgb(dir.navigation_color).r)) +","+(dir.navigation_color === '#undefined' ? null : (hexToRgb(dir.navigation_color).g))+","+(dir.navigation_color === '#undefined' ? null : (hexToRgb(dir.navigation_color).b))+"";
                            var Rgb_font_color          = ""+ (dir.font_color === '#undefined' ? null : (hexToRgb(dir.font_color).r)) +","+(dir.font_color === '#undefined' ? null : (hexToRgb(dir.font_color).g))+","+(dir.font_color === '#undefined' ? null : (hexToRgb(dir.font_color).b))+"";

                        
                            return  res.json({
                                success             : true, 
                                enterprise_fsname   : account_enter.enterprise_fsname, 
                                enterprise_mimetype : account_enter.enterprise_mimetype,
                                header_background   : Rgb_header_background, 
                                footer_background   : Rgb_footer_background, 
                                body_background     : Rgb_body_background, 
                                navigation_color    : Rgb_navigation_color, 
                                font_color          : Rgb_font_color, 
                                font_family         : dir.font_family, 
                                adaptor             : sails.config.receiver,
                                users_limit         : trans.users_limit,
                                quota               : trans.quota,
                                plan_name           : trans.plan_name,
    				account_id	:account_enter.id,
                                duration            : trans.duration,

                            });*/
                        }
                    });
                });
            })
        }
    },
    sendthemeResponse: function (res, dir, account_enter, trans) {

        function hexToRgb(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        if (!dir) {
            console.log('accountAPIaccountAPIaccountAPIaccountAPIaccountAPI');
            console.log(account_enter);
            console.log((account_enter.enterprise_fsname)?account_enter.enterprise_fsname:"null");
            console.log('accountAPIaccountAPIaccountAPIaccountAPIaccountAPI');
            return  res.json({
                success             : true, 
                enterprise_fsname   : (account_enter.enterprise_fsname)?account_enter.enterprise_fsname:"null", 
                enterprise_mimetype : (account_enter.enterprise_mimetype)?account_enter.enterprise_mimetype:"null", 
                header_background   : "null", 
                footer_background   : "null", 
                body_background     : "null", 
                navigation_color    : "null", 
                font_color          : "null", 
                font_family         : "null",
                adaptor             : sails.config.receiver,
                users_limit         : (trans.users_limit === 'undefined') ? null :trans.users_limit,
                quota               : (trans.quota === 'undefined') ? null :trans.quota,
                plan_name           : (trans.plan_name === 'undefined') ? null :trans.plan_name,
                duration            : (trans.duration === 'undefined') ? null :trans.duration,
                account_id          : account_enter.id,

            });
        }

        var Rgb_header_background   = ""+ (dir.header_background === '#undefined' ? null : (hexToRgb(dir.header_background).r)) +","+(dir.header_background === '#undefined' ? null : (hexToRgb(dir.header_background).g))+","+(dir.header_background === '#undefined' ? null : (hexToRgb(dir.header_background).b))+"";
        var Rgb_footer_background   = ""+ (dir.footer_background === '#undefined' ? null : (hexToRgb(dir.footer_background).r)) +","+(dir.footer_background === '#undefined' ? null : (hexToRgb(dir.footer_background).g))+","+(dir.footer_background === '#undefined' ? null : (hexToRgb(dir.footer_background).b))+"";
        var Rgb_body_background     = ""+ (dir.body_background === '#undefined' ? null : (hexToRgb(dir.body_background).r)) +","+(dir.body_background === '#undefined' ? null : (hexToRgb(dir.body_background).g))+","+(dir.body_background === '#undefined' ? null : (hexToRgb(dir.body_background).b))+"";
        var Rgb_navigation_color    = ""+ (dir.navigation_color === '#undefined' ? null : (hexToRgb(dir.navigation_color).r)) +","+(dir.navigation_color === '#undefined' ? null : (hexToRgb(dir.navigation_color).g))+","+(dir.navigation_color === '#undefined' ? null : (hexToRgb(dir.navigation_color).b))+"";
        var Rgb_font_color          = ""+ (dir.font_color === '#undefined' ? null : (hexToRgb(dir.font_color).r)) +","+(dir.font_color === '#undefined' ? null : (hexToRgb(dir.font_color).g))+","+(dir.font_color === '#undefined' ? null : (hexToRgb(dir.font_color).b))+"";                                
        
        console.log('2222accountAPIaccountAPIaccountAPIaccountAPIaccountAPI');
        console.log(account_enter);
        console.log((account_enter.enterprise_fsname)?account_enter.enterprise_fsname:"null");
        console.log('2222accountAPIaccountAPIaccountAPIaccountAPIaccountAPI');

        return  res.json({
            success             : true, 
            enterprise_fsname   : (account_enter.enterprise_fsname)?account_enter.enterprise_fsname:"null", 
            enterprise_mimetype : (account_enter.enterprise_mimetype)?account_enter.enterprise_mimetype:"null", 
            header_background   : Rgb_header_background, 
            footer_background   : Rgb_footer_background, 
            body_background     : Rgb_body_background, 
            navigation_color    : Rgb_navigation_color, 
            font_color          : Rgb_font_color, 
            font_family         : dir.font_family, 
            adaptor             : sails.config.receiver,
            users_limit         : trans.users_limit,
            quota               : trans.quota,
            plan_name           : trans.plan_name,
account_id  :account_enter.id,
            duration            : trans.duration,

        });
    }

};
module.exports = ThemeController;
