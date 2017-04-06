module.exports = {
  run: function () {
    var request = require("superagent");
    console.log("plant migrationg task")
    request
      .get("http://localhost:9000/jobs/migrateplants")
      .end(function (error, res) {
      });
  }
}
