import mongoose, {Schema} from "mongoose";


export const OptionGroupSchema = new mongoose.Schema(
{
    optionGroupName:
    {
        type: String,
        required: true
    },
    options: [{type: Schema.Types.ObjectId}]
});



export default OptionGroupSchema;