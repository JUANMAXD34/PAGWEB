const mongoose = require("mongoose");
const {mongobd} = require("./keys");

mongoose.connect(mongobd.URI,{})
    .then(db=>console.log("La base de datos esta conectada"))
    .catch(err=> console.error(err))
