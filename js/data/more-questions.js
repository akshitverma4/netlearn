/* Expansion pack: extra flashcards and quiz questions merged into the base
 * concepts at load time. Kept separate from concepts.js so the core model
 * stays readable. Facts are grounded in the same Avigilon / CCTV diagrams.
 */
(function () {
  "use strict";

  var EXTRA = {
    /* ----------------------------------------------------------- CCTV */
    "cctv": {
      flashcards: [
        { front: "Which layer sits between the cameras and the servers, and what does it include?", back: "The Network layer — PoE switches, a core L3 switch/router, and a firewall." },
        { front: "What is the role of a second ACC Server in a deployment?", back: "Failover and load balancing — it takes over recording/management if the primary fails." },
        { front: "Name three IP camera form factors you might see in a deployment.", back: "Bullet, dome, PTZ, fisheye 360, and door stations (intercom + camera)." },
        { front: "What does QoS on the core switch achieve for video?", back: "It prioritises time-sensitive video/voice traffic so it isn't delayed by bulk data." },
        { front: "Which two storage technologies appear in the Storage layer beyond internal disks?", back: "NAS/SAN (networked storage over iSCSI) and long-term archive storage." },
        { front: "How do remote users typically view cameras securely?", back: "Through the firewall/VPN gateway (or cloud), not by exposing the server directly to the internet." },
        { front: "What client options exist for viewing video?", back: "Control Room video wall (ACC Client), Admin PC (ACC Client/config), and the ACC Mobile app." },
        { front: "Why is a door station both a camera and an intercom?", back: "It provides video at the entry point plus two-way audio for access/visitor management." }
      ],
      quiz: [
        { q: "Which layer would you troubleshoot first if ALL cameras on one switch go offline together?", choices: ["Storage layer", "Network layer (that PoE switch)", "Client layer", "Remote access"], answer: 1, explain: "A whole switch's worth of cameras dropping points to that PoE switch / network layer." },
        { q: "What is the main benefit of an AI Appliance in the architecture?", choices: ["More storage", "Offloading video analytics from the recording server", "Faster DNS", "Higher PoE budget"], answer: 1, explain: "The AI Appliance handles analytics/object detection so the ACC server isn't overloaded." },
        { q: "Inter-VLAN routing in a CCTV network is performed by the…", choices: ["PoE switch", "Core switch / L3 router", "Camera", "NAS"], answer: 1, explain: "The core L3 switch/router routes between VLANs (cameras, servers, clients)." },
        { q: "Long-term retention of footage beyond the live array is the job of…", choices: ["The PoE switch", "Archive storage", "The door station", "The firewall"], answer: 1, explain: "Archive storage holds older footage for long-term retention." },
        { q: "A PTZ camera in the architecture is most likely powered by…", choices: ["PoE (15.4W)", "PoE+ (30W) or higher", "USB", "A wall socket"], answer: 1, explain: "PTZs draw more power, needing PoE+ or above." },
        { q: "Which device controls what traffic may reach the system from the internet?", choices: ["Core switch", "Firewall / VPN gateway", "NAS", "AI appliance"], answer: 1, explain: "The firewall (often with a VPN gateway) governs remote/internet access." }
      ]
    },

    /* ------------------------------------------------------- DHCP/DNS */
    "dhcp-dns": {
      flashcards: [
        { front: "What is a DHCP lease?", back: "A time-limited assignment of an IP to a device; it must be renewed before expiry or the address can change." },
        { front: "What is a DHCP reservation?", back: "A DHCP rule that always gives a specific MAC address the same IP — combines DHCP convenience with a fixed address." },
        { front: "Which DORA message is a broadcast from the client?", back: "DISCOVER — the client doesn't yet have an IP, so it broadcasts to find a DHCP server." },
        { front: "What three things (besides an IP) does DHCP usually hand out?", back: "Subnet mask, default gateway, and DNS server addresses (plus lease time)." },
        { front: "What is a forward DNS lookup?", back: "Resolving a hostname to an IP address (e.g. acc-server.local → 10.10.10.100)." },
        { front: "Why does Active Directory depend on DNS?", back: "AD clients locate domain controllers via DNS SRV records; broken DNS breaks login/authentication." },
        { front: "What's a quick test that a hostname problem is DNS-related?", back: "If connecting by IP works but by hostname fails, DNS resolution is the issue." },
        { front: "Where is the Windows hosts file, and what is it for?", back: "C:\\Windows\\System32\\drivers\\etc\\hosts — a local manual override mapping hostnames to IPs." }
      ],
      quiz: [
        { q: "A device shows an IP like 169.254.x.x. What does that usually mean?", choices: ["Static IP set correctly", "It couldn't reach a DHCP server (APIPA self-assigned)", "DNS is working", "It's on the camera VLAN"], answer: 1, explain: "169.254.x.x is APIPA — the device fell back to self-assignment because no DHCP server answered." },
        { q: "Which DORA step does the DHCP server use to confirm the lease?", choices: ["Discover", "Offer", "Request", "Acknowledge"], answer: 3, explain: "ACK (Acknowledge) confirms the lease and its duration." },
        { q: "Cameras keep changing IPs after reboots. The fix that keeps DHCP but fixes the address is…", choices: ["Shorten the lease", "Create DHCP reservations by MAC", "Disable DNS", "Use APIPA"], answer: 1, explain: "A reservation ties the MAC to a fixed IP while still using DHCP." },
        { q: "DNS is best described as…", choices: ["A firewall rule set", "A phone book mapping names to IPs", "A RAID level", "A PoE standard"], answer: 1, explain: "DNS maps human-readable names to IP addresses." },
        { q: "Multi-server ACC sites rely on DNS mainly for…", choices: ["Powering cameras", "Servers locating each other by hostname", "Video compression", "Disk striping"], answer: 1, explain: "Servers find each other by name; DNS failure breaks server-to-server comms." },
        { q: "Best practice for the IP addressing of recording servers is…", choices: ["DHCP only", "Static IP (predictable, always reachable)", "APIPA", "Link-local"], answer: 1, explain: "Critical infrastructure like servers should use static IPs." },
        { q: "A reverse DNS lookup resolves…", choices: ["Name → IP", "IP → name", "MAC → IP", "Port → service"], answer: 1, explain: "Reverse DNS maps an IP back to a hostname." }
      ]
    },

    /* --------------------------------------------------- FIREWALL/PORTS */
    "firewall": {
      flashcards: [
        { front: "What is the difference between BLOCK and DROP on a firewall?", back: "BLOCK rejects and may notify the sender (connection refused); DROP silently discards the packet (sender times out)." },
        { front: "What is the valid range of TCP/UDP port numbers?", back: "0 to 65535." },
        { front: "What is the ACC Web Client port (non-HTTPS native)?", back: "38882 (TCP) for browser-based access to ACC." },
        { front: "Which port pair (UDP) is used by DHCP?", back: "67 and 68 (UDP)." },
        { front: "What does RTSP on port 554 do?", back: "Streams video from cameras when using RTSP instead of the native protocol." },
        { front: "Difference between a host firewall and a network firewall?", back: "Host firewall (e.g. Windows Firewall) runs on the device; network firewall is a dedicated device at the network edge controlling all traffic." },
        { front: "Name three hardware firewall vendors.", back: "Cisco ASA, Fortinet (FortiGate), SonicWall (also Palo Alto, etc.)." },
        { front: "If port forwarding is needed for remote ACC, what gets configured?", back: "On the edge router/firewall: external port → internal server IP:port (e.g. 38880 → server:38880), ideally via VPN." }
      ],
      quiz: [
        { q: "A connection attempt returns 'Connection refused' immediately. The firewall most likely…", choices: ["Dropped the packet silently", "Actively rejected (blocked) it", "Allowed it", "Forwarded it to DNS"], answer: 1, explain: "An immediate refusal = active reject/block; a silent drop would time out instead." },
        { q: "Which port should be open for the secure ACC Web Client / cloud?", choices: ["38882", "443", "80", "554"], answer: 1, explain: "443 (HTTPS) is used for secure web/cloud access." },
        { q: "Cameras appear by IP but won't auto-discover across subnets. What's blocked?", choices: ["TCP 443", "UDP 5353 mDNS / broadcast", "TCP 38881", "TCP 80"], answer: 1, explain: "Discovery uses mDNS (UDP 5353)/broadcast which doesn't cross VLANs by default." },
        { q: "Port 80 in a camera context is typically used for…", choices: ["RTSP streaming", "The camera's HTTP web config page", "Server-to-server sync", "DHCP"], answer: 1, explain: "Port 80 = HTTP, used for the camera's web interface." },
        { q: "Which statement about ports is correct?", choices: ["One IP can only run one service", "An IP can run many services, each on its own port", "Ports are only used by cameras", "Ports range 0–255 only"], answer: 1, explain: "A single IP hosts many services, each listening on a different port (0–65535)." },
        { q: "The MOST common single port to check for 'ACC client can't connect' is…", choices: ["554", "38880", "67", "5353"], answer: 1, explain: "38880 (ACC Gateway) is the usual culprit." },
        { q: "telnet <server-ip> 38880 fails but ping works. This suggests…", choices: ["The whole network is down", "The host is reachable but port 38880 is blocked/closed", "DNS is broken", "PoE is too low"], answer: 1, explain: "Ping (ICMP) succeeding but the TCP port failing means a port-level block, not a routing problem." }
      ]
    },

    /* ----------------------------------------------------- MULTICAST */
    "multicast": {
      flashcards: [
        { front: "What does IGMP stand for and do?", back: "Internet Group Management Protocol — hosts use it to join/leave multicast groups so switches/routers know who wants the stream." },
        { front: "What happens to multicast WITHOUT IGMP snooping on a switch?", back: "The switch floods the multicast to every port like a broadcast, wasting bandwidth on all devices." },
        { front: "In unicast, how many copies of a stream does the server send for 5 viewers?", back: "Five separate copies — one per viewer." },
        { front: "In multicast, how many copies does the server send regardless of viewers?", back: "One — the network replicates it to subscribers." },
        { front: "Why does multicast struggle over the internet/WAN?", back: "Multicast routing isn't supported across most public/WAN links, so unicast (or a relay) is used for remote viewers." },
        { front: "50 cameras, 4 viewers each: rough unicast vs multicast load?", back: "Unicast ≈ 4 Gbps; multicast ≈ 1 Gbps (one stream per camera)." }
      ],
      quiz: [
        { q: "IGMP snooping is configured on the…", choices: ["Camera", "Switch", "NAS", "Firewall"], answer: 1, explain: "The switch snoops IGMP joins to replicate multicast only to subscribers." },
        { q: "Multicast bandwidth for one camera as viewers increase…", choices: ["Doubles per viewer", "Stays flat", "Falls to zero", "Triples"], answer: 1, explain: "One stream is shared, so per-camera bandwidth is flat." },
        { q: "A single remote viewer over VPN reports issues with multicast. Best fix?", choices: ["Add IGMP to the camera", "Use unicast for that viewer", "Increase PoE", "Switch to RAID 6"], answer: 1, explain: "Multicast rarely routes over WAN/VPN; unicast suits one remote viewer." },
        { q: "Without IGMP snooping, multicast behaves like a…", choices: ["Unicast", "Broadcast (floods all ports)", "DNS query", "RAID rebuild"], answer: 1, explain: "It floods every port, hurting all devices on the segment." },
        { q: "Which scenario most favours multicast?", choices: ["One remote user on a phone", "A 12-screen control-room video wall on the LAN", "A WAN link to another city", "A single admin PC"], answer: 1, explain: "Many local viewers of the same streams is the classic multicast win." }
      ]
    },

    /* ----------------------------------------------------------- PoE */
    "poe": {
      flashcards: [
        { front: "What two things travel over the single PoE cable?", back: "Data (the video/network traffic) and DC power for the device." },
        { front: "Why does a camera sometimes draw more power at boot than in normal running?", back: "Inrush current — the start-up surge can exceed the steady draw, so the switch must support it." },
        { front: "What cable categories are used for PoE and what's the distance limit?", back: "Cat5e/Cat6, up to ~100 metres." },
        { front: "What does '802.3bt' cover?", back: "PoE++ — Type 3 (60W) and Type 4 (100W)." },
        { front: "If a switch's PoE budget is 370W and cameras draw 150W, how much headroom?", back: "220W of headroom (370 − 150)." },
        { front: "What symptom most strongly indicates an exceeded PoE budget?", back: "Cameras rebooting randomly / dropping under load when many are powered at once." },
        { front: "What's the fix for voltage drop on a >100 m run?", back: "Use a PoE extender or relocate the switch closer to the camera." }
      ],
      quiz: [
        { q: "802.3af (standard PoE) delivers about…", choices: ["30W", "15.4W", "60W", "100W"], answer: 1, explain: "802.3af = 15.4W at the switch (~12.95W at the device)." },
        { q: "A multi-sensor camera needs 28W. Minimum standard?", choices: ["802.3af (15.4W)", "802.3at PoE+ (30W)", "Passive 5V", "USB-C"], answer: 1, explain: "28W exceeds 15.4W, so PoE+ (30W) is required." },
        { q: "The switch in PoE terminology is the…", choices: ["PD", "PSE", "SVI", "NAS"], answer: 1, explain: "PSE = Power Sourcing Equipment (the switch/injector)." },
        { q: "10 cameras at 25W on a 200W-budget switch will…", choices: ["Work fine (250W < 200W)", "Exceed the budget (250W > 200W) and cause instability", "Get no IP", "Lose DNS"], answer: 1, explain: "250W needed vs 200W available — over budget, expect brown-outs/reboots." },
        { q: "PoE++ Type 4 supplies up to…", choices: ["30W", "60W", "100W", "15.4W"], answer: 2, explain: "802.3bt Type 4 provides up to 100W." },
        { q: "A camera powers on then drops immediately after boot. Likely cause?", choices: ["DNS failure", "Switch can't supply the inrush/boot current", "Wrong RAID level", "VLAN mismatch"], answer: 1, explain: "Boot inrush current exceeding what the port supplies causes boot-then-drop." }
      ]
    },

    /* ------------------------------------------------------- STORAGE */
    "storage": {
      flashcards: [
        { front: "Which RAID level should never be used for surveillance, and why?", back: "RAID 0 — striping with no redundancy; one disk failure loses all footage." },
        { front: "What does parity provide in RAID 5/6?", back: "Recovery information so data can be rebuilt if a disk fails (1 disk for RAID 5, 2 for RAID 6)." },
        { front: "Recommended RAID for the OS drive vs recording drives?", back: "RAID 1 (mirror) for the OS; RAID 5 (or 6) for recording arrays." },
        { front: "What protocols does a NAS typically use for sharing?", back: "SMB and NFS." },
        { front: "What protocols/technologies underpin a SAN?", back: "iSCSI or Fibre Channel — it appears to the server as a local disk." },
        { front: "In the storage formula, what does the 0.0432 factor convert?", back: "Mbps to GB per hour (Mbps × 3600s ÷ 8 bits ÷ 1024)." },
        { front: "Roughly how much does a 1080p@15fps (~5 Mbps) camera record per day?", back: "About 52 GB/day." },
        { front: "What tool/status helps spot a failing disk early?", back: "SMART status (and RAID health monitoring)." }
      ],
      quiz: [
        { q: "RAID 1 gives you what usable capacity from two equal disks?", choices: ["100%", "50%", "75%", "0%"], answer: 1, explain: "Mirroring stores an exact copy, so usable capacity is 50%." },
        { q: "Which RAID level is the most common choice for CCTV recording?", choices: ["RAID 0", "RAID 1", "RAID 5", "RAID 10"], answer: 2, explain: "RAID 5 (striping + single parity) is the typical recommendation." },
        { q: "A RAID 5 array loses ONE disk. What happens?", choices: ["All data lost", "Array runs degraded and rebuilds from parity after replacement", "Cameras reboot", "DNS fails"], answer: 1, explain: "RAID 5 survives one failure; replace the disk and it rebuilds from parity." },
        { q: "For 100+ cameras needing high-speed shared storage, choose…", choices: ["DAS", "USB drive", "SAN", "SD card"], answer: 2, explain: "SAN suits enterprise scale (iSCSI/FC)." },
        { q: "Storage stops recording and the array reports 'degraded'. Best action?", choices: ["Lower retention", "Replace the failed disk promptly and rebuild", "Reboot cameras", "Change VLAN"], answer: 1, explain: "Degraded = a disk failed; replace it before a second failure causes data loss." },
        { q: "Storage fills far faster than estimated. Most likely reason?", choices: ["Too few cameras", "Higher bitrate/resolution than estimated or motion-heavy scenes", "RAID 6 enabled", "DNS caching"], answer: 1, explain: "Actual bitrate exceeding the estimate (quality bump or busy scenes) fills disks faster." },
        { q: "Approx storage for 16 cams @ 5 Mbps, 24h/day, 30 days?", choices: ["~2.5 TB", "~25 TB", "~250 TB", "~250 GB"], answer: 1, explain: "5 × 0.0432 × 24 × 30 × 16 ≈ 25 TB." }
      ]
    },

    /* ----------------------------------------------------- SUBNETTING */
    "subnetting": {
      flashcards: [
        { front: "What are the network and broadcast addresses of 10.10.100.0/24?", back: "Network = 10.10.100.0; Broadcast = 10.10.100.255 (so usable hosts are .1–.254)." },
        { front: "How many TOTAL vs USABLE addresses does a /24 have?", back: "256 total; 254 usable (minus network and broadcast)." },
        { front: "What does CIDR notation like /24 represent?", back: "The number of bits used for the network portion of the address." },
        { front: "Convert /22 to a subnet mask.", back: "255.255.252.0 (1,022 usable hosts)." },
        { front: "Two devices, 10.10.100.10/24 and 10.10.100.200/24 — same subnet?", back: "Yes — both in 10.10.100.0/24, so they can talk directly without a router." },
        { front: "What is a default gateway?", back: "The router/L3 interface a device sends traffic to when the destination is on a different subnet." },
        { front: "For 200–400 cameras, which subnet size fits best?", back: "/23 (510 usable hosts)." }
      ],
      quiz: [
        { q: "How many usable hosts does a /23 provide?", choices: ["254", "510", "1022", "126"], answer: 1, explain: "/23 = 512 total − 2 = 510 usable." },
        { q: "255.255.252.0 is which CIDR?", choices: ["/22", "/23", "/24", "/20"], answer: 0, explain: "255.255.252.0 = /22 (1,022 usable hosts)." },
        { q: "A camera 10.10.100.5/24 can't reach a server 10.10.10.5/24. What's required?", choices: ["A bigger disk", "A router/L3 switch and correct gateways between the subnets", "More PoE", "A new DNS record"], answer: 1, explain: "Different subnets need routing via a gateway." },
        { q: "Which is NOT one of the three essentials every device needs?", choices: ["IP address", "Subnet mask", "Default gateway", "RAID level"], answer: 3, explain: "RAID is storage, not an IP setting. The essentials are IP, mask, gateway." },
        { q: "The /24 broadcast address for 192.168.1.0/24 is…", choices: ["192.168.1.0", "192.168.1.1", "192.168.1.255", "192.168.1.254"], answer: 2, explain: ".255 is the broadcast address in a /24." },
        { q: "A campus needs ~60,000 addresses in one block. Which fits?", choices: ["/24", "/22", "/16", "/26"], answer: 2, explain: "/16 gives 65,534 usable hosts." }
      ]
    },

    /* --------------------------------------------------------- VLANS */
    "vlan": {
      flashcards: [
        { front: "What is the relationship between a VLAN and a subnet?", back: "Each VLAN is typically mapped to its own IP subnet (one broadcast domain per VLAN)." },
        { front: "What is a broadcast domain, and how do VLANs affect it?", back: "The set of devices that receive each other's broadcasts; each VLAN is its own broadcast domain, containing storms." },
        { front: "Why can't an unmanaged switch do VLANs?", back: "It has no management/OS to tag frames or assign ports to VLANs — it just forwards everything." },
        { front: "Give an example of a per-VLAN policy you can apply.", back: "QoS priorities or ACLs (access control lists) specific to that VLAN." },
        { front: "What security benefit do VLANs give a guest network?", back: "Isolation — guests on their own VLAN can't reach the camera or server VLANs." },
        { front: "How do VLANs improve performance?", back: "They contain broadcast traffic and give each segment its own logical bandwidth, so camera video doesn't swamp office PCs." }
      ],
      quiz: [
        { q: "Each VLAN generally corresponds to one…", choices: ["Physical cable", "IP subnet / broadcast domain", "RAID array", "PoE budget"], answer: 1, explain: "A VLAN maps to its own subnet and broadcast domain." },
        { q: "A broadcast storm in VLAN 300 (guest) affects which devices?", choices: ["All VLANs", "Only devices in VLAN 300", "Only cameras", "Only servers"], answer: 1, explain: "Broadcasts are contained within their VLAN." },
        { q: "To deploy VLANs you must have a…", choices: ["Unmanaged switch", "Managed switch", "Hub", "Media converter"], answer: 1, explain: "Only managed switches support VLAN configuration." },
        { q: "Putting cameras on VLAN 100 primarily prevents…", choices: ["Disk failure", "Camera video from congesting the office network", "DNS errors", "PoE overload"], answer: 1, explain: "Isolation keeps heavy camera traffic off other segments." },
        { q: "Which is a benefit of VLANs?", choices: ["Higher PoE wattage", "Per-segment security and policy", "Larger disks", "Faster CPUs"], answer: 1, explain: "VLANs enable isolation, security, and per-VLAN QoS/ACLs." }
      ]
    },

    /* ----------------------------------------------------- VLAN SETUP */
    "vlan-setup": {
      flashcards: [
        { front: "What does 802.1Q do?", back: "Tags Ethernet frames with a VLAN ID so trunk links can carry multiple VLANs." },
        { front: "Is traffic on an access port tagged or untagged?", back: "Untagged — an access port belongs to a single VLAN." },
        { front: "Is traffic on a trunk port tagged or untagged?", back: "Tagged (802.1Q) — it carries multiple VLANs between switches/routers." },
        { front: "What is an SVI?", back: "Switched Virtual Interface — a virtual L3 interface (interface vlan X) that acts as the gateway for that VLAN." },
        { front: "Cisco command to put interfaces 1–16 into VLAN 100?", back: "interface range gi0/1-16 → switchport mode access → switchport access vlan 100." },
        { front: "Why enable 'spanning-tree portfast' on access ports?", back: "It lets end-device ports (cameras/PCs) come up immediately instead of waiting through STP states." },
        { front: "What command saves the running config so it survives a reboot?", back: "copy running-config startup-config." },
        { front: "After enabling inter-VLAN routing, what must each camera's gateway be set to?", back: "Its VLAN's gateway IP (e.g. 10.10.100.1 for VLAN 100)." }
      ],
      quiz: [
        { q: "A trunk link carrying VLANs 10,100,200 uses which tagging standard?", choices: ["802.3af", "802.1Q", "802.11", "iSCSI"], answer: 1, explain: "802.1Q tags frames with VLAN IDs on trunks." },
        { q: "A single camera connects to a switch port. That port should be…", choices: ["A trunk", "An access port in the camera VLAN", "A console port", "A mirror port"], answer: 1, explain: "One device, one VLAN, untagged = access port." },
        { q: "Cameras (VLAN 100) can't reach servers (VLAN 10) after setup. The switch is L3. Missing config?", choices: ["More PoE", "SVIs + 'ip routing' (inter-VLAN routing)", "A second DNS", "RAID 6"], answer: 1, explain: "Create interface vlan X with IPs and enable ip routing." },
        { q: "Which command series creates VLAN 100 named Cameras (Cisco)?", choices: ["vlan 100 → name Cameras", "ip routing → vlan 100", "switchport trunk → vlan 100", "interface vlan 100 → no shutdown"], answer: 0, explain: "In config mode: vlan 100, then name Cameras." },
        { q: "All VLAN config disappears after a power cycle. What was skipped?", choices: ["no shutdown", "copy running-config startup-config", "spanning-tree portfast", "switchport mode access"], answer: 1, explain: "Unsaved running config is lost on reboot." },
        { q: "What's the FIRST of the six setup steps?", choices: ["Configure the trunk", "Plan your VLANs (IDs, subnets, ports)", "Enable inter-VLAN routing", "Assign access ports"], answer: 1, explain: "Planning the VLAN/IP scheme comes first." }
      ]
    },

    /* ---------------------------------------------------- FIREWALL LAB */
    "firewall-lab": {
      flashcards: [
        { front: "What does it mean that a server 'listens' on a port?", back: "It has a service bound to that port waiting to accept incoming connections (e.g. ACC on 38880)." },
        { front: "What's the PowerShell equivalent of testing a port?", back: "Test-NetConnection <server-ip> -Port 38880 (TcpTestSucceeded shows true/false)." },
        { front: "If Test-NetConnection succeeds but the ACC client still fails, where do you look next?", back: "Beyond the network: ACC service status, credentials, or a client/server version mismatch." },
        { front: "What ports does a full-access control-room PC need?", back: "38880 (gateway), 38881 (server comms), and 443 (HTTPS)." },
        { front: "What firewall access should a guest device get to ACC?", back: "None — guests are fully isolated with no allowed ports." },
        { front: "Two failure signatures of a blocked port?", back: "Connection REFUSED (actively rejected) or TIMED OUT (silently dropped)." }
      ],
      quiz: [
        { q: "A client 'connects to' a port while a server…", choices: ["Pings it", "Listens on it", "Drops it", "Routes it"], answer: 1, explain: "Servers listen; clients connect to that listening port." },
        { q: "A camera-VLAN PC tries the web client (443) but only 38880 is allowed. Result?", choices: ["Works fine", "Blocked — 443 isn't permitted for that VLAN", "DNS error", "RAID rebuild"], answer: 1, explain: "The firewall rule for that VLAN only allows 38880, so 443 is blocked." },
        { q: "A remote VPN user should typically be limited to which port?", choices: ["38881", "443", "80", "554"], answer: 1, explain: "Remote/VPN users are usually restricted to 443 (HTTPS)." },
        { q: "Which result means the firewall silently discarded the packet?", choices: ["Connection refused", "Connection timed out", "Connected", "Access vlan"], answer: 1, explain: "A silent drop produces a timeout, not an immediate refusal." },
        { q: "The command to verify port 38880 from Windows is…", choices: ["ping <ip>", "Test-NetConnection <ip> -Port 38880", "tracert <ip>", "ipconfig /renew"], answer: 1, explain: "Test-NetConnection with -Port tests a specific TCP port." }
      ]
    }
  };

  // Merge: append extra items onto each concept's arrays.
  (window.CONCEPTS || []).forEach(function (c) {
    var ex = EXTRA[c.id];
    if (!ex) return;
    if (ex.flashcards) c.flashcards = c.flashcards.concat(ex.flashcards);
    if (ex.quiz) c.quiz = c.quiz.concat(ex.quiz);
  });
})();
