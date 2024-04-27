import { Box } from "@mui/material";
import { ReactNode } from "react";

interface CellProps {
  children?: ReactNode;
  secondaryValue?: ReactNode;
  tertiaryValue?: ReactNode;
  title: ReactNode;
  className?: string;
}

export const Value = (props: CellProps) => {
  const { children, secondaryValue, tertiaryValue, title, className } = props;
  return (
    <Box
      sx={{
        display: "flex",
        minWidth: 145,
        height: 64,
        padding: "0px 8px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 0.5,
        flexShrink: 0,
      }}
      className={className}
    >
      <Box display={"flex"} alignItems={"center"} gap={0.5}>
        <Box fontSize={18} fontWeight={700} lineHeight={"20px"}>
          {children ? children : "?"}
        </Box>
        {!!(secondaryValue ?? tertiaryValue) && (
          <Box
            alignSelf={"flex-end"}
            fontSize={12}
            fontWeight={500}
            lineHeight={"16px"}
            textTransform={"uppercase"}
            color={"#888"}
          >
            {secondaryValue ?? tertiaryValue}
          </Box>
        )}
      </Box>
      <Box fontSize={12} fontWeight={500} lineHeight={"16px"} textTransform={"uppercase"}>
        {title}
      </Box>
    </Box>
  );
};
