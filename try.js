const axios = require("axios");

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://h2mwebsite.s3.ap-south-1.amazonaws.com/profile-pic.JPG",
  headers: {},
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
