import React from 'react';
import { render } from 'react-dom';
import TsApp from './ts-components/TsApp';

render(<TsApp test="okay" whowhat={5} />, document.getElementById('ts-app'));
