const express = require("express");
const app = express();
const { celebrate, Joi } = require('celebrate');
const gifService = require('./gif');

const PORT = process.env.PORT || 3000;


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
        .options({ stripUnknown: true }),
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
