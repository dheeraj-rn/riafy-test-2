
const searchSchema = require("./schemas/searchesSchema");
module.exports = class mongoService {

    constructor(mongoose) {
        this.mongoose = mongoose;
    }

    async insert(data) {

        try {
            let search = this.mongoose.model('searches', searchSchema);
            let newSave = new search(data);
            let response = await newSave.save();
            return {
                status: 200,
                data: response
            };
        } catch (err) {
            return {
                status: err.status || 400,
                message: err.message,
            };
        }
    }

    async fetch(site, query) {

        try {
            let search = this.mongoose.model('searches', searchSchema);
            let response = await search.find({ site, query });
            return {
                status: 200,
                data: response,
                count: response.length
            };
        } catch (err) {
            return {
                status: err.status || 400,
                message: err.message,
            };
        }
    }

};
