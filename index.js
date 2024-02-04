// version 8.2.4 of inquirer installed, below fs (file system) and inquirer are required into the project
const fs = require('fs');
const inquirer = require('inquirer');

// have created a function for this as i use multiple instances of prompt.questions

function promptQuestions() {
    // inquirer uitilised for question prompts

    inquirer
        .prompt([
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
        ])

        //    if the user does not wish to proceed node will exit the process. if they do- we continue to launch the prompt questions
        .then((answers) => {
            if (!answers.explainDescription) {
                console.log('You have chosen not to proceed, exiting...');
                process.exit();

                // continue the questions if they agree to proceed
            } else {
                inquirer.prompt([
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

                ])
            }
        })
        // if the user is unhappy with the way they answered their description questions, they can opt to restart the 
        // prompts now using the 'redo' confirm question. if they are happy ans answer Y then we proceeed to the
        //  rest of the questions
        .then((answers) => {
            if (!answers.redo) {
                console.log('You have chosen to start over')
                promptQuestions();
            } else {
                inquirer.prompt([
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
                        message: 'List the collaborators and links to their gitHub profiles',
                    },
                    {
                        type: 'input',
                        name: 'license',
                        message: 'Let other developers know what type of license your project is using',
                    },
                ])
                    .then((answers) => {
                        console.log(answers);
                        // Use user feedback for... whatever!!
                    })
                    .catch((error) => {
                        if (error.isTtyError) {
                            // Prompt couldn't be rendered in the current environment
                        } else {
                            // Something else went wrong
                        }
                    });

            }
        })

};
promptQuestions()



