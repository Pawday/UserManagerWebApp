import {Schema} from "mongoose";

const UserAdditionalInfoSchema = new Schema(
{
    aboutString:
    {
        type: String,
        required: true
    }
});

export default UserAdditionalInfoSchema;