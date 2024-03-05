import I18n from '@iobroker/adapter-react-v5/i18n';
import { expect } from 'chai';
import sinon from 'sinon';
import { nameof } from '../../../src/utils/NameOf';
import { Translation } from './Translation';

describe(nameof(Translation), function () {
  it('Should translate key', function () {
    // GIVEN
    sinon.stub(I18n, 't').returns('translated');
    const translation = new Translation();
    // WHEN
    const translated = translation.translate('key');
    // THEN
    expect(translated).to.equal('translated');
  });
});
