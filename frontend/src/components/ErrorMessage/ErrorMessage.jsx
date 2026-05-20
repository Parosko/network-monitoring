import styles from '../../styles/dashboard.module.css';

function ErrorMessage({ message }) {
   return (
      <div className={styles.error}>
         <strong>Error:</strong> {message}
      </div>
   );
}

export default ErrorMessage;
