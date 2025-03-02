import mongoose, { Document, Schema } from "mongoose"

interface IComment extends Document {
    username: string // Linking the comment to the correct user
    cardId: mongoose.Types.ObjectId // Linking the comment to the correct card
    content: string
    createdAt: Date
}

const CommentSchema = new Schema ({
    username: {type: String, required: true},
    cardId: {type: Schema.Types.ObjectId, ref: "Card", required: true},
    content: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
})

const Comment: mongoose.Model<IComment> = mongoose.model<IComment>("Comment", CommentSchema)

export { Comment, IComment }
