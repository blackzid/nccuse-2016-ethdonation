web3.eth.sendTransaction({from:web3.eth.accounts[1], to:c1.address,value:web3.toWei(20, "ether"),gas:"470000"});
web3.eth.sendTransaction({from:web3.eth.accounts[1], to:c2.address,value:web3.toWei(22, "ether"),gas:"470000"});
web3.eth.sendTransaction({from:web3.eth.accounts[2], to:c1.address,value:web3.toWei(30, "ether"),gas:"470000"});
web3.eth.sendTransaction({from:web3.eth.accounts[3], to:c1.address,value:web3.toWei(14, "ether"),gas:"470000"});
c1.transferDonation(web3.eth.accounts[1], 20, d1,{from:web3.eth.accounts[0],value:0,gas:"470000"});
c1.transferDonation(web3.eth.accounts[2], 10, d2,{from:web3.eth.accounts[0],value:0,gas:"470000"});
c1.transferDonation(web3.eth.accounts[2], 20, d1,{from:web3.eth.accounts[0],value:0,gas:"470000"});
c2.transferDonation(web3.eth.accounts[1], 22, d3,{from:web3.eth.accounts[0],value:0,gas:"470000"});
