import { Box, Stack, Tab, Tabs } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { ConfigModal } from "./config/config-modal";

export const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.slice(1);

  return (
    <Box padding={2} paddingTop={0} display={"flex"} flexDirection={"column"} height="100%" gap={2}>
      <Box flex="0 1 auto">
        <Stack direction="row">
          <Tabs value={currentPath} onChange={(_, value) => navigate({ to: "/" + value })}>
            <Tab value="net-wealth" label="Total Wealth" />
            <Tab value="projected-income" label="Projected Income" />
            <Tab value="projected-wealth" label="Projected Wealth" />
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
