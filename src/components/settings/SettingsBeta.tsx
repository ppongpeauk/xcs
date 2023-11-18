import { Container, Flex, Box, Title, Text, Button, UnstyledButton, Paper, Anchor } from '@mantine/core';
import { IconCircleCheckFilled, IconLogout } from '@tabler/icons-react';

export default function SettingsBeta() {
  return (
    <>
      <Flex
        direction={'column'}
        gap={8}
      >
        <Paper
          p={'lg'}
          withBorder
        >
          <Flex
            direction={'row'}
            align={'center'}
            gap={16}
          >
            <IconCircleCheckFilled size={32} />
            <Flex direction={'column'}>
              <Title order={4}>You are currently enrolled in the beta program.</Title>
              <Text size={'sm'}>Beta program members are eligible for early access to new features.</Text>
              <Text size={'sm'}>
                You were enrolled into the beta program on <strong>August 22, 2023</strong>.
              </Text>
            </Flex>
          </Flex>
        </Paper>
      </Flex>
    </>
  );
}
