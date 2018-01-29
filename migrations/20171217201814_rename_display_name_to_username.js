module.exports.up = async db => db.schema.table('users', table => {
  table.renameColumn('display_name', 'username');
});

module.exports.down = async db => db.schema.table('users', table => {
  table.renameColumn('username', 'display_name');
});
