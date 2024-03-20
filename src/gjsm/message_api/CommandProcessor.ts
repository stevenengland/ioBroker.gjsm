import { ObjectClientInterface } from '../../iob/ObjectClientInterface';
import { ConfigProviderInterface } from '../configuration/ConfigProviderInterface';
import { Command } from './Command';
import { CommandProcessorInterface } from './CommandProcessorInterface';
import { CommandResultInterface } from './CommandResultInterface';

export class CommandProcessor implements CommandProcessorInterface {
  private readonly _objectClient: ObjectClientInterface;
  private readonly _configProvider: ConfigProviderInterface;

  public constructor(objectClient: ObjectClientInterface, configProvider: ConfigProviderInterface) {
    this._objectClient = objectClient;
    this._configProvider = configProvider;
  }

  public async processCommand(command: Command): Promise<CommandResultInterface> {
    const result = { payload: null } as CommandResultInterface;
    // No try/catch here, error is for business errors only
    switch (command) {
      case Command.getAutomationNames:
        result.payload = await this.getAutomationNames();
        break;
      case Command.getAutomations:
        result.payload = await this.getAutomations();
        break;
    }

    return result;
  }

  private async getAutomationNames(): Promise<string[]> {
    const instructionSetStates = await this._objectClient.getStatesAsync(
      this._configProvider.config.automationStatesPattern,
    );
    return instructionSetStates.map((state) => this._objectClient.getStateName(state.id));
  }

  private async getAutomations(): Promise<Record<string, string>> {
    const instructionSetStates = await this._objectClient.getStatesAsync(
      this._configProvider.config.automationStatesPattern,
    );
    const automations = {} as Record<string, string>;
    for (const state of instructionSetStates) {
      automations[state.id] = state.val as string;
    }
    return automations;
  }
}
