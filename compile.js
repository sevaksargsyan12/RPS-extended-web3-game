const fs = require('fs');
const solc = require('solc');
const fsPromises = fs.promises;

(async function(force) {
    const compiledExists = fs.existsSync('./contracts/RPS.json')

    // if (!force && compiledExists) {
    //     return;
    // } else
    if (compiledExists) {
        await fsPromises.rm('./contracts/RPS.json');
    }
    // Load the contract source code
    const sourceCode = await fsPromises.readFile('./contracts/RPS.sol', 'utf8');
    console.log(sourceCode);
    // Compile the source code and retrieve the ABI and Bytecode
    const { abi, bytecode } = compile(sourceCode, 'RPS');
    // Store the ABI and Bytecode into a JSON file
    const artifact = JSON.stringify({ abi, bytecode }, null, 2);
    await fs.writeFile('./contracts/RPS.json', artifact);
})()

function compile(sourceCode, contractName) {
    // Create the Solidity Compiler Standard Input and Output JSON
    const input = {
        language: "Solidity",
        sources: { main: { content: sourceCode } },
        settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
    };
    // Parse the compiler output to retrieve the ABI and Bytecode
    const output = solc.compile(JSON.stringify(input));
    console.log(output);
    const artifact = JSON.parse(output).contracts.main[contractName];
    return {
        abi: artifact.abi,
        bytecode: artifact.evm.bytecode.object,
    };
}
