import { writeContract, waitForTransaction, getAccount } from '@wagmi/core';
import { parseEther } from 'viem';
import usdtContractAbi from '../abi/USDTToken.json';
import seedRoundMMTAbi from '../abi/SeedRoundMMT.json';
import Notiflix from 'notiflix';
require('dotenv').config();

const usdtContractAddress = process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS;
const vestContractAddress = process.env.NEXT_PUBLIC_CURRENT_CONTRACT;

const BuyToken = async (props: any) => {
  let buyerAddress: unknown;
  const { address, isConnected } = getAccount();
  if (isConnected) {
    buyerAddress = address;
  }

  console.log(props.approveState);
  try {
    if (props.approveState == 1) {
      console.log(props.coinAmount.toString());
      const data = await writeContract({
        address: `0x${vestContractAddress}`,
        abi: seedRoundMMTAbi,
        functionName: 'buyToken',
        args: [parseEther(props.coinAmount.toString())],
      });
      await waitForTransaction({
        hash: data.hash,
      });
      props.handleErrorMessage('');
      Notiflix.Notify.success('USDT Transfer Success');
    }
  } catch (error: any) {
    const errorMessage = error.message;
    const rejectError = 'User rejected the request.';
    const requireError = 'reverted with the following reason';
    if (errorMessage.includes(rejectError)) {
      Notiflix.Notify.failure('User rejected the request.');
    } else if (errorMessage.includes(requireError)) {
      const errMsg = error.message.match(
        /reverted with the following reason:\n(.*?)\n/
      )[1];
      props.handleErrorMessage(errMsg);
      Notiflix.Notify.failure(errMsg);
    }
  }
};

export default BuyToken;
