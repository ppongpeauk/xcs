import { Container, Flex, Switch, Group } from '@mantine/core';
import {
  IconCircleCheckFilled,
  IconCode,
  IconForbid2Filled,
  IconJson,
  IconLogout,
  IconSparkles
} from '@tabler/icons-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useMediaQuery } from '@mantine/hooks';

export default function SettingsExperiments() {
  const { user, currentUser, refreshCurrentUser, isAuthLoaded } = useAuthContext();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <Flex
        pos={'relative'}
        direction={'column'}
        gap={8}
      >
        <Switch
          label={
            <Group gap={8}>
              <IconCode size={16} />
              Bulk Importing via. JSON
            </Group>
          }
        />
        <Switch
          label={
            <Group gap={8}>
              <IconSparkles size={16} />
              AI-Powered Suggestions
            </Group>
          }
        />
      </Flex>
    </>
  );
}
