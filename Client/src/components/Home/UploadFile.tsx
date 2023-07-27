import * as React from 'react';
import isNil from 'lodash/isNil';

const UploadFile = ({ file }: { file: any }) => {
  const [PreviewImage, setPreviewImage] = React.useState<any>();
  const [imageType, setImageType] = React.useState<string>('');
  const [imageState, setImageState] = React.useState<number>(0);

  // mime type is all extensions that the file should take
  const imageMimeType: RegExp = /image\/(png|jpg|jpeg)/i;

  const handlePreviewFile = React.useCallback(() => {
    const fileReader: FileReader = new FileReader();
    // check if selected image type is good
    if (!file.type.match(imageMimeType)) {
      setImageType('select  a good image type');
    }
    fileReader.onload = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;
      setPreviewImage(result);
    };

    fileReader.onloadend = () => {
      setImageState(fileReader.readyState);
    };

    fileReader.readAsDataURL(file);
  }, [file]);

  // check whether the file is not undefined, null or empty before uploading it
  if (!isNil(file)) {
    handlePreviewFile();
  }

  return {
    PreviewImage,
    imageType,
    imageState,
    setPreviewImage,
  };
};

export default UploadFile;
