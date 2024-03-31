import { useCallback, useState } from 'react'
import FileSelector from './components/fileSelector'
import SubmitButton from './components/submitButton'
import CustomTextField from './components/textfield'
import ReactS3Client from 'react-aws-s3-typescript';

const s3Config = {
  bucketName: 'filesaver-lamba-learn',
  dirName: 'directory-name',      /* Optional */
  region: 'ap-south-1',
  accessKeyId:'ABCD12EFGH3IJ4KLMNO5',
  secretAccessKey: 'a12bCde3f4+5GhIjKLm6nOpqr7stuVwxy8ZA9bC0',
  s3Url: 'https:/your-aws-s3-bucket-url/'     /* Optional */
}


function App() {

  const [inputText, setInputText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null | undefined>();
  const s3 = new ReactS3Client(s3Config);

  const onsubmit = useCallback(async ()=>{
    console.log(inputText);
    console.log(selectedFile?.name);
    setInputText('');
    setSelectedFile(null);
  }, [inputText, selectedFile]);

  return (
    <>
      <CustomTextField inputValue={inputText} setInputValue={setInputText}/>
      <FileSelector setSelectedFile={setSelectedFile}/>
      <SubmitButton onSubmit={onsubmit}/>
    </>
  )
}

export default App
