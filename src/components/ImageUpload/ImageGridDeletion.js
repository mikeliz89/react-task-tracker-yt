import useRemoveFromStorage from "../../hooks/useRemoveFromStorage";

function ImageGridDeletion({ url, mainID, subID, fileName }) {

  const { error, success } = useRemoveFromStorage(url, mainID, subID, fileName);

  return (
    <></>
  )
}

export default ImageGridDeletion