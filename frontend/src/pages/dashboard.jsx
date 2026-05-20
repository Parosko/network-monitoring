import { useMonitoring } from '../hooks/useMonitoring';
import DeviceCard from '../components/DeviceCard/DeviceCard';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import styles from '../styles/dashboard.module.css';

function Dashboard() {
   const { devices, loading, error, lastUpdate } = useMonitoring(5000);

   if (loading && devices.length === 0) {
      return <Loading />;
   }

   return (
      <div className={styles.container}>
         <h1 className={styles.title}>Network Monitoring Dashboard</h1>

         {error && <ErrorMessage message={error} />}

         {devices.length === 0 ? (
            <div className={styles.noDevices}>No devices to monitor</div>
         ) : (
            <div className={styles.grid}>
               {devices.map((device, index) => (
                  <DeviceCard key={index} device={device} />
               ))}
            </div>
         )}

         <div className={styles.statusBar}>
            {lastUpdate && `Last updated: ${lastUpdate}`}
         </div>
      </div>
   );
}

export default Dashboard;