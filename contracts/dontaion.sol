pragma solidity ^0.4.0;
contract Donee {
    address public creator;
    bytes32 public doneeName;
    string public description;
    string public proofURL;
    
    struct Donor {
        address donorAddress;
        uint donation;
    }
    mapping(address => Donor) public donorList;
    mapping (uint => address) public donorindex;
    uint public donorCount;
    
    modifier isOwner() {if (creator != msg.sender) throw; _; }
    
    function Donee(bytes32 donee_name, string description_, string proof_url ) { 
        creator = msg.sender;
        doneeName = donee_name;
        description = description_;
        proofURL = proof_url;
    }
    
    function withdraw() isOwner() returns (bool)  {
        if (!msg.sender.send(this.balance)){
                // No need to call throw here
                return false;
        }
        return true;
    }
    
	function getName() constant returns (bytes32)  {
	    return doneeName;
	}
	
	function setDescription(string description_) isOwner() {
        description = description_;
	}
	
	function getDescription() constant returns (string) {
	    return description;
	}
	
	function setProofURL(string proof_url) isOwner() {
	    proofURL = proof_url;
	}
	
	function getProofURL() constant returns (string) {
	    return proofURL;
	}
	function getBalance() constant returns (uint) {
	    return this.balance;
	}
	function addDonor(address donor, uint donation) {
        if (donorList[donor].donorAddress == donor){
            donorList[donor].donation += donation;
        } else {
            donorCount++;
            donorindex[donorCount -1] = donor;
            donorList[donor].donorAddress = donor;
            donorList[donor].donation = donation;
        }
    }
	function () payable {
	    if (msg.value != 0) {
            addDonor(msg.sender, msg.value);
        }
	}

}
contract Foundation{
    struct Donor {
        address donorAddress;
        uint donation;
        address doneeAddress;
    }
    
    address public creator;
    string public foundationName;
    string public projectName;
    string public description;

    mapping(address => Donor) public donorList;
    mapping (uint => address) public donorindex;
    uint public donorCount;
    modifier isFoundation() {if (creator != msg.sender) throw; _; }
    
    function Foundation(string foundation_name, string project_name, string description_) {
        creator = msg.sender;
        foundationName = foundation_name;
        projectName = project_name;
        description = description_;
    }
    
    function getFoundationName() constant returns (string){
        return foundationName;
    }
    function getProjectname() constant returns (string) {
        return projectName;
    }
    function getDonorCount() constant returns (uint) {
        return donorCount;
    }
    function setDescription(string description_) {
        description = description_;
    }
	function getDescription() constant returns (string) {
	    return description;
	}
    function donate() payable {
        if (msg.value != 0) {
            addDonor(msg.sender, msg.value);
        }
    }
    function addDonor(address donor, uint donation) {
        if (donorList[donor].donorAddress == donor){
            donorList[donor].donation += donation;
        } else {
            donorCount++;
            donorindex[donorCount -1] = donor;
            donorList[donor].donorAddress = donor;
            donorList[donor].donation = donation;
        }
    }
	function getDonorInfo(address donor) constant returns (uint, address) {
	    var d =  donorList[donor];
	    return (d.donation, d.doneeAddress);
	}
	function transferDonation(address donor_address,uint amount,address donee_address) isFoundation() {
	    if (Donee(donee_address).creator() != 0){
	        var money = amount * 1 ether;
	        if (donorList[donor_address].donation >= money){
	            
	            donorList[donor_address].donation -= money ;
	            
	            if (!donee_address.send(money)){
	                donorList[donor_address].donation += money;
	            }
	        }
	    }
	}
	function getBalance() constant returns (uint) {
	    return this.balance;
	}
	function () payable {
	    if (msg.value != 0) {
            addDonor(msg.sender, msg.value);
        }
	}
}
