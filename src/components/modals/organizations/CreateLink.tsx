import { Organization } from '@/types';
import { Flex, Modal, Text, rem } from '@mantine/core';
import { IconLinkPlus } from '@tabler/icons-react';

export default function CreateLink({
  opened,
  organization,
  onClose,
  refresh
}: {
  opened: boolean;
  organization: Organization;
  onClose: () => void;
  refresh: () => void;
}) {
  return (
    <Modal
      withinPortal
      zIndex={10}
      opened={opened}
      onClose={onClose}
      title={
        <Flex align={'center'}>
          <IconLinkPlus
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
          <Text
            ml={10}
            fw={'bold'}
          >
            Create Invitation Links
          </Text>
        </Flex>
      }
      centered
      size={'md'}
      radius={'md'}
    ></Modal>
  );
}
