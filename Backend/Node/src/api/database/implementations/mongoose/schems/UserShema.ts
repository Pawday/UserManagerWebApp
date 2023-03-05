import mongoose, {Schema} from "mongoose";

// It would be hard to manage boolean like isMan or isWoman
export enum UserGender
{
    WOMAN,
    MAN
}


const UserSchema = new mongoose.Schema(
{
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    phone: {
        required: true,
        type: String
    },
    gender:
    {
        required: true,
        type: Number,
        enum: UserGender
    },
    additionalInfo:
    {
        type: Schema.Types.ObjectId
    }
});

export default UserSchema;