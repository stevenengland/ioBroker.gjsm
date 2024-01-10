import { InstanceConfigInterface } from './InstanceConfigInterface';
import { PrivateConfigInterface } from './PrivateConfigInterface';
import { PublicConfigInterface } from './PublicConfigInterface';

export interface ConfigInterface extends PrivateConfigInterface, PublicConfigInterface, InstanceConfigInterface {}
