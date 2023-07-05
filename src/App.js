import { useState } from 'react';
import { useEffect } from 'react';
import { ethers, formatEther, formatUnits} from 'ethers';
import CrowdFund from './artifacts/contracts/Crowdfund.sol/Crowdfund.json';
import './App.css';

 


const crowd_address = "0xe0Bb730A8374C04413bB812e3bdA3f051C812E2b";

function App() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [to_reach, setToReach] = useState(0);
  const [deadline, setDeadline] = useState(0);


  //test getContributor
  const [contributor,setContributor] = useState('');
   
  //test getRefund
  const [refund, setRefund] = useState(0);

  //test contribute to a project
  const [indice, setIndice] = useState(0);
  const [amount, setAmount] = useState("");

  //test getAllProjects 
  const [allproj, setAllProj] = useState(0);

  


  useEffect(() => {
    if (window.ethereum) {
   
      window.ethereum.on("accountsChanged", () => {

       
        window.location.reload();
      });
    }
  },[]);

  
  

 

  const getAllProjects = async ()=> {
    
   
    const provider = await new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();
    const contract = await new ethers.Contract(crowd_address, CrowdFund.abi, signer);
    const account = (await signer).getAddress();

    console.log("Current account:" , account);
    const array = await contract.getAllProjects();

    setAllProj(array);

    console.log(array);

  }
  
  const proposeProject = async ()=>{

    try{

      //take the current metamask account
      

      const provider = await new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner();
      const contract = await new ethers.Contract(crowd_address, CrowdFund.abi, signer);
      const account = (await signer).getAddress();

      console.log("Current account: ", account);

      if(title!=="" && description!=="" && to_reach !== 0 && deadline!== 0){
      const tx = await contract.proposeProject(
        title,
        description,
        ethers.parseEther(to_reach.toString()),
        deadline,
        { from: account }
      );

      }
      else{
        console.log("please compile all fields");
      }
      
      await console.log("Project posted, good luck!");
      

    }catch(e){
      console.log(e);
    }
  }

  

  const contribute = async ()=>{

    const provider = await new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const account = (await signer).getAddress();
    const contract = await new ethers.Contract(crowd_address,CrowdFund.abi,signer);

    await contract.contribute(indice, {value: ethers.parseUnits(amount,'ether') });

    console.log("Nice, you are now a contributor of this project!");


  };

  const getRefund = async ()=>{

    const provider = await new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const account = (await signer).getAddress();
    const contract = await new ethers.Contract(crowd_address,CrowdFund.abi,signer);

    await contract.getRefund(refund);

  };

  

  const getContributor = async ()=>{

    const provider = await new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const account = (await signer).getAddress();
    const contract = await new ethers.Contract(crowd_address,CrowdFund.abi,signer);

    const contributo = await contract.getContributor(contributor, indice);

    console.log(contributo);


  }


  return (
   
    <div className = "App">
      
      <div className='title'>
        <h1>Welcome to CrowdChain</h1>
        
      </div>


      <div className = "inputField">
        <input
          type='text' 
          value = {title}
          onChange = { (e) => setTitle(e.target.value)}
          placeholder='Title'
        />
        <textarea 
          type='text'
          value = {description}
          onChange = {(e) => setDescription(e.target.value)} 
          placeholder='Description' 
        />
        <input 
          type='number'
          value = {to_reach}
          onChange={(e)=> setToReach(e.target.value)} 
          placeholder='to reach' 
        />
        <input 
          type='number'
          value = {deadline}
          onChange = {(e)=>setDeadline(e.target.value)} 
          placeholder='Deadline' 
        />
        <button className='btn-proj' onClick={proposeProject}>Propose new project</button>
      </div> 

      <div className='inputField'>
        <input 
            type='number'
            value = {refund}
            onChange = {(e)=>setRefund(e.target.value)} 
            placeholder='index of project to get refund' 
        />

        <button className='btn-proj' onClick={getRefund}>Get a refund</button>
      </div>


      <div className='inputField'>
        <input 
            type='text'
            value = {contributor}
            onChange = {(e)=>setContributor(e.target.value)} 
            placeholder='address to check' 
        />
         <input 
            type='number'
            value = {indice}
            onChange = {(e)=>setIndice(e.target.value)} 
            placeholder='index of project to check' 
        />
        <button className='btn-proj' onClick={getContributor}>Get Contributions</button>
      </div>
      <div className='inputField'>
         <input 
            type='number'
            value = {indice}
            onChange = {(e)=>setIndice(e.target.value)} 
            placeholder='index of project to check' 
        />
        <input 
            type='text'
            value = {amount}
            onChange = {(e)=>setAmount(e.target.value)} 
            placeholder='ETH TO DONATE' 
        />
        <button className='btn-proj' onClick={contribute}>Contribute</button>
      </div>
      
      
      <button className='btn-proj' onClick={getAllProjects}>Show all projects</button>
      {allproj.length>0?
          (allproj.map((element, index) =>(
            <div key={index} className='project-card'>
              <p>INDEX: {index}</p>
              <p>Nome: {element.title}</p>
              <p>Descrizione: {element.description}</p>
              <p>Obiettivo da raggiungere: {element && element.to_reach && formatEther(element.to_reach)}</p>
              <p>Totale raggiunto: {element && element.raised && element.raised.toString()}</p>
              <p>Totale donazioni: {element && element.totalDonations && element.totalDonations.toString()}</p>
              <p>Proposta da: {element && element.owner && element.owner.toString()}</p>
            </div>
        ))): (
        <p></p>
      )}

      
      
  
    </div>
  );
}

export default App;
