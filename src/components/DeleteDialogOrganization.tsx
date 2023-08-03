import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  useColorModeValue
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

export default function DeleteDialogOrganization({
  isOpen,
  onClose,
  cancelRef,
  onDelete,
  title,
  body,
  buttonText = 'Delete',
  organization
}: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState(true);


  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={useColorModeValue('white', 'gray.800')}>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              pb={2}
            >
              {title ? title : 'Delete item'}
            </AlertDialogHeader>

            <AlertDialogBody>
              {body ? body : "Are you sure? You can't undo this action afterwards."}
              <Input
                placeholder={`Type "${organization?.name}" to confirm`}
                ref={inputRef}
                onChange={(e) => {
                  if (e.target.value === organization?.name) {
                    setDisabled(false);
                  } else {
                    setDisabled(true);
                  }
                }}
                my={4}
              />
            
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                colorScheme={'red'}
                onClick={onDelete}
                ml={3}
                isDisabled={disabled}
              >
                {buttonText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
