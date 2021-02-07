const https = require("https");
const archiver = require("archiver");
const path = require("path");
var chokidar = require("chokidar");

var watcher = chokidar.watch(path.join(__dirname, "../server/public"), {
  ignored: /[\/\\]\./,
  persistent: true,
});

var log = console.log.bind(console);

watcher
  .on("add", function (path) {
    log("File", path, "has been added");
  })
  .on("addDir", function (path) {
    log("Directory", path, "has been added");
  })
  .on("change", function (path) {
    log("File", path, "has been changed");
    const packagePath = "../server/public/";
    const options = {
      hostname: "qinzehua.top",
      port: 443,
      path: `/tool/publish?filename=package.zip`,
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    };

    const request = https.request(options, (res) => {
      res.on("data", (data) => {
        let result = data.toString();
        console.log(result);
      });
    });

    const archive = archiver("zip", {
      zlib: { level: 0 },
    });

    archive.directory(packagePath, false);
    archive.finalize();
    archive.pipe(request);
  })
  .on("unlink", function (path) {
    log("File", path, "has been removed");
  })
  .on("unlinkDir", function (path) {
    log("Directory", path, "has been removed");
  })
  .on("error", function (error) {
    log("Error happened", error);
  })
  .on("ready", function () {
    log("Initial scan complete. Ready for changes.");
  })
  .on("raw", function (event, path, details) {
    log("Raw event info:", event, path, details);
  });
