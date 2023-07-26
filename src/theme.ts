import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: "dark",
};

const theme = {
  components: {},
  fonts: {
    heading: "var(--font-familjen)",
    body: "var(--font-familjen)",
  },
  config,
};

export default extendTheme(theme);
