const generatePassword = () => {
  const pass = Math.random().toString(36).slice(-8);
  return pass;
};

module.exports = { generatePassword };
