import mongoose, {Schema, Types} from "mongoose";
import OptionModel, {OptionSchema} from "./OptionModel";


export const OptionGroupSchema = new mongoose.Schema(
{
    optionGroupName: String,
    options: [{type: Schema.Types.ObjectId, ref: OptionModel.name}]
});

const OptionGroupModel = mongoose.model("option_group", OptionGroupSchema);

export default OptionGroupModel;