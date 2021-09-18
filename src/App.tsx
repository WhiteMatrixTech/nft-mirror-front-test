import React from 'react';

import styles from './App.module.less';
import { Content } from './components/Content';

function App() {
  return (
    <div className={styles.app}>
      <Content />
    </div>
  );
}

export default App;
