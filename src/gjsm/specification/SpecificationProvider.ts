import { DataFormatError } from '../../data_format/DataFormatError';
import { DataFormatInterface } from '../../data_format/DataFormatInterface';
import { StateManagerInterface } from '../../iob/StateManagerInterface';
import { schema } from '../InstructionSchema';
import { ConfigProviderInterface } from '../configuration/ConfigProviderInterface';
import { InstructionSetInterface } from './InstructionSetInterface';
import { SpecificationProviderInterface } from './SpecificationProviderInterface';

export class SpecificationProvider implements SpecificationProviderInterface {
  private _specifications: Array<InstructionSetInterface>;
  private _schema!: object;
  private _stateManager: StateManagerInterface;
  private _configProvider: ConfigProviderInterface;
  private _yaml: DataFormatInterface;
  private _json: DataFormatInterface;
  public constructor(
    configProvider: ConfigProviderInterface,
    stateManager: StateManagerInterface,
    yaml: DataFormatInterface,
    json: DataFormatInterface,
  ) {
    this._stateManager = stateManager;
    this._yaml = yaml;
    this._json = json;
    this._specifications = [];
    this._configProvider = configProvider;

    this.loadSchema();
  }

  public get specifications(): InstructionSetInterface[] {
    return this._specifications;
  }

  public get schema(): object {
    return this._schema;
  }

  public async loadSpecifications(): Promise<void> {
    this._specifications = []; // empty array
    const instructionSetStates = await this._stateManager.getStatesAsync(
      this._configProvider.config.instructionSetStatesPattern,
    );
    try {
      await Promise.all(
        instructionSetStates.map(async (state) => {
          if (this._yaml.hasCorrectDataFormat(state.val)) {
            await this._yaml.validateAgainstSchema(state.val, this._schema);
            const instructionSet = this._yaml.parse(state.val) as InstructionSetInterface;
            this._specifications.push(instructionSet);
          } else if (this._json.hasCorrectDataFormat(state.val)) {
            await this._json.validateAgainstSchema(state.val, this._schema);
            const instructionSet = this._json.parse(state.val) as InstructionSetInterface;
            this._specifications.push(instructionSet);
          } else {
            throw new DataFormatError(`The data format of ${state.id} is not supported`);
          }
        }),
      );
    } catch (error) {
      this._specifications.push({ errors: [(error as Error).message] });
    }
    // validate, set specications
  }

  private loadSchema(): void {
    this._schema = schema;
  }
}
