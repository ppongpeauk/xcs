// Chakra UI
import { useColorModeValue } from "@chakra-ui/react";

// Components
import NextNProgress from "nextjs-progressbar";

export default function PageProgress() {
  return (
    <NextNProgress
      color={useColorModeValue("#000", "#fff")}
      startPosition={0.3}
      stopDelayMs={250}
      height={2}
    />
  );
}
