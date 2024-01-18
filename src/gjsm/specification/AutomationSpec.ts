import { AutomationInterface } from './AutomationInterface';
import { AutomationSpecInterface } from './AutomationSpecInterface';

export class AutomationSpec implements AutomationSpecInterface {
  // [key: string]: unknown; // Add index signature

  public id?: string;
  public errors?: string[];
  public automations?: AutomationInterface[];

  public constructor(init?: Partial<AutomationSpecInterface>) {
    // for (const [key, value] of Object.entries(init ?? {})) {
    //   if (this[key]) {
    //     this[key] = value;
    //   }
    // }
    Object.assign(this, init);
  }
}
