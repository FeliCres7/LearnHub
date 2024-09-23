import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: "dirlzvaqd",
    api_key: "319517129175242",
    api_secret: "sXjtSugdTQSjIeREGvTcSLWPtHI",
    secure: true,
  rejectUnauthorized: false 
  });
  
  export default cloudinary;