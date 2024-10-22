// Importing fs module using CommonJS
const fs = require('fs');

const filepath = '/Users/jamesholcombe/Documents/git/ags-validator/B MONAGS_output_9.ags';

// Define an async function to handle the dynamic import of validateAgsData
async function main() {
    // Dynamically import the validateAgsData function from the ES module
    const { validateAgsData } = await import('../dist/index.js');

    // Read the file
    const data = fs.readFileSync(filepath, 'utf8');

    // Validate the data
    const { errors, parsedAgs } = validateAgsData(data);

    console.log(errors);
}

// Execute the main function
main().catch(err => console.error(err));
