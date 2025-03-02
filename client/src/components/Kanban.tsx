import { useState, useEffect } from "react"
import Column from "./Column"
import { IColumn } from "../types"
import { Box, Button, Typography } from "@mui/material"
import Plusicon from "../icons/PlusIcon"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const Kanban = () => {
    // Set states for columns
    const [columns, setColumns] = useState<IColumn[]>([])
    const navigate = useNavigate()
    const { t } = useTranslation()

    // Fetch columns upon loading the page
    useEffect(() => {
        fetchColumns()
    }, [])

    // Function to fetch columns
    const fetchColumns = async () => {
        try {
            const response = await fetch("/api/columns", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            })

            if (!response.ok) {
                throw new Error("Failed to fetch columns")
            }

            const data = await response.json()
            setColumns(data)

        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error fetching columns: ${error.message}`)
            }
        }
    }

    // Function to add a new column
    const addColumn = async () => {
        navigate("/addColumn")
    }

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 2, mt: 2}}>
                {columns.map((column) => (
                    <Column key={column._id} column={column} onDelete={fetchColumns} onRename={fetchColumns} />
                ))}
            </Box>
            <Button
                size="small"
                variant="outlined"
                sx={{
                    mt: 2,
                    color: "white",
                    backgroundColor: "orange",
                    padding: "4px 16px",
                }}
                onClick={addColumn}
                >
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Plusicon />
                    <Typography variant="caption" sx={{ color: "inherit" }}>
                    {t("Add Column")}
                    </Typography>
                </Box>
            </Button>
        </Box>
    )
}

export default Kanban