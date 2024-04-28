import { Box, Divider, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

export const Card = (props: { title: ReactNode; children?: ReactNode }) => {
  const { title, children } = props;

  return (
    <Box
      sx={{
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 2,
        minWidth: 0,
        backgroundColor: "#121212",
        boxShadow: "2px 3px 9px 1px #12121252",

        minHeight: "max-content",
      }}
    >
      <Typography sx={{ paddingBottom: 1, paddingLeft: 2, paddingTop: 1, display: "flex" }} variant="h5">
        {title}
      </Typography>

      {children && (
        <>
          <Divider />
          <Stack
            padding={1}
            direction={"row"}
            spacing={0.5}
            width={"100%"}
            minHeight={80}
            justifyContent={"space-between"}
          >
            {children}
          </Stack>
        </>
      )}
    </Box>
  );
};
