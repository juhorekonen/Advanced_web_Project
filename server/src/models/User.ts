import mongoose, { Document, Schema } from "mongoose"

// Here an email won't be necessary if the username is unique
interface IUser extends Document {
    username: string
    password: string
}

const UserSchema = new Schema ({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", UserSchema)

export { User, IUser }
