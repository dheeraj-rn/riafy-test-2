
const axios = require("axios");

module.exports = class gifService {

  constructor() {
  }

  async tenor(query) {

    try {
      const apiUrl = `https://api.tenor.com/v1/search?q=${query}&key=US5X7F0CA0CC&limit=25`;
      let tenorData = await axios.get(apiUrl);
      let urls = tenorData.data.results.map(info => {

        return info.media[0].gif.url
      });
      return {
        status: 200,
        data: urls
      };
    } catch (err) {
      return {
        status: err.status || 400,
        message: err.message,
      };
    }
  }

  async giphy(query) {

    try {
      const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=9yZiEBrYcXsP4KLi5hS4kIoYbqMsNV7I&q=${query}&limit=25&offset=0&rating=pg&lang=en&random_id=test`;
      let giphyData = await axios.get(apiUrl);
      let urls = giphyData.data.data.map(info => {

        return info.images.original.url
      });
      return {
        status: 200,
        data: urls
      };
    } catch (err) {
      return {
        status: err.status || 400,
        message: err.message,
      };
    }
  }

};
