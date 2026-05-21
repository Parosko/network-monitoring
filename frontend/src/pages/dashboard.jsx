import { useEffect, useState } from 'react';
import { useMonitoring } from '../hooks/useMonitoring';
import DeviceCard from '../components/DeviceCard/DeviceCard';
import DeviceChartModal from '../components/DeviceChartModal/DeviceChartModal';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import styles from '../styles/dashboard.module.css';

function Dashboard() {
   const { devices, loading, error, lastUpdate } = useMonitoring(5000);
   const [selectedIp, setSelectedIp] = useState(null);

   const selectedDevice = selectedIp
      ? devices.find((d) => d.ip === selectedIp) ?? null
      : null;

   useEffect(() => {
      const onKeyDown = (e) => {
         if (e.key === 'Escape') setSelectedIp(null);
      };
      if (selectedIp) {
         document.addEventListener('keydown', onKeyDown);
         return () => document.removeEventListener('keydown', onKeyDown);
      }
   }, [selectedIp]);

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
               {devices.map((device) => (
                  <DeviceCard
                     key={device.ip}
                     device={device}
                     onSelect={(d) => setSelectedIp(d.ip)}
                  />
               ))}
            </div>
         )}

         {selectedDevice && (
            <DeviceChartModal
               device={selectedDevice}
               onClose={() => setSelectedIp(null)}
            />
         )}

         <div className={styles.statusBar}>
            {lastUpdate && `Last updated: ${lastUpdate}`}
         </div>
      </div>
   );
}

export default Dashboard;