import { useState, useEffect } from "react"
import { IColumn, ICard } from "../types"
import { Box, Button, Card as MuiCard, CardContent, CardHeader, CardActions, TextField, Typography } from "@mui/material"
import Card from "./Card"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const Column = ({ column, onDelete, onRename }: { 
  column: IColumn, 
  onDelete: (columnId: string) => void, 
  onRename: (updatedColumn: IColumn) => void}) => {

  // Set States
  const [cards, setCards] = useState<ICard[]>([])
   // Keep track if the user is editing the title
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState(column.title)
  const navigate = useNavigate()  
  const { t } = useTranslation()

  // Fetch cards upon loading the page and whenever the column ID changes
  useEffect(() => {
    fetchCards(column._id)
  }, [column._id])  

  // Function to fetch cards
  const fetchCards = async (columnId: string) => {
    //console.log("Fetching cards for column: ", columnId)
    try {
      const response = await fetch(`/api/cards/${columnId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch cards")
      }

      const data = await response.json()
      if (columnId === column._id) {
        setCards(data)
      } else
        console.log("Column Id mismatch")

    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error fetching cards: ${error.message}`)
      }
    }
  }
  
  const addCard = () => {
    navigate("/addCard", { state: { columnId: column._id } })
  }

  // Function to delete a column
  const deleteColumn = async () => {
    try {
      const response = await fetch(`/api/columns/${column._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to delete column")
      }

      // Call the onDelete function to update the state in the parent component
      onDelete(column._id)

    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error when trying to delete column: ${error.message}`)
      }
    }
  }

  // Function to rename a column
  const renameColumn = async () => {
    try {
      const response = await fetch(`/api/columns/${column._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ title })
      })

      if (!response.ok) {
        throw new Error("Failed to rename column")
      }

      const updatedColumn = await response.json()
      onRename(updatedColumn)
      setEditMode(false)

    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error when trying to rename column: ${error.message}`)
      }
    }
  }

  const handleUpdate = (updatedCard: ICard) => {
    setCards(cards.map(card => card._id === updatedCard._id ? updatedCard : card))
  }

  const handleDelete = (cardId: string) => {
    setCards(cards.filter(card => card._id !== cardId))
  }

  const handleMove = async (cardId: string, direction: "up" | "down") => {
    try {
      const response = await fetch(`/api/cards/move/${cardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ direction })
      })

      if (!response.ok) {
        throw new Error(`Failed to move card ${direction}`)
      }

      // Update the order of cards in the frontend
      const index = cards.findIndex(card => card._id === cardId)

      if (index !== -1) {
        if (direction === "up" && index > 0) {
          // Swap the position of the current card with the previous card
          [cards[index - 1], cards[index]] = [cards[index], cards[index - 1]]

        } else if (direction === "down" && index < cards.length - 1) {
          // Swap the position of the current card with the next card
          [cards[index + 1], cards[index]] = [cards[index], cards[index + 1]]
        }
        setCards([...cards])
      }

    } catch (error) {
      if (error instanceof Error) {
        console.log(`Card is already at the very top or bottom: ${error.message}`)
      }
    }
  }

  const handleSwitch = async (cardId: string, direction: "left" | "right") => {
    try {
      const response = await fetch(`/api/cards/switch/${column._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ cardId, direction })
      })

      if (!response.ok) {
        throw new Error(`Failed to switch card ${direction}`)
      }
      // Remove the card from the source column
      setCards(cards.filter(card => card._id !== cardId))

    } catch (error) {
      if (error instanceof Error) {
        console.log(`Card is already at the very left or right: ${error.message}`)
      }
    }
  }

  return (
    <MuiCard sx={{ margin: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardHeader
        title={
          editMode ? (
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={renameColumn}
              autoFocus
            />
          ) : (
            <span onClick={() => setEditMode(true)}>{column.title}</span>
          )
        }
      />
      <CardContent sx={{ flexGrow: 1 }}>
        {cards.map((card) => (
          <Card 
            key={card._id} 
            card={card} 
            onUpdate={handleUpdate} 
            onDelete={handleDelete} 
            onMoveUp={() => handleMove(card._id, "up")} 
            onMoveDown={() => handleMove(card._id, "down")} 
            onMoveLeft={() => handleSwitch(card._id, "left")} 
            onMoveRight={() => handleSwitch(card._id, "right")} 
          />
        ))}
      </CardContent>

      <CardActions sx={{ padding: '4px', justifyContent: 'space-between' }}>
        <Button
          size="small"
          variant="outlined"
          onClick={addCard}
          sx={{
            border: '1px solid black',
            color: 'black',
            minWidth: 'auto', 
            padding: '2px 6px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
              {t("Add Card")}
            </Typography>
          </Box>
        </Button>
        
        <Button
          size="small"
          variant="outlined"
          onClick={deleteColumn}
          sx={{
            border: '1px solid black',
            color: 'black',
            minWidth: 'auto',
            padding: '2px 10px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
              {t("Delete Column")}
            </Typography>
          </Box>
        </Button>
      </CardActions>
    </MuiCard>
  )
}

export default Column