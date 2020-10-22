import { SECOND } from './constants';

export function waitSeconds(delay, ...args) {
  return new Promise((resolve) => setTimeout(resolve, delay * SECOND, ...args));
}

export function hideById(driver, id) {
  driver.executeScript(`document.querySelector('#${id}').setAttribute('style', 'display: none')`);
}
