import { EventEmitter } from '../events/EventEmitter';
import { State } from '../iob/State';
import { GenericJsonStateMapperEventMap } from './GenericJsonStateMapperEventMap';

export interface GenericJsonStateManagerInterface {
  errorEmitter: EventEmitter<GenericJsonStateMapperEventMap>;
  initialize(): Promise<void>;
  terminate(): Promise<void>;
  loadConfig(): Promise<void>;
  loadAutomationDefinitions(): Promise<void>;
  createSubscriptionsAndRepositoryForSourceStates(): Promise<void>;
  handleStateChange(id: string, state: State): Promise<void>;
}
