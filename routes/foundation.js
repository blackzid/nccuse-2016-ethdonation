var express = require('express');
var router = express.Router();

var fs = require("fs");

var Web3 = require("../web3");
var doneeABI = Web3.doneeABI
var foundationABI = Web3.foundationABI
var web3 = Web3.web3
var eth = web3.eth;
// contract abi

existingContracts = require("../existingContract.json");
// fs.writeFile( "existingContract.json", JSON.stringify( myJson ), "utf8", yourCallback );
function updateContracts() {
    // update existingContracts.json
    for (var i = 0; i < existingContracts.length; i++) {
        var contract = eth.contract(foundationABI).at(existingContracts[i].address);
        existingContracts[i].fName = contract.getFoundationName();
        existingContracts[i].description = contract.getDescription();
        existingContracts[i].projectName = contract.getProjectname();
    }

    fs.writeFile("existingContract.json", JSON.stringify(existingContracts), "utf8");
}
// GET home page
router.get('/', function(req, res, next) {
	updateContracts()
    res.render('foundation', {
        contracts: existingContracts
    });
});
// router.locals.toContract = function(addr){
// }
//specific contract
router.get('/:foundationAddress', function(req, res) {
    var addr = req.params.foundationAddress;
    var contract = eth.contract(foundationABI).at(addr);
    
    var donorList = [];
    for (var i = 0; i < contract.getDonorCount(); i++) {
        var donorAddr = contract.donorindex(i);
        donorInfo = contract.donorList(donorAddr);
        var doneeList = []; 
        for (var j = 0; j < donorInfo[2]; j++){
            var donee = contract.getDoneeFromDonor(donorAddr, j); 
            doneeList.push({address:donee[1], donation:web3.fromWei(donee[0], "ether")})
        }
        donorList.push({ 
            donorAddress: donorAddr, 
            donation: web3.fromWei(donorInfo[1], "ether"), 
            doneeList:doneeList
        });
    }
    // console.log(donorList)
    res.render('contractDetail', {
        title: 'Express',
        contractAddress: addr,
        fName: contract.getFoundationName(),
        fProjectName: contract.getProjectname(),
        contractBalance: web3.fromWei(contract.getBalance(), "ether"),
        fDescription: contract.getDescription(),
        donors: donorList
    });

    // contract.setDescription("we need help", {from:"0x116a7e500de44305f7673a5e30cc5b3f921dd771", value: 0}, function(err, result){
    // 	if (err != null) {
    // 		console.log("error: ",err);
    // 	} else {
    // 		console.log(result);
    // 		res.render('foundation', {
    // 			title: 'Express',
    // 			contractAddress:addr,
    // 			fName:contract.getFoundationName(),
    // 			fProjectName:contract.getProjectname(),
    // 			contractBalance:contract.getBalance(),
    // 			fDescription: contract.getDescription()
    // 		});
    // 	}
    // });
})
module.exports = router;
