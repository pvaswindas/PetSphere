import React from "react"
import { Snackbar, Alert, useTheme, useMediaQuery } from "@mui/material"

function AlertSnackbar({ open, message, alert_type = "info", onClose }) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"))

    const handleClose = (_, reason) => {
        if (reason === "clickaway") return;
        if (onClose) onClose()
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: isSmallScreen ? "center" : "right",
            }}
            style={{ top: isSmallScreen ? "5vh" : "2vh" }}
        >
            <Alert onClose={handleClose} severity={alert_type} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
}

export default AlertSnackbar
