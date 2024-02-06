// version 8.2.4 of inquirer installed, below fs (file system) and inquirer are required into the project
const fs = require('fs');
const inquirer = require('inquirer');
const { makeBadge, ValidationError } = require('badge-maker')

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
                type: 'list',
                name: 'license',
                message: 'Choose a license for this application',
                choices: [
                    'Apache License 2.0',
                    'GNU General Public License v3.0',
                    'MIT License',
                    'BSD 2-Clause "Simplified" License',
                    'BSD 3-Clause "New" or "Revised" License',
                    'Boost Software License 1.0',
                    'Creative Commons Zero v1.0 Universal',
                    'Eclipse Public License 2.0',
                    'GNU Affero General Public Licnese v3.0',
                    'GNU General Public License v2.0',
                    'GNU Lesser General Public License v2.1',
                    'Mozilla Public License 2.0',
                    'The Unlicense',
                ]
            },
            {
                type: 'input',
                name: 'tests',
                message: 'Have you written any tests for this code? If so include instrcutions here. If not just write "n/a" \n If you wish to include a link to the file use [Name] (./link) structure',
            },
        ]);

        // Once all inputs are collected, generate the badge for the license input (async)
        const badgePath = await badgeGenerate(thirdAnswers); // Ensure badgeGenerate is awaited
        //    calling my markdown foramtting function in order to utilise it's returned content. write file required a string in order to write a file- and not a function
        const fileContent = markdownFormat(firstAnswers, secondAnswers, thirdAnswers, badgePath);

try{
        await fs.promises.writeFile('README.md', fileContent);
        console.log('Congrats! Your ReadMe file can be found labeled myREADME.md, please check for errors and update within the file itself.')
}catch (err) {
console.error('error writing readme', err);           
        };

        // error handling catch from try block
    } catch (error) {
        if (error.isTtyError) {
            console.log("Prompt couldn't be rendered in the current environment")
        } else {
            console.log("An error has occured, please try again", error);
        }
    }
};

// creating a function that uses the response from teh license list inquirer prompt in order to gain the abbreviation for the licenses optioned.
function licenseName(fullName) {
    const fullToShort = {
        'Apache License 2.0': 'Apache-2.0',
        'GNU General Public License v3.0': 'GPL-3.0',
        'MIT License': 'MIT',
        'BSD 2-Clause "Simplified" License': 'BSD-2-Clause',
        'BSD 3-Clause "New" or "Revised" License': 'BSD-3-Clause',
        'Boost Software License 1.0': 'BSL-1.0',
        'Creative Commons Zero v1.0 Universal': 'CC0-1.0',
        'Eclipse Public License 2.0': 'EPL-2.0',
        'GNU Affero General Public License v3.0': 'AGPL-3.0',
        'GNU General Public License v2.0': 'GPL-2.0',
        'GNU Lesser General Public License v2.1': 'LGPL-2.1',
        'Mozilla Public License 2.0': 'MPL-2.0',
        'The Unlicense': 'Unlicense',
    };

    if (fullToShort.hasOwnProperty(fullName)) {
        return fullToShort[fullName];
    } else {
        return fullName;
    }

};

//function to generate the badge for the license using the badge-maker npm
async function badgeGenerate(thirdAnswers) {
    //running function to get the abbreviation for our chosen license, passing in the user input from thirdAsnwers.license
    const licenseCode = licenseName(thirdAnswers.license)

    // method for badge construction from badge-maker
    const format = {
        label: 'License',
        message: licenseCode, //using the variable that runs the abbreviaion function as the message input
        color: 'brightgreen',
        style: 'flat',
    }

    //creates the badge
    const svg = makeBadge(format);
    const outputFile = 'license-badge.svg';
    const outputPath = path.join(__dirname, outputFile);

    return fs.writeFile(outputPath, svg)
        .then(() => outputPath)
        .catch(err => {
            console.error("Error writing badge to file", err);
            throw err;
        });
}



// This function transforms our user data into the required markdown language for the readme file, taking in all sections of answers
// this function is defined outside of the prompt function, and is called within the try block of the prompt questions function. 
// this means that we are not nesting unneccessary functions and can utilise this again if required.
function markdownFormat(firstAnswers, secondAnswers, thirdAnswers) {

    // Here we are formatting our technologies into a markdown list. 
    // As requested, our user has separated each technology with a comma and we use split() to transform these into an array
    const techList = thirdAnswers.technologies.split(',');
    // using map() we take each array item, add a markdown list '-' and then join the array into a string, seperating each item with a line break (\n)
    const techFormat = techList.map(item => `- ${item.trim()}`).join('\n');

    // using split method on collaborators, have requested formatting from user entry
    const creditsList = thirdAnswers.credits.split(',');
    const creditsFormat = creditsList.join('\n');

    // we are using a template literal to create an entirely formated object with all of our user input concatenated into markdown for our ReadMe
    // Under Technologies we use our variables created for 'technologies' in the markdown list format we created    
    return `
# ${firstAnswers.title}
![License Badge] (${badgePath})
        
## Description

**Motivation:** ${secondAnswers.motivationDescription} \n
**The Why:** ${secondAnswers.whyDescription} \n
**Problem Solved:** ${secondAnswers.problemDescription} \n
**Lessons:** ${secondAnswers.learnDescription} \n

## Table of Contents

> 1. Technologies
>
> 2. Installation
>
> 3. Usage 
>
> 4. Roadmap 
>
> 5. Support
> 
> 6. License
>
> 7. Tests 

## Technologies

${techFormat}

## Installation

${thirdAnswers.installation}

## Usage

${thirdAnswers.usage}

## Roadmap

${thirdAnswers.roadmap}

## Support

${thirdAnswers.support}

## Credits

${creditsFormat}

## License
        
${thirdAnswers.license}

## Tests
${thirdAnswers.tests}

`;
}


promptQuestions();





