import { Text, Title, Flex, Button, Select, Fieldset } from '@mantine/core';
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

      <Fieldset legend="Filter">
        <Flex gap={16}>
          <Select
            label={'Period'}
            placeholder="Period"
            w={200}
            data={[
              {
                label: 'Last hour',
                value: 'last-hour'
              },
              {
                label: 'Last 7 days',
                value: 'last-7-days'
              },
              {
                label: 'Last 30 days',
                value: 'last-30-days'
              },
              {
                label: 'Last 90 days',
                value: 'last-90-days'
              },
              {
                label: 'Last year',
                value: 'last-year'
              }
            ]}
            allowDeselect={false}
            defaultValue={'last-7-days'}
          />
          <Select
            label={'Log type'}
            placeholder="Log type"
            w={200}
            data={[
              {
                label: 'All',
                value: 'all'
              },
              {
                label: 'System',
                value: 'system'
              },
              {
                label: 'User',
                value: 'User'
              }
            ]}
            allowDeselect={false}
            defaultValue={'all'}
          />
        </Flex>
      </Fieldset>
    </>
  );
}
