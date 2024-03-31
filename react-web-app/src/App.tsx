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

  const onsubmit = useCallback(async () => {
    console.log(inputText);
    console.log(selectedFile?.name);
    if (selectedFile) {
      try {
        const response = await new AWS.S3().upload({
          Bucket: 'filesaver-lamba-learn', // Your S3 Bucket name
          Key: selectedFile.name, // File name you want to save as in S3
          Body: selectedFile,
        }).promise();
        console.log(response.toString() + "The output");
        setInputText('');
        setSelectedFile(null);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload faiibgled, check the console for more information.');
      }
    }
  }, [inputText, selectedFile]);

  return (
    <>
      <CustomTextField inputValue={inputText} setInputValue={setInputText} />
      <FileSelector setSelectedFile={setSelectedFile} />
      <SubmitButton onSubmit={onsubmit} />
    </>
  )
}

export default App
