import styles from '../styles/dashboard.module.css';

function Loading() {
   return (
      <div className={styles.loading}>
         <p>Loading devices...</p>
      </div>
   );
}

export default Loading;
