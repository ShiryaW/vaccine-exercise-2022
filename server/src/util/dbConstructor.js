const reader = require("./reader");

const { FILEPATH } = require("./constants");

async function buildDatabase(db) {
  const antiqua = await reader.readFile(`${FILEPATH.RESOURCES}/Antiqua.source`);
  const solarBuddhica = await reader.readFile(
    `${FILEPATH.RESOURCES}/SolarBuddhica.source`
  );
  const zerpfy = await reader.readFile(`${FILEPATH.RESOURCES}/Zerpfy.source`);
  const vaccinations = await reader.readFile(
    `${FILEPATH.RESOURCES}/vaccinations.source`
  );

  const brands = {
    antiqua,
    solarBuddhica,
    zerpfy,
  };

  Object.keys(brands).forEach((brand) => {
    db.run(
      `CREATE TABLE ${brand}(
    id VARCHAR NOT NULL UNIQUE PRIMARY KEY,
    orderNumber INT UNIQUE NOT NULL,
    responsiblePerson VARCHAR NOT NULL,
    healthCareDistrict VARCHAR NOT NULL,
    vaccine VARCHAR NOT NULL,
    injections INT NOT NULL,
    arrived VARCHAR NOT NULL
    )`,
      (err) => {
        if (err) {
          console.error("Error creating table:", err.message);
        } else {
          populateBrandTable(db, brand, brands[brand]);
        }
      }
    );
  });

  /*db.each(
    `CREATE TABLE vaccinations(
    vaccinationid VARCHAR NOT NULL UNIQUE PRIMARY KEY,
    sourceBottle VARCHAR UNIQUE NOT NULL,
    gender VARCHAR NOT NULL,
    vaccinationDate VARCHAR NOT NULL
    )`,
    (err = {
      if(err) {
        console.error("Error creating table:", err.message);
      },
    })
  );*/
}

function populateBrandTable(db, brand, contents) {
  contents.forEach((row) => {
    db.run(
      `INSERT INTO ${brand}(id, orderNumber, responsiblePerson, healthCareDistrict, vaccine, injections, arrived) VALUES("${row.id}", ${row.orderNumber}, "${row.responsiblePerson}", "${row.healthCareDistrict}", "${row.vaccine}", ${row.injections}, "${row.arrived}")`
    );
  });
}

module.exports = {
  buildDatabase,
};