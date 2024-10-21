import { v2 as cloudinary } from 'cloudinary';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


cloudinary.config({
    cloud_name: "dirlzvaqd",
    api_key: "319517129175242",
    api_secret: "sXjtSugdTQSjIeREGvTcSLWPtHI",
    secure: true
  });
  
  export default cloudinary;