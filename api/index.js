"use strict";

var server = require("./server/server");
var port = 50102;

server.listen(port, () => {
  console.log("APIs are running at port: " + port);
});
