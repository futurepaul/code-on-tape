import aws from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.spacesendpoint);
console.log(process.env.bucket);
console.log(process.env.spacesaccesskeyid);
console.log(process.env.spacessecretkey);

const endpointUrl = process.env.spacesendpoint;

const spacesEndpoint = new aws.Endpoint(endpointUrl);

const BUCKET = process.env.bucket;

const config = {
  endpoint: spacesEndpoint,
  accessKeyId: process.env.spacesaccesskeyid,
  secretAccessKey: process.env.spacessecretkey,
  region: "sfo2",
  signatureVersion: "v4"
};

// aws.config.update();

export default (req, res) => {
  console.log(config);
  const space = new aws.S3(config);
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;

  // const params = {
  //   Body: "The contents of the file",
  //   Bucket: BUCKET,
  //   Key: "file.ext"
  // };

  // space.putObject(params, function(err, data) {
  //   if (err) {
  //     // console.log(err, err.stack);
  //     res
  //       .status(400)
  //       .json({ success: false, error: err, error_stack: err.stack });
  //   } else {
  //     console.log(data);
  //     res.status(200).json({
  //       success: true,
  //       data: data
  //     });
  //   }
  // });

  const params = {
    Bucket: BUCKET,
    Key: fileName,
    Expires: 500,
    ContentType: fileType,
    ACL: "public-read"
  };

  space.getSignedUrl("putObject", params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).json({ success: false, error: err });
    }

    const url = `https://${BUCKET}.${endpointUrl}/${fileName}`;

    console.log(url);

    const returnData = {
      signedRequest: data,
      url
    };

    res.status(200).json({
      success: true,
      data: { returnData }
    });
  });
};
