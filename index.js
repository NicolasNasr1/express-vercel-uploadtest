const express = require("express");

var formidable = require("formidable");
var fs = require("fs");

const app = express();
const PORT = 3000;

var path = require("path");

app.use(express.static(path.resolve("./tmp")));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/upload_file", async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  try {
    const imageFile = data.files.image;
    const imagePath = imageFile.filepath;
    const fileName = `${imageFile.newFilename}-${imageFile.originalFilename}`;

    const pathToWriteImage = path.join(process.cwd(), "tmp", fileName);

    const image = await fs.promises.readFile(imagePath);

    await fs.promises.writeFile(pathToWriteImage, image);

    //store path in DB
    res.status(200).json({ message: pathToWriteImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  //res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, (error) => {
  if (!error) console.log("Server is Successfully Running, and App is listening on port " + PORT);
  else console.log("Error occurred, server can't start", error);
});
