import useStorage from "../../hooks/useStorage";
import { useEffect } from "react";
import styles from './progressbar.module.css';

function ProgressBar({ file, setFile }) {

  const { url, progress } = useStorage(file);
  console.log(progress, url);

  useEffect(() => {
    if (url) {
      setFile(null);
    }
  }, [url, setFile])

  return (
    <div className={styles.progressBar} style={{ width: progress + '%' }}></div>
  )
}

export default ProgressBar