import mongoose from "mongoose";


export const OptionSchema = new mongoose.Schema(
{
    name:
    {
        type: String,
        required: true
    }
});



export default OptionSchema;