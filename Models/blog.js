const { Schema, model} = require ("mongoose")
const demo = new Schema ({
    BlogID: String,
    title: String,
    author: String,
    content: String,
});

const sample = model('samples', demo);

module.exports = sample;