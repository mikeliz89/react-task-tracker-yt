import useRemoveFromStorage from "../../hooks/useRemoveFromStorage";

export default function ImageGridDeletion({ url, mainID, subID, fileName }) {

  const { error, success } = useRemoveFromStorage(url, mainID, subID, fileName);

  return (
    <></>
  )
}