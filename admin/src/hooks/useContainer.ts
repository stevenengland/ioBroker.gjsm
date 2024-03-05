import { useContext } from 'react';
import { ContainerContext } from '../contexts/ContainerContext';

export const useContainer = () => {
  const container = useContext(ContainerContext);
  return container;
};
