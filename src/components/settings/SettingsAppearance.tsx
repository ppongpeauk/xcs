import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
  useToast
} from '@chakra-ui/react';

import moment from 'moment';

import { useAuthContext } from '@/contexts/AuthContext';

import DeleteDialog from '@/components/DeleteDialog';
import { Badge, Radio, useMantineColorScheme } from '@mantine/core';

export default function SettingsAppearance() {
  const { currentUser, refreshCurrentUser, user } = useAuthContext();
  const toast = useToast();

  const { colorMode, setColorMode } = useColorMode();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <>
      <Text
        style={{
          alignContent: 'center'
        }}
      >
        Visual mode
        <Badge
          ml={8}
          variant="outline"
          color="var(--mantine-color-default-color)"
        >
          Beta
        </Badge>
      </Text>
      <Stack
        spacing={4}
        h={'max-content'}
      >
        <Radio
          name="colorSchemeLight"
          label="Light"
          checked={colorScheme === 'light'}
          onClick={() => {
            setColorScheme('light');
            // setColorMode('light');
          }}
        />
        <Radio
          name="colorSchemeDark"
          label="Dark"
          checked={colorScheme === 'dark'}
          onClick={() => {
            setColorScheme('dark');
            // setColorMode('dark');
          }}
        />
        {/* <Button
            variant={'unstyled'}
            onClick={() => {
              setColorScheme('light');
              // setColorMode('light');
            }}
            h={'fit-content'}
          >
            <div className={`items-center rounded-lg border-2 p-1 ${colorMode === 'light' ? 'border-muted' : ''}`}>
              <div className="space-y-2 rounded-lg bg-[#ecedef] p-2">
                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
              </div>
            </div>
            <Text
              w={'full'}
              p={2}
            >
              Light
            </Text>
          </Button>
          <Button
            variant={'unstyled'}
            onClick={() => {
              setColorScheme('dark');
              // setColorMode('dark');
            }}
            h={'fit-content'}
          >
            <div
              className={`items-center rounded-lg border-2 bg-popover p-1 ${
                colorMode === 'dark' ? 'border-muted' : ''
              }`}
            >
              <div className="space-y-2 rounded-lg bg-slate-950 p-2">
                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
              </div>
            </div>
            <Text
              w={'full'}
              p={2}
            >
              Dark
            </Text>
          </Button> */}
      </Stack>
    </>
  );
}
