import { readContract } from "@wagmi/core";
import contractAbi from '../abi/SeedRoundMMT.json';

const getRoundBalance  = async() => {

  const vestContractAddress = process.env.NEXT_PUBLIC_CURRENT_CONTRACT;

  const balance  = await readContract({
    address: `0x${vestContractAddress}`,
    abi: contractAbi,
    functionName: "SaleBalance",
  })

  return balance;
}

export default getRoundBalance;