import { Box } from "@mui/material";
import Sidebar from "./Sidebar.tsx";
import Header from "./Header.tsx";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Header />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
