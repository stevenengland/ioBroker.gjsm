import { EventEmitter } from '../events/EventEmitter';
import { ObjectInterface } from '../iob/ObjectInterface';
import { State } from '../iob/State';
import { GenericJsonStateMapperEventMap } from './GenericJsonStateMapperEventMap';
import { PublicConfigInterface } from './configuration/PublicConfigInterface';

export interface GenericJsonStateManagerInterface {
  errorEmitter: EventEmitter<GenericJsonStateMapperEventMap>;
  initialize(): Promise<void>;
  terminate(): Promise<void>;
  loadConfig(config?: PublicConfigInterface): Promise<void>;
  loadAutomationDefinitions(): Promise<void>;
  createSubscriptionsAndRepositoryForSourceStates(): Promise<void>;
  handleStateChange(id: string, state: State): Promise<void>;
  handleObjectChange(id: string, obj: ObjectInterface): Promise<void>;
}
