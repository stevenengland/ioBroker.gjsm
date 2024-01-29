import { MapValueInterface } from './MapValueInterface';
import { SetValueInterface } from './SetValueInterface';

export interface InstructionInterface {
  name?: string;
  map_value?: MapValueInterface;
  set_value?: SetValueInterface;
}
