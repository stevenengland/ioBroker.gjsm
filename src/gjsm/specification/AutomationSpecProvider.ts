import { DataFormatError } from '../../data_format/DataFormatError';
import { DataFormatInterface } from '../../data_format/DataFormatInterface';
import { ObjectClientInterface } from '../../iob/ObjectClientInterface';
import { ConfigProviderInterface } from '../configuration/ConfigProviderInterface';
import { AutomationSpecInterface } from './AutomationSpecInterface';
import { AutomationSpecProviderInterface } from './AutomationSpecProviderInterface';
import { schema } from './AutomationSpecSchema';

export class AutomationSpecProvider implements AutomationSpecProviderInterface {
  private _specifications: Array<AutomationSpecInterface>;
  private _schema!: object;
  private readonly _objectClient: ObjectClientInterface;
  private readonly _configProvider: ConfigProviderInterface;
  private readonly _yaml: DataFormatInterface;
  private readonly _json: DataFormatInterface;
  public constructor(
    configProvider: ConfigProviderInterface,
    objectClient: ObjectClientInterface,
    yaml: DataFormatInterface,
    json: DataFormatInterface,
  ) {
    this._objectClient = objectClient;
    this._yaml = yaml;
    this._json = json;
    this._specifications = [];
    this._configProvider = configProvider;

    this.loadSchema();
  }

  public get specifications(): AutomationSpecInterface[] {
    return this._specifications;
  }

  public get schema(): object {
    return this._schema;
  }

  public async loadSpecifications(): Promise<void> {
    this._specifications = []; // empty array
    const instructionSetStates = await this._objectClient.getStatesAsync(
      this._configProvider.config.automationStatesPattern,
    );
    await Promise.all(
      instructionSetStates.map(async (state) => {
        // Check JSON first because it is more strict than YAML
        try {
          if (this._json.hasCorrectDataFormat(state.val)) {
            await this._json.validateAgainstSchema(state.val, this._schema);
            const automationSpec = this._json.parse(state.val) as AutomationSpecInterface;
            automationSpec.id = state.id;
            this._specifications.push(automationSpec);
          } else if (this._yaml.hasCorrectDataFormat(state.val)) {
            await this._yaml.validateAgainstSchema(state.val, this._schema);
            const automationSpec = this._yaml.parse(state.val) as AutomationSpecInterface;
            automationSpec.id = state.id;
            this._specifications.push(automationSpec);
          } else {
            throw new DataFormatError(`The data format of ${state.id} is not supported`);
          }
        } catch (error) {
          this.specifications.push({ id: state.id, errors: [(error as Error).message] });
        }
      }),
    );
    // validate, set specications
  }

  private loadSchema(): void {
    this._schema = schema;
  }
}
