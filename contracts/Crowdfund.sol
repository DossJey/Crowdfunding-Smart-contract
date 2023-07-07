

// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;
import "hardhat/console.sol";


contract Crowdfund{

    //structs 

    struct Project{

        address owner;
        string title;
        string description;
        uint to_reach;
        uint raised;
        uint deadline;
        uint totalDonations;
        bool complete;
    }

    Project[] public projects;

    mapping(address => mapping(uint => uint )) public contributors;

    //Events
    event ProjectProposed(address _owner,string _title, string description,uint _to_reach,uint _raised, uint _deadline,uint _totalDonations, bool _complete);
    event NewContributor(address newContributor, uint offer, uint project);
    event ProjectTitleModified(uint _index,string new_title);
    event ProjectDescriptionModified(uint _index,string new_description);
    event ProjectToReachModified(uint _index, uint _amount);
    event RefundDone(address _address, uint amount);
    event ProjectCompleted(uint _index);


    //modifiers
    modifier isExpired(uint index) {
        require(block.timestamp <= projects[index].deadline);
        _;
    }

    modifier isOwner(address _owner,uint _index){
        require(_owner == projects[_index].owner);
        _;
    }

    constructor(){
        console.log("Contratto deployato");   
    }


    function proposeProject(string memory _title, string memory _description, uint _to_reach, uint _deadline) external {

        Project memory new_project = Project(msg.sender,_title,_description,_to_reach,0,(block.timestamp + (_deadline *7 days)),0,false);

        projects.push(new_project);

        emit ProjectProposed(msg.sender,_title,_description, _to_reach,0,_deadline,0,false);
    }

    function contribute(uint _index) external payable isExpired(_index){

        require(projects[_index].complete == false);
        require(msg.value > 0);

        projects[_index].raised += msg.value;
        contributors[msg.sender][_index] += msg.value;

        //check if the project has reached the objective
        if(projects[_index].raised >= projects[_index].to_reach){
            projects[_index].complete = true;
            emit ProjectCompleted(_index);
        }

        projects[_index].totalDonations++;

        emit NewContributor(msg.sender, msg.value, _index);

        
    }

    function getTotalDonations(uint _index) public view returns(uint){

        return projects[_index].totalDonations;
    }

    function getContributions(address _contributor, uint _index) public view returns(uint){

        return contributors[_contributor][ _index];
    }

    //Refund the sender if the project results expired or still not completed

    function getRefund(uint _index) public {

        require(!projects[_index].complete || block.timestamp > projects[_index].deadline);
        require(contributors[msg.sender][_index] != 0);

        projects[_index].totalDonations -= contributors[msg.sender][_index];
        uint amount = contributors[msg.sender][_index];
        projects[_index].raised -= amount;
        contributors[msg.sender][_index] = 0;

        payable(msg.sender).transfer(amount);
      

        emit RefundDone(msg.sender, amount);
        
    }

    //Withdraw the donations if the project has been completed
    function withdrawDonations(uint _index) public isOwner(msg.sender, _index){

        require(projects[_index].complete);
        
        payable(msg.sender).transfer(projects[_index].raised);


    }

    //change settings of a project

    function changeTitle(string memory _title, uint _index) external isOwner(msg.sender,_index){

        projects[_index].title = _title;
        emit ProjectTitleModified(_index,_title);
    }
    function changeDescription(string memory _description, uint _index) external isOwner(msg.sender,_index){

        projects[_index].description = _description;
         emit ProjectDescriptionModified( _index, _description);
    }
    function changeToReach(uint _amount , uint _index) external isOwner(msg.sender, _index){

        projects[_index].to_reach = _amount * 1 ether;
        emit ProjectToReachModified(_index, _amount);
    }


    function getArrayLength() public view returns(uint){
        return projects.length;
    }

    function getProject(uint index) public view returns(Project memory){
        return projects[index];
    }
    function getAllProjects() public view returns(Project[] memory){
        return projects;
    }

   
    function getContributor(address _address, uint index) public view returns(uint){

        return contributors[_address][index];
    }

}