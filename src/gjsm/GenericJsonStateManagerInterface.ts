import { EventEmitter } from '../events/EventEmitter';
import { GenericJsonStateMapperEventMap } from './GenericJsonStateMapperEventMap';

export interface GenericJsonStateManagerInterface {
  errorEmitter: EventEmitter<GenericJsonStateMapperEventMap>;
  initialize(): Promise<void>;
  loadConfig(): Promise<void>;
  loadAutomationDefinitions(): Promise<void>;
}
