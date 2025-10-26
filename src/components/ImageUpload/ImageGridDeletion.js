import useRemoveFromStorage from "../../Hooks/useRemoveFromStorage";

export default function ImageGridDeletion({ url, mainID, subID, fileName }) {

  const { } = useRemoveFromStorage(url, mainID, subID, fileName);

  return (
    <></>
  )
}