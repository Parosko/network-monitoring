import styles from './DeviceCard.module.css';

function StatItem({ label, value, unit, tooltip, hasData = true }) {
   const displayValue = hasData ? value : '-';
   
   return (
      <div className={styles.statItem}>
         <div className={styles.statLabel} title={tooltip}>
            {label}
            <span className={styles.infoIcon}>ℹ️</span>
         </div>
         <div className={`${styles.statValue} ${!hasData ? styles.noData : ''}`}>
            {displayValue}
            {unit && hasData && <span className={styles.unit}>{unit}</span>}
         </div>
      </div>
   );
}

function getStatusColor(device) {
   if (!device.alive) return 'critical';
   if (device.time > 100) return 'slow';
   if (device.successRate < 80) return 'warning';
   return 'healthy';
}

function getLatencyColor(latency) {
   if (latency > 100) return styles.latencySlow;
   if (latency > 50) return styles.latencyWarning;
   return styles.latencyGood;
}

function getSuccessRateColor(rate) {
   if (rate >= 95) return styles.rateExcellent;
   if (rate >= 80) return styles.rateGood;
   return styles.rateWarning;
}

function DeviceCard({ device }) {
   const statusColor = getStatusColor(device);
   const lastUpdateTime = device.lastCheckedTime 
      ? new Date(device.lastCheckedTime).toLocaleTimeString()
      : 'N/A';

   // Determine if we have enough samples for stable metrics
   const hasStableMetrics = device.sampleCount >= 3;
   const hasAnyMetrics = device.sampleCount > 0;

   // Debug log
   console.log(`[${device.name}] totalChecks: ${device.totalChecks}, sampleCount: ${device.sampleCount}, successRate: ${device.successRate}%, consecutive: ${device.consecutiveResponses}`);

   return (
      <div className={`${styles.card} ${styles[`status_${statusColor}`]}`}>
         {/* Header */}
         <div className={styles.header}>
            <h2 className={styles.deviceName}>{device.name}</h2>
            <div className={styles.headerRight}>
               {device.isMonitoring && (
                  <span className={styles.monitoringIndicator} title="System is actively monitoring this device">
                     🟡 Monitoring
                  </span>
               )}
               <span className={`${styles.statusBadge} ${device.alive ? styles.online : styles.offline}`}>
                  {device.alive ? '🟢 Online' : '🔴 Offline'}
               </span>
            </div>
         </div>

         {/* Device Info */}
         <div className={styles.basicInfo}>
            <StatItem 
               label="IP Address" 
               value={device.ip}
               tooltip="The IP address of the device being monitored"
            />
            {device.type && (
               <StatItem 
                  label="Device Type" 
                  value={device.type}
                  tooltip="Category or type of the device"
               />
            )}
         </div>

         {/* Data Collection Status */}
         {device.totalChecks > 0 && device.sampleCount < 3 && (
            <div className={styles.statusMessage}>
               📊 Collecting data... ({device.sampleCount} of 3 samples, {device.totalChecks} total checks)
            </div>
         )}

         {/* Latency Stats Grid */}
         <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Latency Statistics</h3>
            <div className={styles.statsGrid}>
               <StatItem 
                  label="Current"
                  value={device.time}
                  unit="ms"
                  tooltip="The latency of the most recent ping (in milliseconds)"
               />
               <StatItem 
                  label="Average"
                  value={device.avgLatency || 0}
                  unit="ms"
                  tooltip="Average latency calculated from recent measurements"
                  hasData={hasAnyMetrics}
               />
               <StatItem 
                  label="Min"
                  value={device.minLatency || 0}
                  unit="ms"
                  tooltip="Lowest latency recorded in recent measurements"
                  hasData={hasStableMetrics}
               />
               <StatItem 
                  label="Max"
                  value={device.maxLatency || 0}
                  unit="ms"
                  tooltip="Highest latency recorded in recent measurements"
                  hasData={hasStableMetrics}
               />
            </div>
            {!hasStableMetrics && device.totalChecks > 0 && (
               <small className={styles.metricNote}>
                  Min/Max will stabilize after 3+ measurements
               </small>
            )}
         </div>

         {/* Quality Metrics */}
         <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Quality Metrics</h3>
            <div className={styles.qualityMetrics}>
               <div className={styles.metricRow}>
                  <StatItem 
                     label="Success Rate"
                     value={device.successRate || 0}
                     unit="%"
                     tooltip="Percentage of successful ping responses out of total attempts"
                  />
                  <div className={styles.successRateBar}>
                     <div 
                        className={styles.successRateFill}
                        style={{ width: `${device.successRate || 0}%` }}
                     ></div>
                  </div>
               </div>
               <StatItem 
                  label="Packet Loss"
                  value={device.packetLoss || 0}
                  unit="%"
                  tooltip="Percentage of packets lost during transmission"
               />
            </div>
         </div>

         {/* Connection Info - Always Show */}
         <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Connection Info</h3>
            <div className={styles.connectionInfo}>
               <StatItem 
                  label="Consecutive Responses"
                  value={device.consecutiveResponses || 0}
                  tooltip="Number of consecutive successful ping responses (resets if device goes offline)"
               />
               <StatItem 
                  label="Total Checks"
                  value={device.totalChecks || 0}
                  tooltip="Total number of ping attempts since monitoring started"
               />
               {device.sampleCount > 0 && (
                  <StatItem 
                     label="Data Samples"
                     value={device.sampleCount || 0}
                     tooltip="Number of successful latency measurements collected (max 100)"
                  />
               )}
               {device.successCount !== undefined && (
                  <StatItem 
                     label="Successful Pings"
                     value={device.successCount || 0}
                     tooltip="Total number of successful ping responses"
                  />
               )}
            </div>
         </div>

         {/* Footer */}
         <div className={styles.footer}>
            <small>Last updated: {lastUpdateTime}</small>
            {device.isMonitoring && (
               <small className={styles.monitoringNote}>
                  Pinging every 5 seconds automatically
               </small>
            )}
         </div>
      </div>
   );
}

export default DeviceCard;
