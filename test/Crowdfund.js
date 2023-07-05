const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowd", function () {
  
  let Crowdfund;
  let crowdfund;
  //test case
  beforeEach(async function(){

     Crowdfund = await ethers.getContractFactory("Crowdfund");
     crowdfund = await Crowdfund.deploy();
  
    // Chiamare la funzione proposeProject
    await crowdfund.proposeProject("Economy coin", "just a new coin", 32, 30);
    //console.log("before each eseguito");
  });

  it('PROPOSEPROJECT: should propose a new project', async function() {
 
    await crowdfund.proposeProject("JACOPO coin", "la migliore moneta ", 12, 10);
    const projectsLength = await crowdfund.getArrayLength();
    
    // Verificare che la lunghezza dell'array dei progetti sia maggiore o uguale a 1
    //console.log("PROGETTI", Number(projectsLength));
    expect(projectsLength >= 2, "La proposta di un nuovo progetto non ha avuto successo");
  });

  it('CONTRIBUTE: should contribute to a project', async function(){

    const [addr1] = await ethers.getSigners();
    
    //console.log("ACCOUNT:",addr1.address);
    
   
    await expect(crowdfund.connect(addr1).contribute(0,{value: ethers.parseEther('3')}))
          .to.emit(crowdfund,"NewContributor")
          .withArgs(addr1.address, ethers.parseEther('3'),0);
   

    const project = await crowdfund.getProject(0);

    //console.log("DENAROS:", Number(project.raised));

    expect(Number(project.raised) == ethers.parseEther('3'));
    expect(crowdfund.getContributor(addr1.address, 0) == 1);

  });

  it('CHANGETITLE: should change the title of a project, only changeable by the owner of the project', async function(){

    const [address1,address2] = await ethers.getSigners();

    await crowdfund.connect(address2).proposeProject("Test3","test per cambiare title ", 12, 10);

    const project_before = await crowdfund.getProject(1);
    //console.log(project_before);

    
    await expect(crowdfund.connect(address2).changeTitle("ZEBRA E LEONE", 1))
    .to.emit(crowdfund,'ProjectTitleModified');

    await expect(crowdfund.connect(address1).changeTitle("LEONE E ZEBRA", 1))
    .to.emit(crowdfund,'ProjectTitleModified').to.be.reverted;
    
    /*const project_after = await crowdfund.getProject(1);

    console.log(project_after);*/

  });

  it('CHANGEDESCRIPTION: should change the description of a project, only changeable by the owner of the project', async function(){

    const [address1,address2] = await ethers.getSigners();

    await crowdfund.connect(address2).proposeProject("Test4","test per cambiare description ", 12, 10);

    /*const project_before = await crowdfund.getProject(1);
    console.log(project_before);*/

    
    await expect(crowdfund.connect(address2).changeDescription("Ho cambiato la descrizione", 1))
    .to.emit(crowdfund,'ProjectDescriptionModified');

    await expect(crowdfund.connect(address1).changeDescription("non dovrei cambiarla", 1))
    .to.emit(crowdfund,'ProjectDescriptionModified')
    .to.be.reverted;
    
    /*const project_after = await crowdfund.getProject(1);

    console.log(project_after);*/

  });

  it('WITHDRAWDONATIONS: should withdraw the balance donated to a project', async function(){

    const [address1] = await ethers.getSigners();

    await crowdfund.connect(address1).proposeProject("Test5","test per ritirare il denaro donato ", 12, 10);
    await crowdfund.connect(address1).contribute(1,{value: ethers.parseEther('100')});


    //const project = await crowdfund.getProject(1);



    /*console.log(await ethers.provider.getBalance(address1));
    console.log("BILANCIO DEL PROGETTO ATTUALE: ",Number(project.raised));
    console.log(await crowdfund.getContributor(address1,1));*/

    await expect(crowdfund.connect(address1).withdrawDonations(1)).to.emit(crowdfund,'WithdrawDone');
    /*console.log(await ethers.provider.getBalance(address1));
    console.log(await crowdfund.getContributor(address1,1));*/

  });



});

  


  
