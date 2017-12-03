import bcrypt from 'bcryptjs';

// compares user password and hash in database
const comparePass = (userPassword, databasePassword) =>
  bcrypt.compareSync(userPassword, databasePassword);

export default comparePass;
