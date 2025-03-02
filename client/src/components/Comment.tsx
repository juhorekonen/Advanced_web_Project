import { useState } from "react"
import { IComment } from "../types"
import { Box, Button, TextareaAutosize, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

const Comment = ({ comment, onUpdate }: { comment: IComment, onUpdate: (updatedComment: IComment) => void}) => {
  // Set states for editing and content
  const [content, setContent] = useState(comment.content)
  const [editMode, setEditMode] = useState(false)
  const { t } = useTranslation()

  const handleEdit = () => {
    setEditMode(true)
  }

  const saveComment = async () => {
    try {
      const response = await fetch(`/api/comments/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ content, createdAt: Date.now() })
      })

      if (!response.ok) {
        throw new Error("Failed to update comment")
      }

      // Otherwise Comment was successfully updated
      setEditMode(false)
      const updatedComment: IComment = { ...comment, content: content, createdAt: new Date() }
      onUpdate(updatedComment)

    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error when trying to update comment: ${error.message}`)
      }
    }
  }

  return (
    <Box sx={{ padding: 2, border: "1px solid #ccc", borderRadius: "4px", marginBottom: 2, backgroundColor: "white" }}>
      {editMode ? (
        <Box>
          <TextareaAutosize
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", borderColor: "#ccc" }}
          />
          <Button onClick={saveComment} variant="outlined" sx={{ marginTop: 1, color: "black", backgroundColor: "white" }}>{t("Save")}</Button>
        </Box>
      ) : (
        <Box onClick={handleEdit} sx={{ cursor: "pointer" }}>
          <Typography variant="body1">{comment.content}</Typography>
          <Typography variant="caption" color="textSecondary">{new Date(comment.createdAt).toLocaleString()}</Typography>
        </Box>
      )}
    </Box>
  )
}

export default Comment