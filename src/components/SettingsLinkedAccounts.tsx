import DeleteDialog from "@/components/DeleteDialog";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  Box,
  Button,
  ButtonGroup,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";

export default function SettingsLinkedAccounts() {
  const { currentUser, refreshCurrentUser, user } = useAuthContext();
  const toast = useToast();

  const {
    isOpen: isUnlinkRobloxOpen,
    onOpen: onUnlinkRobloxOpen,
    onClose: onUnlinkRobloxClose,
  } = useDisclosure();

  const unlinkRoblox = async () => {
    user.getIdToken().then((token: string) => {
      fetch("/api/v1/me/roblox", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            return res.json().then((json: any) => {
              throw new Error(json.message);
            });
          }
        })
        .then((data) => {
          toast({
            title: data.message,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "There was an error while unlinking your Roblox account.",
            description: err.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        })
        .finally(() => {
          refreshCurrentUser();
        });
    });
  };

  return (
    <>
      <DeleteDialog
        title={"Unlink Roblox Account"}
        body={
          "Are you sure you want to unlink your Roblox account?"
        }
        buttonText={"Unlink Account"}
        isOpen={isUnlinkRobloxOpen}
        onClose={onUnlinkRobloxClose}
        onDelete={() => {
          unlinkRoblox();
          onUnlinkRobloxClose();
        }}
      />
      <Box>
        <Text as={"h2"} fontSize={"3xl"} fontWeight={"900"}>
          Roblox
        </Text>
        {currentUser?.roblox?.verified ? (
          <>
            <Text fontSize={"lg"}>
              You are verified as{" "}
              <Text as={"span"} fontWeight={"900"}>
                {currentUser?.roblox.username}
              </Text>{" "}
              on {moment(currentUser?.roblox.verifiedAt).format("MMMM Do YYYY, h:mm:ss a.")}
            </Text>
            <ButtonGroup mt={4}>
              <Button
                colorScheme={"red"}
                onClick={() => {
                  onUnlinkRobloxOpen();
                }}
              >
                Unlink Account
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <Text fontSize={"lg"}>
            You are not verified. Please verify your account to use EVE XCS.
          </Text>
        )}
      </Box>
    </>
  );
}
