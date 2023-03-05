import mongoose, {Schema} from "mongoose";


export const OptionGroupSchema = new mongoose.Schema(
{
    optionGroupName: String,
    options: [{type: Schema.Types.ObjectId}]
});



export default OptionGroupSchema;