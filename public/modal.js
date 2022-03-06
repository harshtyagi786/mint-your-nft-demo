//-------------Modal Handling Methods-------------

function resetModal() {
    setCloseModal(false)
    progressBar.css('width', '0%');
    progressStatus.text('Getting Started...');
    $('.progess-container-circle').removeClass('un-successful successful animate');
}

function closeProgessModal() {
    $('.progress-modal').removeClass('active');
}

function setCloseModal(Status) {
    Status
    ? closeModal.addClass('disable-close')
    : closeModal.removeClass('disable-close')

    closeModal.attr('disabled', Status);
}

//-------------Progress and Error Handling Methods-------------

function handleError(progressStep, res = {}) {
    console.log('Error Occured');
    const progressCirlce = document.querySelectorAll('.progess-container-circle');
    resetModal();
    progressCirlce.forEach((ele, index) => {
        if(index >= progressStep){
            ele.classList.add('un-successful')
        }
        else {
            ele.classList.add('successful')
        }
    });

    const { message } = res;
    const outputText = message || 'Something Went Wrong...Please Try Again';
    progressStatus.text(outputText);
    setCloseModal(false);
}

function handleProgress(progressStep, progressText = '') {
    console.log('Updating progress...');
    const progressCirlce = document.querySelectorAll('.progess-container-circle');
    resetModal();
    setCloseModal(false);
    progressCirlce.forEach((ele, index) => {
        if(index <= progressStep){
            ele.classList.add('successful')
        }
    });

    progressStep != 0 && progressBar.css('width', `${(progressStep+1)*20}%`);
    progressStatus.text(progressText);

    if(progressStep < 3) {
        progressCirlce[progressStep].classList.add('animate');
    }
    else {
        setCloseModal(false);
        const stepsToCheckNFT = `<ol>
            <li>To See Your NFTs Go To Open Sea Test Network. <a href='https://testnets.opensea.io/' target='_blank'>click here</a></li>
            <li>Make Sure To Connect Your Meta-Mask Wallet To The Open Sea Test Network</li>
            <li>You Will See Your NFTs Listed</li>
        </ol>`

        progressStatus.append(stepsToCheckNFT);
    }
}