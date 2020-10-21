const puppeteer = require("puppeteer");
const username = "email@email.com";
const password = "senha";

const searchTerm = "react".replace(" ", "%20");
const searchArea = "inglaterra".replace(" ", "%20");

let totalApplied = 0;

const insertFieldById = async (id, value, page) => {
    await page.waitForSelector('input[id=' + id + ']');
    await page.type('input[id=' + id + ']', value);
    await page.click('[class="btn__primary--large from__button--floating mercado-button--primary"]');
}

const loginPage = async (page) => {
    await insertFieldById("username", username, page);
    await insertFieldById("password", password, page);
}

const jobsList = async (page) => {
//check for joblist
}

const start = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.linkedin.com/");
    await page.click('[class="nav__button-secondary"]');
    await loginPage(page);
    await page.goto(`https://www.linkedin.com/jobs/search/?f_LF=f_AL&keywords=${searchTerm}&location=${searchArea}&sortBy=DD`);
    await jobsList();
    console.log(`Finalizado. Aplicado para ${totalApplied} vaga(s)!`)
    await browser.close();
}

start();