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
      return (
         <div className={styles.page}>
            <Loading />
         </div>
      );
   }

   return (
      <div className={styles.page}>
         <div className={styles.container}>
            <header className={styles.header}>
               <h1 className={styles.title}>Network monitor</h1>
               <p className={styles.subtitle}>
                  {devices.length} device{devices.length !== 1 ? 's' : ''}
                  {lastUpdate ? ` · Last sync ${lastUpdate}` : ''}
               </p>
            </header>

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
         </div>
      </div>
   );
}

export default Dashboard;
