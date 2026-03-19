import React from 'react';
import style from './index.module.scss';
import { ClipLoader } from 'react-spinners';
import { useSelector } from 'react-redux';

const PageLoader = ({ color = '#000', size = 50, sx }) => {
  const loading = useSelector((state) => state.loader.loading);

  if (!loading) return null;

  return (
    <div className={style['loader-wrap']} style={sx}>
      <ClipLoader
        color={color}
        size={size}
      />
    </div>
  );
};

export default PageLoader;