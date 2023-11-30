// Handle a simple search by id for a record
module.exports = {
  getRecord: (Model) => {
    return async (req, res, next) => {
      let record;
      try {
        record = await Model.findById(req.params.id);
        if (record == null)
          return res.status(404).json({ message: `Cannot find record` });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
      res.record = record;
      next();
    };
  },
};
