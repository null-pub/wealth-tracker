import { Box, Divider, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

export const Card = (props: { title: ReactNode; children?: ReactNode }) => {
  const { title, children } = props;

  return (
    <Box
      sx={{
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 2,
        minWidth: 480,
      }}
    >
      <Typography sx={{ paddingBottom: 1, paddingLeft: 2, paddingTop: 1, display: "flex" }} variant="h5">
        {title}
      </Typography>

      {children && (
        <>
          <Divider />
          <Stack padding={1} direction={"row"} spacing={0.5} width={"max-content"} minHeight={80}>
            {children}
          </Stack>
        </>
      )}
    </Box>
  );
};
