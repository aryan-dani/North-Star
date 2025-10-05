import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Box,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Psychology as PredictIcon,
  Analytics as AnalyticsIcon,
  Info as InfoIcon,
  ModelTraining as ModelTrainingIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

const navItems = [
  { text: "Dashboard", path: "/", icon: DashboardIcon },
  { text: "Predict", path: "/predict", icon: PredictIcon },
  { text: "Analytics", path: "/analytics", icon: AnalyticsIcon },
  { text: "Models", path: "/models", icon: ModelTrainingIcon },
  { text: "Model Info", path: "/model-info", icon: InfoIcon },
  { text: "Learn", path: "/learn", icon: SchoolIcon },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #0a0e27 0%, #1a1f3a 100%)",
          borderRight: "1px solid rgba(100, 181, 246, 0.1)",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", mt: 2 }}>
        <List>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isSelected}
                  sx={{
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 2,
                    "&.Mui-selected": {
                      background:
                        "linear-gradient(135deg, #64b5f6 0%, #1976d2 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #90caf9 0%, #2196f3 100%)",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(100, 181, 246, 0.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isSelected ? "#fff" : "rgba(255, 255, 255, 0.7)",
                      minWidth: 40,
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontWeight: isSelected ? 600 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
