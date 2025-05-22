// utils/s3Uploader.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
  
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


const uploadToS3 = async (file) => {
  console.log("Uploading file to S3..."); // Debugging line
  console.log("File details:", file); // Debugging line
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${uuidv4()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };
  console.log("S3 upload params:", params); // Debugging line

  const result = await s3.upload(params).promise();
  return result.Location; // S3 file URL
};

module.exports = { uploadToS3 };
