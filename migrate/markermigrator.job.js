module.exports = {
  run: function () {
    var request = require("superagent");
    console.log("marker migrationg task")
    request
      .get("http://localhost:9000/jobs/migratemarkers")
      .end(function (error, res) {
      });
  }
}
