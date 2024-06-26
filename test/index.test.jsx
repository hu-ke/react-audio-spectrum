import React from 'react';
import { shallow } from 'enzyme';
import ReactAudioSpectrum from '../src/index';
import '../src/index.scss';

it('renders', () => {
  const wrapper = shallow(<ReactAudioSpectrum />);
  expect(wrapper.find('.ReactAudioSpectrum').length).toBe(1);
});
