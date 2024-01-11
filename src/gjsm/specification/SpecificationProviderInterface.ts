import { InstructionSetInterface } from './InstructionSetInterface';

export interface SpecificationProviderInterface {
  specifications: Array<InstructionSetInterface>;
  schema: object;
  loadSpecifications(): Promise<void>;
}
