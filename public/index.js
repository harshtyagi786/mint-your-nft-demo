document.querySelector('.wallet-connect').disabled = false;
var walletButton;

document.addEventListener("DOMContentLoaded", function(event) {
    walletButton = $('#walletButton');

    if(isMetaMaskInstalled()) {
        walletButton.text('Connecting...');
        walletButton.attr('disabled', true);
        walletButton.addClass('inactive-wallet');
        MetaMaskClientConnect();
    }
    else {
        walletButton.text('Install Wallet');
    }
});

function generateNft() {
    //TODO add condition to check balance using npx hardhat check-balance
    if(!walletAddress){
        alert("Please enter valid wallet address")
        return
    }

    resetModal(); //reseting the modal for new process
    $('.progress-modal').addClass('active');
    handleProgress(0, 'Getting Started...')
    setCloseModal(true);
    socket.emit('getStarted', { walletAddress: walletAddress })
}

function getStartedResponse(response={}){
    const { error } = response;

    if(error) {
        return handleError(0, response)
    }

    handleProgress(1, 'Generating Metas...')
    socket.emit('preparingMetadata', { walletAddress: walletAddress })
}

function preparingMetadataResponse(response={}) {
    const { error, transactionHash } = response;

    if(error){
        return handleError(2, response)
    }
    
    handleProgress(2, "Minting NFT's...");
    console.log('Meta deploy transactional hash', transactionHash);

    const nftNumber = parseInt($('#nft_number').val());

    for(let i=0; i<nftNumber; i++) {

        const mintingId = `minting-${i}`;
        console.log('Minting: ', mintingId);

        mintIds.push(mintingId);
        socket.emit('minting', {
            walletAddress: walletAddress,
            mintingId: mintingId
        });

        mintIds = [...new Set(mintIds)];
    }
}

function mintingResponse(response={}){
    const { error, mintedId, message } = response;

    if(!error) {
        //add code for handling multiple minting nft take a total mint variable
        mintIds = [...mintIds.filter(item => item !== mintedId)]
    }
    else {
        console.log('Something went wrong...Error Occured while minting:', mintedId);
        console.log('MESSAGE: ', message);
    }

    if(!mintIds.length) {
        handleProgress(3, `Successfuly minted NFT` );
        setCloseModal(false);
    }
}

function isMetaMaskInstalled() {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
}

function onWalletClick() {
    if(!isMetaMaskInstalled()){
        return window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en', '_blank');
    }
    walletButton.attr('disabled', true);
    walletButton.addClass('inactive-wallet');
    MetaMaskClientConnect();
}

async function MetaMaskClientConnect() {
    try {
        const response = await ethereum.request({ method: 'eth_requestAccounts' });
        walletAddress = response[0];
        walletButton.text('Wallet Connected')
    }
    catch (error) {
        console.error(error);
        alert('Something Went Wrong while connecting to Metamask wallet')
        walletAddress = '';
        walletButton.text('Connect Wallet')
        walletButton.attr('disabled', false);
        walletButton.removeClass('inactive-wallet');
    }
    console.log(walletAddress)
}

function updateValue(value) {
    const currentValue = parseInt($('#number-of-nfts').text());
    const newValue = currentValue + parseInt(value);
    if(newValue > 0 && newValue < 4) {
        $('#number-of-nfts').text(newValue);
    }
}