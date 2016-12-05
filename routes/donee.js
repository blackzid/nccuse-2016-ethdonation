var express = require('express');
var router = express.Router();

var Web3 = require("../web3");
var doneeABI = Web3.doneeABI
var foundationABI = Web3.foundationABI
var web3 = Web3.web3
var eth = web3.eth;

router.get('/:doneeAddress', function (req, res) {
	var addr = req.params.doneeAddress;
	var contract = eth.contract(doneeABI).at(addr);
	var donorList = [];
	var donorCount = contract.donorCount()
    for (var i = 0; i < donorCount; i++) {
        var donorAddr = contract.donorindex(i);
        donorInfo = contract.donorList(donorAddr);
        donorList.push({ 
            donorAddress: donorAddr,
            donation: web3.fromWei(donorInfo[1], "ether"), 
        });
    }
	res.render('donee', {
        contractAddress: addr,
        doneeName: contract.getName(),
        description: contract.getDescription(),
        received: web3.fromWei(contract.getReceivedBalance(), "ether"),
        donors: donorList
    });
})

module.exports = router;
