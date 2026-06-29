/* CCTV / Avigilon log-reading & troubleshooting topic.
 * Pushes one concept onto window.CONCEPTS (track "CCTV"). Each quiz/scenario
 * item carries an optional `log` field rendered as a monospace <pre> block by
 * the shared quiz engine, so the learner reads real-looking logs and pinpoints
 * the fault. No diagram; tabs/mastery adapt to what's present.
 */
(function () {
  "use strict";
  window.CONCEPTS = window.CONCEPTS || [];
  window.CONCEPTS.push({
    id: "cctv-logs",
    track: "CCTV",
    title: "Log Reading & Troubleshooting",
    icon: "🔍",
    blurb: "Read real Avigilon ACC and network logs and pinpoint the root cause — camera offline, storage, PoE, time sync, bandwidth, auth, licensing, and switch faults.",
    keyFacts: [
      "Always correlate by TIMESTAMP across sources: a camera going OFFLINE in ACC at the same second a switch logs a PoE/link error points to the switch, not the camera.",
      "An interface that self-assigns a 169.254.x.x (APIPA) address did NOT get a DHCP lease — suspect DHCP scope exhaustion or a broken relay (ip helper-address).",
      "%ILPOWER messages are PoE power-budget/inline-power events on the switch; %LINK/%LINEPROTO are physical link up/down; %PORT_SECURITY means a MAC violation err-disabled the port.",
      "Rising CRC / input errors with a duplex line in the log usually means a DUPLEX MISMATCH (one side full, one side half), not a bad camera.",
      "RAID 'DEGRADED' means the array is still serving footage but has lost redundancy; a second disk failure during rebuild loses data — replace the failed disk now.",
      "'Disk full / write failed / recording paused' = storage capacity or a failed volume, not a network problem; check retention settings and volume health.",
      "NTP offset / time drift in logs means timestamps across cameras won't line up — bad for evidence; point all cameras and the ACC server at the same NTP source.",
      "401 Unauthorized / ONVIF auth failed = wrong camera credentials; 'over license count' / channel-license errors mean you've exceeded purchased ACC channels."
    ],
    flashcards: [
      { front: "A switch logs '%ILPOWER-3-CONTROLLER_PORT_ERR: power budget exceeded' just before a camera goes offline. What is the cause?", back: "The switch's total PoE power budget is exhausted; the port can't power the camera (often a PTZ/heater drawing more watts). Move it to a higher-budget switch/port or use PoE+/++ or a PoE injector." },
      { front: "What does a camera with a 169.254.x.x address in the logs tell you?", back: "It failed to obtain a DHCP lease and self-assigned an APIPA address, so it's unreachable. Suspect DHCP scope exhaustion or a missing/broken ip helper-address (relay) on the camera VLAN." },
      { front: "Log shows rising CRC and input errors on a 100Mb/Full port whose peer is Half-duplex. Diagnosis?", back: "A duplex mismatch — late collisions and CRC/FCS errors result. Set both ends to the same duplex (or both to auto). It is a cabling/config fault, not a faulty camera." },
      { front: "RAID controller logs 'Array REC1 state: DEGRADED — disk 3 FAILED, no hot spare'. What does this mean and what's the risk?", back: "The array lost redundancy but is still recording; if a second disk fails before you replace disk 3 and rebuild, footage is lost. Replace the failed drive immediately." },
      { front: "ACC logs 'write failed, disk D: no space — recording paused'. Network or storage issue?", back: "Storage — the recording volume is full or failing. Check capacity, retention/overwrite settings, and volume health; it is not a network fault." },
      { front: "ACC logs 'NTP offset 47s' and several cameras show 'time drift'. Why does it matter for CCTV?", back: "Clocks are out of sync, so multi-camera footage timestamps won't align — undermining incident review and evidence. Sync all cameras and the ACC server to one NTP source." },
      { front: "ACC logs '401 Unauthorized / ONVIF auth failed' when adding a camera. Cause?", back: "The credentials (username/password) configured for the camera are wrong, so the camera rejects the connection. Re-enter the correct camera/ONVIF credentials." },
      { front: "ACC logs 'camera rejected — over license count'. What's wrong?", back: "You've connected more cameras than your ACC has channel licenses for; the extra camera won't record until you free a channel or add licenses." },
      { front: "Switch logs '%PORT_SECURITY: security violation, MAC change — port err-disabled' after a camera swap. Why is the new camera offline?", back: "Port security saw a new MAC on the locked port and shut it down (err-disabled). Update the allowed MAC / re-enable the port (and consider sticky MAC) after replacing hardware." },
      { front: "Core switch logs '98% utilization, output drops' and a camera reports '14% packet loss'. Diagnosis?", back: "An oversubscribed/saturated uplink is dropping packets, causing dropped frames and stuttering video. Add bandwidth, segment the camera VLAN, lower bitrates, or use multicast for shared streams." },
      { front: "Logs show 'multicast traffic exceeded — storm control dropping' and many cameras flapping on VLAN 100. Likely cause?", back: "Multicast is flooding the VLAN (often IGMP snooping disabled). Enable IGMP snooping so multicast video only reaches subscribers instead of every port." },
      { front: "ACC Web logs 'TLS handshake failed: certificate expired'. Effect?", back: "Clients can't connect over HTTPS because the server certificate is expired. Renew/replace the certificate to restore secure web/mobile access." },
      { front: "Log: '%LINK-3-UPDOWN Gi1/1/1 (fiber uplink) down' and a whole remote IDF of cameras goes offline together. What does the pattern tell you?", back: "Many cameras dropping at once points to a shared upstream failure — here the fiber uplink to that IDF, not the individual cameras. Check the SFP/fiber/uplink." },
      { front: "ACC logs 'AvigilonStorageService stopped unexpectedly (exit 0xC0000005), auto-restart 3/5'. What is happening?", back: "The recording/storage service is crashing repeatedly (an access-violation fault) and auto-restarting. Investigate the service/host (logs, updates, resources, disk health) — recording is at risk." },
      { front: "Why correlate ACC events with switch syslog by timestamp when troubleshooting an offline camera?", back: "It tells you which side failed first: a switch PoE/link error at the exact second the camera went OFFLINE means the network/power dropped it — you fix the switch, not the camera." },
      { front: "Camera firmware log: 'firmware 1.2.0 unsupported; analytics disabled'. What action does this call for?", back: "The camera firmware is too old for the ACC features/analytics; upgrade the camera firmware to a supported version to restore functionality." }
    ],
    quiz: [
      { log: "2026-06-29 12:04:31  SW1  %ILPOWER-3-CONTROLLER_PORT_ERR: Gi1/0/14: Power budget exceeded\n2026-06-29 12:04:31  SW1  %ILPOWER-5-IEEE_DISCONNECT: Gi1/0/14 IEEE disconnect\n2026-06-29 12:04:32  ACC  Camera 'NorthDoor-PTZ' (10.20.5.14) CONNECTED -> OFFLINE",
        q: "What is the root cause of the camera going offline?", choices: ["The camera firmware crashed", "The switch ran out of PoE power budget and cut power to the port", "DNS resolution failed for the camera", "The ACC license expired"], answer: 1, explain: "The %ILPOWER 'power budget exceeded' + IEEE disconnect at the same second as the OFFLINE event means the switch could no longer power that PoE port (a hungry PTZ); it's a power problem, not the camera." },
      { log: "ACC > Camera 'Lobby-Cam3' obtaining address...\nClient assigned 169.254.18.7 / 255.255.0.0\nACC  Camera 'Lobby-Cam3' status: UNREACHABLE (no route)",
        q: "What does the 169.254.18.7 address indicate?", choices: ["A valid static IP on the camera VLAN", "The camera reached the internet successfully", "The camera failed to get a DHCP lease and self-assigned an APIPA address", "The camera is using IPv6"], answer: 2, explain: "169.254.0.0/16 is APIPA — assigned only when DHCP fails. The DHCP scope is likely exhausted or the relay (ip helper-address) is missing, so the camera has no usable address." },
      { log: "SW2  show interface Gi1/0/8\n  Full-duplex, 100Mb/s  (link partner: Half-duplex)\n  19,442 input errors, 19,442 CRC, 211 late collision\n  Camera 'Dock-Cam' video: heavy stutter / frame loss",
        q: "What is causing the errors and stuttering video?", choices: ["A duplex mismatch between the switch and the camera", "The camera lens is dirty", "An expired TLS certificate", "RAID array failure"], answer: 0, explain: "Full-duplex on one end and Half-duplex on the other produces late collisions and CRC/input errors — a classic duplex mismatch. Set both ends to the same setting (or auto)." },
      { log: "RAID  Array 'REC1' state: DEGRADED\nRAID  Disk 3 (enclosure 1, slot 2): FAILED\nRAID  Hot spare: NONE  |  Rebuild: NOT STARTED",
        q: "What should the technician do, and why is it urgent?", choices: ["Nothing — degraded arrays self-heal", "Replace the failed disk now; a second failure before rebuild loses footage", "Reformat the array immediately", "Reduce the camera bitrate"], answer: 1, explain: "DEGRADED means redundancy is gone but recording continues. With no hot spare, a second disk failure during this window destroys data — replace disk 3 and rebuild immediately." },
      { log: "ACC  Storage volume D: 99% full\nACC  ERROR: write failed (disk D: no space)\nACC  Recording PAUSED for 3 cameras",
        q: "Is this a network or storage problem, and what's the fix?", choices: ["Network — restart the switch", "Storage — the recording volume is full; check capacity/retention or add storage", "Camera — reseat the lens module", "License — buy more channels"], answer: 1, explain: "'no space' / 'write failed' / 'recording paused' is a storage-capacity fault. Check the volume's free space, retention/overwrite policy, and disk health — the network is fine." },
      { log: "ACC Server  NTP: offset +47.5s from source 10.20.1.1 (unsynchronized)\nCamera 'Gate-2' time drift +52s\nCamera 'Bay-9' time drift +49s",
        q: "What problem will this cause and how do you fix it?", choices: ["Cameras will lose power; replace PoE injectors", "Footage timestamps won't align across cameras; sync all devices to one NTP source", "The RAID will degrade; replace a disk", "HTTPS will fail; renew the certificate"], answer: 1, explain: "Time drift means each camera stamps footage with a different clock, so multi-camera incident review and evidence integrity break down. Point all cameras and the ACC server at the same NTP server." },
      { log: "ACC  Adding camera 10.20.5.41 (ONVIF)...\nACC  ONVIF auth failed: 401 Unauthorized (user 'admin')\nACC  Camera 'Gate-1' NOT added",
        q: "What is the most likely cause?", choices: ["The camera is powered off", "Wrong username/password configured for the camera", "The switch port is err-disabled", "The ACC database is corrupt"], answer: 1, explain: "A 401 Unauthorized from the camera's ONVIF service means the credentials ACC is using are wrong. Re-enter the correct camera/ONVIF username and password." },
      { log: "ACC  License check: 51 cameras connected, 50 channel licenses available\nACC  Camera 'Annex-2' REJECTED — over license count",
        q: "Why won't 'Annex-2' record?", choices: ["Its IP conflicts with another device", "You've exceeded the number of purchased ACC channel licenses", "Its firmware is unsupported", "The NTP server is down"], answer: 1, explain: "There are more connected cameras than channel licenses. Free up a channel or add licenses so the extra camera can be recorded." },
      { log: "SW1  %PORT_SECURITY-2-PSECURE_VIOLATION: security violation on Gi1/0/14\nSW1  MAC 00:18:85:1a:2b:3c != allowed MAC; port Gi1/0/14 -> err-disabled\nACC  Camera 'NorthDoor' OFFLINE (after hardware swap)",
        q: "Why did the replacement camera fail to come online?", choices: ["Port security shut the port down because the new camera has a different MAC", "The new camera needs a license", "The fiber uplink is down", "DHCP is disabled"], answer: 0, explain: "Port security had locked the old MAC; the replacement's new MAC triggered a violation and err-disabled the port. Update the allowed/sticky MAC and re-enable the port." },
      { log: "SW-CORE  Gi1/0/1 utilization 98% (1Gbps), output drops 24,114 and climbing\nACC  Camera 'Park-7' stream: 14% packet loss, frame gaps\nACC  Camera 'Park-9' stream: 11% packet loss",
        q: "What is the root cause of the packet loss on multiple cameras?", choices: ["Each camera has a separate hardware fault", "The shared uplink is saturated and dropping packets", "The cameras' certificates expired", "The DHCP pool is exhausted"], answer: 1, explain: "A near-100% uplink with rising output drops, hitting several cameras at once, is congestion. Add bandwidth, segment traffic, lower bitrates, or use multicast for shared live streams." },
      { log: "SW3  %STORM_CONTROL: multicast exceeded threshold on Gi1/0/2 — dropping\nSW3  VLAN 100: multicast flood detected\nACC  cameras on VLAN 100 flapping CONNECTED/OFFLINE",
        q: "What configuration most likely fixes this?", choices: ["Disable PoE on the affected ports", "Enable IGMP snooping so multicast video only reaches subscribed ports", "Increase the DHCP lease time", "Replace the RAID controller"], answer: 1, explain: "Multicast flooding the whole VLAN points to IGMP snooping being off. With it enabled, multicast streams are sent only to ports that joined the group, ending the flood." },
      { log: "ACC Web Service  TLS handshake failed\n  reason: server certificate expired 2026-05-30\n  result: HTTPS clients and mobile app cannot connect",
        q: "What is the fix?", choices: ["Restart every camera", "Renew/replace the expired server certificate", "Add more PoE budget", "Rebuild the RAID array"], answer: 1, explain: "The web/mobile clients fail TLS because the ACC server's certificate has expired. Install a renewed certificate to restore secure connections." },
      { log: "SW2-IDF  %LINK-3-UPDOWN: Interface Gi1/1/1 (fiber uplink), changed state to down\nACC  Camera 'IDF2-01' OFFLINE\nACC  Camera 'IDF2-02' OFFLINE\nACC  Camera 'IDF2-03' OFFLINE  (all within 1 second)",
        q: "What does the pattern of failures tell you?", choices: ["Each camera coincidentally failed", "A shared upstream link failed — the fiber uplink to that IDF", "The ACC license expired", "The cameras need firmware updates"], answer: 1, explain: "Many cameras in the same closet dropping in the same second points to a shared upstream fault — the fiber uplink going down — not individual camera failures. Check the SFP/fiber." },
      { log: "ACC Server  Service 'AvigilonStorageService' stopped unexpectedly\n  exit code 0xC0000005 (access violation)\n  auto-restart attempt 3 of 5",
        q: "What is happening on the ACC server?", choices: ["A camera lens failed", "The recording/storage service is repeatedly crashing and auto-restarting", "The switch lost power", "DHCP is misconfigured"], answer: 1, explain: "The storage service is crashing (access violation) and looping through restarts, putting recording at risk. Investigate host resources, disk health, and updates on the ACC server." },
      { log: "ACC  Camera 'Bay-9' added\nACC  WARNING: firmware 1.2.0 unsupported (min 2.4.0)\nACC  Self-Learning Analytics: DISABLED for 'Bay-9'",
        q: "Why are analytics disabled and what's the remedy?", choices: ["The camera is out of license; buy more channels", "The camera firmware is too old; upgrade it to a supported version", "The RAID is degraded; replace a disk", "The NTP server is unreachable; fix time sync"], answer: 1, explain: "The camera's firmware predates the minimum the analytics feature needs. Upgrading the camera firmware to a supported version re-enables analytics." },
      { log: "ACC  Duplicate IP detected on 10.20.5.30\n  device A: camera 'Lobby-2' (00:18:85:aa:bb:cc)\n  device B: NVR-aux (00:1c:2d:ee:ff:00)\nACC  Camera 'Lobby-2' intermittently OFFLINE",
        q: "What is causing 'Lobby-2' to drop intermittently?", choices: ["An IP address conflict — two devices share 10.20.5.30", "A PoE power-budget problem", "An expired certificate", "A duplex mismatch"], answer: 0, explain: "Two devices answering for the same IP causes intermittent connectivity as ARP entries flip. Assign a unique IP (or a DHCP reservation) to resolve the conflict." },
      { log: "ACC  ping 10.30.0.5 (remote site gateway) -> Request timed out x4\nACC  traceroute stops after core router 10.20.0.1\nACC  All cameras at SiteB (10.30.0.0/24) OFFLINE",
        q: "Where is the fault most likely located?", choices: ["In each individual SiteB camera", "On the path/link to the remote site (10.30.0.0/24 unreachable beyond the core)", "In the ACC license server", "In the RAID controller"], answer: 1, explain: "Traceroute dying at the core and the whole remote subnet being unreachable points to a WAN/routing/link failure to SiteB, not the cameras themselves." },
      { log: "SW1  %SPANTREE-2-RECV_PVID_ERR: Received BPDU with inconsistent peer vlan id\nSW1  %SPANTREE-2-BLOCK_PVID_LOCAL: Blocking Gi1/0/24\nACC  multiple cameras flapping; network unstable",
        q: "What does this spanning-tree log indicate?", choices: ["A VLAN/native-VLAN mismatch (or loop) on the trunk causing STP to block and instability", "The cameras need more PoE power", "The storage volume is full", "A certificate expired"], answer: 0, explain: "PVID inconsistency BPDUs mean the trunk's VLANs don't match end-to-end (native VLAN mismatch / potential loop); STP blocks the port and the network destabilizes. Fix the trunk VLAN config." },
      { log: "DHCP-SRV  Scope 10.20.5.0/24: 0 addresses available (254/254 leased)\nACC  3 new cameras stuck obtaining address\nACC  Camera 'West-12' assigned 169.254.4.9 (APIPA)",
        q: "What is the underlying problem?", choices: ["The DHCP scope is exhausted — no free addresses", "The cameras have failed hardware", "The switch lost PoE", "The certificate expired"], answer: 0, explain: "The scope shows 254/254 leased and new cameras can't get an address (one falls back to APIPA). Expand the scope, shorten lease time, or add a subnet for the cameras." },
      { log: "ACC Server  CPU 19%  |  RAM 62%\nACC Server  Disk D: queue length 240 (avg 0.9s latency)\nACC  Recording 'choppy', frames buffered then dropped on 8 cameras",
        q: "Which subsystem is the bottleneck?", choices: ["Network bandwidth", "Disk I/O — the storage volume can't keep up with the write load", "PoE power", "Camera firmware"], answer: 1, explain: "Low CPU/RAM but a huge disk queue and high latency means the storage subsystem (disk I/O) is saturated, so writes back up and frames drop. Improve disk throughput or spread the load." }
    ],
    scenarios: [
      { log: "08:15:02  ACC   Camera 'Warehouse-PTZ' OFFLINE\n08:15:02  SW4   %ILPOWER-3-CONTROLLER_PORT_ERR: Gi1/0/6 power budget exceeded\n08:15:40  ACC   Camera 'Warehouse-PTZ' ONLINE\n08:16:10  ACC   Camera 'Warehouse-PTZ' OFFLINE  (repeating)",
        situation: "A PTZ camera keeps cycling online/offline. The logs above repeat every minute. What is the best first action?", choices: ["Replace the camera — it's clearly faulty", "Move the PTZ to a PoE+/++ port or switch with spare power budget, since the switch keeps cutting power when the PTZ draws peak watts", "Increase the DHCP lease time", "Renew the ACC certificate"], answer: 1, explain: "The flapping lines up with PoE power-budget errors — the PTZ's motor/heater peaks exceed the switch's remaining budget. Give it adequate PoE (higher-budget port/switch or injector) before assuming the camera is bad." },
      { log: "ACC   Backup last succeeded: 2026-06-08 (21 days ago)\nACC   Config/database backup task: FAILED (destination unreachable)\nACC   Storage volume E: (backup target) status: OFFLINE",
        situation: "During a routine review you see the above. Recording to the primary volume is fine. What's the priority?", choices: ["Ignore it — recording still works", "Restore the offline backup target and verify backups resume, so a server/database failure wouldn't be unrecoverable", "Delete all old footage", "Lower the camera frame rates"], answer: 1, explain: "Live recording working hides that backups have silently failed for 3 weeks. If the server/database dies, config and metadata are unrecoverable — fix the backup target and confirm a successful backup." },
      { log: "ACC   Camera 'Entrance-1' image: very dark / IR not engaging at night\nACC   Camera health: OK, stream OK, no network errors\nCamera log: 'ICR (IR-cut filter) move timeout'; 'IR LED board: no response'",
        situation: "Night images are unusable but the network/stream logs are clean. What does this point to?", choices: ["A network bandwidth problem", "A camera hardware fault (IR-cut filter / IR illuminator), not a network or ACC issue", "An expired license", "A duplex mismatch"], answer: 1, explain: "Clean network/stream logs plus ICR/IR hardware errors localize the fault to the camera's IR subsystem. This needs camera service/replacement, not network troubleshooting." },
      { log: "SW-CORE  CPU utilization 99% (sustained)\nSW-CORE  %CPU: ARP input process high\nSW-CORE  many MAC moves logged on VLAN 100\nACC   widespread camera flapping across the site",
        situation: "Site-wide camera instability with the core switch CPU pegged and constant MAC moves. What's the most likely culprit?", choices: ["Every camera needs a firmware update", "A Layer 2 loop / broadcast storm on VLAN 100 is flooding the network and overloading the switch CPU", "The RAID array is degraded", "The NTP server is down"], answer: 1, explain: "Pegged CPU from ARP/flooding plus constant MAC moves and site-wide flapping are signatures of a switching loop/broadcast storm. Find and break the loop (check STP, redundant cabling, BPDU guard)." }
    ],
    games: {
      match: [
        { a: "%ILPOWER power budget exceeded", b: "Switch out of PoE power" },
        { a: "169.254.x.x address", b: "DHCP lease failed (APIPA)" },
        { a: "CRC errors + duplex line", b: "Duplex mismatch" },
        { a: "Array state DEGRADED", b: "RAID lost a disk / redundancy" },
        { a: "401 Unauthorized (ONVIF)", b: "Wrong camera credentials" },
        { a: "NTP offset / time drift", b: "Clocks out of sync" },
        { a: "over license count", b: "Too few ACC channels" },
        { a: "certificate expired", b: "HTTPS clients can't connect" }
      ],
      sort: {
        prompt: "Sort each log signature by the subsystem you'd investigate first.",
        buckets: {
          "Network / Switch": ["%ILPOWER power budget exceeded", "duplex mismatch CRC errors", "uplink Gi1/1/1 down", "multicast storm on VLAN"],
          "Storage / Server": ["disk D: no space, write failed", "RAID array DEGRADED", "StorageService crashed (0xC0000005)", "disk queue length 240, high latency"],
          "Camera / Config": ["401 ONVIF Unauthorized", "firmware unsupported, analytics disabled", "duplicate IP detected", "IR-cut filter move timeout"]
        }
      }
    }
  });
})();
