interface FileSelectorProps {
  setSelectedFile: (file: File | undefined | null)=>void
}

const FileSelector = ({ setSelectedFile}:FileSelectorProps) => {

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files? event.target.files[0]:null);
  };

    return (<div className="mb-3">
    <label htmlFor="formFile" className="form-label">Default file input example</label>
    <input className="form-control" type="file" id="formFile" onChange={handleFileSelect}></input>
  </div>);
};

export default FileSelector;