const mongoose = require("mongoose");
const { MongoURL } = global.client.settings;

if (!MongoURL) {
  console.error("[DATABASE] MongoURL is empty. Set it in src/configs/settings.js");
} else {
  mongoose.connect(MongoURL).catch((error) => {
    console.error("[DATABASE] Failed To Connect Database:", error.message);
  });
}

mongoose.connection.on("connected", () => console.log("[DATABASE] Connected To Database"));
mongoose.connection.on("error", (error) => console.error("[DATABASE] Connection Error:", error.message));