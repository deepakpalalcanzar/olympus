/*---------------------
  :: DeletedList
  -> model
---------------------*/
module.exports = {
  attributes: {
    type        : 'integer',
    deleted_id  : 'integer',
    sync_time   : 'datetime',
    user_id   	: 'integer',
    account_id  : 'integer',
  },
};
