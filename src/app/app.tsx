import { Box, Stack, Tab, Tabs } from "@mui/material";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { ConfigModal } from "./config/config-modal";

export const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split("/").slice(2)[0];

  return (
    <Box padding={2} paddingTop={0} display={"flex"} flexDirection={"column"} height="100%" gap={2}>
      <Box flex="0 1 auto">
        <Stack direction="row">
          <Tabs value={currentPath} onChange={(_, value) => navigate({ to: value })}>
            <Tab value="net-wealth" label="Total Wealth" component={Link} to="/net-wealth" />
            <Tab value="projected-income" label="Projected Income" component={Link} to="/projected-income" />
            <Tab value="projected-wealth" label="Projected Wealth" component={Link} to="/projected-wealth" />
          </Tabs>
          <Box marginLeft={"auto"} gap={2} display={"flex"}>
            <ConfigModal />
          </Box>
        </Stack>
      </Box>
      <Box flex="1 1 auto" height={"100%"} width={"100%"} overflow="hidden">
        <Outlet />
      </Box>
    </Box>
  );
};
