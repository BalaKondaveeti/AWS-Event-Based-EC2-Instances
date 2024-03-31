interface SubmitButtonProps {
  onSubmit: ()=>void
}

const SubmitButton = ({ onSubmit }:SubmitButtonProps) => {
    return (<div className="col-12">
    <button type="submit" className="btn btn-primary" onClick={onSubmit}>Submit</button>
  </div>);
};

export default SubmitButton;