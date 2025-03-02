import mongoose, { Document, Schema } from "mongoose"

interface ICard extends Document {
    username: string // Linking the card to the correct user
    columnId: mongoose.Types.ObjectId // Linking the card to the correct column
    title: string
    content: string
    color: string
    createdAt: Date
    finishedAt: number
    comments: mongoose.Types.ObjectId[]
}

const CardSchema = new Schema ({
    username: {type: String, required: true},
    columnId: {type: Schema.Types.ObjectId, ref: "Column", required: true},
    title: {type: String, required: true},
    content: {type: String, required: false},
    color: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    finishedAt: {type: Number, required: true},
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
})

const Card: mongoose.Model<ICard> = mongoose.model<ICard>("Card", CardSchema)

export { Card, ICard }
