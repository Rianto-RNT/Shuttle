const bcrypt = require('bcrypt');

const encrypt = (password, saltRound = 10) => {
  return bcrypt.hashSync(password, saltRound);
};

const checkPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

module.exports = { encrypt, checkPassword };
