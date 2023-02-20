import mongoose from "mongoose";


// It wold be hard to manage boolean like isMan or isWoman
export enum UserGender
{
    WOMAN,
    MAN
}


export const UserSchema = new mongoose.Schema(
{
    name: String,
    email: String,
    phone: String,
    gender:
    {
        type: Number,
        enum: UserGender
    }
});



const UserModel = mongoose.model("User", UserSchema);

export default UserModel;