export const optionsMainTheme = {
    palette: {
        primary: {
            main: "#0D0D0B",
            contrastText: "#F9E799"
        },
        secondary: {
            main: "#FFD000",
            contrastText: "#0D0D0B"
        },
        primaryLight: {
            main: "#fc98aa",
            contrastText: "#616161"
        }
    },
    typography: {
        fontFamily: "Comic Sans MS, sans-serif",
    },
    components: {
        MuiTypography: {
            styleOverrides: {
                // root: {
                //     fontFamily: "Comic Sans MS, sans-serif",
                // }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "1rem",
                    border: "none",
                    background: '#398a5c',
                    color: "#FFF",
                    "&:hover": {
                        backgroundColor: "#F9E799",
                        color: "#0D0D0B"
                    }
                }
            }
        },
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    margin: "0",
                    padding: "0"
                },
                body: {
                    margin: "0",
                    padding: "0",
                }
            }
        }
    }
}