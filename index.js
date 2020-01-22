import { Builder, By, Key, until, promise } from 'selenium-webdriver';
const SECOND = 1000;
const driver = new Builder().withCapabilities({ browserName: 'chrome', chromeOptions: { w3c: false } }).build();
const wait = (delay, ...args) => new Promise(resolve => setTimeout(resolve, delay, ...args));

const username = "email@email.com";
const password = "senha";

const searchTerm = "react".replace( " ", "%20" );
const searchArea = "inglaterra".replace( " ", "%20" );

let totalApplied = 0;

const insertFieldById = async ( id, value ) => {
    await driver.wait( until.elementsLocated( By.id( id ) ), 20 * SECOND );

    const field = driver.findElement( By.id( id ) );

    await field.clear();
    await wait( 1 * SECOND );
    await field.sendKeys( value );
}

const hideById = ( id ) => {
    driver.executeScript(`document.querySelector('#${id}').setAttribute('style', 'display: none')`);
}

const loginPage = async () => {
    await insertFieldById( "username", username );

    await insertFieldById( "password", password );

    const passwordField = driver.findElement( By.id( "password" ) );

    await wait( 2 * SECOND );
    await passwordField.submit();
}

const jobsList = async () => {
    await driver.wait( until.elementsLocated( By.className( "artdeco-pagination__pages" ) ), 20 * SECOND );
    const pages = await driver.findElement( By.className( "artdeco-pagination__pages" ) ).findElements( By.tagName( "li" ) );
    
    for( let j = 1; j <= pages.length ; j++ ){
        await wait( 2 * SECOND );
        hideById( "msg-overlay" );
        await driver.wait( until.elementsLocated( By.className( "jobs-search-results__list" ) ), 20 * SECOND );
        const jobs = await driver.findElement( By.className( "jobs-search-results__list" ) ).findElements( By.tagName( "li" ) );
        for( let i = 0; i < jobs.length ; i++ ){
            await wait( 1 * SECOND );
            const job = await jobs[i].findElements( By.className( "job-card-search__title" ) );
            if( job.length !== 0 ){
                job[0].click();
                await wait( 2 * SECOND );
                const alreadyApplied = await driver.findElements( By.className( "jobs-s-apply__applied-date" ) );
                if( alreadyApplied.length === 0 ){
                    console.log("Aplicando vaga...")
                    await wait( 2 * SECOND );
                    await driver.wait( until.elementsLocated( By.className( "jobs-apply-button" ) ), 20 * SECOND );
                    await driver.findElement( By.className( "jobs-apply-button" ) ).click();
                    await wait( 1 * SECOND );
                    await driver.wait( until.elementsLocated( By.className( "jobs-easy-apply-footer__actions" ) ), 20 * SECOND );
                    const progressBar = await driver.findElements( By.className( "jobs-easy-apply-content__progress-bar" ) );
                    if( progressBar.length === 0 ){ 
                        const applyButton = await driver.findElement( By.className( "jobs-easy-apply-footer__actions" ) ).findElement( By.tagName( "button" ) );
                        applyButton.click();
                        job[0].findElement( By.tagName( "a" ) ).getText().then( jobName => console.log( `Vaga aplicada para ${jobName}` ) );
                        await wait( 2 * SECOND );
                        totalApplied++;
                    } else {
                        console.log( "Pulando vaga, existem muitas etapas para poder aplicar" );
                        driver.findElement( By.className( "artdeco-modal__dismiss" ) ).click();
                        await driver.wait( until.elementsLocated( By.className( "artdeco-modal__actionbar" ) ), 20 * SECOND );
                        const cancelButton = await driver.findElement( By.className( "artdeco-modal__actionbar" ) ).findElements( By.tagName( "button" ) );
                        cancelButton[1].click();
                        await wait( 1 * SECOND );
                    }
                } else {
                    console.log("Vaga já aplicada!");
                }
            } 
        } 

        if ( j < pages.length ) {
            await wait( 1 * SECOND );
            console.log("Indo para proxima página!");
            pages[j].click();
            await wait( 2 * SECOND );
        }

    }

      
}


const start = async () => {
    driver.get("https://www.linkedin.com/");
    driver.findElement( By.className( "nav__button-secondary" ) ).click();

    await loginPage();

    await wait( 3 * SECOND );
    await driver.get(`https://www.linkedin.com/jobs/search/?f_LF=f_AL&keywords=${searchTerm}&location=${searchArea}`);

    await wait( 2 * SECOND );

    await jobsList();

    console.log(`Finalizado. Aplicado para ${totalApplied} vaga(s)!`)
   
}


start();