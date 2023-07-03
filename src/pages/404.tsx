/* eslint-disable react/no-children-prop */

// Components
import Error from "@/components/Error";
import Footer from "@/components/Footer";
import PlatformNav from "@/components/PlatformNav";
import { Box, Flex } from "@chakra-ui/react";

export default function ErrorPage() {
  return (
    <Flex w={"100vw"} flexDir={"row"}>
      <PlatformNav
        title={null}
        children={
          <Box width={"full"}>
            <Box as="main" minH={"100vh"}>
              <Error />
            </Box>
            <Footer />
          </Box>
        }
      />
    </Flex>
  );
}
