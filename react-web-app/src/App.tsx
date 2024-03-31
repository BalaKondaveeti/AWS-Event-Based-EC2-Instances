import { useCallback, useState } from 'react'
import FileSelector from './components/fileSelector'
import SubmitButton from './components/submitButton'
import CustomTextField from './components/textfield'
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1', // e.g., 'us-west-2'
  accessKeyId:  'AKIA47CRVLP3OP56FQ6I',
  secretAccessKey: '6CpktMq7jvlbmljOh1ZCYj3xD7Wc75njP3l0+6zB',
});

function App() {

  const [inputText, setInputText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null | undefined>();
  const [showError, setShowError] = useState<boolean>(false);
  const [showUploadedtoS3, setShowUploadedtoS3] = useState<boolean>(false);
  const [showUploadedtoLambda, setshowUploadedtoLambda] = useState<boolean>(false);

  const onsubmit = useCallback(async () => {
    setShowUploadedtoS3(false);
    setshowUploadedtoLambda(false);
    setShowError(false);
    
    console.log(inputText);
    console.log(selectedFile?.name);

    if (selectedFile && inputText) {
      try {
        const response = await new AWS.S3().upload({
          Bucket: 'filesaver-lamba-learn',
          Key: selectedFile.name,
          Body: selectedFile,
        }).promise();
        console.log(response.Location + "The output");
        setInputText('');
        setSelectedFile(null);
        setShowUploadedtoS3(true);
        return;
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload faiibgled, check the console for more information.');
      }
    } else {
      setShowError(true);
    }

  }, [inputText, selectedFile]);

  return (
    <div style={{ padding: '20px' }}>
      <CustomTextField inputValue={inputText} setInputValue={setInputText} />
      <FileSelector setSelectedFile={setSelectedFile} />
      <SubmitButton onSubmit={onsubmit} />
      {showError && <label style={{color: 'red', paddingTop: '20px'}}>⚠️ Complete Information is Required</label>}
      {showUploadedtoS3 && <label style={{color: 'green', paddingTop: '20px'}}>✅ Uploaded File to s3</label>}
      {showUploadedtoLambda && <label style={{color: 'green', paddingTop: '20px'}}>✅ Triggered to Lambda</label>}
    </div>
  )
}

export default App
