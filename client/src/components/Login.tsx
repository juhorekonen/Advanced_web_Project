import { Box, Button, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useTranslation } from "react-i18next"


const fetchData = async (username: string, password: string, setError: (message: string) => void) => {
    
    if (!username || !password) {
        alert("Please fill in both fields")
        return
    }

    try {
        const response = await fetch("/api/user/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        if (response.status === 404) {
            setError("User was not found")
            return
        }
        if (response.status === 401) {
            setError("Invalid Credentials")
            return
        }

        const data = await response.json()
        //console.log("Data: ", data)

        if(data.token) {
            console.log(`User authenticated successfully`)
            localStorage.setItem("token", data.token)
            window.location.href = "/kanban"
        }

    } catch (error) {
        if (error instanceof Error) {
            console.log(`Error when trying to register: ${error.message}`)
        }
    }
}



const Login = () => {
    // Set States
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const { t } = useTranslation()

  return (
    <div>
        <h2>{t("Login")}</h2>
        {/* Display error messages */}
        {error && <Typography color="error">{error}</Typography>}
        
        <Box
            component="form"
            sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
            "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
            >
            <TextField
                required
                id="outlined-required"
                label={t("Username")}
                placeholder={t("Username")}
                defaultValue=""
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                required
                id="outlined-password-input"
                label={t("Password")}
                placeholder={t("Password")}
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={() => fetchData(username, password, setError)} variant="contained" sx={{ width: "25ch", m: 1, backgroundColor: "orange" }}>{t("Login")}</Button>
        </Box>
        
    </div>
  )
}

export default Login