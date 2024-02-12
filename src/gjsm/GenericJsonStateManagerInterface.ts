import { EventEmitter } from '../events/EventEmitter';
import { ObjectType } from '../iob/types/ObjectType';
import { State } from '../iob/types/State';
import { GenericJsonStateMapperEventMap } from './GenericJsonStateMapperEventMap';
import { PublicConfigInterface } from './configuration/PublicConfigInterface';
import { CommandResultInterface } from './message_api/CommandResultInterface';

export interface GenericJsonStateManagerInterface {
  errorEmitter: EventEmitter<GenericJsonStateMapperEventMap>;
  initialize(): Promise<void>;
  terminate(): Promise<void>;
  loadConfig(config?: PublicConfigInterface): Promise<void>;
  loadAutomationDefinitions(): Promise<void>;
  createSubscriptionsAndRepositoryForSourceStates(): Promise<void>;
  handleStateChange(id: string, state: State): Promise<void>;
  handleObjectChange(id: string, obj: ObjectType): Promise<void>;
  handleMessage(command: string): Promise<CommandResultInterface>;
}
