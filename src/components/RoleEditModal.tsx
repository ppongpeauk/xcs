import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';

export default function RoleEditModal({ isOpen, onOpen, onClose }: any) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          bg={useColorModeValue("white", "gray.800")}
        >
          <ModalHeader>Manage Access Groups</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text size={'md'}>This is the modal body</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

}