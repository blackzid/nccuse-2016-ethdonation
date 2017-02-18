var express = require('express');
var router = express.Router();
var fs = require("fs");

var Web3 = require("../web3");
var doneeABI = Web3.doneeABI
var foundationABI = Web3.foundationABI
var web3 = Web3.web3
var eth = web3.eth;
// contract abi
var existingContracts = require("../existingContract.json");
// fs.writeFile( "existingContract.json", JSON.stringify( myJson ), "utf8", yourCallback );

var isAdmin = false;
var checkAdmin = function(req, res){
    isAdmin = false;
    if(req.signedCookies.admin && req.signedCookies.password){
        isAdmin = true;
    }
};

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
    checkAdmin(req, res);
    console.log(isAdmin)
    updateContracts()
    res.render('projects', {
        contracts: existingContracts,
        isAdmin:isAdmin
    });
});
router.get('/create', function(req, res) {
    checkAdmin(req, res);
    res.render('createContract',{
        isAdmin:isAdmin
    })
})
router.post('/create', function(req, res) {
    checkAdmin(req, res);
    if (req.body['creator'] == "") {
        res.render("createContract");
    } else if (req.body['foundationName'] == "") {
        res.render("createContract");
    } else if (req.body['projectName'] == "") {
        res.render("createContract");
    } else if (req.body['description'] == "") {
        res.render("createContract");
    } else {
        eth.contract(foundationABI).new(
            req.body['foundationName'],
            req.body['projectName'],
            req.body['description'], {
                from: req.body['creator'],
                data: '0x6060604052346200000057604051620016aa380380620016aa833981016040528080518201919060200180518201919060200180518201919050505b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260019080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620000ca57805160ff1916838001178555620000fb565b82800160010185558215620000fb579182015b82811115620000fa578251825591602001919060010190620000dd565b5b5090506200012391905b808211156200011f57600081600090555060010162000105565b5090565b50508160029080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200017357805160ff1916838001178555620001a4565b82800160010185558215620001a4579182015b82811115620001a357825182559160200191906001019062000186565b5b509050620001cc91905b80821115620001c8576000816000905550600101620001ae565b5090565b50508060039080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200021c57805160ff19168380011785556200024d565b828001600101855582156200024d579182015b828111156200024c5782518255916020019190600101906200022f565b5b5090506200027591905b808211156200027157600081600090555060010162000257565b5090565b50505b5050505b61141e806200028c6000396000f300606060405236156100ef576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302d05d3f1461011d57806312065fe01461016c5780631a0925411461018f5780632241776a1461022557806331095f7b146102bb57806333999c171461031657806338a45787146103525780634fbd73cc146103af57806369bc2f1e146104455780636b506491146104685780637118a9c0146104fe5780637284e4161461058157806390c3f38f146106175780639a33e3001461066e578063be49443d14610704578063c407670f14610727578063fcff72661461074a575b61011b5b600034141515610118573460046000828254019250508190555061011733346107cb565b5b5b565b005b346100005761012a6109ed565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3461000057610179610a13565b6040518082815260200191505060405180910390f35b346100005761019c610a33565b60405180806020018281038252838181518152602001915080519060200190808383600083146101eb575b8051825260208311156101eb576020820191506020810190506020830392506101c7565b505050905090810190601f1680156102175780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3461000057610232610ae5565b6040518080602001828103825283818151815260200191508051906020019080838360008314610281575b8051825260208311156102815760208201915060208101905060208303925061025d565b505050905090810190601f1680156102ad5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3461000057610314600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610b97565b005b3461000057610350600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506107cb565b005b346100005761036d6004808035906020019091905050610f90565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34610000576103bc610fc3565b604051808060200182810382528381815181526020019150805190602001908083836000831461040b575b80518252602083111561040b576020820191506020810190506020830392506103e7565b505050905090810190601f1680156104375780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3461000057610452611061565b6040518082815260200191505060405180910390f35b346100005761047561106c565b60405180806020018281038252838181518152602001915080519060200190808383600083146104c4575b8051825260208311156104c4576020820191506020810190506020830392506104a0565b505050905090810190601f1680156104f05780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3461000057610538600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190505061111e565b604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390f35b346100005761058e6111bb565b60405180806020018281038252838181518152602001915080519060200190808383600083146105dd575b8051825260208311156105dd576020820191506020810190506020830392506105b9565b505050905090810190601f1680156106095780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b346100005761066c600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050611259565b005b346100005761067b6112fe565b60405180806020018281038252838181518152602001915080519060200190808383600083146106ca575b8051825260208311156106ca576020820191506020810190506020830392506106a6565b505050905090810190601f1680156106f65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b346100005761071161139c565b6040518082815260200191505060405180910390f35b34610000576107346113a2565b6040518082815260200191505060405180910390f35b346100005761077b600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506113a8565b604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390f35b8173ffffffffffffffffffffffffffffffffffffffff16600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156108b65780600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101600082825401925050819055506109e8565b6007600081548092919060010191905055508160066000600160075403815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101819055505b5b5050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60003073ffffffffffffffffffffffffffffffffffffffff163190505b90565b602060405190810160405280600081525060038054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610ada5780601f10610aaf57610100808354040283529160200191610ada565b820191906000526020600020905b815481529060010190602001808311610abd57829003601f168201915b505050505090505b90565b602060405190810160405280600081525060028054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610b8c5780601f10610b6157610100808354040283529160200191610b8c565b820191906000526020600020905b815481529060010190602001808311610b6f57829003601f168201915b505050505090505b90565b60003373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610bf557610000565b60008273ffffffffffffffffffffffffffffffffffffffff166302d05d3f6000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b156100005760325a03f115610000575050506040518051905073ffffffffffffffffffffffffffffffffffffffff16141515610f8857670de0b6b3a76400008302905080600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010154101515610f87578173ffffffffffffffffffffffffffffffffffffffff168160405180807f646f6e6174652861646472657373290000000000000000000000000000000000815250600f01905060405180910390207c0100000000000000000000000000000000000000000000000000000000900490866040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060006040518083038185886185025a03f1935050505015610f8157600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020160008154809291906001019190505550600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206003018054806001018281815481835581811511610ee357600202816002028360005260206000209182019101610ee291905b80821115610ede57600060008201600090556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600201610e9c565b5090565b5b505050916000526020600020906002020160005b6040604051908101604052808581526020018673ffffffffffffffffffffffffffffffffffffffff1681525090919091506000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050610f86565b610000565b5b5b5b5b50505050565b60066020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156110595780601f1061102e57610100808354040283529160200191611059565b820191906000526020600020905b81548152906001019060200180831161103c57829003601f168201915b505050505081565b600060075490505b90565b602060405190810160405280600081525060018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156111135780601f106110e857610100808354040283529160200191611113565b820191906000526020600020905b8154815290600101906020018083116110f657829003601f168201915b505050505090505b90565b600060006000600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060030184815481101561000057906000526020600020906002020160005b50905080600001548160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16925092505b509250929050565b60038054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156112515780601f1061122657610100808354040283529160200191611251565b820191906000526020600020905b81548152906001019060200180831161123457829003601f168201915b505050505081565b8060039080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106112a557805160ff19168380011785556112d3565b828001600101855582156112d3579182015b828111156112d25782518255916020019190600101906112b7565b5b5090506112f891905b808211156112f45760008160009055506001016112dc565b5090565b50505b50565b60028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156113945780601f1061136957610100808354040283529160200191611394565b820191906000526020600020905b81548152906001019060200180831161137757829003601f168201915b505050505081565b60045481565b60075481565b60056020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600101549080600201549050835600a165627a7a7230582055bfc95f73d3ab1b72831249f9a0ee75b56b2b0123d42b42a358230e7bec91030029',
                gas: '4700000'
            },
            function(e, contract) {
                if (e) {
                    console.log("error: " + e)
                } else if (typeof contract.address !== 'undefined') {
                    console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                    existingContracts.push({ "address": contract.address })
                    updateContracts()
                }
            });
        res.redirect("/projects")
    }
})
router.get('/:projectAddress', function(req, res) {
    var addr = req.params.projectAddress;
    var contract = eth.contract(foundationABI).at(addr);
    var donorList = [];
    for (var i = 0; i < contract.getDonorCount(); i++) {
        var donorAddr = contract.donorindex(i);
        donorInfo = contract.donorList(donorAddr);
        var doneeList = [];
        for (var j = 0; j < donorInfo[2]; j++) {
            var donee = contract.getDoneeFromDonor(donorAddr, j);
            doneeList.push({ address: donee[1], donation: web3.fromWei(donee[0], "ether") })
        }
        donorList.push({
            donorAddress: donorAddr,
            donation: web3.fromWei(donorInfo[1], "ether"),
            doneeList: doneeList
        });
    }
    // console.log(donorList)
    res.render('contractDetail', {
        title: 'Express',
        contractAddress: addr,
        fName: contract.getFoundationName(),
        fProjectName: contract.getProjectname(),
        contractBalance: web3.fromWei(contract.receivedBalance(), "ether"),
        fDescription: contract.getDescription(),
        donors: donorList
    });
})
router.get('/:projectAddress/manage', function(req, res) {
    checkAdmin(req, res);
    var addr = req.params.projectAddress;
    var contract = eth.contract(foundationABI).at(addr);
    var donorList = [];
    for (var i = 0; i < contract.getDonorCount(); i++) {
        var donorAddr = contract.donorindex(i);
        donorInfo = contract.donorList(donorAddr);
        var doneeList = [];
        for (var j = 0; j < donorInfo[2]; j++) {
            var donee = contract.getDoneeFromDonor(donorAddr, j);
            doneeList.push({ address: donee[1], donation: web3.fromWei(donee[0], "ether") })
        }
        donorList.push({
            donorAddress: donorAddr,
            donation: web3.fromWei(donorInfo[1], "ether"),
            doneeList: doneeList
        });
    }
    res.render('manage', {
        contractAddress: addr,
        fName: contract.getFoundationName(),
        fProjectName: contract.getProjectname(),
        contractBalance: web3.fromWei(contract.receivedBalance(), "ether"),
        fDescription: contract.getDescription(),
        donors: donorList,
        isAdmin:isAdmin
    });
})
router.post('/:projectAddress/manage', function(req, res) {
    checkAdmin(req, res);
    console.log("Transfer Ether Post")
    var addr = req.params.projectAddress;
    var contract = eth.contract(foundationABI).at(addr);
    if (req.body["donor-address"] != "" && req.body["donee-address"] != "" && req.body["ether"] > 0) {
        console.log(req.body["donor-address"])
        console.log(req.body["donee-address"])
        console.log(req.body["ether"])

        contract.transferDonation(
            req.body["donor-address"],
            req.body["ether"],
            req.body["donee-address"], { from: "0x001a0233f5696de3a3021211074f70aba0a2b9e5", value: 0, gas: 300000 },
            function(err, result) {
                if (err != null) {
                    console.log("error: ", err);
                } else {
                    console.log(result);
                }
            });
        return res.redirect('/projects/' + addr + "/manage");
    } else {
        console.log("Wrong Inputs")
    }
})

module.exports = router;