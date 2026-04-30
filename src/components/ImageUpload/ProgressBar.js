//for debugging
//console.log(progress, url);

import { useEffect } from "react";

import useUploadToStorage from "../Hooks/useUploadToStorage";

import styles from './progressbar.module.css';

export default function ProgressBar({ file, setFile, objectID, imagesUrl }) {

  const { url, progress } = useUploadToStorage(file, imagesUrl, objectID);

  useEffect(() => {
    if (url) {
      setFile(null);
    }
  }, [url, setFile])

  return (
    <div className={styles.progressBar} style={{ width: progress + '%' }}></div>
  )
}


