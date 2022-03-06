const store = require("store2");
const { spawnSync } = require('child_process');
const socketIO = require('socket.io');
const path = require("path");
const express = require('express');
const app = express();
const http = require('http');
const exec = require('child_process').exec

app.set("view engine","jade");
app.get('/', function (req, res) {
    res.render('index');
});

app.use(express.static(path.join(__dirname, "public")))

const server = http.createServer(app)
const io = socketIO(server, {
    transport: ['websocket'],
    allowUpgrades: false,
    pingTimeout: 600000,
    upgradeTimeout: 30000,
    maxHttpBufferSize: 100000000,
    autoConnect: true
});

// make a connection with the user from server side
io.on('connection', (socket)=>{
    console.log('New user connected');

    socket.on('getStarted', (data)=>{
        const { walletAddress } = data;

        if(store(`${walletAddress}-getStartedResponse`)) {
            return socket.emit('getStartedResponse', store(`${walletAddress}-getStartedResponse`))
        }

        console.log('Compiling...');
        exec('npx hardhat compile', (err, stdout, stderr) => {
            console.log('Finshed Compiling...');
            if (err) {
                console.log("Error while compiling the code:", stderr);
                socket.emit('getStartedResponse', { message: 'Error while compiling the code', error: true, body: {}});
            } else {
                console.log(stdout.toString())
                console.log('Deploying...');
    
                exec('npx hardhat deploy', (err, stdout, stderr) => {
                    if (err) {
                        console.log("Error while deploying new contract: ", stderr);
                        store(`${walletAddress}-getStartedResponse`, { message: 'Error while deploying new contract', error: true, body: {}});
                        socket.emit('getStartedResponse', { message: 'Error while deploying new contract', error: true, body: {}});
                    } else {
                        
                        console.log('Finished Deploying...');
                        console.log('Status...', stdout.toString());
    
                        const contractAddressRegex = /(Contract deployed to address: [^]*)/;
                        const contractAddress = stdout.toString().match(contractAddressRegex)[1].split(":")[1].trim();
                        process.env.contactAddress = contractAddress;

                        store(`${walletAddress}-getStartedResponse`, { message: "Successfuly deployed the contract...", error: false, contractAddress: contractAddress });
                        console.log("logging----------", store(`${walletAddress}-getStartedResponse`));
                        socket.emit('getStartedResponse', { message: "Successfuly deployed the contract...", error: false, contractAddress: contractAddress });
                    }
                });
            }
        });
    });

    socket.on('preparingMetadata', (data)=>{
        const { walletAddress } = data;
        const metaCarAddress = 'bafybeif6iuokmmcuwj7jgscybx3gvlcwkb6ybspwcduivl7mbqmgmmxubi'; //TODO make it dynamic this is responsible for meta images

        if(store(`${walletAddress}-preparingMetadata`)) {
            return socket.emit('preparingMetadataResponse', store(`${walletAddress}-preparingMetadata`))
        }

        console.log('Preparing MetaCar...')

        response = spawnSync(`npx hardhat set-base-token-uri --base-url "https://${metaCarAddress}.ipfs.dweb.link/metadata/"`, [], {shell: true})
        if(response.error) {
            console.log("Error while generating the metadata:", response.error);
            store(`${walletAddress}-preparingMetadata`,{ message: 'Error while generating the metadata', error: true, body: {}});
            socket.emit('preparingMetadataResponse', { message: 'Error while generating the metadata', error: true, body: {}});
        }

        console.log('Deployed MetaCar...')
        console.log('Status:', response.stdout.toString());

        const metaAddressRegex = /(Transaction Hash: [^]*)/;
        const transactionHash = response.stdout.toString().match(metaAddressRegex)[1].split(":")[1].trim();

        store(`${walletAddress}-preparingMetadata`, { message: "Successfuly deployed the meta...", error: false, transactionHash: transactionHash});

        console.log("logging----------",store("preparingMetadata"));

        socket.emit('preparingMetadataResponse', { message: "Successfuly deployed the meta...", error: false, transactionHash: transactionHash});
    });

    socket.on('minting', (data)=>{
        const { walletAddress, mintingId } = data;

        if(store(`${walletAddress}-${mintingId}`)) {
            return socket.emit('mintingResponse', store(`${walletAddress}-${mintingId}`))
        }

        console.log(`Initiating ${mintingId} minting...`)

        if( !walletAddress ) {
            socket.emit('mintingResponse', { message: 'Error No wallet address provided:', error: true, body: {}});
        }

        response = spawnSync(`npx hardhat mint --address ${walletAddress}`, [], {shell: true})
        if(response.error) {
            console.log("Error while minting:", response.error);
            store(`${walletAddress}-${mintingId}` ,{ message: 'Error while minting the NFT:', error: true, body: {}, mintedId: mintingId});
            socket.emit('mintingResponse', { message: 'Error while minting the NFT:', error: true, body: {}, mintedId: mintingId});
        }

        console.log(`NFT ${ mintingId } minted...`)

        store(`${walletAddress}-${mintingId}` , { message: 'Minted NFT successfuly', error: false, body: { response: 200 }, mintedId: mintingId});
        socket.emit('mintingResponse', { message: 'Minted NFT successfuly', error: false, body: { response: 200 }, mintedId: mintingId});
    })

    socket.on('disconnect', (reason)=>{
        console.log('disconnected from user');
        console.log(reason)
    });
});

server.listen(process.env.PORT || 5000, function () {
    console.log('Node server is running on port 5000..');
    console.log('http://localhost:5000');
});