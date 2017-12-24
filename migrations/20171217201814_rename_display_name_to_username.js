exports.up = async db => db.schema.table('users', table => {
  table.renameColumn('display_name', 'username');
});

exports.down = async db => db.schema.table('users', table => {
  table.renameColumn('username', 'display_name');
});
