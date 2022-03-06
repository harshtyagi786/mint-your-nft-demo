var progressBar = $('.circle-container .updated-progres');
var socket=io()
var processCounter = 0;
var closeModal, firstCircle, secondCircle, thirdCircle, fourthCircle, progressStatus;
var mintIds = [];
var walletAddress;

document.addEventListener("DOMContentLoaded", function(event) {

    //Setting variable with element values
    progressStatus = $('#progess-status');
    closeModal = $('.close-modal');
    firstCircle = document.querySelectorAll('.progess-container-circle')[0];
    secondCircle = document.querySelectorAll('.progess-container-circle')[1];
    thirdCircle = document.querySelectorAll('.progess-container-circle')[2];
    fourthCircle = document.querySelectorAll('.progess-container-circle')[3];
});

// make connection with server from user side
socket.on('connect', function(){
    console.log('Connected to Server')
    progressStatus.text('This may take couple of minutes...');
    const isOldProcess = document.querySelector('.progress-modal').classList.value.includes('active');
    if(isOldProcess) {
        switch(processCounter) {
            case 0:
                console.log("CASE 0");
                console.log('----------------Starting again generateNft----------------');
                generateNft();
                break;
            case 1:
                console.log("CASE 1");
                console.log('----------------Starting again getStartedResponse----------------');
                getStartedResponse();
                break;
            case 2:
                console.log("CASE 2");
                console.log('----------------Starting again minting generateNft----------------');

                for(let i = 0; i < mintIds.length; i++){
                    socket.emit('minting', {
                        walletAddress: walletAddress,
                        mintingId: mintIds[i]
                    });
                }
                break;
            default:
                generateNft();
        }
    }
});

socket.on('getStartedResponse', function(response){
    processCounter = 1;
    getStartedResponse(response);
});

socket.on('preparingMetadataResponse', function(response){
    processCounter = 2;
    preparingMetadataResponse(response);
});

socket.on('mintingResponse', function(response){
    processCounter = 3;
    mintingResponse(response);
})

// when disconnected from server
socket.on('disconnect', function(reason){
    console.log('Disconnect from server');
    console.log(reason);
});