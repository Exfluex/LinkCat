import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {store} from './store/store'
import App from './app/app';
import { ChakraProvider } from '@chakra-ui/react';
import 'react-complex-tree/lib/style.css';
ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <ChakraProvider>
    <App />
    </ChakraProvider>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);
