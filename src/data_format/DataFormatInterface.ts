import { DataFormatParserInterface } from './DataFormatParserInterface';
import { DataFormatValidatorInterface } from './DataFormatValidatorInterface';

export interface DataFormatInterface extends DataFormatParserInterface, DataFormatValidatorInterface {}
