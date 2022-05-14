const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
    {
        record: {
            type: Number,
            required: true,
        }
    }
)

module.exports = mongoose.model("Record",recordSchema);