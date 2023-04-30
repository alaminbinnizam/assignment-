


//importing all module
const http = require('http');
const fs = require('fs');
const port = 3000;
const localhost = 'localhost';


const myServer = http.createServer((req, res) => {

  const mainFile = (fileName, statusCode) => {
    fs.readFile(fileName, (err, e) => {
      res.writeHead(statusCode, { "content-Type": "text/html" });
      res.write(e);
      res.end();
    });

  };
  //condition
  if (req.url === "/") {
    mainFile("./public/index.html", 200);
  }
  else if (req.url === "/about") {
    mainFile("./public/about.html", 200);
  }

  else if (req.url === "/contact") {
    mainFile("./public/contact.html", 200);
  }
  else {
    mainFile("./public/error.html", 404);
  }
});

myServer.listen(port, localhost, () => {
  console.log(`Server is Running on http://${localhost}:${port}`);
});

