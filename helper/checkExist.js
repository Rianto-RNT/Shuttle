const checkExist = (Model) => {
  return async (req, res, next) => {
    const { id } = req.params;

    const shuttle = await Model.findOne({
      where: {
        id,
      },
    });
    if (shuttle) {
      next();
    } else {
      res.status(404).send(`No shuttle exists with id: ${id}`);
    }
  };
};
module.exports = {
  checkExist,
};
