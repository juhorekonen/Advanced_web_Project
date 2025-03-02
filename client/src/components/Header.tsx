import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import "@materializecss/materialize"

const Header = () => {
    // UI Translation
    const { t, i18n } = useTranslation()

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
    }

    // Set State for Authentication
    const [jwt, setJwt] = useState<string | null>(null)

    // Check if the user is on a smaller device
    const [isMobile] = useState<boolean>(window.innerWidth < 768);

    useEffect(() => {
        if(localStorage.getItem("token")) {
            setJwt(localStorage.getItem("token"))
        }
    }, [jwt])

    const logout = () => {
        localStorage.removeItem("token")
        setJwt(null)
        window.location.href = "/"
    }

    const buttonStyle = {
        borderRadius: "5px",
        color: "white",
        fontSize: isMobile ? "12px" : "16px",
        margin: isMobile ? "5px" : "20px",
        padding: isMobile ? "5px" : "10px",
        boxShadow: "2px 2px 5px white, -2px -2px 5px white",
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ backgroundColor: "orange"}}>
                <Toolbar className="nav-wrapper" sx={{ display: "flex", justifyContent: "center" }}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 0 }}
                    >
                    </IconButton>
                    {!jwt ? (
                        <>
                            <Button sx={buttonStyle} component={Link} to="/">{t("Home")}</Button>
                            <Button sx={buttonStyle} component={Link} to="/login">{t("Login")}</Button>
                            <Button sx={buttonStyle} component={Link} to="/register">{t("Register")}</Button>
                            <Button sx={buttonStyle} onClick={() => changeLanguage("fi")}>FI</Button>
                            <Button sx={buttonStyle} onClick={() => changeLanguage("en")}>EN</Button>
                        </>
                    ) : (
                        <>
                            <Button sx={buttonStyle} component={Link} to="/kanban">{t("Kanban")}</Button>
                            <Button sx={buttonStyle} component={Link} to="/logout" onClick={logout}>{t("Logout")}</Button>
                            <Button sx={buttonStyle} onClick={() => changeLanguage("fi")}>FI</Button>
                            <Button sx={buttonStyle} onClick={() => changeLanguage("en")}>EN</Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Header