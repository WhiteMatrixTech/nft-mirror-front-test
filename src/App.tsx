import React from 'react';

import { Header } from './components/Header';

import styles from './App.module.less';
import { Content } from './components/Content';

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <Content />
    </div>
  );
}

export default App;
