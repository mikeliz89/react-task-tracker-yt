import useRemoveFromStorage from "../../hooks/useRemoveFromStorage";

export default function ImageGridDeletion({ url, mainID, subID, fileName }) {

  const { } = useRemoveFromStorage(url, mainID, subID, fileName);

  return (
    <></>
  )
}