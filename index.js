const express = require("express");
const app = express();
const { celebrate, Joi } = require('celebrate');
const gifService = require('./gif');
const mongoService = require('./mongo');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

// mongoose.set('debug', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoURL = `mongodb://testuser:${encodeURIComponent('test@123')}@ds057386.mlab.com:57386/gif_db`

let connection = mongoose.createConnection(mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
connection.once('open', () => {

    console.log('connecting to database.');
});

app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get('/api/:site/:query', celebrate({
    params: Joi.object({
        site: Joi.string()
            .valid('tenor')
            .valid('giphy')
            .required()
            .error(new Error('Invalid website')),
        query: Joi.string()
            .required()
            .error(new Error('Invalid query')),
    })
        .options({ stripUnknown: true })
        .label('search-api'),
}),
    async (req, res, next) => {
        const { site, query } = req.params;
        let response = null;
        const gifServiceInstance = new gifService();
        if (site === 'tenor') {
            response = await gifServiceInstance.tenor(query);
        }
        else if (site === 'giphy') {
            response = await gifServiceInstance.giphy(query);
        }
        const mongoServiceInstance = new mongoService(connection);
        let savedSearch = await mongoServiceInstance.fetch(
            site,
            query
        );
        if (savedSearch.status === 200 && savedSearch.count > 0) {
            response.saved = savedSearch.data.map((data) => {
                return data.links;
            });
        }
        else {
            response.saved = null;
        }
        if (response.status === 200) {
            return res.json(response).status(200);
        } else {
            next(response);
        }
    });

app.post('/api/save', celebrate({
    body: Joi.object({
        site: Joi.string()
            .valid('tenor')
            .valid('giphy')
            .required()
            .error(new Error('Invalid website')),
        query: Joi.string()
            .required()
            .error(new Error('Invalid query')),
        links: Joi.array().items(Joi.string())
            .required()
            .error(new Error('Invalid array')),
    })
        .options({ stripUnknown: true })
        .label('database-insert-api'),
}),
    async (req, res, next) => {
        const { site, query, links } = req.body;
        const mongoServiceInstance = new mongoService(connection);
        let response = await mongoServiceInstance.insert({
            site,
            query,
            links
        });
        if (response.status === 200) {
            return res.json(response).status(200);
        } else {
            next(response);
        }
    });

app.get("*", (req, res) => {
    res.redirect("/");
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        errors: {
            message: err.message,
        },
    });
});
app.listen(PORT);
console.log("listening to http://127.0.0.1:" + PORT);
