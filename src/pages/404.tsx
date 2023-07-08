/* eslint-disable react/no-children-prop */

// Components
import Error from "@/components/Error";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Box, Flex } from "@chakra-ui/react";

export default function ErrorPage() {
  return (
    <Box w={"100vw"} flexDir={"row"}>
      <Nav />
      <Box width={"full"}>
        <Box as="main" minH={"calc(100vh - 6rem)"}>
          <Error />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
