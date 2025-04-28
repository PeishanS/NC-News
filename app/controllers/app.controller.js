const endpointsJson = require("../../endpoints.json")
const { selectTopics } = require("../models/app.model")

exports.getApi = (req, res) => {
    res.status(200).json({endpoints: endpointsJson})
}

exports.getTopics = (req, res) => {
    return selectTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })
}