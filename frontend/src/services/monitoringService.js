const API_URL = 'http://localhost:3000';

export const monitoringService = {
   async fetchDevices() {
      const response = await fetch(`${API_URL}/ping`);
      if (!response.ok) throw new Error('Failed to fetch devices');
      return await response.json();
   },

   async addDevice(name, ip) {
      const response = await fetch(`${API_URL}/devices`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name, ip })
      });
      if (!response.ok) throw new Error('Failed to add device');
      return await response.json();
   }
};
