import { useState } from "react"
import { Box, Button, TextField, Typography } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"

const AddComment = () => {
  const [content, setContent] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const cardId = location.state?.cardId
  const { t } = useTranslation()

  const onSubmit = async () => {
    if (!content) {
      setError("Content is required")
      return
    }

    try {
      const response = await fetch(`/api/comments/add/${cardId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ content })
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      navigate("/kanban")

    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error adding comment: ${error.message}`)
        setError(`Error adding comment: ${error.message}`)
      }
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 4 }}>
      <Typography variant="h5" component="h5" gutterBottom>
        {t("Add Comment")}
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        required
        id="outlined-required"
        label={t("Content")}
        placeholder={t("Enter your comment")}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ marginBottom: 2, width: "300px" }}
      />
      <Button sx={{backgroundColor: "orange", color: "white"}} variant="outlined" onClick={onSubmit}>
        {t("Add Comment")}
      </Button>
    </Box>
  )
}

export default AddComment
