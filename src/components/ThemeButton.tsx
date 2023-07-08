import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Button, IconButton, useColorMode } from "@chakra-ui/react";

export default function ThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      aria-label={"Theme"}
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
    />
  );
}
