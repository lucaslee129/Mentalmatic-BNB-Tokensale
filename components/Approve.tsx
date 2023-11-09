import { useState, useEffect, React } from 'react';
import Modal from 'react-modal';
import getStakedAmount from '../utils/getStakedAmount';
import HandleUnstake from '../utils/handleUnstake';
import handleHarvest from '../utils/handleHarvest';
import handleCompound from '../utils/handleCompound';

const StakeModal = (props: any) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const [headerText, setHeaderText] = useState("SELECT YOUR OPTION");
  const [stakingAmount, setStakingAmount] = useState(0);
  const [stakingPeriod, setStakingPeriod] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [endDate, setEndDate] = useState("");
  const [text, setText] = useState(
    <div className='pr-12 pl-16  w-[100%] justify-center text-center text-xl'>
      <p className='my-2'>Loading...</p>
    </div>
  );

  // useEffect(() => {
    const vestingInfo = async () => {
      let stakedData = await getStakedAmount();
      setStakingAmount(Number(stakedData.stakedAmount) * (10 ** -18));
      setRewardAmount(Number(stakedData.rewards) * (10 ** -18)  );
      setStakingPeriod(stakedData.stakingPeriod);
      setEndDate(stakedData.endTime);
      console.log(stakedData);
    }
  //   vestingInfo();
  // }, [stakingAmount, rewardAmount])

  const unstakeClick = () => {
    setSelectedItem(1);
    setHeaderText("UNSTAKE");
    vestingInfo();
    setText(
      <div className='pr-12 pl-16  w-[100%] justify-center text-xl'>
        <p className='my-2'>- You staked <span className='text-2xl'>{stakingAmount}</span> $MMT Tokens for <span className='text-2xl'>{stakingPeriod}</span> Months.</p>
        <p className='my-2'>- You will receive <span className='text-2xl'>{stakingAmount}</span> $MMT staking Tokens and <span className='text-2xl'>{rewardAmount}</span> $MMT Tokens as rewards.</p>
        <p>- Your Staking end date: <span className='text-2xl'>{endDate}</span></p>
      </div>
    )
  }

  const harvestClick = () => {
    setSelectedItem(2);
    setHeaderText("HARVEST");
    vestingInfo();
    setText(
      <div className='pr-12 pl-16  w-[100%] justify-centerr text-xl'>
        <p className='my-2'>- You staked <span className='text-2xl'>{stakingAmount}</span> $MMT Tokens for <span className='text-2xl'>{stakingPeriod}</span> Months.</p>
        <p className='my-2'>- You will receive  <span className='text-2xl'>{rewardAmount}</span> $MMT Tokens as rewards.</p>
        <p>- Your Staking end date: <span className='text-2xl'>{endDate}</span></p>
      </div>
    )
  }

  const compoundClick = () => {
    setSelectedItem(3);
    setHeaderText("COMPOUND");
    vestingInfo();
    setText(
      <div className='pr-12 pl-16  w-[100%] justify-centerr text-xl'>
        <p className='my-2'>- You staked <span className='text-2xl'>{stakingAmount}</span> $MMT Tokens for <span className='text-2xl'>{stakingPeriod}</span> Months.</p>
        <p className='my-2'>- Your Staking Amount is <span className='text-2xl'>{stakingAmount}</span> $MMT Tokens and Reward Tokens are <span className='text-2xl'>{rewardAmount}</span> $MMT Tokens.</p>
        <p className='my-2'>- Your total compound tokens are <span className='text-2xl'>{ stakingAmount + rewardAmount }</span> $MMT Tokens.</p>
      </div>
    )
  }

  const handleSubmit = () => {
    if(selectedItem == 0) {
      setErrorMessage("Please select your staking option");
    } else if (selectedItem == 1) {
      HandleUnstake(stakingAmount);
    } else if (selectedItem == 2) {
      handleHarvest(rewardAmount);
    } else if (selectedItem == 3) {
      handleCompound(rewardAmount);
    }
  }

  return(
    <Modal 
    className="mx-auto min-w-[500px] max-w-[650px] bg-gradient-to-t from-blue-800/40 to-blue-100/50 bg-blur backdrop-blur-[6px] mt-20 w-1/3 h-3/4 shadow-2xl justify-center rounded-3xl py-8 text-black drop-shadow-[0_5px_5px_rgba(0,0,0,0.35)] md:w-1/2 sm:w-3/4 sm:h-3/4 sx:h-full" 
    isOpen={props.isModalOpen} 
      onRequestClose={props.closeModal}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0)',
        },
      }}
    >
      <div className='text-5xl w-full justify-center text-center mt-8 mb-8'>{headerText}</div>
      <div className='box-border flex justify-between w-full px-6 mb-6 text-white'>
        <button 
          className="box-border bg-violet-600 active:bg-violet-500 focus:bg-violet-800 focus:outline-none focus:ring focus:text-yellow-300 hover:text-yellow-100 hover:bg-violet-500 hover:border-1 w-[20%] h-[20%] text-blue font-bold py-2 px-4 rounded"
          onClick={unstakeClick}
        >
          Unstake
        </button>
        <button 
          className="box-border bg-violet-600 active:bg-violet-500 focus:bg-violet-800 focus:outline-none focus:ring focus:text-yellow-300 hover:text-yellow-100 hover:bg-violet-500 hover:border-1 w-[20%] h-[20%] text-blue font-bold py-2 px-4 rounded"
          onClick={harvestClick}
        >
          Harvest
        </button>
        <button 
          className="box-border bg-violet-600 active:bg-violet-500 focus:bg-violet-800 focus:outline-none focus:ring focus:text-yellow-300 hover:text-yellow-100 hover:bg-violet-500 hover:border-1 w-[20%] h-[20%] text-blue font-bold py-2 px-4 rounded"
          onClick={compoundClick}
        >
          Compound
        </button>
      </div>
      <div className='text-sm w-full justify-center text-red-300 text-center my-4'>{errorMessage}</div>
      <hr className="flex w-[60%] border-black mx-auto my-8" />
      {text}
      <hr className="flex w-[60%] border-black mx-auto my-8" />
      <div className='flex justify-center gap-5 w-full px-6 mt-6'>
        <button 
          className="box-border bg-violet-600 text-white active:bg-violet-500 w-[20%] h-[20%] font-bold py-2 px-4 rounded"
          onClick={props.closeModal}  
        >
          Cancel
        </button>
        <button 
          className="box-border bg-violet-600 bg-violet-500 active:bg-violet-500 text-white w-[20%] h-[20%] font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </Modal>
  )
}

export default StakeModal;