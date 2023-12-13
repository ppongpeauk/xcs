import { Text, Title, Flex, Button } from '@mantine/core';
import InfoLink from '../InfoLink';
import { IconTableExport } from '@tabler/icons-react';

export default function OrganizationEvents() {
  return (
    <>
      <Flex
        style={{
          alignItems: 'center'
        }}
      >
        <Title
          order={2}
          py={4}
        >
          Event Log
          <InfoLink
            title="Event Log"
            description="View all events that have occurred in this organization."
          />
        </Title>
        <Button
          variant="default"
          size="xs"
          style={{ marginLeft: 'auto' }}
          leftSection={<IconTableExport size={16} />}
        >
          Export to CSV
        </Button>
      </Flex>
    </>
  );
}
