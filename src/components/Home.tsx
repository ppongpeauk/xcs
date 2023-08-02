import { Box, Container, Divider, Flex, Heading, Image, Text, chakra, useColorModeValue } from '@chakra-ui/react';

// import { Familjen_Grotesk, Manrope } from "next/font/google";
// const font1 = Familjen_Grotesk({ subsets: ["latin"] });
import NextImage from 'next/image';
import Marquee from 'react-fast-marquee';

import Section from '@/components/section';

// const Image = chakra(NextImage, {
//   baseStyle: {
//     maxH: '100%',
//     maxW: '100%'
//   }
// });

const ChakraImage = chakra(NextImage, {
  baseStyle: { maxH: 120, maxW: 120 },
  shouldForwardProp: (prop) => ['width', 'height', 'src', 'alt'].includes(prop),
});


export default function Home() {
  return (
    // New Bold Typography Design
    <Flex
      position={'relative'}
      flexDir={'column'}
    >
      <Flex
        position={'relative'}
        flexDir={{ base: 'column', md: 'row' }}
        h={'calc(100vh - 6rem)'}
        borderBottom={'1px solid'}
        borderColor={useColorModeValue('gray.300', 'gray.700')}
      >
        <Flex
          flexBasis={1}
          flexGrow={2}
          order={{ base: 2, md: 1 }}
          overflow={'hidden'}
          w={'full'}
        >
          <Image
            src={'/images/login3.jpg'}
            alt={'Home Image'}
            w={"full"}
            height={"full"}
            style={{
              objectFit: 'cover',
            }}
          />
        </Flex>
        <Flex
          pos={'relative'}
          flexBasis={1}
          flexGrow={1}
          align={'center'}
          justify={'center'}
          py={8}
          px={{ base: 8, md: 16, lg: 32 }}
          order={{ base: 1, md: 2 }}
          // backdropFilter={"blur(2rem)"}
          // bg={useColorModeValue(
          //   "rgba(255, 255, 255, 0.25)",
          //   "rgba(26, 32, 44, 0.5)"
          // )}
          bg={useColorModeValue('white', 'gray.800')}
          minW={{ base: 'unset', md: '50%' }}
          w={{ base: 'full', md: '50%' }}
          h={'full'}
        >
          <Section>
            <Heading
              as={'h1'}
              size={'xl'}
              fontWeight={'bolder'}
              letterSpacing={'tight'}
              pb={2}
            >
              Streamlined access control is here.
            </Heading>
            <Text fontSize={'xl'}>Restrafes XCS is a new way to manage your building&apos;s access control.</Text>
          </Section>
        </Flex>
      </Flex>
      <Flex
        w={'100%'}
        minH={'50vh'}
        borderBottom={'1px solid'}
        borderColor={useColorModeValue('gray.300', 'gray.700')}
        py={16}
      >
        <Box
          px={{ base: 8, md: 16, lg: 32 }}
          flexGrow={1}
          flexBasis={1}
          display={{ base: 'none', md: 'block' }}
        >
          <Heading
            size={'xl'}
            fontWeight={'400'}
            pb={2}
          >
            Qu&apos;est-ce que Restrafes XCS?
          </Heading>
        </Box>
        <Box
          px={{ base: 8, md: 16, lg: 32 }}
          flexGrow={1}
          flexBasis={1}
        >
          <Heading
            size={'xl'}
            fontWeight={'400'}
            pb={2}
          >
            What is Restrafes XCS?
          </Heading>
          <Text fontSize={'xl'}>
            Restrafes XCS is a powerful access control system designed to help you manage access points for your
            building. With Restrafes XCS, you can easily and securely control who has access to your property, including
            employees and visitors. The system is highly customizable, allowing you to set access levels and permissions
            for different users, and offers a range of advanced features such as real-time monitoring, reporting, and
            integration with other security systems. Whether you&apos;re looking to enhance the security of your
            business, school, or residential property, Restrafes XCS provides the flexibility and reliability you need
            to manage access with confidence.
          </Text>
        </Box>
      </Flex>
      <Flex position={'relative'}>
        <Flex
          flexDir={'column'}
          w={'full'}
          pos={'relative'}
          fontSize={['4em', '8em', '12em']}
          lineHeight={1}
          justify={'center'}
          py={16}
        >
          <Marquee
            autoFill={true}
            direction={'left'}
            className={'overflow-hidden'}
          >
            <Text
              as={'h3'}
              fontSize={['0.5em', '0.25em']}
            >
              Restrafes XCS
              <Box
                as={'span'}
                mx={8}
              ></Box>
            </Text>
          </Marquee>
          <Marquee
            autoFill={true}
            direction={'right'}
            className={'overflow-hidden'}
          >
            <Text
              as={'h3'}
              fontSize={['0.5em', '0.25em']}
              fontWeight={'900'}
            >
              Restrafes XCS
              <Box
                as={'span'}
                mx={8}
              ></Box>
            </Text>
          </Marquee>
        </Flex>
      </Flex>
    </Flex>
  );
}
