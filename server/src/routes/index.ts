import { Request, Response, Router } from "express"
import { validateToken, CustomRequest } from "../middleware/validateToken"
// import { User, IUser } from "../models/User"
import { Column, IColumn } from "../models/Column"
import { Card, ICard } from "../models/Card"
import { Comment, IComment } from "../models/Comment"
import mongoose from "mongoose"

// Here again changing all routes to start with "/api/"
const router: Router = Router()

// Create a Column
router.post("/api/columns/add", validateToken, async (req: CustomRequest, res: Response) => {
    //console.log("Creating a column...")
    try {
        // Create a new column
        const newColumn: IColumn = new Column ({
            username: req.user?.username,
            title: req.body.title,
            cards: req.body.cards
        })
        // Save the column to the database
        await Column.create(newColumn)
        //console.log("Column created Successfully")
        res.status(200).json({ message: "Column created successfully" })
        return
        
    } catch (error: any) {
        console.error(`Error occurred while creating column: ${error}`)
        res.status(500).json({ message: "Internal server error" })
        return
    }
})


// Create a Card
router.post("/api/cards/add/:columnId", validateToken, async (req: CustomRequest, res: Response) => {
    // console.log("Creating a card...")
    try {
        const { columnId } = req.params

        // Check that the column exists
        const column: IColumn | null = await Column.findById(columnId)
        if (!column) {
            res.status(401).json({ message: "Column was not found" })
            return
        }

        // Create a new card
        const newCard: ICard = new Card ({
            username: req.user?.username,
            columnId,
            title: req.body.title,
            content: req.body.content,
            color: req.body.color,
            createdAt: Date.now(),
            finishedAt: req.body.finishedAt,
            comments: req.body.comments
        })

        // Save the card to the database and update the column's card array
        await Card.create(newCard)
        await Column.findByIdAndUpdate(columnId, { $push: { cards: newCard._id } })
        //console.log("Card created Successfully")
        res.status(200).json({ message: "Card created successfully" })
        return
        
    } catch (error: any) {
        console.error(`Error occurred while creating card: ${error}`)
        res.status(500).json({ message: "Internal server error" })
        return
    }
})


// Create a Comment
router.post("/api/comments/add/:cardId", validateToken, async (req: CustomRequest, res: Response) => {
    // console.log("Creating a comment...")
    try {
        const { cardId } = req.params

        // Check that the card exists
        const card: ICard | null = await Card.findById(cardId)
        if (!card) {
            res.status(401).json({ message: "Card was not found" })
            return
        }

        // Create a new comment
        const newComment: IComment = new Comment ({
            username: req.user?.username,
            cardId,
            content: req.body.content,
            createdAt: Date.now()
        })

        // Save the comment to the database and update the cards's comment array
        await Comment.create(newComment)
        await Card.findByIdAndUpdate(cardId, { $push: { comments: newComment._id } })
        //console.log("Comment created Successfully")
        res.status(200).json({ message: "Comment created successfully" })
        return
        
    } catch (error: any) {
        console.error(`Error occurred while creating comment: ${error}`)
        res.status(500).json({ message: "Internal server error" })
        return
    }
})


// Get all Columns
router.get("/api/columns", validateToken, async (req: CustomRequest, res: Response) => {
    try {
        // Find all colums by the correct user
        const columns: IColumn[] | null = await Column.find({ username: req.user?.username })
        res.status(200).json(columns)
        return

    } catch (error: any) {
        console.error(`Error occurred while loading columns: ${error}`)
        res.status(500).json({ message: "Internal server error" })
        return
    }
})


// Get all Cards
router.get("/api/cards/:columnId", validateToken, async (req: CustomRequest, res: Response) => {
    // console.log("Loading cards...")
    try {
        const { columnId } = req.params

        // Check that the column exists
        const column: IColumn | null = await Column.findById(columnId)
        if (!column) {
            res.status(401).json({ message: "Column was not found" })
            return
        }

        // Find all cards linked to the correct column
        const cards: ICard[] | null = await Card.find({ _id: { $in: column.cards } })
        res.status(200).json(cards)
        return

    } catch (error: any) {
        console.error(`Error occurred while loading cards: ${error}`)
        res.status(500).json({ message: "Internal server error" })
        return
    }
})


