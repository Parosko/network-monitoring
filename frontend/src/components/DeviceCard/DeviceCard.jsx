import { IconActivity, IconBarChart, IconDot, IconInfo } from '../Icons/Icons';
import styles from './DeviceCard.module.css';

function StatItem({ label, value, unit, tooltip, hasData = true }) {
   const displayValue = hasData ? value : '—';

   return (
      <div className={styles.statItem}>
         <span className={styles.statLabel} title={tooltip}>
            {label}
            {tooltip && <IconInfo className={styles.infoIcon} />}
         </span>
         <span className={`${styles.statValue} ${!hasData ? styles.noData : ''}`}>
            {displayValue}
            {unit && hasData && <span className={styles.unit}>{unit}</span>}
         </span>
      </div>
   );
}

function StatusBadge({ alive }) {
   return (
      <span className={styles.statusBadge}>
         <IconDot className={`${styles.statusDot} ${alive ? styles.dotOnline : styles.dotOffline}`} />
         {alive ? 'Online' : 'Offline'}
      </span>
   );
}

function DeviceCard({ device, onSelect }) {
   const lastUpdateTime = device.lastCheckedTime
      ? new Date(device.lastCheckedTime).toLocaleTimeString()
      : '—';

   const hasStableMetrics = device.sampleCount >= 3;
   const hasAnyMetrics = device.sampleCount > 0;

   const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
         e.preventDefault();
         onSelect?.(device);
      }
   };

   return (
      <div
         className={`${styles.card} ${onSelect ? styles.clickable : ''}`}
         onClick={() => onSelect?.(device)}
         onKeyDown={handleKeyDown}
         role={onSelect ? 'button' : undefined}
         tabIndex={onSelect ? 0 : undefined}
      >
         <div className={styles.header}>
            <h2 className={styles.deviceName}>{device.name}</h2>
            <div className={styles.headerRight}>
               {device.isMonitoring && (
                  <span className={styles.tag} title="Actively monitored">
                     <IconActivity className={styles.tagIcon} />
                     Live
                  </span>
               )}
               <StatusBadge alive={device.alive} />
            </div>
         </div>

         <div className={styles.meta}>
            <StatItem label="IP address" value={device.ip} />
            {device.type && <StatItem label="Type" value={device.type} />}
         </div>

         {device.totalChecks > 0 && device.sampleCount < 3 && (
            <div className={styles.notice}>
               <IconBarChart className={styles.noticeIcon} />
               <span>
                  Collecting samples ({device.sampleCount}/3, {device.totalChecks} checks so far)
               </span>
            </div>
         )}

         <div className={styles.block}>
            <h3 className={styles.blockTitle}>Latency</h3>
            <div className={styles.statsGrid}>
               <StatItem label="Current" value={device.time} unit="ms" tooltip="Latest ping" />
               <StatItem
                  label="Average"
                  value={device.avgLatency || 0}
                  unit="ms"
                  tooltip="Mean of recent samples"
                  hasData={hasAnyMetrics}
               />
               <StatItem
                  label="Min"
                  value={device.minLatency || 0}
                  unit="ms"
                  hasData={hasStableMetrics}
               />
               <StatItem
                  label="Max"
                  value={device.maxLatency || 0}
                  unit="ms"
                  hasData={hasStableMetrics}
               />
            </div>
            {!hasStableMetrics && device.totalChecks > 0 && (
               <span className={styles.hint}>Min and max appear after 3 samples.</span>
            )}
         </div>

         <div className={styles.block}>
            <h3 className={styles.blockTitle}>Quality</h3>
            <div className={styles.qualityRow}>
               <StatItem
                  label="Success rate"
                  value={device.successRate || 0}
                  unit="%"
                  tooltip="Successful pings / total checks"
               />
               <div className={styles.progressTrack} aria-hidden>
                  <div
                     className={styles.progressFill}
                     style={{ width: `${device.successRate || 0}%` }}
                  />
               </div>
            </div>
            <StatItem label="Packet loss" value={device.packetLoss || 0} unit="%" />
         </div>

         <div className={styles.block}>
            <h3 className={styles.blockTitle}>Connection</h3>
            <div className={styles.connectionGrid}>
               <StatItem label="Consecutive" value={device.consecutiveResponses || 0} />
               <StatItem label="Total checks" value={device.totalChecks || 0} />
               {device.sampleCount > 0 && (
                  <StatItem label="Samples" value={device.sampleCount || 0} />
               )}
               {device.successCount !== undefined && (
                  <StatItem label="Successful" value={device.successCount || 0} />
               )}
            </div>
         </div>

         <div className={styles.footer}>
            <span>Updated {lastUpdateTime}</span>
            {onSelect && <span className={styles.viewChart}>Click card for chart</span>}
         </div>
      </div>
   );
}

export default DeviceCard;
