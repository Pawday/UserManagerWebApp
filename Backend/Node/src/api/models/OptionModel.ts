import mongoose from "mongoose";


export const OptionSchema = new mongoose.Schema(
{
    name: String
});

const OptionModel = mongoose.model("option", OptionSchema);

export default OptionModel;