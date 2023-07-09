// Components
import {
  Box,
  Button,
  Center,
  Code,
  Container,
  Flex,
  Heading,
  Spacer,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useColorModeValue,
  useSteps,
} from "@chakra-ui/react";

import Head from "next/head";
import { useState } from "react";

// Layouts
import Layout from "@/layouts/PlatformLayout";

const steps = [
  { title: "First", description: "Join Game" },
  { title: "Second", description: "Provide Verification Code" },
  { title: "Third", description: "Complete" },
];
export default function Verify() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  return (
    <>
      <Head>
        <title>EVE XCS - Verification</title>
      </Head>
      <Container maxW={"container.lg"} p={8}>
        <Text as={"h1"} fontSize={"4xl"} fontWeight={"900"}>
          Account Verification
        </Text>
        <Stepper colorScheme={"blue"} index={activeStep} py={8}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        <Center>
          <Flex
            maxW={"500px"}
            border={"1px solid"}
            borderColor={useColorModeValue("gray.300", "gray.700")}
            rounded={"xl"}
            p={8}
            m={2}
            flexDir={"column"}
          >
            <Text as={"h2"} fontSize={"3xl"} fontWeight={"900"}>
              Welcome
            </Text>
            <Text>
              Welcome to the verification process. In just a few steps you will
              be able to start using the EVE XCS platform.
            </Text>
            <Spacer />
            <Stack spacing={2} pt={8}>
              <Button
                colorScheme={"blue"}
                onClick={() => setActiveStep(activeStep + 1)}
              >
                Start Verification
              </Button>
            </Stack>
          </Flex>
        </Center>
        <Center>
          <Flex
            maxW={"500px"}
            border={"1px solid"}
            borderColor={useColorModeValue("gray.300", "gray.700")}
            rounded={"xl"}
            p={8}
            m={2}
            flexDir={"column"}
          >
            <Text as={"h2"} fontSize={"3xl"} fontWeight={"900"}>
              Verify Your Roblox Account
            </Text>
            <Text>
              Join the following game. You will need to provide the verification code below:
            </Text>
            <Spacer />
            <Stack spacing={2} pt={8}>
              <Button
                colorScheme={"blue"}
                onClick={() => setActiveStep(activeStep + 1)}
              >
                Start Verification
              </Button>
            </Stack>
          </Flex>
        </Center>
      </Container>
    </>
  );
}

Verify.getLayout = (page: any) => <Layout>{page}</Layout>;
