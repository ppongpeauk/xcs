import { useAuthContext } from '@/contexts/AuthContext';
import { type AccessPoint, type Organization } from '@/types';
import { useToast } from '@chakra-ui/react';
import {
  Autocomplete,
  AutocompleteProps,
  Avatar,
  Box,
  Button,
  Center,
  Combobox,
  Fieldset,
  Flex,
  Group,
  Input,
  InputBase,
  Loader,
  Modal,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  rem,
  useCombobox,
  useMantineColorScheme
} from '@mantine/core';
import { UseFormReturnType, useForm } from '@mantine/form';
import { FormProps } from '@mantine/form/lib/Form/Form';
import { notifications } from '@mantine/notifications';
import {
  IconAccessPoint,
  IconElevator,
  IconLocation,
  IconPencil,
  IconPlus,
  IconUserPlus,
  IconUserScan,
  IconUsersGroup
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function CreateMember({
  opened,
  onClose,
  refresh,
  organization
}: {
  opened: boolean;
  onClose: () => void;
  refresh: () => void;
  organization: Organization;
}) {
  const { user } = useAuthContext();
  const [formSubmitting, setFormSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      type: 'user',
      userId: '',
      robloxUsername: ''
    },

    validate: {
      type: (value) => {
        if (!value) return 'Please select a member type.';
        return null;
      }
    }
  });

  return (
    <>
      <Modal
        withinPortal
        zIndex={10}
        opened={opened}
        onClose={onClose}
        title={
          <Flex align={'center'}>
            <IconUserPlus
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
            <Text
              ml={10}
              fw={'bold'}
            >
              Add Member
            </Text>
          </Flex>
        }
        centered
        size={'md'}
        radius={'md'}
      >
        <form
          onSubmit={form.onSubmit(async (values) => {
            setFormSubmitting(true);
            console.log(values);
            const token = await user.getIdToken();
            await fetch(`/api/v2/organizations/${organization?.id}/members`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                type: values.type,
                userId: values.userId,
                robloxUsername: values.robloxUsername
              })
            })
              .then((res) => {
                if (res.status === 200) {
                  return res.json();
                } else {
                  return res.json().then((json) => {
                    throw new Error(json.message);
                  });
                }
              })
              .then((data) => {
                notifications.show({
                  message: data.message,
                  color: 'green'
                });
                form.reset();
                refresh();
                onClose();
              })
              .catch((error) => {
                notifications.show({
                  message: error.message,
                  color: 'red'
                });
              })
              .finally(() => {
                setFormSubmitting(false);
              });
          })}
        >
          <Box>
            <Flex
              direction={'column'}
              gap={8}
            >
              <Select
                label="Member Type"
                description="The type of member to add."
                placeholder="Select a member type..."
                defaultValue={'user'}
                data={[
                  { label: 'XCS User', value: 'user' },
                  { label: 'Roblox User', value: 'roblox' },
                  { label: 'Roblox Group', value: 'roblox-group' }
                ]}
                allowDeselect={false}
                required
                {...form.getInputProps('type')}
              />
              {form.values.type === 'user' && (
                <>
                  <UserAutocomplete
                    form={form}
                    props={{
                      label: 'XCS User',
                      description: 'The XCS user to add.',
                      placeholder: 'Search for a user...',
                      required: true,
                      ...form.getInputProps('userId')
                    }}
                  />
                  <Text
                    size="xs"
                    c={'gray'}
                  >
                    You will be able to configure the user&apos;s permissions after they have been added.
                  </Text>
                </>
              )}
              {form.values.type === 'roblox' && (
                <TextInput
                  label="Roblox Username"
                  description="The Roblox username of the user to add."
                  placeholder="restrafes"
                  {...form.getInputProps('robloxUsername')}
                />
              )}
              {form.values.type === 'roblox-group' && <></>}
              <Button
                mt={8}
                ml={'auto'}
                leftSection={<IconPlus size={16} />}
                color="dark.5"
                type="submit"
                loading={formSubmitting}
              >
                {form.values.type === 'user' ? 'Invite' : 'Add'} User
              </Button>
            </Flex>
          </Box>
        </form>
      </Modal>
    </>
  );
}

interface UserItem {
  displayName: string;
  username: string;
  avatar: string;
  label: string;
  value: string;
}

function UserOption({ displayName, username, avatar }: UserItem) {
  return (
    <Group
      gap={8}
      py={4}
    >
      <Avatar
        src={avatar}
        alt={displayName}
        radius="xl"
        size={32}
      />
      <Stack gap={0}>
        <Text size={'sm'}>{displayName}</Text>
        <Text size={'xs'}>@{username}</Text>
      </Stack>
    </Group>
  );
}

export function UserAutocomplete({
  form,
  props
}: {
  form: UseFormReturnType<any>;
  props: React.PropsWithoutRef<any | AutocompleteProps>;
}) {
  const [search, setSearch] = useState('');
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch('');
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    }
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[] | null>(null);
  const [value, setValue] = useState('');
  const [empty, setEmpty] = useState(false);
  const abortController = useRef<AbortController>();
  const { user } = useAuthContext();
  const [selectedOption, setSelectedOption] = useState(null);

  function getAsyncData(searchQuery: string, signal: AbortSignal) {
    return new Promise<string[]>(async (resolve, reject) => {
      signal.addEventListener('abort', () => {
        reject(new Error('Request aborted'));
      });
      if (!search) return resolve([]);
      const token = await user.getIdToken();
      await fetch(`/api/v2/platform/search-users/${encodeURIComponent(search)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            return res.json().then((json) => {
              throw new Error(json.message);
            });
          }
        })
        .then((data) => {
          resolve(
            data.map((user: any) => ({
              displayName: user.displayName,
              username: user.username,
              avatar: user.avatar,
              label: user.displayName,
              value: user.id
            }))
          );
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  const fetchOptions = async (query: string) => {
    abortController.current?.abort();
    abortController.current = new AbortController();
    setLoading(true);

    await getAsyncData(query, abortController.current.signal)
      .then((result) => {
        setData(result);
        setLoading(false);
        setEmpty(result.length === 0);
        abortController.current = undefined;
      })
      .catch(() => {});
  };

  const options = (data || []).map((item: any) => (
    <Combobox.Option
      value={item.value}
      key={item.value}
    >
      <UserOption
        {...item}
        key={item.id}
      />
    </Combobox.Option>
  ));

  useEffect(() => {
    fetchOptions(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setValue(optionValue);
        form.setFieldValue('userId', optionValue);
        console.log(optionValue);
        combobox.closeDropdown();
        setSelectedOption(data?.find((item) => item.value === optionValue));
      }}
      withinPortal={true}
      store={combobox}
      zIndex={5000}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          value={value}
          {...(props as any)}
          multiline
        >
          {selectedOption ? (
            <UserOption {...((selectedOption as any) || [])} />
          ) : (
            <Input.Placeholder>Search for a user...</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Display Name, Username, or ID"
        />
        <Combobox.Options
          mah={200}
          style={{ overflowY: 'auto' }}
        >
          {options}
          {!options.length && <Combobox.Empty>No results found.</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
