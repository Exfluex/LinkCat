import { Box } from "@chakra-ui/react";





export interface FactoryRingDescriptionBarProps{
  desc:string;
  showing:boolean;
}
export function FactoryRingDescriptionBar({desc,showing}:FactoryRingDescriptionBarProps){
  return (
      <Box pos="absolute" >
        {
          showing && (
            <Box>
              {desc}
              </Box>
          )
        }
      </Box>

  )
}
