const { db } = require("../util/database");

module.exports = async (req, res) => {
  await db.then((db) => {
    let sql = `SELECT * FROM vaccinations`;

    if (req.query.date) {
      sql = `SELECT * FROM vaccinations WHERE vaccinationDate LIKE '${req.query.date}%'`;
    }

    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).send();
        throw err;
      }

      res.status(200).send(rows);
    });
  });
};
