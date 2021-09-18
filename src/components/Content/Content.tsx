import React from 'react';
import { useQuery } from 'react-query';
import cn from 'classnames';

import styles from './Content.module.less';
import { getWeather } from '../../service/weather';

interface ContentProps {
  className?: string;
}

export function Content(props: ContentProps) {
  const { className } = props;

  const { data, isLoading, isError } = useQuery('getWeather', getWeather);

  return (
    <div className={cn(styles.Content, className)}>
      {!isLoading && data?.city}
    </div>
  );
}
