import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { MultiSelectTheme } from "chakra-multiselect";

const config: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: "dark",
};

const theme = {
  components: {
    MultiSelect: {
      ...MultiSelectTheme,
      baseStyle: (props: any) => {
        const baseStyle = MultiSelectTheme.baseStyle(props) as any;
        return {
          ...baseStyle,
        };
      },
    },
  },
  fonts: {
    heading: "var(--font-familjen)",
    body: "var(--font-familjen)",
  },
  config,
};

export default extendTheme(theme);
