interface CustomTextFieldProps {
    inputValue: string
    setInputValue: (value: string) => void
}

const CustomTextField = ({ inputValue, setInputValue }:CustomTextFieldProps) => {

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value?.toString() || '');
  };

    return (<div> <label htmlFor="exampleFormControlInput1" className="form-label">Text Field</label>
    <input className="form-control" id="exampleFormControlInput1" placeholder="Enter something" value={inputValue} onChange={handleInputChange}></input></div>);
}

export default CustomTextField;