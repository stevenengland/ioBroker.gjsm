import { PrivateConfigInterface } from './PrivateConfigInterface';

export const config = {
  automationNamespace: 'automations',
  automationStatesPattern: '',
  functionsNamespace: 'enum.functions',
} as PrivateConfigInterface;

function setVars(): void {
  config.automationStatesPattern = config.automationNamespace + '.*';
}

setVars();
