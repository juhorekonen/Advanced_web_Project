import { useState } from "react"
import { Box, Button, TextField, Typography } from "@mui/material"
import { ICard } from "../types"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const AddColumn = () => {
    // Set States
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const { t } = useTranslation()
    const navigate = useNavigate()

    const onSubmit = async () => {
        if (!title) {
            setError("Title is required")
            return
        }

        try {
            const response = await fetch("/api/columns/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ title, cards: [] as ICard[] })
            })

            if (!response.ok) {
                throw new Error("Failed to add column")
            }
            navigate("/kanban")

        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error adding column: ${error.message}`)
                setError(`Error adding column: ${error.message}`)
            }
        }
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h5" component="h5" gutterBottom>
                {t("Add New Column")}
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
                required
                id="outlined-required"
                label={t("Title")}
                placeholder={t("Enter column title")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ marginBottom: 2, width: "300px", justifyContent: "center" }}
            />
            <Button sx={{backgroundColor: "orange"}} variant="contained" onClick={onSubmit}>
                {t("Add Column")}
            </Button>
        </Box>
    )
}

export default AddColumn