import { EventEmitter } from '../events/EventEmitter';
import { GenericJsonStateMapperEventMap } from './GenericJsonStateMapperEventMap';

export interface GenericJsonStateManagerInterface {
  initialize(): Promise<void>;
  loadConfig(): Promise<void>;
  loadAutomationDefinitions(): Promise<void>;
  errorEmitter: EventEmitter<GenericJsonStateMapperEventMap>;
}
