import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Stars } from "@mui/icons-material";

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background:
          "linear-gradient(90deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)",
      }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Stars sx={{ fontSize: 28 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 700 }}
          >
            North Star
          </Typography>
          <Typography
            variant="caption"
            sx={{
              ml: 1,
              px: 1,
              py: 0.5,
              bgcolor: "rgba(255,255,255,0.1)",
              borderRadius: 1,
              fontWeight: 600,
            }}
          >
            Exoplanet Discovery
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
