interface FileSelectorProps {
  setSelectedFile: (file: File | undefined | null)=>void
}

const FileSelector = ({ setSelectedFile }:FileSelectorProps) => {

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files? event.target.files[0]:null);
  };

    return (<div className="mb-3" style={{ paddingTop: '20px' }}>
    <label htmlFor="formFile" className="form-label">Upload File</label>
    <input className="form-control" type="file" id="formFile" onChange={handleFileSelect}></input>
  </div>);
};

export default FileSelector;