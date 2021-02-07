const http = require("http");
const fs = require("fs");

const filename = "./package/sky1.jpg";
fs.stat(filename, (err, stats) => {
  if (!err) {
    const options = {
      host: "",
      port: 3000,
      path: `/?filename=sky.jpg`,
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": stats.size,
      },
    };

    const req = http.request(options, (res) => {
      console.log(`HEADER: ${JSON.stringify(res.headers)}`);
    });
    const readStream = fs.createReadStream(filename);
    readStream.pipe(req);
  }
});
