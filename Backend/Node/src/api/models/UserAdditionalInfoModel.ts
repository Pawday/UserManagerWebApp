import mongoose, {Schema} from "mongoose";
import OptionModel from "./OptionModel";

export const UserAdditionalInfoSchema = new Schema(
{
    aboutString: String,
    options: {type: [Schema.Types.ObjectId], ref: OptionModel.name}
});

const UserAdditionalInfoModel = mongoose.model("user_additional_info", UserAdditionalInfoSchema);

export default UserAdditionalInfoModel;
