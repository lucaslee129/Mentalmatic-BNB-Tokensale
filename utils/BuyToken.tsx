import { 
  writeContract,  waitForTransaction, getAccount
} from '@wagmi/core';
import { parseEther} from "viem";
import usdtContractAbi from '../abi/USDTToken.json';
import seedRoundMMTAbi from '../abi/SeedRoundMMT.json'
import Notiflix from 'notiflix';
require('dotenv').config();

const usdtContractAddress = process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS;
const vestContractAddress = process.env.NEXT_PUBLIC_CURRENT_CONTRACT;

const BuyToken =  async(props: any) => {
  
  let buyerAddress: unknown;
  const { address, isConnected} = getAccount();
  if(isConnected) {
    buyerAddress = address;
  }
  try{
    console.log('here');
    const approveHash = await writeContract({
      address: `0x${usdtContractAddress}`,
      abi: usdtContractAbi,
      functionName : "approve",
      args : [`0x${vestContractAddress}`, parseEther(props.coinAmount.toString())]
    })
    console.log("approveHash>>>", approveHash);
    await waitForTransaction({
      hash: approveHash.hash
    })

    let flag = true;

    Notiflix.Notify.success("Approved");
    
    if(flag) {
      console.log(props.coinAmount.toString())
      const data = await writeContract({
        address: `0x${vestContractAddress}`,
        abi: seedRoundMMTAbi,
        functionName : "buyToken",
        args : [parseEther(props.coinAmount.toString())] 
      })
      await waitForTransaction({
        hash: data.hash
      })
      Notiflix.Notify.success("USDT Transfer Success");
    }
  } catch(error: any) {
    const errorMessage = error.message;
    const rejectError = "User rejected the request.";
    const requireError = "reverted with the following reason";
    if(errorMessage.includes(rejectError)) {
      Notiflix.Notify.failure("User rejected the request.");
    } else if(errorMessage.includes(requireError)) {
      const errMsg = error.message.match(/reverted with the following reason:\n(.*?)\n/)[1];
      Notiflix.Notify.failure(errMsg);
    }
  }  
}

export default BuyToken;