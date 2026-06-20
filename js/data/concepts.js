/* NetLearn content model.
 * One global array drives every feature: flashcards, diagrams, quizzes,
 * scenarios, and the match/sort/sequence games. Facts are sourced from the
 * Avigilon / CCTV network diagrams in source-diagrams/.
 *
 * Per concept:
 *   id, title, icon, blurb
 *   diagram : { img, takeaways[], hotspots[{label,text}] }
 *   keyFacts: string[]                       (display + quick study)
 *   flashcards: [{ front, back }]
 *   quiz:      [{ q, choices[], answer, explain }]
 *   scenarios: [{ situation, choices[], answer, explain }]
 *   games (optional):
 *     match:    [{ a, b }]                   (matching / memory)
 *     sort:     { prompt, buckets:{name:[items]} }
 *     sequence: { prompt, items:[ordered]  }
 */
window.CONCEPTS = [
  /* ---------------------------------------------------------------- CCTV */
  {
    id: "cctv",
    title: "CCTV Architecture",
    icon: "🎥",
    blurb: "How an enterprise Avigilon video system is layered — from cameras to storage to remote viewing.",
    diagram: {
      img: "assets/diagrams/CCTV_System_Architecture.png",
      takeaways: [
        "A CCTV system is built in layers: Camera → Network → Server → Storage → Client → Remote.",
        "IP cameras get both data and power over one cable via PoE switches on a dedicated camera VLAN (VLAN 100).",
        "The ACC Server records, runs analytics, and manages devices; a second server adds failover / load balancing.",
        "A core L3 switch handles inter-VLAN routing, IGMP snooping (multicast) and QoS; a firewall controls remote access.",
        "Storage can be internal RAID (DAS), networked NAS/SAN (iSCSI), plus long-term archive."
      ],
      hotspots: [
        { label: "Camera Layer", text: "IP cameras (bullet, dome, PTZ, fisheye, door station) powered by PoE/PoE+." },
        { label: "Network Layer", text: "PoE switches feed a core switch/router doing inter-VLAN routing, IGMP snooping & QoS, behind a firewall." },
        { label: "Server Layer", text: "ACC Server records & manages; ACC Server 2 = failover; AI Appliance = video analytics." },
        { label: "Storage Layer", text: "RAID (DAS) internal disks, NAS/SAN over iSCSI, and archive for long-term retention." },
        { label: "Client / Remote", text: "Control Room video wall, Admin PC, ACC Mobile app, and VPN/cloud remote viewing." }
      ]
    },
    keyFacts: [
      "Layers: Camera → Network → Server → Storage → Client → Remote.",
      "Cameras live on a dedicated camera VLAN (VLAN 100).",
      "ACC Server = recording + analytics + management.",
      "Core switch does inter-VLAN routing, IGMP snooping and QoS.",
      "Storage tiers: DAS (internal RAID), NAS/SAN (iSCSI), archive."
    ],
    flashcards: [
      { front: "Name the 6 layers of a CCTV system architecture.", back: "Camera → Network → Server → Storage → Client/Monitoring → Remote Access." },
      { front: "What does the ACC Server do?", back: "Recording, video analytics, and device/system management. A second server provides failover & load balancing." },
      { front: "Why put cameras on their own VLAN?", back: "Isolation, security, and to keep heavy video traffic off the corporate network (typically VLAN 100)." },
      { front: "What three jobs does the core switch/router perform here?", back: "Inter-VLAN routing, IGMP snooping (for multicast), and QoS." },
      { front: "What is the AI Appliance for?", back: "Video analytics — object detection and advanced detection offloaded from the recording server." }
    ],
    quiz: [
      { q: "Which device is responsible for recording video and running management in an ACC deployment?", choices: ["PoE switch", "ACC Server", "Firewall", "Door station"], answer: 1, explain: "The ACC Server records, runs analytics, and manages the system." },
      { q: "Cameras typically receive power via…", choices: ["A separate AC outlet at each camera", "PoE over the same Ethernet cable", "USB", "Battery packs"], answer: 1, explain: "PoE delivers data + power over one cable, so no outlet is needed at the camera." },
      { q: "What feature on the core switch limits multicast video to only ports that asked for it?", choices: ["QoS", "IGMP snooping", "NAT", "Spanning tree"], answer: 1, explain: "IGMP snooping makes the switch replicate multicast only to subscribing ports." },
      { q: "Remote viewing from the internet should pass through which device?", choices: ["The PoE switch", "The firewall / VPN gateway", "The camera directly", "The archive storage"], answer: 1, explain: "Remote access is controlled by the firewall, usually via a VPN gateway." }
    ],
    scenarios: [
      { situation: "A customer's corporate PCs slow to a crawl every time the security team watches live video. Cameras and office PCs share one flat network. What's the best fix?", choices: ["Buy faster PCs", "Segment cameras onto their own VLAN", "Lower the camera frame rate to 1 fps", "Disable the firewall"], answer: 1, explain: "Heavy camera traffic on a flat network starves other devices — isolating cameras on a VLAN contains it." },
      { situation: "The control room needs a live video wall plus the manager and a mobile user all viewing the same camera on the LAN. Which design keeps bandwidth flat?", choices: ["Unicast to every viewer", "Multicast with IGMP snooping", "Give each viewer its own camera", "Record only, no live view"], answer: 1, explain: "Multicast sends one stream the switch replicates only to subscribers — bandwidth stays flat regardless of viewer count." }
    ],
    games: {
      match: [
        { a: "Camera Layer", b: "IP cameras + PoE" },
        { a: "Server Layer", b: "ACC recording & analytics" },
        { a: "Storage Layer", b: "RAID / NAS / SAN" },
        { a: "Network Layer", b: "Switches, routing, firewall" },
        { a: "Remote Access", b: "VPN / cloud viewing" }
      ]
    }
  },

  /* ------------------------------------------------------------ DHCP/DNS */
  {
    id: "dhcp-dns",
    title: "DHCP & DNS",
    icon: "📇",
    blurb: "How devices automatically get an IP (DHCP/DORA) and how names resolve to IPs (DNS).",
    diagram: {
      img: "assets/diagrams/DHCP_DNS_Explained.png",
      takeaways: [
        "DHCP automatically assigns IP addresses using the 4-step DORA process: Discover, Offer, Request, Acknowledge.",
        "For CCTV cameras, STATIC IPs are recommended so ACC always finds them; DHCP reservations (MAC → fixed IP) are the exception.",
        "DNS translates hostnames to IP addresses — a phone book for the network.",
        "If a client connects by IP but NOT by hostname, it's a DNS problem.",
        "DNS matters for multi-server ACC, the web client, Active Directory login, and firmware update URLs."
      ],
      hotspots: [
        { label: "DORA", text: "Discover → Offer → Request → Acknowledge. The 4 steps a device uses to lease an IP." },
        { label: "Static vs DHCP", text: "Cameras: use Static (or DHCP reservation). DHCP lease changes break ACC's link to the camera." },
        { label: "DNS resolution", text: "Client asks 'what's the IP of acc-server.company.local?' → gets 10.10.10.100 → connects." },
        { label: "Hosts file fix", text: "Temporary DNS workaround: add the hostname to C:\\Windows\\System32\\drivers\\etc\\hosts." }
      ]
    },
    keyFacts: [
      "DORA = Discover, Offer, Request, Acknowledge.",
      "Cameras should use Static IPs (or DHCP reservation by MAC).",
      "DNS = names → IP addresses.",
      "Connects by IP but not hostname = DNS issue.",
      "ACC needs DNS for multi-server, web client, AD login, firmware URLs."
    ],
    flashcards: [
      { front: "What does DHCP do, and what are its 4 steps?", back: "Automatically assigns IPs. Steps = DORA: Discover, Offer, Request, Acknowledge." },
      { front: "In DORA, who broadcasts 'anyone have an IP for me?'", back: "The client (DISCOVER). The server replies with OFFER, client sends REQUEST, server sends ACK with the lease." },
      { front: "Should CCTV cameras use DHCP or static IPs?", back: "Static (recommended) so the IP never changes and ACC always finds the camera. Exception: DHCP reservation (MAC → fixed IP)." },
      { front: "What does DNS do?", back: "Translates human-readable hostnames into IP addresses — like a phone book for the network." },
      { front: "A client connects to the ACC server by IP but not by hostname. What's wrong?", back: "A DNS issue. Check the client's DNS settings, or add the server to the hosts file as a temporary fix." },
      { front: "Name two places ACC depends on DNS.", back: "Multi-server communication, web/cloud client, Active Directory login, and reaching firmware update URLs." }
    ],
    quiz: [
      { q: "What does the acronym DORA stand for?", choices: ["Discover, Offer, Request, Acknowledge", "Detect, Open, Route, Assign", "Deliver, Offer, Reply, Accept", "Discover, Order, Renew, Apply"], answer: 0, explain: "DORA = Discover → Offer → Request → Acknowledge." },
      { q: "Best practice for IP addressing of CCTV cameras is…", choices: ["DHCP with short leases", "Static IPs (or DHCP reservation)", "APIPA self-assignment", "Link-local only"], answer: 1, explain: "Static IPs keep cameras findable by ACC; reservations are the managed exception." },
      { q: "DNS primarily provides…", choices: ["IP-to-power mapping", "Hostname-to-IP resolution", "Encryption of traffic", "VLAN tagging"], answer: 1, explain: "DNS resolves names to IP addresses." },
      { q: "Server-to-server ACC communication suddenly breaks but pinging by IP works. Likely cause?", choices: ["PoE budget exceeded", "DNS failure", "RAID rebuild", "Wrong subnet mask on the camera"], answer: 1, explain: "Servers find each other by hostname; if DNS fails, by-name communication breaks while IP still works." }
    ],
    scenarios: [
      { situation: "After a power cut, several cameras show offline in ACC even though they're powered. They were left on DHCP. What most likely happened?", choices: ["The cameras' firmware wiped", "DHCP handed them new IPs, so ACC is looking at the old addresses", "The RAID array failed", "The firewall reset"], answer: 1, explain: "DHCP leases can change after a reboot; ACC still points at the old IPs. Use static IPs or reservations." },
      { situation: "The ACC web client won't load by its URL, but typing the server's IP works. Fastest temporary fix on that PC?", choices: ["Reinstall ACC", "Add the hostname → IP to the Windows hosts file", "Reboot the switch", "Change the camera VLAN"], answer: 1, explain: "The hosts file is a quick local DNS override while the real DNS issue is investigated." }
    ],
    games: {
      sequence: {
        prompt: "Put the DHCP DORA steps in order.",
        items: ["Discover — client broadcasts for an IP", "Offer — server offers an address", "Request — client requests that address", "Acknowledge — server confirms the lease"]
      },
      match: [
        { a: "DISCOVER", b: "Client: anyone have an IP?" },
        { a: "OFFER", b: "Server: here, use 10.10.100.50" },
        { a: "REQUEST", b: "Client: I'll take that one" },
        { a: "ACK", b: "Server: confirmed, lease 24h" }
      ]
    }
  },

  /* ----------------------------------------------------- FIREWALLS/PORTS */
  {
    id: "firewall",
    title: "Firewalls & Ports",
    icon: "🧱",
    blurb: "What ports Avigilon ACC uses and how firewalls allow, block or drop traffic.",
    diagram: {
      img: "assets/diagrams/Firewalls_Ports_Explained.png",
      takeaways: [
        "A firewall checks every packet and ALLOWs, BLOCKs or DROPs it based on rules.",
        "An IP is like a building address; ports (0–65535) are the apartment numbers for each service.",
        "ACC's most common port is 38880 (Client → Server). Blocking it is the #1 'can't connect' cause.",
        "38881 = server-to-server, 443 = HTTPS/web/cloud, 554 = RTSP video, 80 = HTTP camera config.",
        "5353/UDP (mDNS) handles camera auto-discovery; 67-68/UDP is DHCP."
      ],
      hotspots: [
        { label: "Packet check", text: "Port 38880 → ALLOW. Port 12345 → BLOCK. Unknown → DROP." },
        { label: "IP vs Port", text: "One IP, many services — each listens on its own port number (0–65535)." },
        { label: "Test command", text: "Test-NetConnection <server-ip> -Port 38880  (PowerShell). Fails = port blocked." }
      ]
    },
    keyFacts: [
      "Firewall actions: ALLOW, BLOCK, DROP.",
      "Port 38880 = ACC Gateway (Client → Server) — most common issue.",
      "Port 38881 = ACC server-to-server.",
      "Port 443 = HTTPS web client / cloud.",
      "Port 554 = RTSP video; Port 80 = HTTP camera config.",
      "5353/UDP = mDNS discovery; 67-68/UDP = DHCP."
    ],
    flashcards: [
      { front: "What three actions can a firewall take on a packet?", back: "ALLOW (permit), BLOCK (reject), or DROP (silently discard)." },
      { front: "Which port does the ACC Client use to connect to the ACC Server?", back: "TCP 38880 (ACC Gateway) — the most common port-related support issue." },
      { front: "What is port 38881 used for?", back: "ACC server-to-server communication (multi-server sites syncing)." },
      { front: "What is port 443 used for in ACC?", back: "HTTPS — secure ACC web client, cloud access, and API connections." },
      { front: "Port 554 carries what?", back: "RTSP video streaming from cameras." },
      { front: "How do you test if a port is open from Windows?", back: "Test-NetConnection <server-ip> -Port 38880 in PowerShell (or telnet). Failure means the port is blocked." },
      { front: "Analogy: if an IP is a building address, what is a port?", back: "An apartment number — the specific service inside the building. Range 0–65535." }
    ],
    quiz: [
      { q: "An ACC Client cannot connect to the server. Which port should you check FIRST?", choices: ["443", "554", "38880", "80"], answer: 2, explain: "38880 is the ACC Gateway port — the most common connection blocker." },
      { q: "Which port is used for the secure ACC web client and cloud access?", choices: ["80", "443", "5353", "38881"], answer: 1, explain: "443 is HTTPS — secure web/cloud/API." },
      { q: "Multi-server ACC sites need which port open between servers?", choices: ["38881", "554", "67", "80"], answer: 0, explain: "38881 carries server-to-server communication." },
      { q: "Which protocol/port pair handles camera auto-discovery on the LAN?", choices: ["TCP 80", "UDP 5353 (mDNS)", "TCP 443", "UDP 554"], answer: 1, explain: "mDNS / Bonjour on UDP 5353 auto-discovers cameras." },
      { q: "A firewall that silently discards a packet without replying is performing which action?", choices: ["ALLOW", "BLOCK (reject)", "DROP", "Forward"], answer: 2, explain: "DROP discards silently — the client sees a timeout rather than a refusal." }
    ],
    scenarios: [
      { situation: "Remote staff can't reach ACC from home, but everything works on the LAN. The edge router has no port forwarding configured. Best fix?", choices: ["Open port 80 on cameras", "Port-forward 38880/443 on the edge firewall to the server (ideally via VPN)", "Disable Windows Firewall on cameras", "Switch cameras to DHCP"], answer: 1, explain: "Remote access needs the relevant ports forwarded at the edge — best done through a VPN for security." },
      { situation: "On a multi-server site the servers won't sync. LAN and 38880 are fine. What's the likely block?", choices: ["Port 38881 blocked between server subnets", "RTSP disabled", "DHCP exhausted", "RAID degraded"], answer: 0, explain: "Server-to-server sync uses 38881 — open it bidirectionally between the ACC server IPs." },
      { situation: "Cameras aren't being auto-discovered across VLANs, though you can add them by IP. What's happening?", choices: ["443 blocked", "mDNS (5353) / broadcast not forwarded between VLANs", "PoE budget exceeded", "Wrong RAID level"], answer: 1, explain: "Discovery relies on mDNS/broadcast which doesn't cross VLANs by default — add by IP or enable mDNS forwarding." }
    ],
    games: {
      match: [
        { a: "38880", b: "ACC Gateway (Client→Server)" },
        { a: "38881", b: "Server-to-Server" },
        { a: "443", b: "HTTPS web / cloud" },
        { a: "554", b: "RTSP video" },
        { a: "80", b: "HTTP camera config" },
        { a: "5353", b: "mDNS discovery" }
      ],
      sort: {
        prompt: "Sort each port by its transport protocol.",
        buckets: {
          "TCP": ["38880", "38881", "443", "554", "80"],
          "UDP": ["5353 (mDNS)", "67-68 (DHCP)"]
        }
      }
    }
  },

  /* ------------------------------------------------------------ MULTICAST */
  {
    id: "multicast",
    title: "Unicast vs Multicast",
    icon: "📡",
    blurb: "Two ways video reaches viewers — and why multicast keeps bandwidth flat.",
    diagram: {
      img: "assets/diagrams/Multicast_vs_Unicast.png",
      takeaways: [
        "Unicast = one-to-one: the server sends a separate copy of the stream to every viewer.",
        "Unicast bandwidth multiplies: 4 viewers × 20 Mbps = 80 Mbps for ONE camera.",
        "Multicast = one-to-many: the server sends ONE stream; the switch replicates it to subscribers via IGMP.",
        "Multicast bandwidth stays FLAT: 4 viewers still = 20 Mbps for that camera.",
        "Use unicast for few viewers / WAN / remote; use multicast for LAN, control rooms, video walls."
      ],
      hotspots: [
        { label: "Unicast", text: "Separate copy per client. Simple but expensive — bandwidth scales with viewers." },
        { label: "Multicast", text: "One stream to the network; IGMP-aware switch copies only to ports that subscribed." },
        { label: "The math", text: "50 cams × 4 clients: unicast ≈ 4 Gbps vs multicast ≈ 1 Gbps." }
      ]
    },
    keyFacts: [
      "Unicast = one-to-one (a copy per viewer).",
      "Multicast = one-to-many (one stream, switch replicates).",
      "Unicast: 4 viewers × 20 Mbps = 80 Mbps per camera.",
      "Multicast: 4 viewers = still 20 Mbps per camera.",
      "Multicast needs IGMP snooping on the switch.",
      "Unicast for WAN/remote; multicast for LAN/video walls."
    ],
    flashcards: [
      { front: "Define unicast video streaming.", back: "One-to-one: the server sends a separate copy of the stream to each viewer. Bandwidth scales with the number of viewers." },
      { front: "Define multicast video streaming.", back: "One-to-many: the server sends one stream; an IGMP-aware switch replicates it only to ports that subscribed. Bandwidth stays flat." },
      { front: "4 clients watch one 20 Mbps camera. Bandwidth with unicast vs multicast?", back: "Unicast = 4 × 20 = 80 Mbps. Multicast = 20 Mbps (flat)." },
      { front: "What switch feature makes multicast efficient?", back: "IGMP snooping — the switch only copies the stream to ports that requested it." },
      { front: "When is unicast the better choice?", back: "Few viewers, remote access, or WAN connections where multicast routing isn't available." }
    ],
    quiz: [
      { q: "With unicast, what happens to bandwidth as more viewers join?", choices: ["Stays flat", "Multiplies with each viewer", "Drops", "Halves"], answer: 1, explain: "Unicast sends a separate copy per viewer, so bandwidth scales up." },
      { q: "Multicast relies on which switch feature to avoid flooding?", choices: ["QoS", "NAT", "IGMP snooping", "Spanning tree"], answer: 2, explain: "IGMP snooping limits multicast to subscribing ports." },
      { q: "One 20 Mbps camera, 4 LAN viewers. Multicast total bandwidth for that camera?", choices: ["80 Mbps", "40 Mbps", "20 Mbps", "5 Mbps"], answer: 2, explain: "Multicast stays flat at 20 Mbps regardless of viewer count." },
      { q: "Best streaming method for a control room video wall with many local viewers?", choices: ["Unicast", "Multicast", "RTSP only", "HTTP"], answer: 1, explain: "Multicast keeps LAN bandwidth flat for many concurrent viewers." }
    ],
    scenarios: [
      { situation: "A site adds a 12-monitor video wall and the network saturates whenever all screens show live cameras. They're using unicast. Best change?", choices: ["Add more servers", "Enable multicast with IGMP snooping on the LAN", "Lower retention", "Switch to RAID 6"], answer: 1, explain: "Many local viewers is the classic multicast use case — it keeps per-camera bandwidth flat." },
      { situation: "A single remote manager over a VPN reports choppy multicast video. What's the pragmatic fix?", choices: ["Force multicast across the WAN", "Use unicast for that remote viewer", "Add a video wall", "Disable IGMP"], answer: 1, explain: "Multicast rarely routes well over WAN/VPN; unicast suits a single remote viewer." }
    ],
    games: {
      match: [
        { a: "Unicast", b: "Copy per viewer (scales up)" },
        { a: "Multicast", b: "One stream, flat bandwidth" },
        { a: "IGMP snooping", b: "Switch copies to subscribers only" },
        { a: "WAN / remote", b: "Best with unicast" },
        { a: "Video wall / LAN", b: "Best with multicast" }
      ]
    }
  },

  /* ------------------------------------------------------------------ PoE */
  {
    id: "poe",
    title: "Power over Ethernet",
    icon: "🔌",
    blurb: "How cameras draw power over the data cable — standards, wattages, and the dreaded power budget.",
    diagram: {
      img: "assets/diagrams/PoE_Explained.png",
      takeaways: [
        "PoE delivers data + DC power over one Cat5e/Cat6 cable — no outlet needed at the camera (max 100 m).",
        "The switch is the PSE (Power Sourcing Equipment); the camera is the PD (Powered Device).",
        "Standards: PoE 802.3af = 15.4W, PoE+ 802.3at = 30W, PoE++ 802.3bt Type 3 = 60W, Type 4 = 100W.",
        "A switch has a total PoE BUDGET (e.g. 370W). Sum of all camera draw must stay under it.",
        "Exceeding the budget makes cameras reboot randomly — the #1 PoE support issue."
      ],
      hotspots: [
        { label: "PSE → PD", text: "Switch (PSE) powers the camera (PD) through one Ethernet cable carrying data + power." },
        { label: "100 m limit", text: "Runs over ~100 m cause voltage drop → intermittent disconnects. Use an extender." },
        { label: "Budget", text: "e.g. 6 fixed × 15W + 2 PTZ × 30W = 150W used of a 370W switch budget." }
      ]
    },
    keyFacts: [
      "PoE = data + power over one cable, max 100 m.",
      "Switch = PSE, camera = PD.",
      "PoE 802.3af = 15.4W; PoE+ 802.3at = 30W.",
      "PoE++ 802.3bt Type 3 = 60W; Type 4 = 100W.",
      "Switch PoE budget must exceed total camera draw.",
      "Budget exceeded → random camera reboots."
    ],
    flashcards: [
      { front: "What does PoE deliver, over what, and what's the cable limit?", back: "Data + DC power over a single Cat5e/Cat6 cable, up to ~100 metres." },
      { front: "In PoE terms, what is the switch and what is the camera?", back: "Switch = PSE (Power Sourcing Equipment); camera = PD (Powered Device)." },
      { front: "How much power does standard PoE (802.3af) provide?", back: "15.4W at the switch (~12.95W at the device)." },
      { front: "How much does PoE+ (802.3at) provide, and what's it for?", back: "30W — for PTZ, IR, and multi-sensor cameras." },
      { front: "PoE++ 802.3bt Type 3 vs Type 4 power?", back: "Type 3 = 60W (PTZ with heater); Type 4 = 100W (large PTZ + heater + wiper)." },
      { front: "What is a PoE budget and why does it matter?", back: "The total watts a switch can supply across all ports (e.g. 370W). Exceeding it causes random camera reboots." }
    ],
    quiz: [
      { q: "What is the maximum cable distance for standard PoE?", choices: ["50 m", "100 m", "300 m", "1 km"], answer: 1, explain: "PoE is limited to about 100 metres before voltage drop causes problems." },
      { q: "A PTZ camera needs 25W. Which standard must the port support?", choices: ["PoE 802.3af (15.4W)", "PoE+ 802.3at (30W)", "Passive 12V", "None — it's USB"], answer: 1, explain: "25W exceeds 802.3af's 15.4W, so you need PoE+ (30W) or higher." },
      { q: "Cameras on a switch reboot randomly under load. Most likely cause?", choices: ["DNS failure", "PoE budget exceeded", "Wrong VLAN", "RAID rebuild"], answer: 1, explain: "When total draw exceeds the switch's PoE budget, ports lose power and cameras reboot." },
      { q: "In PoE, the device supplying power is called the…", choices: ["PD", "PSE", "DHCP", "SVI"], answer: 1, explain: "PSE = Power Sourcing Equipment (the switch/injector)." }
    ],
    scenarios: [
      { situation: "8 fixed cameras (15W each) and 4 PTZs (30W each) are planned on a 24-port switch with a 200W PoE budget. What happens?", choices: ["Fine — well under budget", "Over budget: 8×15 + 4×30 = 240W > 200W, expect reboots", "Cameras won't get IPs", "RTSP will fail"], answer: 1, explain: "Total draw = 120 + 120 = 240W, exceeding the 200W budget — cameras will brown-out/reboot. Use a higher-budget switch." },
      { situation: "A single PTZ at the far end of a 130 m run keeps dropping while nearer cameras are fine. Cause and fix?", choices: ["Bad VLAN — re-tag it", "Cable too long → voltage drop; use a PoE extender or move the switch closer", "DNS — add hosts entry", "Increase retention"], answer: 1, explain: "Beyond ~100 m voltage drops; a PoE extender or relocating the switch resolves it." }
    ],
    games: {
      match: [
        { a: "802.3af (PoE)", b: "15.4W" },
        { a: "802.3at (PoE+)", b: "30W" },
        { a: "802.3bt Type 3", b: "60W" },
        { a: "802.3bt Type 4", b: "100W" },
        { a: "PSE", b: "The switch" },
        { a: "PD", b: "The camera" }
      ],
      sort: {
        prompt: "Sort each camera type by the PoE standard it usually needs.",
        buckets: {
          "PoE (15.4W)": ["Fixed dome", "Basic bullet"],
          "PoE+ (30W)": ["PTZ", "IR camera", "Multi-sensor"],
          "PoE++ (60-100W)": ["PTZ with heater", "Large PTZ + wiper"]
        }
      }
    }
  },

  /* ------------------------------------------------------------- STORAGE */
  {
    id: "storage",
    title: "Storage & RAID",
    icon: "💽",
    blurb: "Where video lives — storage types, RAID levels, and how to size retention.",
    diagram: {
      img: "assets/diagrams/Storage_RAID_Explained.png",
      takeaways: [
        "Storage types: DAS (disks inside the server, small sites), NAS (network box, SMB/NFS), SAN (high-speed iSCSI/FC, enterprise).",
        "RAID 0 = striping, fast but NO protection (1 disk fails = all lost). RAID 1 = mirroring (safe, 50% capacity).",
        "RAID 5 = striping + parity across 3+ disks, survives 1 failure — most common. RAID 6 = double parity, survives 2.",
        "NEVER use RAID 0 for surveillance. Use RAID 5/6 for recording, RAID 1 for the OS drive.",
        "Storage(GB) = Bitrate(Mbps) × 0.0432 × hours/day × retention days × number of cameras."
      ],
      hotspots: [
        { label: "DAS / NAS / SAN", text: "Internal disks vs networked box (SMB/NFS) vs dedicated storage network (iSCSI/FC)." },
        { label: "RAID levels", text: "0 striping (no safety), 1 mirror, 5 single-parity, 6 double-parity." },
        { label: "Sizing", text: "GB = Mbps × 0.0432 × hrs × days × cams. e.g. 16 cams × 5 Mbps × 24h × 30d ≈ 25 TB." }
      ]
    },
    keyFacts: [
      "DAS = internal disks; NAS = network (SMB/NFS); SAN = iSCSI/FC.",
      "RAID 0 = striping, no protection (never for CCTV).",
      "RAID 1 = mirroring (safe, 50% usable).",
      "RAID 5 = striping + parity, survives 1 disk — most common.",
      "RAID 6 = double parity, survives 2 disks.",
      "Storage GB = Mbps × 0.0432 × hrs/day × days × cameras."
    ],
    flashcards: [
      { front: "What do DAS, NAS, and SAN mean?", back: "DAS = Direct Attached (disks in the server). NAS = Network Attached (box shared via SMB/NFS). SAN = Storage Area Network (high-speed iSCSI/FC, appears as local disk)." },
      { front: "What is RAID 0 and why is it banned for surveillance?", back: "Striping for speed with NO redundancy — if one disk fails, ALL footage is lost." },
      { front: "What is RAID 1?", back: "Mirroring — an exact copy on two drives. Safe, but you only get 50% of raw capacity." },
      { front: "What is RAID 5 and how many disk failures does it survive?", back: "Striping + parity across 3+ disks. Survives 1 disk failure (rebuilds from parity). The most common CCTV choice." },
      { front: "What is RAID 6?", back: "Double parity — survives 2 simultaneous disk failures. Best for large arrays." },
      { front: "State the CCTV storage sizing formula.", back: "Storage(GB) = Bitrate(Mbps) × 0.0432 × hours/day × retention days × number of cameras." }
    ],
    quiz: [
      { q: "Which RAID level offers speed but ZERO data protection?", choices: ["RAID 0", "RAID 1", "RAID 5", "RAID 6"], answer: 0, explain: "RAID 0 stripes for speed with no redundancy — never use it for footage." },
      { q: "Most common RAID level for CCTV recording drives?", choices: ["RAID 0", "RAID 1", "RAID 5", "RAID 10"], answer: 2, explain: "RAID 5 (striping + parity, survives 1 failure) is the typical recommendation." },
      { q: "How many disk failures can RAID 6 survive?", choices: ["0", "1", "2", "3"], answer: 2, explain: "RAID 6 uses double parity and tolerates 2 simultaneous failures." },
      { q: "Which storage type uses iSCSI/Fibre Channel and suits 100+ cameras?", choices: ["DAS", "NAS", "SAN", "USB"], answer: 2, explain: "SAN is a dedicated high-speed storage network for enterprise scale." },
      { q: "In the storage formula, what is 0.0432?", choices: ["A RAID overhead factor", "The Mbps→GB-per-hour conversion factor", "Disk failure rate", "Compression ratio"], answer: 1, explain: "0.0432 converts Mbps to GB/hour (Mbps × 3600s ÷ 8 bits ÷ 1024)." }
    ],
    scenarios: [
      { situation: "A site used RAID 0 across 4 recording disks. One disk fails. What's the impact?", choices: ["No data lost — rebuild from parity", "All footage on the array is lost", "Only 25% lost", "Cameras reboot"], answer: 1, explain: "RAID 0 has no redundancy — a single failure destroys the whole array. Should have been RAID 5/6." },
      { situation: "Recording stops on a system that was fine yesterday. The RAID shows 'degraded'. Best first action?", choices: ["Lower camera bitrate", "Identify & replace the failed disk and let the array rebuild; monitor health", "Add a new VLAN", "Switch to multicast"], answer: 1, explain: "A degraded array means a disk failed; replace it promptly and rebuild before a second failure causes loss." },
      { situation: "Estimate storage: 16 cameras at 5 Mbps, 24h/day, 30-day retention. Roughly?", choices: ["~2.5 TB", "~25 TB", "~250 GB", "~250 TB"], answer: 1, explain: "5 × 0.0432 × 24 × 30 × 16 ≈ 24,883 GB ≈ 25 TB." }
    ],
    games: {
      match: [
        { a: "RAID 0", b: "Striping, no protection" },
        { a: "RAID 1", b: "Mirroring" },
        { a: "RAID 5", b: "Single parity (survives 1)" },
        { a: "RAID 6", b: "Double parity (survives 2)" },
        { a: "DAS", b: "Disks inside the server" },
        { a: "SAN", b: "iSCSI/FC storage network" }
      ],
      sort: {
        prompt: "Sort each RAID level by how many disk failures it survives.",
        buckets: {
          "Survives 0": ["RAID 0"],
          "Survives 1": ["RAID 1", "RAID 5"],
          "Survives 2": ["RAID 6"]
        }
      }
    }
  },

  /* ---------------------------------------------------------- SUBNETTING */
  {
    id: "subnetting",
    title: "Subnetting",
    icon: "🧮",
    blurb: "IP addresses, subnet masks/CIDR, and how to design camera/server/client subnets.",
    diagram: {
      img: "assets/diagrams/Subnetting_Explained.png",
      takeaways: [
        "An IP has a network part and a host part; the subnet mask says where the split is.",
        "255.255.255.0 = /24 = 254 usable hosts. /23 = 510, /22 = 1022, /16 = 65,534.",
        "Devices on the SAME subnet talk directly; DIFFERENT subnets need a router or L3 switch (gateway).",
        "Every device needs three things: IP address, subnet mask, and default gateway.",
        "Typical CCTV design: cameras 10.10.100.0/24, servers 10.10.10.0/24, clients 10.10.200.0/24."
      ],
      hotspots: [
        { label: "Mask / CIDR", text: "255.255.255.0 = /24. The mask marks network bits vs host bits." },
        { label: "Same vs different", text: "Same subnet = direct comms. Different = must route via a gateway (L3 switch/router)." },
        { label: "Three essentials", text: "IP + Subnet Mask + Default Gateway on every device." }
      ]
    },
    keyFacts: [
      "Subnet mask splits an IP into network + host parts.",
      "/24 = 255.255.255.0 = 254 hosts.",
      "/23 = 510, /22 = 1022, /16 = 65,534 hosts.",
      "Same subnet = talk directly; different = need a gateway.",
      "Every device needs IP + mask + default gateway.",
      "Camera 10.10.100.0/24, Server 10.10.10.0/24, Client 10.10.200.0/24."
    ],
    flashcards: [
      { front: "What does a subnet mask do?", back: "It marks which part of an IP is the network and which is the host. e.g. 255.255.255.0 means first 3 octets = network, last = host." },
      { front: "What does /24 mean, and how many usable hosts?", back: "/24 = 255.255.255.0 = 254 usable host addresses." },
      { front: "How many usable hosts in a /23 and a /22?", back: "/23 = 510 hosts; /22 = 1,022 hosts." },
      { front: "When do two devices need a router/L3 switch to communicate?", back: "When they're on DIFFERENT subnets. Same-subnet devices talk directly." },
      { front: "What three IP settings must every device have?", back: "IP address, subnet mask, and default gateway." },
      { front: "Give a typical CCTV subnet split.", back: "Cameras 10.10.100.0/24, Servers 10.10.10.0/24, Clients 10.10.200.0/24 — each with its own gateway (.1)." }
    ],
    quiz: [
      { q: "How many usable host addresses does a /24 provide?", choices: ["256", "254", "510", "1024"], answer: 1, explain: "/24 = 256 total minus network & broadcast = 254 usable." },
      { q: "255.255.254.0 corresponds to which CIDR?", choices: ["/22", "/23", "/24", "/16"], answer: 1, explain: "255.255.254.0 = /23 = 510 usable hosts." },
      { q: "A camera (10.10.100.10/24) can't reach a server (10.10.10.100/24). Most likely missing piece?", choices: ["A faster disk", "A route/gateway between the two subnets", "More PoE", "A second DNS server"], answer: 1, explain: "They're on different subnets — they need an L3 switch/router and correct default gateways." },
      { q: "Which three settings must every networked device have?", choices: ["IP, MAC, port", "IP, subnet mask, default gateway", "IP, DNS, VLAN", "Mask, gateway, RAID"], answer: 1, explain: "IP + subnet mask + default gateway are the essentials." }
    ],
    scenarios: [
      { situation: "A new camera at 10.10.100.10/24 has no default gateway set. It reaches other cameras fine but not the ACC server on 10.10.10.0/24. Why?", choices: ["Wrong RAID", "No gateway means it can't route off its own subnet to the server", "PoE too low", "DNS cache"], answer: 1, explain: "Without a default gateway a device can only reach its own subnet; cross-subnet traffic needs the gateway." },
      { situation: "A site is growing past 400 cameras and the camera /24 is full. Cleanest fix?", choices: ["Reuse client IPs", "Move cameras to a larger subnet such as /22 (1,022 hosts)", "Disable the gateway", "Switch to RAID 6"], answer: 1, explain: "A /22 gives 1,022 hosts — appropriate for 400–900 cameras." }
    ],
    games: {
      match: [
        { a: "/24", b: "254 hosts" },
        { a: "/23", b: "510 hosts" },
        { a: "/22", b: "1,022 hosts" },
        { a: "/16", b: "65,534 hosts" },
        { a: "Same subnet", b: "Talk directly" },
        { a: "Different subnet", b: "Need a gateway" }
      ]
    }
  },

  /* --------------------------------------------------------------- VLANS */
  {
    id: "vlan",
    title: "VLANs",
    icon: "🔀",
    blurb: "Splitting one physical switch into isolated logical networks for security and performance.",
    diagram: {
      img: "assets/diagrams/VLAN_Explained.png",
      takeaways: [
        "Without VLANs everything shares one flat network — camera video floods it and there's no isolation.",
        "A VLAN splits one switch into separate logical networks (e.g. VLAN 100 cameras, 10 servers, 200 corporate, 300 guest).",
        "Benefits: traffic isolation, security (guests can't reach cameras), performance, broadcast containment, per-VLAN policy.",
        "Each VLAN is its own subnet; a guest VLAN is typically fully isolated.",
        "VLANs need a managed switch — unmanaged switches can't do them."
      ],
      hotspots: [
        { label: "Flat network", text: "One broadcast domain: video floods, no security, broadcast storms hit everyone." },
        { label: "Segmented", text: "VLAN 100 cameras / 10 servers / 200 corporate / 300 guest — isolated logical networks." },
        { label: "Why it helps", text: "Isolation, security, performance, broadcast containment, per-VLAN QoS/ACLs." }
      ]
    },
    keyFacts: [
      "VLAN = logical network on a shared physical switch.",
      "Typical: VLAN 100 cameras, 10 servers, 200 corporate, 300 guest.",
      "Each VLAN = its own subnet.",
      "Benefits: isolation, security, performance, broadcast containment.",
      "Guest VLAN is usually fully isolated.",
      "Requires a managed switch."
    ],
    flashcards: [
      { front: "What is a VLAN?", back: "A Virtual LAN — a way to split one physical switch into multiple isolated logical networks, each its own subnet." },
      { front: "Name the four typical CCTV VLANs and their IDs.", back: "Cameras (VLAN 100), Servers (VLAN 10), Corporate (VLAN 200), Guest (VLAN 300)." },
      { front: "List three benefits of VLANs.", back: "Traffic isolation, security (segments can't reach each other), performance, broadcast containment, and per-VLAN policy (QoS/ACLs)." },
      { front: "What's wrong with a flat (no-VLAN) network for CCTV?", back: "Camera video floods the network, office PCs slow down, anyone can access feeds, and broadcast storms hit every device." },
      { front: "What kind of switch is required for VLANs?", back: "A managed switch — unmanaged switches don't support VLANs." }
    ],
    quiz: [
      { q: "What does a VLAN let you do on a single switch?", choices: ["Add more ports", "Create isolated logical networks", "Increase PoE budget", "Store video"], answer: 1, explain: "VLANs segment one physical switch into separate logical networks." },
      { q: "Which VLAN ID is used for cameras in the standard design?", choices: ["10", "100", "200", "300"], answer: 1, explain: "Cameras = VLAN 100 in the reference design." },
      { q: "A guest device should NOT be able to reach camera feeds. VLANs provide this through…", choices: ["Higher bandwidth", "Isolation between segments", "Faster DNS", "RAID parity"], answer: 1, explain: "VLAN isolation keeps guest traffic away from camera/server VLANs." },
      { q: "VLANs require which type of switch?", choices: ["Unmanaged", "Managed", "PoE-only", "Any 5-port switch"], answer: 1, explain: "Only managed switches support VLAN configuration." }
    ],
    scenarios: [
      { situation: "Guest Wi-Fi users discover they can browse to camera login pages on the same flat network. Best remediation?", choices: ["Change camera passwords only", "Put guests and cameras on separate isolated VLANs", "Disable DNS", "Add RAID 6"], answer: 1, explain: "Segmentation via VLANs isolates guests from the camera/server networks." },
      { situation: "Broadcast storms periodically take down the whole network including cameras and PCs. How do VLANs help?", choices: ["They increase total bandwidth", "They contain broadcasts within each VLAN", "They add parity", "They forward mDNS everywhere"], answer: 1, explain: "Broadcasts stay inside their own VLAN, so a storm in one segment doesn't take down others." }
    ],
    games: {
      match: [
        { a: "VLAN 100", b: "Cameras" },
        { a: "VLAN 10", b: "Servers" },
        { a: "VLAN 200", b: "Corporate" },
        { a: "VLAN 300", b: "Guest (isolated)" },
        { a: "Managed switch", b: "Required for VLANs" }
      ]
    }
  },

  /* ----------------------------------------------------------- VLAN SETUP */
  {
    id: "vlan-setup",
    title: "VLAN Setup",
    icon: "🛠️",
    blurb: "The practical 6 steps to configure VLANs on a managed switch — access ports, trunks, and inter-VLAN routing.",
    diagram: {
      img: "assets/diagrams/VLAN_Setup_Guide.png",
      takeaways: [
        "Prerequisites: a MANAGED switch, management access (GUI/SSH/console), an IP plan, and an L3 switch/router for inter-VLAN routing.",
        "Steps: 1) Plan VLANs, 2) Access the switch, 3) Create VLANs, 4) Assign access ports, 5) Configure a trunk, 6) Enable inter-VLAN routing.",
        "Access port = ONE VLAN, untagged, connects to one end device. Trunk port = MANY VLANs, tagged (802.1Q), switch-to-switch/router.",
        "Inter-VLAN routing uses SVIs (interface vlan X + ip address) and 'ip routing' so cameras can reach the ACC server.",
        "Set each camera's default gateway to its VLAN's gateway (e.g. 10.10.100.1) and save: copy running-config startup-config."
      ],
      hotspots: [
        { label: "Access vs Trunk", text: "Access = one VLAN, untagged, end device. Trunk = many VLANs, tagged 802.1Q, between switches/routers." },
        { label: "Create VLAN (Cisco)", text: "vlan 100 → name Cameras → exit. Repeat per VLAN." },
        { label: "Inter-VLAN routing", text: "interface vlan 100 → ip address 10.10.100.1 255.255.255.0 → no shutdown; then ip routing." }
      ]
    },
    keyFacts: [
      "Needs a managed switch + an IP plan.",
      "6 steps: plan → access → create → assign ports → trunk → route.",
      "Access port = one VLAN, untagged.",
      "Trunk port = many VLANs, tagged (802.1Q).",
      "Inter-VLAN routing uses SVIs + 'ip routing'.",
      "Save config: copy running-config startup-config."
    ],
    flashcards: [
      { front: "What are the prerequisites for setting up VLANs?", back: "A managed switch, management access (Web GUI/SSH/console), a planned IP scheme, and an L3 switch/router if VLANs must talk." },
      { front: "List the 6 VLAN-setup steps.", back: "1) Plan VLANs 2) Access the switch 3) Create VLANs 4) Assign access ports 5) Configure trunk 6) Enable inter-VLAN routing." },
      { front: "Access port vs trunk port?", back: "Access = ONE VLAN, untagged, to a single end device. Trunk = MANY VLANs, tagged with 802.1Q, between switches/routers." },
      { front: "Cisco commands to create a camera VLAN?", back: "vlan 100 → name Cameras → exit (after 'configure terminal')." },
      { front: "How do you enable inter-VLAN routing on an L3 switch?", back: "Create SVIs: interface vlan X → ip address … → no shutdown, then enable 'ip routing'." },
      { front: "How do you save the switch configuration?", back: "copy running-config startup-config (otherwise it's lost on reboot)." }
    ],
    quiz: [
      { q: "A port connecting a single camera to its VLAN should be configured as…", choices: ["A trunk port", "An access port", "A console port", "A routed loopback"], answer: 1, explain: "One device, one VLAN, untagged = access port." },
      { q: "A link carrying multiple VLANs between two switches must be a…", choices: ["Access port", "Trunk port (802.1Q tagged)", "Mirror port", "DHCP port"], answer: 1, explain: "Trunks carry multiple tagged VLANs between switches/routers." },
      { q: "Cameras on VLAN 100 can't reach the ACC server on VLAN 10. What's missing?", choices: ["A managed switch", "Inter-VLAN routing (SVIs + ip routing)", "More PoE", "A second DNS"], answer: 1, explain: "VLANs are isolated by default; you need L3 routing between them." },
      { q: "Which command makes a switch configuration survive a reboot?", choices: ["no shutdown", "copy running-config startup-config", "switchport mode access", "ip routing"], answer: 1, explain: "Saving running-config to startup-config persists it." },
      { q: "What does 802.1Q refer to?", choices: ["PoE standard", "VLAN tagging on trunk links", "RAID level", "RTSP port"], answer: 1, explain: "802.1Q is the standard for tagging frames with VLAN IDs on trunks." }
    ],
    scenarios: [
      { situation: "After creating VLANs and assigning access ports, cameras work among themselves but can't reach the server VLAN. The switch is L3-capable. Next step?", choices: ["Reboot the cameras", "Create SVIs for each VLAN and enable 'ip routing'", "Convert all ports to trunks", "Disable the firewall"], answer: 1, explain: "Inter-VLAN routing (SVIs + ip routing) lets the VLANs communicate." },
      { situation: "A tech configured everything correctly but all VLAN config vanished after a power cycle. What was forgotten?", choices: ["no shutdown", "Saving with copy running-config startup-config", "Setting the gateway", "Enabling PoE"], answer: 1, explain: "Unsaved running-config is lost on reboot — it must be copied to startup-config." }
    ],
    games: {
      sequence: {
        prompt: "Order the VLAN setup steps.",
        items: ["Plan your VLANs (IDs, subnets, ports)", "Access the switch (GUI/SSH/console)", "Create the VLANs", "Assign access ports", "Configure the trunk port", "Enable inter-VLAN routing"]
      },
      match: [
        { a: "Access port", b: "One VLAN, untagged" },
        { a: "Trunk port", b: "Many VLANs, 802.1Q tagged" },
        { a: "SVI", b: "interface vlan X gateway" },
        { a: "ip routing", b: "Enables inter-VLAN routing" },
        { a: "copy run start", b: "Saves the config" }
      ]
    }
  },

  /* -------------------------------------------------------- FIREWALL LAB */
  {
    id: "firewall-lab",
    title: "Firewall Lab",
    icon: "🧪",
    blurb: "Hands-on troubleshooting: listening vs connecting, testing ports, and reading firewall rules by IP/VLAN.",
    diagram: {
      img: "assets/diagrams/Firewalls_Ports_Explained.png",
      takeaways: [
        "A server LISTENS on a port (waiting); a client CONNECTS to that port. ACC Server listens on 38880; the client connects to it.",
        "A blocked port can fail two ways: REFUSED (actively rejected) or TIMED OUT (silently dropped).",
        "Test reachability with: Test-NetConnection <server-ip> -Port 38880 (PowerShell) or telnet.",
        "Firewall rules are per source IP/VLAN: cameras need 38880; control room needs 38880+38881+443; guests get nothing; remote VPN gets 443.",
        "When a customer says 'client can't connect', check whether their IP/VLAN has the right port rules."
      ],
      hotspots: [
        { label: "Listen vs connect", text: "Server listens on 38880; client connects TO 38880. A 'port' is a service endpoint." },
        { label: "Fail modes", text: "REFUSED = actively rejected. TIMED OUT = packet silently dropped by the firewall." },
        { label: "Rules by source", text: "Camera VLAN → 38880 only. Control room → 38880/38881/443. Guest → none. Remote VPN → 443." }
      ]
    },
    keyFacts: [
      "Server listens on a port; client connects to it.",
      "ACC Server listens on 38880.",
      "Blocked port = REFUSED or TIMED OUT.",
      "Test-NetConnection <ip> -Port 38880 checks a port.",
      "Rules are per source IP/VLAN.",
      "Guest network typically gets NO allowed ports."
    ],
    flashcards: [
      { front: "What's the difference between a server listening and a client connecting?", back: "The server LISTENS on a port (waits for connections); the client CONNECTS to that port. ACC Server listens on 38880; the client connects to 38880." },
      { front: "Two ways a blocked port connection can fail?", back: "REFUSED (actively rejected — port closed) or TIMED OUT (silently dropped by a firewall)." },
      { front: "What command tests whether a port is reachable from Windows?", back: "Test-NetConnection <server-ip> -Port 38880 in PowerShell (telnet also works)." },
      { front: "What ports does a control-room PC typically need to ACC?", back: "38880 (gateway) + 38881 (server comms) + 443 (HTTPS) for full access." },
      { front: "What firewall access does a guest device usually get?", back: "None — the guest network is fully isolated with no allowed ports to ACC." }
    ],
    quiz: [
      { q: "ACC Server is waiting for client connections on 38880. This is called…", choices: ["Connecting", "Listening", "Routing", "Tagging"], answer: 1, explain: "A service that waits for incoming connections is listening on its port." },
      { q: "A connection attempt hangs and eventually fails with no response. This is…", choices: ["REFUSED", "TIMED OUT (dropped)", "ALLOWED", "An ACK"], answer: 1, explain: "Silent drop → timeout. An active rejection would be REFUSED." },
      { q: "Which PowerShell command checks if port 38880 is open on a server?", choices: ["ping <ip>", "Test-NetConnection <ip> -Port 38880", "ipconfig /all", "tracert <ip>"], answer: 1, explain: "Test-NetConnection with -Port tests a specific TCP port." },
      { q: "A remote user connecting over VPN should typically only be allowed which port?", choices: ["38881", "443", "80", "554"], answer: 1, explain: "Remote/VPN users are usually limited to 443 (HTTPS)." }
    ],
    scenarios: [
      { situation: "A customer says 'the ACC client can't connect'. Their PC is on the camera VLAN, which the firewall only allows 38880 outbound. They're using the web client on 443. Why does it fail?", choices: ["RAID degraded", "Their VLAN doesn't allow 443 — only 38880 is open", "PoE budget", "DNS cache"], answer: 1, explain: "The web client needs 443, but the camera VLAN rule only permits 38880. Fix the rule or use the right network." },
      { situation: "Test-NetConnection to 38880 returns success, but the desktop ACC client still won't connect. Most useful next check?", choices: ["The port is fine, so check ACC service status/credentials/version on the server", "Replace the switch", "Re-cable the cameras", "Increase retention"], answer: 0, explain: "If the port is open, the network path is good — move on to the ACC service, login, or version mismatch." }
    ],
    games: {
      match: [
        { a: "Listening", b: "Server waits on a port" },
        { a: "Connecting", b: "Client reaches out to a port" },
        { a: "REFUSED", b: "Actively rejected" },
        { a: "TIMED OUT", b: "Silently dropped" },
        { a: "Test-NetConnection", b: "Check if a port is open" }
      ],
      sort: {
        prompt: "Given the per-source firewall rules, was each connection allowed or blocked?",
        buckets: {
          "Allowed": ["Control room → 38880", "Remote VPN → 443", "Camera → 38880"],
          "Blocked / Dropped": ["Guest → 38880", "Camera → 443", "Guest → 443"]
        }
      }
    }
  }
];
