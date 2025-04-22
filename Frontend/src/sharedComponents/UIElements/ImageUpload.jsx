import { useEffect, useRef, useState } from "react";
import Button from "./Button";

export default function ImageUpload({ id, onInput, errorText }) {
  const [file, setFile] = useState();
  const [previewURL, setPreviewURL] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewURL(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (e) => {
    let pickedFile;
    let fileIsValid = isValid;

    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    onInput(id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <input
        id={id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />

      <div className="w-40 h-40 border border-gray-300 rounded-md overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
        {previewURL ? (
          <img src={previewURL} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <p className="text-gray-400 text-sm text-center p-2">Please pick an image</p>
        )}
      </div>

      <Button type="button" onClick={pickImageHandler}>
        Pick Image
      </Button>

      {!isValid && (
        <p className="text-sm text-red-500 mt-2 text-center">{errorText}</p>
      )}
    </div>
  );
}
