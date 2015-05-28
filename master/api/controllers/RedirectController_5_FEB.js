/**
  * Redirect New API Methods to New Server
*/
var request = require('request');

var RedirectController = {

  redirect: function (req, res) {


      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(req);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");


    // hack the session bro
    var _session = {
      authenticated: true,
      Account: req.session.Account
    };

    // Strip original headers of host and connection status
    var headers = req.headers;
    delete headers.host;
    delete headers.connection;

    // Build options for request
    var options = {
      uri: 'http://localhost:1337' + req.path,
      method: req.method,
      headers: headers
    };

    if(req.method === 'POST' && req.url == '/files/content') { 
      
      options.uri += "?_session="+JSON.stringify(_session);

      console.log("%%%%%%%%%%%%%%%%%%%%%%% TESTTING FILE OPTIONS %%%%%%%%%%%%%%%%%%%%%%%");
        console.log(options);
      console.log("%%%%%%%%%%%%%%%%%%%%%%% END TESTTING FILE OPTIONS %%%%%%%%%%%%%%%%%%%%%%%");

      var proxyReq = req.pipe(request.post(options));

	console.log("%%%%%%%%%%%%%%%%%%%%%%% TESTING REQUEST PIPE %%%%%%%%%%%%%%%%%%%%%%%");
		console.log(proxyReq);
       	console.log("%%%%%%%%%%%%%%%%%%%%%%% END TESTING REQUEST PIPE %%%%%%%%%%%%%%%%%%%%%%%");      

      proxyReq.on('data', function(data) {
          try {
            data = JSON.parse(data.toString('utf8'));
          }
          catch(e) {
            data = {error: 'unknown error'};
          }
          if (data.error) {return res.json(data, 500);}
          if (data.origParams) {return afterUpload(data);}
          // Get dir subscribers
          var subscribers = Directory.roomName(data.parentId);

          // Broadcast a message to everyone watching this INode to update
          // accordingly.
          SocketService.broadcast('UPLOAD_PROGRESS', subscribers, {
            id: data.parentId,
            filename: data.name,
            percent: data.percent
          });

      });
      proxyReq.on('error', function(err) {
        return res.send(500);
      });
      return;
    }

    else if(req.url.match(/^\/file\/download\//) || req.url.match(/^\/file\/open\//)) {

      File.find(req.param('id')).success(function (fileModel) {

        // If we have a file model to work with...
        if (fileModel) {
        
          // If the "open" param isn't set, force the file to download
          if (!req.url.match(/^\/file\/open\//)) {
            res.setHeader('Content-disposition', 'attachment; filename=\"' + fileModel.name + '\"');
          }

          // set content-type header
          res.setHeader('Content-Type', fileModel.mimetype);

          options.uri = "http://localhost:1337/file/download/"+fileModel.fsName+"?_session="+JSON.stringify(_session);

          var proxyReq = request.get(options).pipe(res);

          /*Create logging*/
          var opts = {
            uri: 'http://localhost:1337/logging/register/' ,
            method: 'POST',
          };

          var openOrDown =  req.url.match(/^\/file\/open\//)?'opened':'downloaded';
          opts.json =  {
            user_id     : req.session.Account.id,
            text_message: req.session.Account.name+ ' has '+openOrDown+' a file named '+fileModel.name+'.',
            activity    : openOrDown,
            on_user     : req.session.Account.id,
          };

          request(opts, function(err, response, body) {
          if(err) return res.json({ error: err.message, type: 'error' }, response && response.statusCode);
            
            proxyReq.on('error', function(err) {res.send(err, 500)});
          
          });
        /*Create logging*/

          //proxyReq.on('error', function(err) {res.send(err, 500)});

        }

      }).error(function(err){res.send(err, 500);});

      return;

    }


    // Set Body payload if this is a POST or PUT request
    else if(req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {

      var body = req.body || {};
      body._session = _session;
      options.body = JSON.stringify(body);
      
    }

    // Make a request to the new API
    request(options, after);

    function after (err, response, body) {
      if(err) return res.json({ error: err.message, type: 'error' }, response && response.statusCode);
      if (response && response.statusCode !== 200) {
        return res.json({ error: body, type: 'error' }, response.statusCode);
      }

      // Try and parse the JSON response
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.log(e.stack, 'body ->',body);
        return res.json({ error: e.message, type: 'error' });
      }

      // Resend using the original response statusCode
      // use the json parsing above as a simple check we got back good stuff
      res.json(body, response && response.statusCode);

    };

    function afterUpload (body) {

        var preFile = body.oldFile;
        var parsedFormData;
        if (body.origParams.data) {
          parsedFormData = JSON.parse(body.origParams.data);
        }
        else if (body.origParams.id) {
          parsedFormData = {
            parent: {
              id: body.origParams.id,
            }
          };
        }
        // API parameters
        else if (body.origParams.parent_id) {
          parsedFormData = {
            parent: {
              id: body.origParams.parent_id,
            }
          };
        }     

        File.handleUpload({
          
            name: body.name,
            size: body.size,
            type: body.mimetype,
            fsName: body.fsName,
            oldFile: preFile,
            version: body.version,
            parentId: parsedFormData.parent.id,
            replaceFileId: req.param('replaceFileId'),
            account_id   : req.session.Account.id, // AF

        }, function(err, resultSet) {

            if(err) return res.send(err, 500);

            /*Create logging*/
           Directory.find(parsedFormData.parent.id).success(function(dirModel) {
              
              var options = {
                  uri: 'http://localhost:1337/logging/register/' ,
                  method: 'POST',
                };

                options.json =  {
                  user_id     : req.session.Account.id,
                  text_message: req.session.Account.name+ ' has uploaded a file ' +body.name+ ' in '+dirModel.name+' directory.',
                  activity    : 'upload',
                  on_user     : req.session.Account.id,
                };

                request(options, function(err, resp, body) {
                if(err) return res.json({ error: err.message, type: 'error' }, resp && resp.statusCode);
                    
                  var response = {
                      total_count: resultSet.length,
                      entries: resultSet
                    };
                    res.json(response);
                });
              
            });
        /*Create logging*/


        });      
    }

  },
  
  redirectQuota: function (req, res) {
    req.path='/folders/quota';

    // hack the session bro
    var _session = {
      authenticated: true,
      Account: req.session.Account
    };

    // Strip original headers of host and connection status
    var headers = req.headers;
    delete headers.host;
    delete headers.connection;

    // Build options for request
    var options = {
      uri: 'http://localhost:1337' + req.path,
      method: req.method,
      headers: headers
    };

    options.json =  {
      folderId: req.param('folderId'),
      quota: req.param('quota'),
      _session : {
        authenticated: true,
        Account: req.session.Account
      }
    }

    // Make a request to the new API
    request(options, function(err, response, body) {
      if(err) return res.json({ error: err.message, type: 'error' }, response && response.statusCode);

      // Resend using the original response statusCode
      // use the json parsing above as a simple check we got back good stuff
      res.json(body, response && response.statusCode);
    });
  }
  
};

_.extend(exports, RedirectController);
