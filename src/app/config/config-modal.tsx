import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { Config } from "./config";
import { ProjectedIncome } from "./projected-income";
import { System } from "./system";

export const ConfigModal = () => {
  const [tab, setTab] = useState("system");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <SettingsIcon />
      </Button>
      <Dialog maxWidth={false} open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle sx={{ display: "flex" }}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab value="projected-Income" label="Projected Income" />
            <Tab value="projected-wealth" label="Projected Wealth" />
            <Tab value="system" label="System" />
          </Tabs>
          <IconButton sx={{ height: "min-content", marginLeft: "auto" }} onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box width={600} height={600}>
            {tab === "projected-Income" && <ProjectedIncome />}
            {tab === "projected-wealth" && <Config />}
            {tab === "system" && <System />}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
