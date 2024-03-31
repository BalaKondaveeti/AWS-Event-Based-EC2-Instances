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
  const [showError, setShowError] = useState<string | null>(null);
  const [showUploadedtoS3, setShowUploadedtoS3] = useState<boolean>(false);
  const [showUploadedtoLambda, setshowUploadedtoLambda] = useState<boolean>(false);

  const onsubmit = useCallback(async () => {
    setShowUploadedtoS3(false);
    setshowUploadedtoLambda(false);
    setShowError(null);
    
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
        
        setShowUploadedtoS3(true);
        const response2 = await fetch(`https://myr0dmq7sc.execute-api.us-east-1.amazonaws.com/dev/invoke?text=${inputText}&s3Path=${response.Bucket+'/'+response.Key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (!response2.ok) {
          throw new Error('Network response was not ok');
        }
        console.log("Done");
        console.log(await response2.text());
        setshowUploadedtoLambda(true);
        return;
      } catch (error) {
        setShowUploadedtoS3(false);
        setshowUploadedtoLambda(false);
        console.error('Upload failed:', error);
        setShowError('Upload Failed, check console.');
      }
    } else {
      setShowError('Fill all information before submitting');
    }

  }, [inputText, selectedFile]);

  return (
    <div style={{ padding: '20px' }}>
      <CustomTextField inputValue={inputText} setInputValue={setInputText} />
      <FileSelector setSelectedFile={setSelectedFile} />
      <SubmitButton onSubmit={onsubmit} />
      {showError && <label style={{color: 'red', paddingTop: '20px'}}>⚠️ {showError}</label>}
      {showUploadedtoS3 && <label style={{color: 'green', paddingTop: '20px', width: '100%'}}>✅ Uploaded File to s3</label>}
      {showUploadedtoLambda && <label style={{color: 'green', paddingTop: '20px'}}>✅ Triggered Lambda</label>}
    </div>
  )
}

export default App
