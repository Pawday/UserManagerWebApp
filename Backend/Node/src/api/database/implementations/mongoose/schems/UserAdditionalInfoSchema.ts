import {Schema} from "mongoose";

const UserAdditionalInfoSchema = new Schema(
{
    aboutString: String,
});

export default UserAdditionalInfoSchema;