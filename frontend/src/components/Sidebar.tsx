import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Psychology as PredictIcon,
  Analytics as AnalyticsIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const navItems = [
  { text: "Dashboard", path: "/", icon: DashboardIcon },
  { text: "Predict", path: "/predict", icon: PredictIcon },
  { text: "Analytics", path: "/analytics", icon: AnalyticsIcon },
  { text: "Model Info", path: "/model-info", icon: InfoIcon },
];

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <List>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.path}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
