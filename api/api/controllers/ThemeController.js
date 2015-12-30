/*---------------------
 :: Theme 
 -> controller
 ---------------------*/
 
var ThemeController = {

    updateColors: function (req, res) {
        Theme.saveColors(req.body, function (err, theme) {
            if (err)
                return res.json({error: 'Error creating adminuser', type: 'error'});
            return  res.json({id: theme.id});
        });
    },

    getThemeConfiguration: function (req, res) {

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
                        return  res.json({
                                    success             : true, 
                                    enterprise_fsname   : account_enter.enterprise_fsname, 
                                    enterprise_mimetype : account_enter.enterprise_mimetype, 
                                    header_background   : "null", 
                                    footer_background   : "null", 
                                    body_background     : "null", 
                                    navigation_color    : "null", 
                                    font_color          : "null", 
                                    font_family         : "null",
                                    adaptor             : sails.config.fileAdapter.adapter,
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
                    
                    return  res.json({
                                success             : true, 
                                enterprise_fsname   : account_enter.enterprise_fsname, 
                                enterprise_mimetype : account_enter.enterprise_mimetype,
                                header_background   : Rgb_header_background, 
                                footer_background   : Rgb_footer_background, 
                                body_background     : Rgb_body_background, 
                                navigation_color: Rgb_navigation_color, 
                                font_color: Rgb_font_color, 
                                font_family: dir.font_family, 
                                adaptor : sails.config.fileAdapter.adapter,
                                bucket              : "app.olympus.io",
                                api_key             : "AKIAIEURF2O4FGCDDK6A",
                                api_secret_key      : "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"
                                
                            });
                });
            })

        }
    }
};
module.exports = ThemeController;