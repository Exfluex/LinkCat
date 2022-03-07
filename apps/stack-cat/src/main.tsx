import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import {ChakraProvider} from '@chakra-ui/react'
import App from './app/app';

ReactDOM.render(
  <StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
  </StrictMode>,
  document.getElementById('root')
);
