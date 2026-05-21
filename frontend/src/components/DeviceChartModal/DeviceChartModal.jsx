import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Tooltip,
   Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { IconClose } from '../Icons/Icons';
import styles from './DeviceChartModal.module.css';

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Tooltip,
   Legend
);

function DeviceChartModal({ device, onClose }) {
   if (!device) return null;

   const history = device.latencyHistory || [];
   const labels = history.map((_, i) => String(i + 1));

   const chartData = {
      labels,
      datasets: [
         {
            label: 'Latency (ms)',
            data: history,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.06)',
            borderWidth: 2,
            pointRadius: history.length > 30 ? 0 : 2,
            tension: 0.15,
            fill: true,
         },
      ],
   };

   const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
         legend: { display: false },
         tooltip: {
            callbacks: {
               title: (items) => `Sample ${items[0]?.label}`,
               label: (ctx) => `${ctx.parsed.y} ms`,
            },
         },
      },
      scales: {
         x: {
            title: { display: true, text: 'Sample (oldest → newest)', font: { family: 'Poppins' } },
            grid: { color: '#f4f4f5' },
            ticks: { font: { family: 'Poppins', size: 11 } },
         },
         y: {
            title: { display: true, text: 'ms', font: { family: 'Poppins' } },
            beginAtZero: true,
            grid: { color: '#f4f4f5' },
            ticks: { font: { family: 'Poppins', size: 11 } },
         },
      },
   };

   const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) onClose();
   };

   return (
      <div className={styles.backdrop} onClick={handleBackdropClick} role="presentation">
         <div className={styles.modal} role="dialog" aria-labelledby="chart-modal-title">
            <div className={styles.header}>
               <div>
                  <h2 id="chart-modal-title" className={styles.title}>{device.name}</h2>
                  <p className={styles.subtitle}>{device.ip}</p>
               </div>
               <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
                  <IconClose />
               </button>
            </div>

            <div className={styles.summary}>
               <span>Current <strong>{device.time} ms</strong></span>
               <span>Avg <strong>{device.avgLatency || 0} ms</strong></span>
               <span>Min <strong>{device.minLatency || 0} ms</strong></span>
               <span>Max <strong>{device.maxLatency || 0} ms</strong></span>
               <span>Samples <strong>{history.length}</strong></span>
            </div>

            <div className={styles.chartWrap}>
               {history.length === 0 ? (
                  <p className={styles.empty}>No latency data yet.</p>
               ) : (
                  <Line data={chartData} options={chartOptions} />
               )}
            </div>
         </div>
      </div>
   );
}

export default DeviceChartModal;
