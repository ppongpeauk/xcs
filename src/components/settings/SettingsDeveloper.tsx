import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

export default function SettingsDeveloper() {
  return (
    <>
      <Button
        variant="default"
        leftSection={<IconPlus size={16} />}
      >
        Create a new app
      </Button>
    </>
  );
}
