import { chakra, HTMLChakraProps } from "@chakra-ui/react";
import { HTMLMotionProps, motion } from "framer-motion";

type Merge<P, T> = Omit<P, keyof T> & T;
export type MotionBoxProps = Merge<HTMLChakraProps<"div">, HTMLMotionProps<"div">>;
export const MotionBox: React.FC<MotionBoxProps>  = motion(chakra.div);
