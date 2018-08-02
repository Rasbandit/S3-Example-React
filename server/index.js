require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const AWS = require('aws-sdk');

const port = 3005;

const app = express();

// this sets up the settings for AWS and loads in your credentials.
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
// with those settings applied make an interface with s3
const S3 = new AWS.S3();

// because the file upload is such a large string the body parser is not equiped to handle it. this allows you to upload files through the body.
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.post('/api/s3', (req, res) => {
  // the body contains the string that is the photo
  const photo = req.body;

  // the photo string needs to be converted into a 'base 64' string for s3 to understand how to read the image
  const buf = new Buffer(photo.file.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  // this is the object that we will end to s3 with all the info about the photo, and the photo itself.
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Body: buf,
    Key: photo.filename,
    ContentType: photo.filetype,
    ACL: 'public-read',
  };

  // using the S3 object we made above the endpoints we will pass it the image we want uploaded and the funciton to be run when the upload is finished.
  S3.upload(params, (err, data) => {
    let response, code;
    if (err) {
      response = err;
      code = 500;
    } else {
      response = data;
      code = 200;
    }
    // if the upload was sucessfull give them the data, if not send them the error
    res.status(code).send(response);
  });
});

app.listen(port, () => {
  console.log(`Ship docked at port: ${port}`);
});
