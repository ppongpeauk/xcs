import { useCallback, useEffect, useRef, useState } from 'react';

import { useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import { Box, Flex, Button, Title, Text, rem } from '@mantine/core';

import { AiOutlineUser } from 'react-icons/ai';
import { BiReset } from 'react-icons/bi';
import { IoSave } from 'react-icons/io5';

import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import { useAuthContext } from '@/contexts/AuthContext';

import InvitePlatformUserModal from '@/components/InvitePlatformUserModal';
import LocationResetUniverseIdModal from '@/components/settings/LocationResetUniverseIdModal';
import { IconLink } from '@tabler/icons-react';

export default function SettingsInvite() {
  const { currentUser, isAuthLoaded, refreshCurrentUser } = useAuthContext();

  // Platform Invite Creation Modal
  const {
    isOpen: platformInviteModalOpen,
    onOpen: platformInviteModalOnOpen,
    onClose: platformInviteModalOnClose
  } = useDisclosure();

  useEffect(() => {
    refreshCurrentUser();
  }, [refreshCurrentUser]);

  return (
    <>
      <InvitePlatformUserModal
        isOpen={platformInviteModalOpen}
        onOpen={platformInviteModalOnOpen}
        onClose={platformInviteModalOnClose}
        onCreate={() => {}}
      />
      <Box
        w={'fit-content'}
        px={rem(32)}
        py={rem(24)}
        style={{
          borderRadius: rem(4),
          border: '1px solid var(--mantine-color-dark-5)'
        }}
      >
        <Title size={'md'}>
          You have {currentUser?.platform?.invites || 0} referral credit
          {currentUser?.platform?.invites === 1 ? '' : 's'}.
        </Title>
        <Text size={'md'}>You can use referral credits to invite users to the XCS platform.</Text>
      </Box>
      <Button
        mt={8}
        variant="filled"
        color="dark.5"
        onClick={platformInviteModalOnOpen}
        disabled={currentUser?.platform?.invites === 0}
        leftSection={<IconLink size={16} />}
      >
        Create Invitation Link
      </Button>
    </>
  );
}
