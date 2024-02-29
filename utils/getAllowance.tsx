import { getAccount, readContract } from '@wagmi/core';
import usdtAbi from '../abi/USDTToken.json';

const getAllowance = async () => {
  const usdtAddress = process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS;
  const contractAddress = process.env.NEXT_PUBLIC_CURRENT_CONTRACT;
  try {
    const { address } = getAccount();

    const data = await readContract({
      address: `0x${usdtAddress}`,
      abi: usdtAbi,
      functionName: 'allowance',
      args: [address, `0x${contractAddress}`],
    });
    return data;
  } catch (error: any) {
    console.log(error);
  }
};

export default getAllowance;
