import { IocContainerInterface } from '../ioc/IocContainerInterface';
import { useContainer } from './useContainer';

export const useInject = <T>(identifier: keyof IocContainerInterface): T => {
  const container = useContainer();
  return container.resolve<T>(identifier);
};
