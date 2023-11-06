import { getAccount, readContract } from "@wagmi/core";
import usdtAbi from '../abi/USDTToken.json';

const getTetherAmount = async() => {

  const usdtAddress = process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS;
  try {
    const { address} = getAccount();

    const data =  await readContract({
      address: `0x${usdtAddress}`,
      abi : usdtAbi,
      functionName: 'balanceOf',
      args: [address]
    })
    return (Number(data) * (10 ** -18)).toFixed(3);

  } catch (error: any) {
    console.log(error);
  }
}

export default getTetherAmount;