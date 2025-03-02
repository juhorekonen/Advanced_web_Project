import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

const Home = () => {
    // Ui Translation
    const { t } = useTranslation()
    
    return (
        <Box sx={{ color: "black", padding: "20px", textAlign: "center"}}>
            <Typography variant="h3" component="h3" gutterBottom>
                {t("Welcome to the Kanban Board")}
            </Typography>

            <Typography variant="body1" component="p" gutterBottom>
                {t("Please")} <Link to="/login">{t("login")}</Link> {t("or")} <Link to="/register">{t("register")}</Link> {t("to proceed to the board.")}
            </Typography>
        </Box>
    )
}

export default Home
