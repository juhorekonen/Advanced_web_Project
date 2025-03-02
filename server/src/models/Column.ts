import mongoose, { Document, Schema } from "mongoose"

interface IColumn extends Document {
    username: string // Linking the comment to the correct user
    title: string
    cards: mongoose.Types.ObjectId[]
}

const ColumnSchema = new Schema ({
    username: {type: String, required: true},
    title: {type: String, required: true},
    cards: [{type: Schema.Types.ObjectId, ref: "Card"}]
})

const Column: mongoose.Model<IColumn> = mongoose.model<IColumn>("Column", ColumnSchema)

export { Column, IColumn }