// Get all Comments
router.get("/api/comments/:cardId", validateToken, async (req: CustomRequest, res: Response) => {
    // console.log("Loading comments...")
    try {
        const { cardId } = req.params

        // Check that the card exists
        const card: ICard | null = await Card.findById(cardId)
        if (!card) {
            res.status(401).json({ message: "Card was not found" })
            return
        }

        // Find all comments linked to the correct card
        const comments: IComment[] | null = await Comment.find({ _id: { $in: card.comments } })
        res.status(200).json(comments)
        return

    } catch (error: any) {
        console.error(`Error occurred while loading comments: ${error}`)
        res.status(500).json({ message: "Internal server error" })
        return
    }
})


// Update a Column
router.put("/api/columns/:columnId", validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const { columnId } = req.params
        const newTitle = req.body.title

        // Check that the column exists
        const column: IColumn | null = await Column.findById(columnId)
        if (!column) {
            res.status(401).json({ message: "Column was not found" })
            return
        }

        // Otherwise update the title
        column.title = newTitle
        await column.save()

        res.status(200).json({ message: "Column updated successfully" })
        return
        
    } catch (error: any) {
        console.error(`Error occurred while updating column: ${error}`)
        res.status(500).json({ message: "Internal server error" })
        return
    }
})


// Update a Card
router.put("/api/cards/:cardId", validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const { cardId } = req.params
        const updatedCard = req.body

        // Check that the card exists
        const card: ICard | null = await Card.findById(cardId)
        if (!card) {
            res.status(401).json({ message: "Card was not found" })
            return
        }

        // Update the time of creation
        updatedCard.createdAt = Date.now()

        // Looked up how to update Mongoose documents, found "findByIdAndUpdate" from:
        // https://www.geeksforgeeks.org/mongoose-findbyidandupdate-function/
        await Card.findByIdAndUpdate(cardId, updatedCard, { new: true })
        res.status(200).json({ message: "Card updated successfully" })
        return
        
    } catch (error: any) {
        console.error(`Error occurred while updating card: ${error}`)
        res.status(500).json({ message: "Internal server error" })
        return
    }
})


// Update a Comment
router.put("/api/comments/:commentId", validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const { commentId } = req.params
        const updatedComment = req.body

        // Check that the comment exists
        const comment: IComment | null = await Comment.findById(commentId)
        if (!comment) {
            res.status(401).json({ message: "Comment was not found" })
            return
        }

        // Update the time of creation
        updatedComment.createdAt = Date.now()

        // Looked up how to update Mongoose documents, found "findByIdAndUpdate" from:
        // https://www.geeksforgeeks.org/mongoose-findbyidandupdate-function/
        await Comment.findByIdAndUpdate(commentId, updatedComment, { new: true })
        res.status(200).json({ message: "Comment updated successfully" })
        return
        
    } catch (error: any) {
        console.error(`Error occurred while updating comment: ${error}`)
        res.status(500).json({ message: "Internal server error" })
        return
    }
})


// Delete a Column
router.delete("/api/columns/:columnId", validateToken, async (req: CustomRequest, res: Response) => {
    // console.log("Deleting column...")
    try {
        const { columnId } = req.params

        // Check that the column exists
        const column: IColumn | null = await Column.findById(columnId)
        if (!column) {
            res.status(401).json({ message: "Column was not found" })
            return
        }

        // First find all cards linked to this column
        const cards: ICard[] | null = await Card.find({ columnId })
        if (cards.length > 0) {
            // Then extract the comments from the found cards
            const comments = cards.flatMap(card => card.comments)

            // Delete all comments (if there are any)
            if (comments.length > 0) {
                await Comment.deleteMany({ _id: { $in: comments } })
            }

            // Delete all cards
            await Card.deleteMany({ columnId })
        }

        // Finally delete the column
        await Column.findByIdAndDelete(columnId)
        res.status(200).json({ message: "Column deleted successfully" })
        return

    } catch (error: any) {
        console.error(`Error occurred while deleting column: ${error}`)
        res.status(500).json({ message: "Internal server error" })
        return
    }
})


// Delete a Card
router.delete("/api/cards/:cardId", validateToken, async (req: CustomRequest, res: Response) => {
    // console.log("Deleting card...")
    try {
        const { cardId } = req.params

        // Find the card
        const card: ICard | null = await Card.findById(cardId)
        if (!card) {
            res.status(401).json({ message: "Card was not found" })
            return
        }

        // First delete all the comments if exist
        if (card.comments && card.comments.length > 0) {
            await Comment.deleteMany({ _id: { $in: card.comments } })
        }

        // Then delete the card
        await Card.findByIdAndDelete(cardId)

        // Finally delete the card from the column's card array
        await Column.findByIdAndUpdate(card.columnId, {
            $pull: { cards: cardId }
        })
        res.status(200).json({ message: "Card deleted successfully"})
        return

    } catch (error: any) {
        console.error(`Error occurred while deleting card: ${error}`)
        res.status(500).json({ message: "Internal server error" })
        return
    }
})


