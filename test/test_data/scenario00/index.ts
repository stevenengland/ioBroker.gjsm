import { readTestObjectsFromDir, readTestStatesFromDir } from '../../integration_tests/TestTools';

export const iobObjects = readTestObjectsFromDir(__dirname);
export const iobStates = readTestStatesFromDir(__dirname);
