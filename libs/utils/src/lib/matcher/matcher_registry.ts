import { DefaultNumberRegistry, Registry } from "../registry";
import { Matcher, PriorityMatcher } from "./matcher";


export type NumberedMatcher = PriorityMatcher

export interface MatcherRegistry<Target,Env,M extends PriorityMatcher<Target,Env>> extends Matcher<Target,Env>,Registry<number,M>{
}

