import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Portal,
  Skeleton,
  SkeletonCircle,
  Stack,
  Switch,
  Text,
  Textarea,
  VStack,
  useColorModeValue,
  useDisclosure,
  useToast
} from '@chakra-ui/react';

import { AiOutlineUser } from 'react-icons/ai';
import { BiReset } from 'react-icons/bi';
import { IoSave } from 'react-icons/io5';

import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import { useAuthContext } from '@/contexts/AuthContext';

import InvitePlatformUserModal from '@/components/InvitePlatformUserModal';
import LocationResetUniverseIdModal from '@/components/settings/LocationResetUniverseIdModal';

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
        bg={'gray.100'}
        rounded={'lg'}
        px={8}
        py={6}
      >
        <Heading
          as={'h2'}
          size={'md'}
          color={'gray.800'}
        >
          You have {currentUser?.platform?.invites || 0} referral credit
          {currentUser?.platform?.invites === 1 ? '' : 's'}.
        </Heading>
        <Text
          fontSize={'md'}
          color={'gray.500'}
        >
          You can use referral credits to invite users to the XCS platform.
        </Text>
      </Box>
      <Button
        mt={4}
        onClick={platformInviteModalOnOpen}
        isDisabled={currentUser?.platform?.invites === 0}
      >
        Create Invitation Link
      </Button>
    </>
  );
}
