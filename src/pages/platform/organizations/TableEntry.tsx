import { Organization } from "@/types";
import { Link } from "@chakra-ui/next-js";
import { Avatar, Button, ButtonGroup, Flex, Icon, Skeleton, Stack, Td, Text, Tr, useColorModeValue, useToken } from "@chakra-ui/react";
import moment from "moment";
import { useMemo } from "react";
import { BiRefresh } from "react-icons/bi";

export default function TableEntry({ key, organization, skeleton }: { key: number | string, organization?: Organization, skeleton?: boolean }) {
  const toRelativeTime = useMemo(() => (date: string) => {
    return moment(new Date(date)).fromNow();
  }, []);

  return <>
    <Tr key={key}>
      <Td>
        <Stack flexDir={'row'} align={'center'}>
          <Skeleton isLoaded={!skeleton}>
            <Avatar borderRadius={'lg'} size={'md'} src={organization?.avatar || '/images/default-avatar.png'} />
          </Skeleton>

          <Flex flexDir={'column'} mx={2} justify={'center'}>
            <Skeleton isLoaded={!skeleton}>
              <Text fontWeight={'bold'}>
                {!skeleton ? organization?.name : "Organization Name"}
              </Text>
              <Text size={'sm'} color={'gray.500'}>
                Owned by {!skeleton ? organization?.owner?.displayName : "Organization Owner"}
              </Text>
              <Flex align={'center'} color={'gray.500'} gap={1}>
                <Icon as={BiRefresh} />
                <Text size={'sm'}>
                  {!skeleton ? toRelativeTime(organization?.updatedAt as string) : "Last Updated"}
                  {!skeleton && organization?.updatedBy && " by "}
                  {!skeleton ? organization?.updatedBy?.displayName : "Organization Owner"}
                </Text>
              </Flex>
            </Skeleton>
          </Flex>
        </Stack>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={!skeleton}>
          <Text>
            {!skeleton ? organization?.statistics?.numMembers : 0}
          </Text>
        </Skeleton>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={!skeleton}>
          <Text>
            {!skeleton ? organization?.statistics?.numLocations : 0}
          </Text>
        </Skeleton>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={!skeleton}>
          <ButtonGroup>
            <Button
              as={Link}
              href={`/platform/organizations/${organization?.id}/edit`}
              size={"sm"}
              variant={"solid"}
              colorScheme='blue'
              textDecor={"unset !important"}
            >
              View Details
            </Button>
          </ButtonGroup>
        </Skeleton>
      </Td>
    </Tr>
  </>
}