
import { projectsEn, projectsTr } from './projects';
import { servicesEn, servicesTr } from './services';
import { uiEn, uiTr } from './ui';
import { modulesEn, modulesTr } from './modules';

export const translations = {
  en: {
    ...uiEn,
    ...modulesEn,
    services: servicesEn.list,
    servicesPage: servicesEn.page,
    projects: projectsEn
  },
  tr: {
    ...uiTr,
    ...modulesTr,
    services: servicesTr.list,
    servicesPage: servicesTr.page,
    projects: projectsTr
  }
};
