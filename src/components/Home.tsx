import { Box, Button, Container, Flex, Heading, Icon, Image, Text, chakra, useColorModeValue } from '@chakra-ui/react';

import NextImage from 'next/image';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';
import { BsArrowRight } from 'react-icons/bs';
import Section from './section';

const ChakraImage = chakra(NextImage, {
  baseStyle: { maxH: 120, maxW: 120 },
  shouldForwardProp: (prop) => ['width', 'height', 'src', 'alt'].includes(prop),
});

const ChakraMarquee = chakra(Marquee, {
  baseStyle: {
    height: '100%',
    width: '100%',
  },
});

export default function Home() {
  return (
    // New Bold Typography Design
    <>
      <Container
        as={Flex}
        flexDir={'column'}
        maxW={'100%'}
        position={'relative'}
        p={0}
        pt={16}
        align={'center'}
      >
        <Flex
          flexDir={'column'}
          position={'relative'}
          maxW={'container.xl'}
          h={'calc(100dvh)'}
          borderBottom={'1px solid'}
          borderColor={useColorModeValue('blackAlpha.900', 'whiteAlpha.900')}
          mx={{ base: 4, md: 16 }}
          pb={24}
        >
          <Section>
            <Heading as={'h1'} size={{ base: 'xl', md: '4xl' }} fontWeight={'normal'} pb={{ base: 8, md: 16 }} w={{ base: 'full', md: '66%' }}>
              Powering the future of access control.
            </Heading>
          </Section>
          <Flex
            flexBasis={1}
            flexGrow={2}
            overflow={'hidden'}
            w={'full'}
          >
            <Image
              src={'/images/home-hero.jpg'}
              alt={'Home Image'}
              w={"full"}
              height={"full"}
              style={{
                objectFit: 'cover',
              }}
            />
          </Flex>
        </Flex>
        <Flex
          minH={'50vh'}
          maxW={'container.xl'}
          mx={{ base: 4, md: 16 }}
          py={16}
          borderBottom={'1px solid'}
          borderColor={useColorModeValue('blackAlpha.900', 'whiteAlpha.900')}
        >
          <Box
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
              reverse-compatibility with other systems. Whether you&apos;re looking to enhance the security of your
              business or residential property, Restrafes XCS provides the flexibility and reliability you need
              to manage access with confidence.
            </Text>
          </Box>
        </Flex>
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          w={'100%'}
          maxW={'container.xl'}
          mx={{ base: 4, md: 16 }}
          justify={{ base: 'center', md: 'space-between' }}
          gap={4}
          align={'center'}
          py={24}
        >
          <Box>
            <Heading
              size={'2xl'}
              fontWeight={'normal'}
            >
              Get started today.
            </Heading>
          </Box>
          <Box>
            <Text
              fontSize={'xl'}
              maxW={'24ch'}
            >
              Open access coming soon. Available now for beta testers.
            </Text>
          </Box>
          <Box
            my={4}
          >
            <Button
              as={Link}
              h={'auto'}
              // variant={pathname === href ? 'solid' : variant}
              variant={'unstyled'}
              border={'1px solid'}
              borderColor={useColorModeValue('blackAlpha.900', 'white')}
              borderRadius={'none'}
              py={2}
              px={4}
              href={'/auth/login'}
              transition={'all 0.2s ease'}
              _hover={{
                bg: useColorModeValue('blackAlpha.900', 'white'),
                color: useColorModeValue('white', 'black')
              }}
              _active={{
                bg: useColorModeValue('blackAlpha.700', 'white'),
                color: useColorModeValue('white', 'black')
              }}
              lineHeight={1.25}
            >
              Access Platform
              <Icon as={BsArrowRight} ml={1} h={3} />
            </Button>
          </Box>
        </Flex>
      </Container>
      {/* <Flex position={'relative'}>
        <Flex
          flexDir={'column'}
          w={'full'}
          pos={'relative'}
          fontSize={['4em', '8em', '12em']}
          lineHeight={1}
          justify={'center'}
          py={16}
        >
          <ChakraMarquee
            autoFill={true}
            direction={'left'}
            className={'overflow-hidden'}
          >
            <Heading
              as={'h3'}
              fontSize={'4xl'}
              fontWeight={'normal'}
            >
              Restrafes XCS
              <Box
                as={'span'}
                mx={8}
              ></Box>
            </Heading>
          </ChakraMarquee>
          <ChakraMarquee
            autoFill={true}
            direction={'right'}
            className={'overflow-hidden'}
          >
            <Heading
              as={'h3'}
              fontSize={'4xl'}
              fontWeight={'normal'}
            >
              Restrafes XCS
              <Box
                as={'span'}
                mx={8}
              ></Box>
            </Heading>
          </ChakraMarquee>
        </Flex>
      </Flex> */}
    </>
  );
}
