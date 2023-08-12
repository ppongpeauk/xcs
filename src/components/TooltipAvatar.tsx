import { Avatar, Tooltip } from "@chakra-ui/react";

export const TooltipAvatar: typeof Avatar = (props: any) => (
  <Tooltip label={props.name}>
    <Avatar {...props} />
  </Tooltip>
);