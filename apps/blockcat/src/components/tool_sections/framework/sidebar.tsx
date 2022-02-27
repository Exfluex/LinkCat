import { Box, BoxProps } from "@chakra-ui/react";

type SideBarProps = BoxProps;
export function SideBar({children,...props}:SideBarProps){
  return (<Box {...props}>{children}</Box>)
}
