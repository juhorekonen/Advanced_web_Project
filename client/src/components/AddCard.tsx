import { useState } from "react"
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "react-router-dom"

const AddCard = () => {
  // Set States
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [color, setColor] = useState<string>("")
  const [finishedAt, setFinishedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const location = useLocation()
  const columnId = location.state?.columnId
  //console.log("Column ID: ", columnId)

  const handleSubmit = async () => {
    if (!title || !content || !color) {
      setError("All fields are required")
      return
    }

    if (finishedAt === null || isNaN(finishedAt)) {
      setError("Estimated Time to Finish must be a number")
      return
    }

    // Map color names to hex values
    const colorMap: { [key: string]: string } = {
      "red": "#DE3163",
      "blue": "#0096FF",
      "green": "#90EE90",
      "yellow": "#FFFF8F",
    }

    const hexColor = colorMap[color]

    try {
      const response = await fetch(`/api/cards/add/${columnId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ title, content, color: hexColor, finishedAt, comments: [] })
      })

      if (!response.ok) {
        throw new Error("Failed to add card")
      }

      navigate("/kanban")

    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error adding card: ${error.message}`)
        setError(`Error adding card: ${error.message}`)
      }
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h5" component="h5" gutterBottom>
        {t("Add New Card")}
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        required
        id="outlined-required"
        label={t("Title")}
        placeholder={t("Enter card title")}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ marginBottom: 2, width: "300px" }}
      />
      <TextField
        required
        id="outlined-required"
        label={t("Content")}
        placeholder={t("Enter card content")}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ marginBottom: 2, width: "300px" }}
      />
      <FormControl required sx={{ marginBottom: 2, width: "300px" }}>
        <InputLabel>{t("Color")}</InputLabel>
        <Select
          value={color}
          onChange={(e) => setColor(e.target.value as string)}
          label={t("Color")}
        >
          <MenuItem value="red">{t("Red")}</MenuItem>
          <MenuItem value="blue">{t("Blue")}</MenuItem>
          <MenuItem value="green">{t("Green")}</MenuItem>
          <MenuItem value="yellow">{t("Yellow")}</MenuItem>
        </Select>
      </FormControl>
      <TextField
        required
        id="outlined-required"
        label={t("Estimated Time to Finish (hours)")}
        placeholder={t("Enter estimated time to finish")}
        type="number"
        value={finishedAt !== null ? finishedAt : ""}
        onChange={(e) => setFinishedAt(Number(e.target.value))}
        sx={{ marginBottom: 2, width: "300px" }}
        InputProps={{ inputProps: { min: 0 } }}
      />
      <Button sx={{ backgroundColor: "orange" }} variant="contained" onClick={handleSubmit}>
        {t("Add Card")}
      </Button>
    </Box>
  )
}

export default AddCard