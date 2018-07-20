import router from '@curveball/router';
import redirectTest from './controller/redirect-test';
import redirectTestHome from './controller/redirect-test-home';
import redirectTestForm from './controller/redirect-test-form';
import home from './controller/home';
import testingHome from './controller/testing-home';
import testingMarkDown from './controller/testing-markdown';
import testingCsv from './controller/testing-csv';

const routes = [
  router('/redirect-test/', redirectTestHome),
  router('/redirect-test/:status', redirectTest),
  router('/redirect-test/:status/form', redirectTestForm),
  router('/').get(home),
  router('/testing').get(testingHome),
  router('/testing/markdown').get(testingMarkDown),
  router('/testing/csv').get(testingCsv)
];

export default routes;
