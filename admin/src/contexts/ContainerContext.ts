import { createContainer } from 'awilix';
import { createContext } from 'react';
import { IocContainerInterface } from '../ioc/IocContainerInterface';

export const ContainerContext = createContext(createContainer<IocContainerInterface>());
