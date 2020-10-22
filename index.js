/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import {
  Builder, By, until,
} from 'selenium-webdriver';

import {
  SECOND, password, searchArea, searchTerm, username,
} from './constants';

import {
  waitSeconds, hideById,
} from './util';

const driver = new Builder().withCapabilities({
  browserName: 'chrome',
  chromeOptions: {
    w3c: false,
  },
}).build();

function waitUntilElementLocated(className, delay) {
  driver.wait(until.elementsLocated(By.className(className), delay));
};

function findElementByClassName(className) {
  driver.findElement(By.className(className))
}

let totalApplied = 0;

async function insertFieldById(id, value) {
  await driver.wait(until.elementsLocated(By.id(id)), 20 * SECOND);

  const field = driver.findElement(By.id(id));

  await field.clear();
  await waitSeconds(1);
  await field.sendKeys(value);
}

async function loginPage() {
  await insertFieldById('username', username);

  await insertFieldById('password', password);

  const passwordField = driver.findElement(By.id('password'));

  await waitSeconds(2);
  await passwordField.submit();
}

async function applyToJobs(pages) {
  for (const j in pages) {
    await waitSeconds(2);

    hideById('msg-overlay');

    await waitUntilElementLocated('jobs-search-results__list', 20 * SECOND);

    const jobs = await findElementByClassName('jobs-search-results__list').findElements(By.tagName('li'));

    for (const i in jobs) {
      await waitSeconds(1);

      const job = await jobs[i].findElements(By.className('job-card-search__title'));

      if (job.length !== 0) {
        job[0].click();
        await waitSeconds(2);

        const alreadyApplied = await driver.findElements(By.className('jobs-s-apply__applied-date'));

        if (alreadyApplied.length === 0) {
          console.log('Aplicando vaga...');

          await waitSeconds(2);

          await waitUntilElementLocated('jobs-apply-button', 20 * SECOND);
          await findElementByClassName('jobs-apply-button').click();

          await waitSeconds(1);

          await waitUntilElementLocated('jobs-easy-apply-footer__actions', 20 * SECOND);

          const progressBar = await driver.findElements(By.className('jobs-easy-apply-content__progress-bar'));

          if (progressBar.length === 0) {
            const applyButton = await findElementByClassName('jobs-easy-apply-footer__actions')).findElement(By.tagName('button'));

            applyButton.click();

            job[0].findElement(By.tagName('a')).getText().then((jobName) => console.log(`Vaga aplicada para ${jobName}`));

            await waitSeconds(2);

            totalApplied++;
          } else {
            console.log('Pulando vaga, existem muitas etapas para poder aplicar');

            findElementByClassName('artdeco-modal__dismiss').click();

            await waitUntilElementLocated('artdeco-modal__actionbar', 20 * SECOND);

            const cancelButton = await findElementByClassName('artdeco-modal__actionbar').findElements(By.tagName('button'));

            cancelButton[1].click();

            await waitSeconds(1);
          }
        } else {
          console.log('Vaga já aplicada!');
        }
      }
    }

    if (j < pages.length) {
      await waitSeconds(1);
      console.log('Indo para proxima página!');
      pages[j].click();
      await waitSeconds(2);
    }
  }
}

async function jobsList() {
  await waitUntilElementLocated('artdeco-pagination__pages', 20 * SECOND);

  let pages = new Array(1);
  const pagesList = await driver.findElements(By.className('artdeco-pagination__pages'));

  if (pagesList.length !== 0) {
    pages = await pagesList[0].findElements(By.tagName('li'));
  }

  await applyToJobs(pages);
}

async function start() {
  driver.get('https://www.linkedin.com/');
  
  findElementByClassName('nav__button-secondary').click();

  await loginPage();

  await waitSeconds(3);
  await driver.get(`https://www.linkedin.com/jobs/search/?f_LF=f_AL&keywords=${searchTerm}&location=${searchArea}&sortBy=DD`);

  await waitSeconds(2);

  await jobsList();

  console.log(`Finalizado. Aplicado para ${totalApplied} vaga(s)!`);
}

setImmediate(() => {
  start();
});
