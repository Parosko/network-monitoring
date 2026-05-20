import { useEffect, useState } from 'react';
import { monitoringService } from '../services/monitoringService';

export const useMonitoring = (refreshInterval = 5000) => {
   const [devices, setDevices] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [lastUpdate, setLastUpdate] = useState(null);

   const fetchDevices = async () => {
      try {
         const data = await monitoringService.fetchDevices();
         setDevices(data);
         setLastUpdate(new Date().toLocaleTimeString());
         setError(null);
         console.log('✓ Data refreshed at', new Date().toLocaleTimeString());
      } catch (err) {
         setError(err.message);
         console.error('✗ Error fetching data:', err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchDevices();

      const interval = setInterval(() => {
         console.log('Refreshing data...');
         fetchDevices();
      }, refreshInterval);

      return () => clearInterval(interval);
   }, [refreshInterval]);

   return { devices, loading, error, lastUpdate };
};
