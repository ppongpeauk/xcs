import {
  Container,
  Flex,
  Box,
  Title,
  Text,
  Button,
  UnstyledButton,
  Paper,
  Anchor,
  LoadingOverlay,
  Switch,
  Group
} from '@mantine/core';
import {
  IconCircleCheckFilled,
  IconCode,
  IconForbid2Filled,
  IconJson,
  IconLogout,
  IconSparkles
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useAuthContext } from '@/contexts/AuthContext';
import { useMediaQuery } from '@mantine/hooks';
import moment from 'moment';
import { useRouter } from 'next/router';

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
