
const InputForm = (props: any) => {
  if(props.id == "usdt") {
    return(
      <div className="flex justify-center mb-4">
        <input 
          className="shadow appearance-none border bg-[url('../assets/usdt.png')] bg-contain bg-no-repeat bg-right  bg-origin-content rounded w-7/8 h-12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
          type="text" 
          disabled = {!props.isConnected}
          onChange={props.onChange}
          value={props.value}
          placeholder="10000" />
      </div>
    )
  } else {
    return(
      <div className="flex justify-center mb-4">
        <input 
          className="shadow appearance-none border bg-[url('../assets/dolphin.png')] bg-contain bg-no-repeat bg-right  bg-origin-content rounded w-7/8 h-12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
          type="text" 
          disabled = {!props.isConnected}
          onChange={props.onChange}
          value={props.value}
          placeholder="10000" />
      </div>
    )
  }

  
}

export default InputForm;