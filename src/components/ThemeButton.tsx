import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Button, useColorMode } from "@chakra-ui/react";

export default function ThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button onClick={toggleColorMode} mx={2}>
      {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
