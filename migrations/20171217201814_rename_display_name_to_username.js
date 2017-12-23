exports.up = async db => {
  await db.schema.table('users', table => {
    table.renameColumn('display_name', 'username');
  });
};

exports.down = async db => {
  await db.schema.table('users', table => {
    table.renameColumn('username', 'display_name');
  });
};
