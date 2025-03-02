import { useState, useEffect } from "react"
import { ICard, IComment } from "../types"
import { Box, Button, Card as MuiCard, CardContent, CardActions, TextareaAutosize, Typography, TextField } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Comment from "./Comment"

const Card = ({ card, onUpdate, onDelete, onMoveUp, onMoveDown, onMoveLeft, onMoveRight }: { card: ICard, 
  onUpdate: (updatedCard: ICard) => void, 
  onDelete: (cardId: string) => void, 
  onMoveUp: (cardId: string) => void, 
  onMoveDown: (cardId: string) => void, 
  onMoveLeft: (cardId: string) => void, 
  onMoveRight: (cardId: string) => void }) => {

    // Set States
  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState(false)
  const [content, setContent] = useState(card.content)
  const [title, setTitle] = useState(card.title)
  const [comments, setComments] = useState<IComment[]>([])
  const navigate = useNavigate()
  const { t } = useTranslation()

  // fetch comments upon page load and when card._id changes 
  useEffect(() => {
    fetchComments()
  }, [card._id])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/${card._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch comments")
      }

      const data = await response.json()
      setComments(data)
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error fetching comments: ${error.message}`)
      }
    }
  }

  const handleEdit = () => {
    setEditMode(true)
  }

  const addComment = () => {
    navigate("/addComment", { state: { cardId: card._id } })
  }

  const handleTitleChange = async () => {
    try {
      const response = await fetch(`/api/cards/${card._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ title })
      })

      if (!response.ok) {
        throw new Error("Failed to update card title")
      }

      // Otherwise Card title was successfully updated
      setEditTitle(false)
      const updatedCard: ICard = { ...card, title: title }
      onUpdate(updatedCard)

    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error when trying to update card title: ${error.message}`)
      }
    }
  }

  const saveCard = async () => {
    try {
      const response = await fetch(`/api/cards/${card._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ content, createdAt: Date.now() })
      })

      if (!response.ok) {
        throw new Error("Failed to update card")
      }

      // Otherwise Card was successfully updated
      setEditMode(false)
      const updatedCard: ICard = { ...card, content: content, createdAt: new Date() }
      onUpdate(updatedCard)

    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error when trying to update card: ${error.message}`)
      }
    }
  }

  const deleteCard = async () => {
    try {
      const response = await fetch(`/api/cards/${card._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to delete card")
      }

      // Call the onDelete function to update the state in the parent component
      onDelete(card._id)

    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error when trying to delete card: ${error.message}`)
      }
    }
  }

  const handleUpdateComment = (updatedComment: IComment) => {
    setComments(comments.map(comment => comment._id === updatedComment._id ? updatedComment : comment))
  }

  return (
    <MuiCard sx={{ margin: 2, width: "95%", backgroundColor: card.color }}>
      <CardContent>
        {editTitle ? (
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleChange}
            autoFocus
          />
        ) : (
          <Typography variant="h6" onClick={() => setEditTitle(true)} sx={{ cursor: "pointer" }}>
            {card.title}
          </Typography>
        )}
        {editMode ? (
          <Box>
            <TextareaAutosize
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", borderColor: "#ccc" }}
            />
            <Button onClick={saveCard} variant="contained" sx={{ marginTop: 1, backgroundColor: "white", color: "black" }}>{t("Save")}</Button>
          </Box>
        ) : (
          <Box onClick={handleEdit} sx={{ cursor: "pointer" }}>
            <Typography variant="body1">{card.content}</Typography>
            <Typography variant="caption">{new Date(card.createdAt).toLocaleString()}</Typography>
            <Typography variant="caption" display="block">{t("Estimated Time to Finish")}:</Typography>
            <Typography variant="caption" >{card.finishedAt} {t("hours")}</Typography>
          </Box>
        )}
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="subtitle2">{t("Comments")}:</Typography>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} onUpdate={handleUpdateComment} />
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={addComment}
          sx={{
            border: "1px solid black",
            backgroundColor: "white",
            color: "black",
            fontSize: "0.65rem",
            minWidth: "auto",
            padding: "2px 6px",
          }}
        >
          {t("Add Comment")}
        </Button>
        <Button
          size="small"
          onClick={deleteCard}
          sx={{
            border: "1px solid black",
            backgroundColor: "white",
            color: "black",
            fontSize: "0.65rem",
            minWidth: "auto",
            padding: "2px 6px",
          }}
        >
          {t("Delete")}
        </Button>
        <Button
          size="small"
          onClick={() => onMoveUp(card._id)}
          sx={{
            border: "1px solid black",
            backgroundColor: "white",
            color: "black",
            fontSize: "0.65rem",
            minWidth: "auto",
            padding: "2px 6px",
          }}
        >
          {t("Up")}
        </Button>
        <Button
          size="small"
          onClick={() => onMoveDown(card._id)}
          sx={{
            border: "1px solid black",
            backgroundColor: "white",
            color: "black",
            fontSize: "0.65rem",
            minWidth: "auto",
            padding: "2px 6px",
          }}
        >
          {t("Down")}
        </Button>
        <Button
          size="small"
          onClick={() => onMoveLeft(card._id)}
          sx={{
            border: "1px solid black",
            backgroundColor: "white",
            color: "black",
            fontSize: "0.65rem",
            minWidth: "auto",
            padding: "2px 6px",
          }}
        >
          {t("Left")}
        </Button>
        <Button
          size="small"
          onClick={() => onMoveRight(card._id)}
          sx={{
            border: "1px solid black",
            backgroundColor: "white",
            color: "black",
            fontSize: "0.65rem",
            minWidth: "auto",
            padding: "2px 6px",
          }}
        >
          {t("Right")}
        </Button>
      </CardActions>
    </MuiCard>
  )
}

export default Card