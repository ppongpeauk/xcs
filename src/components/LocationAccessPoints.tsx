/* eslint-disable react-hooks/rules-of-hooks */
import {
  Box,
  Button,
  Code,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  SimpleGrid,
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

import moment from "moment";
import { AiFillWarning } from "react-icons/ai";
import { BiSolidLock, BiSolidLockOpen } from "react-icons/bi";

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
      <Text as={"h1"} fontSize={"4xl"} fontWeight={"900"} mb={2}>
        Access Points
      </Text>
      <Stack mb={4} direction={{ base: "column", md: "row" }}>
        <Button
          leftIcon={<MdOutlineAddCircle />}
          onClick={onCreateAccessPointModalOpen}
          isDisabled={accessPoints?.self?.role <= 1}
        >
          Create
        </Button>
      </Stack>
      <Flex h={"full"} overflow={"auto"} flexWrap={"wrap"}>
        <Skeleton isLoaded={!!accessPoints} w={"full"}>
          {accessPoints?.accessPoints?.length > 0 ? (
            <Flex flexWrap={"wrap"}>
              {accessPoints?.accessPoints?.map((accessPoint: any) => (
                <Flex
                  key={accessPoint.id}
                  w={{ base: "full", md: "384px" }}
                  h={"auto"}
                  p={6}
                  m={2}
                  aspectRatio={2 / 1}
                  borderWidth={1}
                  borderRadius={"lg"}
                  borderColor={useColorModeValue("gray.200", "gray.700")}
                  align={"center"}
                  justify={"space-between"}
                  flexDir={"column"}
                >
                  <Box w={"full"}>
                    <Text fontSize={"2xl"} fontWeight={"bold"} mb={2}>
                      {accessPoint.name}
                    </Text>
                    <HStack
                      align={"center"}
                      justify={"flex-start"}
                      fontSize={"xl"}
                    >
                      {!accessPoint.configuration.active && (
                        <AiFillWarning title="Not active" />
                      )}
                      {accessPoint.configuration.armed ? (
                        <BiSolidLock title="Armed" />
                      ) : (
                        <BiSolidLockOpen title="Unarmed" />
                      )}
                    </HStack>

                    <Box py={4}>
                      <Text>
                        {accessPoint.description || "No description available."}
                      </Text>
                      <Text>
                        ID: <Code>{accessPoint.id}</Code>
                      </Text>
                      <Text>
                        Updated at:{" "}
                        <Code>{moment(accessPoint.updatedAt).fromNow()}</Code>
                      </Text>
                    </Box>
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
            </Flex>
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
