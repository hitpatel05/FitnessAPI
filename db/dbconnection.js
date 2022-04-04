const mongoose = require("mongoose");

//const DB = process.env.DATABASE;


mongoose.connect("mongodb://KNKTfitness:yTSHvgcE5fs80@54.201.160.69:58173/KNKTfitness?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
    // useFindAndModify: false
}).then(() => {
    console.log("MongoDB successfully connected.");
}).catch((err) => {
    console.log("MongoDB Connection: ", err);
});