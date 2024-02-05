// version 8.2.4 of inquirer installed, below fs (file system) and inquirer are required into the project
const fs = require('fs');
const inquirer = require('inquirer');

// have created an async function to avoid errors with multiple instances of prompt.questions/then. 
// also utilising try and catch for error handling
// have used separate instances of prmpt with async in order to allow for exit of process if answered incorrectly etc

async function promptQuestions() {
    try {

        // first round of questions
        const firstAnswers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the project title?',
            },
            {
                type: 'confirm',
                name: 'explainDescription',
                message: 'Next, I will ask you a series of questions to help write the project description. \n Try to delve deeper with each new question asked, otherwise leave it blank.\n Are you ready?',
            },
        ]);

        //    if the user does not wish to proceed node will exit the process. if they do- we continue to launch the prompt questions. if used instead of then in async function structure
        if (!firstAnswers.explainDescription) {
            console.log('You have chosen not to proceed, exiting...');
            process.exit();
        }
        // continue to second set of questions if proceeding has been selected
        const secondAnswers = await inquirer.prompt([
            {
                type: 'input',
                name: 'motivationDescription',
                message: 'What was your motivation?',
            },
            {
                type: 'input',
                name: 'whyDescription',
                message: 'Why did you build this project?',
            },
            {
                type: 'input',
                name: 'problemDescription',
                message: 'What problem does this project solve?',
            },
            {
                type: 'input',
                name: 'learnDescription',
                message: 'What did you learn?',
            },
            {
                type: 'confirm',
                name: 'redo',
                message: 'Nice! If you are happy with your description proceed Y, \n if you would like to start again before proceeding enter N.',
            },

        ]);

        // if the user is unhappy with the way they answered their description questions, they can opt to restart the 
        // prompts now using the 'redo' confirm question. if they are happy (answer Y) then we proceeed to the
        //  rest of the questions. using if statement instead of .then in await async function
        if (!secondAnswers.redo) {
            console.log('You have chosen to start over')
            // recursive call to begin again, discarding previous user input
            // using return before a recursive call (here) ensures that the flow of process is stopped following this
            // this makes the exit of this code explicit and prevents further execution of the following code
            return promptQuestions();

        }
        const thirdAnswers = await inquirer.prompt([
            {
                type: 'input',
                name: 'technologies',
                message: 'What programs or technologies did you use to create this application? \n !IMPORTANT Separate each with a comma (,) Include coding languages and programs ie. HTML, Javascript, VS Code,',
            },
            {
                type: 'input',
                name: 'installation',
                message: 'Provide a step by step "installation" guide outlining how to get your \n application running',
            },
            {
                type: 'input',
                name: 'usage',
                message: 'How do your users use this application? Provide instrucions and examples for use',
            },
            {
                type: 'input',
                name: 'roadmap',
                message: 'Outline improvements that are intended for future versions, issues that are to be fixed or future projections for this application',
            },
            {
                type: 'input',
                name: 'support',
                message: 'Enter the best contact details if a user comes into any issues with the web application',
            },
            {
                type: 'input',
                name: 'credits',
                message: 'List the collaborators and links to their gitHub profiles \n !IMPORTANT, format each collaborater as follows [Name] (https://www.yourlink.com),\n note each name is within a square bracket [], each link is within brackets() and each entry ends with a comma ,',
            },
            {
                type: 'input',
                name: 'license',
                message: 'Let other developers know what type of license your project is using',
            },
        ]);
        //    calling my markdown foramtting function in order to utilise it's returned content. write file required a string in order to write a file- and not a function
        const fileContent = markdownFormat(firstAnswers, secondAnswers, thirdAnswers);

        fs.writeFile('README.md', fileContent, err => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Congrats! Your ReadMe file can be found labeled myREADME.md, please check for errors and update within the file itself.')
        });

        // error handling catch from try block
    } catch (error) {
        if (error.isTtyError) {
            console.log("Prompt couldn't be rendered in the current environment")
        } else {
            console.log("An error has occured, please try again", error);
        }
    }
};

// This function transforms our user data into the required markdown language for the readme file, taking in all sections of answers
// this function is defined outside of the prompt function, and is called within the try block of the prompt questions function. 
// this means that we are not nesting unneccessary functions and can utilise this again if required.
function markdownFormat(firstAnswers, secondAnswers, thirdAnswers) {

    // Here we are formatting our technologies into a markdown list. 
    // As requested, our user has separated each technology with a comma and we use split() to transform these into an array
    const techList = thirdAnswers.technologies.split(',');
    // using map() we take each array item, add a markdown list '-' and then join the array into a string, seperating each item with a line break (\n)
    const techFormat = techList.map(item => `-${item.trim()}`).join('\n');

    // using split method on collaborators, have requested formatting from user entry
    const creditsList = thirdAnswers.credits.split(',');
    const creditsFormat = creditsList.join('\n');

    // we are using a template literal to create an entirely formated object with all of our user input concatenated into markdown for our ReadMe
    // Under Technologies we use our variables created for 'technologies' in the markdown list format we created    
    return `
# ${firstAnswers.title}
        
## Description

Motivation: ${secondAnswers.motivationDescription} \n
The Why: ${secondAnswers.whyDescription} \n
Problem Solved:${secondAnswers.problemDescription} \n
Lessons: ${secondAnswers.learnDescription} \n

## Technologies 

${techFormat}

## Installation

${thirdAnswers.installation}

## Usage

${thirdAnswers.usage}

## Roadmap

${thirdAnswers.roadmap}

## Support

${creditsFormat}

## License
        
${thirdAnswers.license}

`;}


promptQuestions();





