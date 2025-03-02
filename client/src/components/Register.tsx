import { Box, Button, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useTranslation } from "react-i18next"


const fetchData = async (username: string, password: string, setError: (message: string) => void) => {

    if (!username || !password) {
        alert("Please fill in both fields")
        return
    }
    
    try {
        const response = await fetch("/api/user/register",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        if (response.status === 403) {
            setError("Username already in use")
            return
        }

        if (!response.ok) {
            throw new Error("Check that password contains at least 1 number and 1 special character")
        }

        if(response.status === 200) {
            console.log(`User registered successfully`)
            window.location.href = "/login"
        }


    } catch (error) {
        if (error instanceof Error) {
            console.log(`Error when trying to register: ${error.message}`)
            setError(`Error when trying to register: ${error.message}`)
        }
    }
}

const Register = () => {
    // Set States
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const { t } = useTranslation()

  return (
    <div>
        <h2>{t("Register")}</h2>
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
            <Button variant="contained" sx={{ width: "25ch", m: 1, backgroundColor: "orange" }} onClick={() => fetchData(username, password, setError)}>{t("Register")}</Button>
        </Box>
    
    
    </div>
  )
}

export default Register