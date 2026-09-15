const { client } = global;
const { readdir } = require("fs");

readdir("./src/events", (err, files) => {
  if (err) return console.error(err);
  files
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
      let prop = require(`../events/${file}`);
      if (!prop.conf) return;
      const eventName = prop.conf.event === "message" ? "messageCreate" : prop.conf.event;
      client.on(eventName, prop);
      console.log(`[EVENT] ${prop.conf.name} Loaded`);
    });
});