/*---------------------
  :: DeletedList
  -> model
---------------------*/
module.exports = {
  attributes: {
    name        : 'string',
    type        : 'integer',
    deleted_id  : 'integer',
    sync_time   : 'datetime',
    user_id   	: 'integer',
  },
};
