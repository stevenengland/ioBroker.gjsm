import { expect } from 'chai';
import sinon from 'sinon';
import { nameof } from '../../utils/NameOf';
import { InsctructionFactory } from '../specification/instructions/Instruction.Factory.test';
import { AutomationRepository } from './AutomationRepository';

describe(nameof(AutomationRepository), () => {
  let sut: AutomationRepository;

  beforeEach(() => {
    sut = new AutomationRepository();
  });

  afterEach(() => {
    sinon.reset();
  });

  describe(
    nameof<AutomationRepository>((a) => a.addAutomations),
    () => {
      it(`Should add an item to the repository`, () => {
        // GIVEN
        sut.addAutomations('test', [InsctructionFactory.createMapValueInstruction()]);
        // WHEN
        const result = sut.getAutomations('test');
        // THEN
        expect(result).to.not.be.empty;
      });
      it(`Should append an item to the repository`, () => {
        // GIVEN
        sut.addAutomations('test', [InsctructionFactory.createMapValueInstruction()]);
        sut.addAutomations('test', [InsctructionFactory.createMapValueInstruction()]);
        // WHEN
        const result = sut.getAutomations('test');
        // THEN
        expect(result.length).to.equal(2);
      });
    },
  );
  describe(
    nameof<AutomationRepository>((a) => a.getAutomations),
    () => {
      it(`Should return empty result if repository has no items for key`, () => {
        // GIVEN
        // WHEN
        const result = sut.getAutomations('test');
        // THEN
        expect(result).to.be.empty;
      });
    },
  );
  describe(
    nameof<AutomationRepository>((a) => a.deleteAllAutomations),
    () => {
      it(`Should delete all automations`, () => {
        // GIVEN
        sut.addAutomations('test', [InsctructionFactory.createMapValueInstruction()]);
        sut.addAutomations('test', [InsctructionFactory.createMapValueInstruction()]);
        // WHEN
        const resultBefore = sut.getAutomations('test');
        sut.deleteAllAutomations();
        const resultAfter = sut.getAutomations('test');
        // THEN
        expect(resultBefore.length).to.equal(2);
        expect(resultAfter.length).to.equal(0);
      });
    },
  );
});
