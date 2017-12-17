exports.up = async db => {
  await db.schema.table('users').renameColumn('display_name', 'username');
};

exports.down = async db => {
  await db.schema.table('users').renameColumn('username', 'display_name');
};
