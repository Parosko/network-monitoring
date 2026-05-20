import styles from './DeviceCard.module.css';

function DeviceCard({ device }) {
   return (
      <div className={styles.card}>
         <div className={styles.deviceName}>{device.name}</div>
         <div className={styles.info}>
            <strong>IP:</strong> {device.ip}
         </div>
         <div className={styles.info}>
            <strong>Status:</strong>{' '}
            <span className={device.alive ? styles.statusOnline : styles.statusOffline}>
               {device.alive ? '🟢 Online' : '🔴 Offline'}
            </span>
         </div>
         <div className={styles.info}>
            <strong>Latency:</strong> {device.time} ms
         </div>
      </div>
   );
}

export default DeviceCard;
