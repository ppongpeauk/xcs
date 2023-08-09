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
import LocationResetUniverseIdModal from '@/components/LocationResetUniverseIdModal';

export default function SettingsInvite() {
  const { currentUser, refreshCurrentUser, user, isAuthLoaded } = useAuthContext();
  const toast = useToast();
  const { push } = useRouter();

  useEffect(() => {
    if (!currentUser) return;
    if (!currentUser?.platform?.staff) {
      toast({
        title: 'You are not authorized to view this page.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      push('/platform/settings/1');
      return;
    }
  }, [currentUser, push, toast]);

  // Platform Invite Creation Modal
  const {
    isOpen: platformInviteModalOpen,
    onOpen: platformInviteModalOnOpen,
    onClose: platformInviteModalOnClose
  } = useDisclosure();

  return (
    <>
      <InvitePlatformUserModal
        isOpen={platformInviteModalOpen}
        onOpen={platformInviteModalOnOpen}
        onClose={platformInviteModalOnClose}
        onCreate={() => { }}
      />
      {isAuthLoaded && currentUser && (
        <Box w={'fit-content'}>
          <Heading
            as={'h2'}
            size={'lg'}
          >
            You have {currentUser?.platform?.invites?.length || 0} invites.
          </Heading>
          <Text fontSize={'md'} color={"gray.500"}>
            Who&apos;s a great addition to XCS? Invite them to join!
          </Text>
          <Button
            mt={4}
            colorScheme={'blue'}
            onClick={platformInviteModalOnOpen}
          >
            Invite
          </Button>

        </Box>
      )}
    </>
  );
}
