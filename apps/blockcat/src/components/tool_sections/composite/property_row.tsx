import { Text,HStack, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";




interface KeyValueRowProps{
  property:string;
  value:string|number;
  onChange:(value:string)=>void;
}

export function KeyValueRow({property,value,onChange}:KeyValueRowProps){
  const [svalue,setValue] = useState(value);
  useEffect(()=>{
    onChange(svalue as string);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[svalue])
  useEffect(()=>{
    setValue(value);
  },[value]);
  return(
    <HStack p={1} px={3}>
      <Text pr={1}>{property}</Text>
      <Input value={svalue} onChange={(ev)=>{setValue(ev.target.value)}} />
    </HStack>
  )
}
