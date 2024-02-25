import { Command } from './Command';
import { CommandResultInterface } from './CommandResultInterface';

export interface CommandProcessorInterface {
  processCommand(command: Command): Promise<CommandResultInterface>;
}
