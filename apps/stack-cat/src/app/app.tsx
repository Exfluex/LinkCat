// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import NxWelcome from './nx-welcome';
import { MainPage } from './page/main';

export function App() {
  return (
    <MainPage app={"nope"}/>
  );
}

export default App;
