interface SubmitButtonProps {
  onSubmit: ()=>void
}

const SubmitButton = ({ onSubmit }:SubmitButtonProps) => {
    return (<div className="col-12" style={{ paddingTop: '20px' }}>
    <button type="submit" className="btn btn-primary" onClick={onSubmit}>Submit</button>
  </div>);
};

export default SubmitButton;