var UUIDGenerator = require('node-uuid');
var cacheRoute = require('booty-cache');

var LoggingController = {

	listLog: function(req, res){
    var request = require('request');

    if(req.session.Account.isSuperAdmin === 1){

      var sql = "SELECT log.*,DATE_FORMAT(log.createdAt,'%b %d %Y %h:%i %p') AS created_at,"+
      " a.id AS user_id,a.name AS name,a.email AS email,a.title AS title,a.phone AS phone,"+
      " e.name AS ent_name, e.id AS ent_id FROM"+
      " logging log LEFT JOIN account a ON a.id=log.user_id"+
      " LEFT JOIN enterprises e ON a.id=e.account_id"+
      " ORDER BY id DESC";
      
      sql = Sequelize.Utils.format([sql]);
    }else{

      var sql = "SELECT log.*,DATE_FORMAT(log.createdAt,'%b %d %Y %h:%i %p') AS created_at,"+
      " a.id AS user_id,a.name AS name,a.email AS email,a.title AS title,a.phone AS phone FROM"+
      " logging log LEFT JOIN account a ON a.id=log.user_id"+
      // " LEFT JOIN enterprises e ON e.account_id=a.id"+
      " WHERE log.user_id="+req.session.Account.id+" OR log.user_id IN"+
      " (SELECT id from account where created_by="+req.session.Account.id+") ORDER BY log.id DESC";
      sql = Sequelize.Utils.format([sql]);
    }
      
    sequelize.query(sql, null, {
      raw: true
    }).success(function(log) {

      /*Looking for data if not found return appropriate*/  
      if(log.length){
          res.json(log, 200);
      }else{

        res.json({
          text_message: 'error_123',
          notFound : true,  
        });
      }
    }).error(function(e) {
        throw new Error(e);
    });
    
	},
  

};
_.extend(exports, LoggingController);