import { Button, Container, Stack, Switch, Title } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@chakra-ui/react';
import { notifications } from '@mantine/notifications';

export default function SettingsPrivacy() {
  const { currentUser, user, refreshCurrentUser } = useAuthContext();
  const toast = useToast();
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);

  const form = useForm({
    initialValues: {
      organizations: currentUser?.privacy?.organizations,
      linkedAccounts: currentUser?.privacy?.linkedAccounts,
      linkScans: currentUser?.privacy?.linkScans
    }
  });

  useEffect(() => {
    if (!currentUser) return;
    form.setValues({
      organizations: currentUser?.privacy?.organizations || false,
      linkedAccounts: currentUser?.privacy?.linkedAccounts || false,
      linkScans: currentUser?.privacy?.linkScans || false
    });
  }, [currentUser]);

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          setFormSubmitting(true);
          user.getIdToken().then((token: any) => {
            fetch(`/api/v2/me/privacy`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                organizations: values.organizations || false,
                linkedAccounts: values.linkedAccounts || false,
                linkScans: values.linkScans || false
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
                refreshCurrentUser();
              })
              .catch((error) => {
                notifications.show({
                  title: 'There was an error updating your privacy settings.',
                  message: error.message,
                  color: 'red'
                });
              })
              .finally(() => {
                setFormSubmitting(false);
              });
          });
        })}
      >
        <Stack>
          <Title order={4}>Platform</Title>
          <Switch
            label="Organizations are public"
            description="Show your organizations on your profile."
            {...form.getInputProps('organizations')}
            checked={form.values.organizations}
          />
          <Title order={4}>Roblox</Title>
          <Switch
            label="Link Roblox scans to XCS profile"
            description="Enabling this option will display your XCS user instead of your Roblox username when scanning an access point on Roblox."
            {...form.getInputProps('linkScans')}
            checked={form.values.linkScans}
          />
        </Stack>
        <Button
          mt={16}
          leftSection={<IconDeviceFloppy size={16} />}
          type={'submit'}
          color={'dark.5'}
          loading={formSubmitting}
          w={'fit-content'}
        >
          Save Changes
        </Button>
      </form>
    </>
  );
}
