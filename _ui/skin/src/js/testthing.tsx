import React from 'react';
import { render } from 'react-dom';
import TsApp from './ts-components/TsApp';

render(React.createElement(TsApp, null), document.getElementById('ts-app'));
