import { PrivateConfigInterface } from './PrivateConfigInterface';

export const config = {
  automationStatesPattern: 'automations.*', // Automatically subscribes to new matching states
  functionsNamespace: 'enum.functions', // Automatically subscribes to new matching states
} as PrivateConfigInterface;
