/* eslint-disable react-hooks/rules-of-hooks */
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import NextLink from "next/link";
import { MdOutlineAddCircle } from "react-icons/md";
import CreateAccessPointDialog from "./CreateAccessPointDialog";

import { AiFillWarning } from "react-icons/ai";
import { BiSolidLock } from "react-icons/bi";

export default function LocationAccessPoints({
  idToken,
  location,
  refreshData,
}: any) {
  const [accessPoints, setAccessPoints] = useState<any>(null);
  const toast = useToast();

  const {
    isOpen: isCreateAccessPointModalOpen,
    onOpen: onCreateAccessPointModalOpen,
    onClose: onCreateAccessPointModalClose,
  } = useDisclosure();

  useEffect(() => {
    if (!location) return;

    fetch(`/api/v1/locations/${location.id}/access-points`, {
      method: "GET",
      headers: { Authorization: `Bearer ${idToken}` },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        throw new Error(`Failed to fetch access points. (${res.status})`);
      })
      .then((data) => {
        console.log(data);
        setAccessPoints(data);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }, [location]);

  return (
    <>
      <CreateAccessPointDialog
        isOpen={isCreateAccessPointModalOpen}
        onClose={onCreateAccessPointModalClose}
        location={location}
        onCreate={refreshData}
      />
      <Heading as="h1" size="lg" mb={4}>
        Access Points
      </Heading>
      <HStack mb={4}>
        <Button
          leftIcon={<MdOutlineAddCircle />}
          onClick={onCreateAccessPointModalOpen}
          isDisabled={accessPoints?.self?.role <= 1}
        >
          Create
        </Button>
      </HStack>
      <Flex w={"full"} h={"full"}>
        <Skeleton isLoaded={!!accessPoints}>
          {accessPoints?.accessPoints?.length > 0 ? (
            <Box w={"full"}>
              {accessPoints?.accessPoints?.map((accessPoint: any) => (
                <Flex
                  key={accessPoint.id}
                  w={"384px"}
                  h={"auto"}
                  py={4}
                  px={8}
                  borderWidth={1}
                  borderRadius={"xl"}
                  borderColor={useColorModeValue("gray.200", "gray.700")}
                  mb={4}
                  aspectRatio={2 / 1}
                  align={"center"}
                  justify={"space-between"}
                  flexDir={"column"}
                >
                  <Box w={"full"}>
                    <HStack mb={2} align={"center"} justify={"flex-start"} fontSize={"xl"}>
                      {!accessPoint.configuration.enabled && <AiFillWarning />}
                      {accessPoint.configuration.armed && <BiSolidLock />}
                    </HStack>
                    <Heading as={"h2"} size={"md"} mb={2}>
                      {accessPoint.name}
                    </Heading>
                    <Text>
                      {accessPoint.description || "No description available."}
                    </Text>
                  </Box>
                  <Stack w={"full"}>
                    <Button
                      as={NextLink}
                      href={`/platform/access-points/${accessPoint.id}`}
                      variant={"solid"}
                      w={"full"}
                    >
                      View
                    </Button>
                  </Stack>
                </Flex>
              ))}
            </Box>
          ) : (
            <Text>
              This location does not have any access points yet.{" "}
              {accessPoints?.self?.role >= 2 ? (
                <>
                  <Text as={"span"}>
                    <Button
                      variant={"link"}
                      color={"unset"}
                      textDecor={"underline"}
                      textUnderlineOffset={4}
                      onClick={onCreateAccessPointModalOpen}
                      _hover={{
                        color: useColorModeValue("gray.600", "gray.400"),
                      }}
                    >
                      Create one
                    </Button>
                  </Text>{" "}
                  to get started.
                </>
              ) : (
                <></>
              )}
            </Text>
          )}
        </Skeleton>
      </Flex>
    </>
  );
}