// Move Cards inside a Column
router.put("/api/cards/move/:cardId", validateToken, async (req: CustomRequest, res: Response) => {
    // console.log("Moving card...")
    try {
        const { cardId } = req.params
        const { direction } = req.body // User can move the card "up" or "down"

        // Convert cardId to a Mongoose ObjectId
        const cardObjectId = new mongoose.Types.ObjectId(cardId)

        // Find the card
        const card: ICard | null = await Card.findById(cardId)
        if (!card) {
            res.status(401).json({ message: "Card was not found" })
            return
        }

        // Find the column
        const column: IColumn | null = await Column.findById(card.columnId)
        if (!column) {
            res.status(401).json({ message: "Column was not found" })
            return
        }

        // Find the index of the card
        const index = column.cards.indexOf(cardObjectId)
        if (index === -1) {
            res.status(401).json({ message: "Card was not found in the column" })
            return
        }

        // Move the card
        if (direction === "up" && index > 0) {
            // Swap with the previous card
            [column.cards[index - 1], column.cards[index]] = [column.cards[index], column.cards[index - 1]]
        } else if (direction === "down" && index < column.cards.length - 1) {
            // Swap with the next card
            [column.cards[index + 1], column.cards[index]] = [column.cards[index], column.cards[index + 1]]
        } else {
            // Otherwise the card is already at the boundary
            res.status(401).json({ message: "Card is already at the very top or very bottom" })
            return
        }

        // Save the column
        await column.save()

        res.status(200).json({ message: "Card moved successfully" })
        return

    } catch (error: any) {
        console.error(`Error occurred while moving card: ${error}`)
        res.status(500).json({ message: "Internal server error" })
        return
    }
})


// Switch Cards between Columns
router.put("/api/cards/switch/:columnId", validateToken, async (req: CustomRequest, res: Response) => {
    console.log("Switching card...")
    try {
        // Get the current columnId
        const { columnId } = req.params
        const { cardId, direction } = req.body

        console.log(columnId, cardId, direction)

        // Ensure the user and columns are defined
        if (!req.user) {
            console.log("User not found")
            res.status(401).json({ message: "User not found" })
            return
        }

        // Find all columns for the user
        const userColumns: IColumn[] = await Column.find({ username: req.user.username })

        // Find the card
        const card: ICard | null = await Card.findById(cardId)
        if (!card) {
            res.status(401).json({ message: "Card was not found" })
            return
        }

        // Find the current column
        const currentColumn: IColumn | null = await Column.findById(columnId)
        if (!currentColumn) {
            res.status(401).json({ message: "Column was not found" })
            return
        }

        // Find the index of the current column in the user's columns array
        const currentIndex = userColumns.findIndex((col) => col.id === columnId);
        console.log("Current: ", currentIndex)


        if (currentIndex === -1) {
            res.status(401).json({ message: "Current column was not found in user's columns" })
            return
        }
        
        // Find the target column based on the direction
        let targetIndex = 0
        if (direction === "left" && currentIndex > 0) {
            targetIndex = currentIndex - 1
            // console.log(targetIndex)

        } else if (direction === "right" && currentIndex < userColumns.length - 1) {
            targetIndex = currentIndex + 1
            // console.log(targetIndex)

        } else {
            console.log("Card already at the boundary")
            res.status(401).json({ message: "Invalid direction" })
            return
        }

        // Find the target columnId
        const targetColumnId = userColumns[targetIndex]._id as mongoose.Types.ObjectId

        // Find the target column
        const targetColumn: IColumn | null = await Column.findById(targetColumnId)
        if (!targetColumn) {
            res.status(401).json({ message: "Target column was not found" })
            return
        }

        // Remove the card from the original column
        await Column.findByIdAndUpdate(columnId, {
            $pull: { cards: cardId }
        })

        // Add the card to the target column
        await Column.findByIdAndUpdate(targetColumnId, {
            $push: { cards: cardId }
        })

        card.columnId = targetColumnId
        await card.save()

        res.status(200).json({ message: "Card switched successfully"})
        return


    } catch (error: any) {
        console.error(`Error occurred while switching card: ${error}`)
        res.status(500).json({ message: "Internal server error" })
        return
    }
})

export default router
