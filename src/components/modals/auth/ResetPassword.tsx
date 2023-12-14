import { useAuthContext } from '@/contexts/AuthContext';
import { Button, Modal, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconMailFilled } from '@tabler/icons-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';

export default function ResetPasswordModal({ open, onClose } = { open: false, onClose: () => {} }) {
  const { auth } = useAuthContext();
  const [formSubmitting, setFormSubmitting] = useState(false);

  const resetForm = useForm({
    initialValues: {
      email: ''
    },
    validate: {
      email: (value) => {
        if (!value) {
          return 'Please enter your email address.';
        }
        if (!value.includes('@')) {
          return 'Please enter a valid email address.';
        }
        return false;
      }
    }
  });

  return (
    <>
      <Modal
        title={<Title order={4}>Reset Password</Title>}
        opened={open}
        onClose={onClose}
        size={'sm'}
        centered
        radius={'md'}
      >
        <form
          onSubmit={resetForm.onSubmit(async (values) => {
            setFormSubmitting(true);
            await sendPasswordResetEmail(auth, values.email)
              .then(() => {
                notifications.show({
                  title: 'Password reset email sent.',
                  message: 'Please check your email for instructions.',
                  color: 'blue'
                });
                onClose();
              })
              .catch((error) => {
                const errorCode = error.code;
                let errorMessage = error.message;
                switch (errorCode) {
                  case 'auth/invalid-email':
                    errorMessage = 'The email address you provided is invalid.';
                    break;
                  case 'auth/user-not-found':
                    errorMessage = 'The email address you provided is not associated with any account.';
                    break;
                  default:
                    errorMessage = 'An unknown error occurred.';
                }
                notifications.show({
                  message: errorMessage,
                  color: 'red'
                });
              })
              .finally(() => {
                setFormSubmitting(false);
              });
          })}
        >
          <TextInput
            label="Email address"
            placeholder="Email address"
            leftSection={<IconMailFilled size={16} />}
            // data-autofocus
            {...resetForm.getInputProps('email')}
          />
          <Button
            fullWidth
            type="submit"
            mt="md"
            variant="default"
            loading={formSubmitting}
          >
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
}
