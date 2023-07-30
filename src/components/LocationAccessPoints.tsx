/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';

import {
  Badge,
  Box,
  Button,
  Code,
  Container,
  Flex,
  FormControl,
  FormLabel,
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
  useToast
} from '@chakra-ui/react';

import { AiFillWarning } from 'react-icons/ai';
import { BiSolidLock, BiSolidLockOpen } from 'react-icons/bi';
import { MdOutlineAddCircle } from 'react-icons/md';

import { CreatableSelect, Select } from 'chakra-react-select';
import moment from 'moment';
import NextLink from 'next/link';

import CreateAccessPointDialog from '@/components/CreateAccessPointDialog';

export default function LocationAccessPoints({ idToken, location, refreshData }: any) {
  const [accessPoints, setAccessPoints] = useState<any>(null);
  const [selectedTags, setSelectedTags] = useState<any>([]);
  const [tags, setTags] = useState<any>([]);
  const [tagsOptions, setTagsOptions] = useState<any>([]); // [{ value: 'tag', label: 'tag' }
  const toast = useToast();

  const {
    isOpen: isCreateAccessPointModalOpen,
    onOpen: onCreateAccessPointModalOpen,
    onClose: onCreateAccessPointModalClose
  } = useDisclosure();

  // get tags
  useEffect(() => {
    if (!accessPoints) return;
    let res = [] as string[];
    accessPoints?.accessPoints?.forEach((accessPoint: any) => {
      res = [...res, ...(accessPoint?.tags || [])];
    });
    setTags(res);
    setTagsOptions(
      res.map((value: any) => {
        return {
          value,
          label: value
        };
      })
    );
  }, [accessPoints]);

  useEffect(() => {
    if (!location) return;

    fetch(`/api/v1/locations/${location.id}/access-points`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${idToken}` }
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
          title: 'Error',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true
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
      <Text
        as={'h1'}
        fontSize={'4xl'}
        fontWeight={'900'}
        mb={2}
      >
        Access Points
      </Text>
      <Stack
        mb={4}
        direction={{ base: 'column', md: 'row' }}
      >
        <Button
          leftIcon={<MdOutlineAddCircle />}
          onClick={onCreateAccessPointModalOpen}
          isDisabled={accessPoints?.self?.role <= 1}
        >
          Create
        </Button>
        <Box w={'256px'}>
          <FormControl>
            {/* <FormLabel>Filter by tag</FormLabel> */}
            <Select
              options={tagsOptions}
              placeholder="Select a tag..."
              onChange={(value) => {
                setSelectedTags(value);
              }}
              value={selectedTags}
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              selectedOptionStyle={'check'}
            />
          </FormControl>
        </Box>
      </Stack>
      <Flex
        as={Stack}
        direction={'row'}
        h={'full'}
        spacing={4}
        overflow={'auto'}
        flexWrap={'wrap'}
      >
        {accessPoints && accessPoints?.accessPoints?.length > 0 ? (
          <Flex
            as={Stack}
            direction={'row'}
            h={'full'}
            spacing={4}
            overflow={'auto'}
            flexWrap={'wrap'}
          >
            {!accessPoints
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Box
                    key={i}
                    as={Skeleton}
                    w={{ base: 'full', md: '384px' }}
                    h={'max-content'}
                    py={4}
                    px={8}
                    borderWidth={1}
                    borderRadius={'xl'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                  >
                    <HStack
                      p={2}
                      w={'full'}
                    >
                      <Box flexGrow={1}>
                        <Text
                          fontSize={'2xl'}
                          fontWeight={'bold'}
                        >
                          Loading...
                        </Text>
                        <Text color={'gray.500'}>0 Members</Text>
                        <Text color={'gray.500'}>Owned by</Text>
                        <Text>Organization</Text>
                      </Box>
                    </HStack>
                  </Box>
                ))
              : null}
            {accessPoints?.accessPoints
              ?.filter(
                (accessPoint: any) =>
                  !selectedTags.length || selectedTags.some((tag: any) => accessPoint?.tags?.includes(tag.value))
              )
              .map((accessPoint: any) => (
                <Flex
                  key={accessPoint.id}
                  w={{ base: 'full', md: '384px' }}
                  h={'max-content'}
                  p={6}
                  borderWidth={1}
                  borderRadius={'xl'}
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                >
                  <Box flexGrow={1}>
                    <Text
                      fontSize={'xl'}
                      fontWeight={'bold'}
                      noOfLines={1}
                    >
                      {accessPoint?.name}
                    </Text>
                    <Code
                      fontSize={'xs'}
                      mt={2}
                    >
                      {accessPoint.id}
                    </Code>
                    <HStack
                      align={'center'}
                      justify={'flex-start'}
                      fontSize={'xl'}
                      mt={2}
                    >
                      {accessPoint?.config?.active ? (
                        <Badge colorScheme={'green'}>Active</Badge>
                      ) : (
                        <Badge colorScheme={'red'}>Inactive</Badge>
                      )}
                      {accessPoint?.config?.armed ? (
                        <Badge colorScheme={'blue'}>Armed</Badge>
                      ) : (
                        <Badge colorScheme={'red'}>Not Armed</Badge>
                      )}
                    </HStack>
                    {accessPoint.description ? (
                      <Text pt={2}>{accessPoint.description}</Text>
                    ) : (
                      <Text
                        pt={2}
                        color={'gray.500'}
                      >
                        No description available.
                      </Text>
                    )}
                    <Stack pt={4}>
                      <Button
                        as={NextLink}
                        href={`/platform/access-points/${accessPoint.id}`}
                        variant={'solid'}
                        w={'full'}
                      >
                        View
                      </Button>
                    </Stack>
                  </Box>
                </Flex>
              ))}
          </Flex>
        ) : (
          <Text>
            This location does not have any access points yet.{' '}
            {accessPoints?.self?.role >= 2 ? (
              <>
                <Text as={'span'}>
                  <Button
                    variant={'link'}
                    color={'unset'}
                    textDecor={'underline'}
                    textUnderlineOffset={4}
                    onClick={onCreateAccessPointModalOpen}
                    _hover={{
                      color: useColorModeValue('gray.600', 'gray.400')
                    }}
                  >
                    Create one
                  </Button>
                </Text>{' '}
                to get started.
              </>
            ) : (
              <></>
            )}
          </Text>
        )}
      </Flex>
    </>
  );
}
