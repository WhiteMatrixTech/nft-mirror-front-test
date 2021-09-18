import React from 'react';
import cn from 'classnames';

import styles from './Header.module.less';

interface HeaderProps {
  className?: string;
}

export function Header(props: HeaderProps) {
  const { className } = props;

  return <h1 className={cn(className, styles.Header)}>Header</h1>;
}
