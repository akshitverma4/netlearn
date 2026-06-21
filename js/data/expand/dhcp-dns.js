(function () {
  "use strict";
  var c = (window.CONCEPTS || []).filter(function (x) { return x.id === "dhcp-dns"; })[0];
  if (!c) return;

  c.flashcards = c.flashcards.concat([
    { front: "What is a DHCP relay agent (ip helper-address) for?", back: "A router feature that forwards DHCP broadcasts from a client subnet to a DHCP server on a different subnet, so one central server can serve many VLANs." },
    { front: "On a Cisco router, which command enables DHCP relay?", back: "ip helper-address <dhcp-server-ip>, applied on the interface facing the clients (the SVI for that VLAN)." },
    { front: "Why is a DHCP relay needed at all?", back: "DHCP DISCOVER and REQUEST are broadcasts, and routers do not forward broadcasts between subnets. The relay converts them to unicast toward the server." },
    { front: "What is a DHCP scope?", back: "The range (pool) of IP addresses a DHCP server is configured to lease out for a given subnet, along with its options (mask, gateway, DNS)." },
    { front: "What is a DHCP exclusion range?", back: "Addresses within a scope that the DHCP server is told NOT to hand out, typically reserved for static devices like servers, switches, and cameras." },
    { front: "At what point does a DHCP client first try to renew its lease (T1)?", back: "At 50% of the lease time, the client unicasts a REQUEST directly to the original DHCP server to renew." },
    { front: "What happens at T2 (87.5% of the lease) if renewal failed?", back: "The client enters REBINDING and broadcasts a REQUEST to any available DHCP server, not just the original one." },
    { front: "How many packets does a lease RENEWAL use, versus a new lease?", back: "Renewal is just REQUEST then ACK (two messages, unicast). A brand-new lease uses the full four-step DORA." },
    { front: "What is a DNS A record?", back: "Maps a hostname to an IPv4 address (e.g. acc-server.local -> 10.10.10.100)." },
    { front: "What is a DNS AAAA record?", back: "Maps a hostname to an IPv6 address (the IPv6 equivalent of an A record)." },
    { front: "What is a DNS CNAME record?", back: "A canonical-name alias that points one hostname to another hostname (e.g. www -> webserver.local) rather than directly to an IP." },
    { front: "What is a DNS PTR record?", back: "A pointer record used in reverse DNS to map an IP address back to a hostname; it lives in the in-addr.arpa zone for IPv4." },
    { front: "What is a DNS MX record?", back: "A mail exchanger record that tells senders which mail server handles email for a domain." },
    { front: "What is a DNS NS record?", back: "A name server record that lists the authoritative DNS servers for a zone/domain." },
    { front: "What is a DNS SRV record and why does AD use it?", back: "A service-location record giving the host and port for a service. Active Directory clients use SRV records (e.g. _ldap._tcp) to find domain controllers." },
    { front: "What is DNS TTL?", back: "Time To Live: how long a resolver may cache a DNS record before it must look it up again. Lower TTL = faster propagation, more queries." },
    { front: "What does a forward lookup zone hold versus a reverse lookup zone?", back: "Forward zone resolves names to IPs (A/AAAA). Reverse zone resolves IPs back to names (PTR), stored under in-addr.arpa." },
    { front: "What does the Windows command nslookup do?", back: "Queries a DNS server to resolve a name (or IP) so you can confirm whether DNS itself is returning the right answer." },
    { front: "What does ipconfig /flushdns do?", back: "Clears the local Windows DNS resolver cache, forcing fresh lookups after a record has changed." },
    { front: "What does ipconfig /release and /renew do?", back: "/release gives up the current DHCP lease; /renew requests a fresh lease (re-running DORA) from the DHCP server." },
    { front: "What is a DHCP option, and name a common one?", back: "Extra configuration delivered with the lease. Examples: Option 3 (default gateway), Option 6 (DNS servers), Option 15 (DNS domain name), Option 51 (lease time)." },
    { front: "What is an authoritative vs a recursive DNS server?", back: "An authoritative server holds the actual records for a zone. A recursive resolver answers clients by querying other servers on their behalf and caching the result." },
    { front: "What is DHCP snooping on a switch?", back: "A security feature that blocks DHCP server replies (OFFER/ACK) from untrusted ports, stopping rogue DHCP servers from handing out bad addresses." },
    { front: "Why can a duplicate / rogue DHCP server cause outages?", back: "Clients may accept leases with a wrong gateway or DNS from the rogue server, breaking connectivity even though they have an IP." },
    { front: "What does the hosts file take priority over?", back: "On most systems the hosts file is checked before DNS, so a hosts entry overrides whatever DNS would return for that name." },
    { front: "Why should the DHCP scope range never overlap your static/camera addresses?", back: "If DHCP can lease an address already used by a static device, you get an IP conflict; exclude the static range from the scope." }
  ]);

  c.quiz = c.quiz.concat([
    { q: "Clients on VLAN 20 get no IP from a DHCP server that sits on VLAN 10. What is the standard fix on the router?", choices: ["Add a static route", "Configure ip helper-address pointing to the DHCP server on the VLAN 20 interface", "Open port 80", "Shorten the lease time"], answer: 1, explain: "Routers do not forward DHCP broadcasts, so ip helper-address relays them across subnets to the server." },
    { q: "Why is a DHCP relay agent needed between subnets?", choices: ["DHCP uses TCP which is blocked", "DHCP DISCOVER is a broadcast and routers do not forward broadcasts", "DNS must resolve the server first", "Leases are too long"], answer: 1, explain: "DISCOVER/REQUEST are broadcasts; the relay converts them to unicast toward a server on another subnet." },
    { q: "A DHCP relay forwards the client's broadcast to the server as what?", choices: ["A multicast", "A unicast", "Another broadcast", "An ARP request"], answer: 1, explain: "The relay agent unicasts the request to the configured server address." },
    { q: "At what fraction of the lease does a DHCP client first attempt renewal (T1)?", choices: ["25%", "50%", "75%", "100%"], answer: 1, explain: "At T1 (50%) the client unicasts a REQUEST to the original server to renew." },
    { q: "If renewal at T1 fails, at what point does the client enter REBINDING (T2)?", choices: ["62.5%", "75%", "87.5%", "95%"], answer: 2, explain: "At T2 (87.5%) the client broadcasts to any available DHCP server." },
    { q: "A DHCP lease renewal (not a new lease) consists of which messages?", choices: ["Discover and Offer", "Request and Acknowledge", "Discover, Offer, Request, Acknowledge", "Offer and Acknowledge"], answer: 1, explain: "Renewal skips Discover/Offer; the client sends REQUEST and the server replies ACK." },
    { q: "What is the purpose of a DHCP exclusion range?", choices: ["To delete old leases", "To stop the server leasing addresses reserved for static devices", "To extend the lease time", "To enable IPv6"], answer: 1, explain: "Exclusions keep static-device addresses out of the dynamic pool to avoid conflicts." },
    { q: "The block of addresses a DHCP server is allowed to lease for a subnet is called the…", choices: ["Reservation", "Scope", "Zone", "Helper"], answer: 1, explain: "A scope is the address pool plus options for a subnet." },
    { q: "Which DNS record maps a hostname to an IPv4 address?", choices: ["AAAA", "A", "CNAME", "PTR"], answer: 1, explain: "An A record resolves a name to an IPv4 address." },
    { q: "Which DNS record maps a hostname to an IPv6 address?", choices: ["A", "AAAA", "MX", "NS"], answer: 1, explain: "AAAA is the IPv6 equivalent of the A record." },
    { q: "Which record is an alias pointing one hostname to another hostname?", choices: ["A", "PTR", "CNAME", "TXT"], answer: 2, explain: "A CNAME points a name to another canonical name rather than to an IP." },
    { q: "Which record type is used for a reverse DNS lookup?", choices: ["A", "CNAME", "PTR", "MX"], answer: 2, explain: "PTR records map an IP back to a hostname in the in-addr.arpa zone." },
    { q: "A reverse DNS lookup resolves…", choices: ["Name to IP", "IP to name", "MAC to IP", "Port to service"], answer: 1, explain: "Reverse lookups turn an IP address into its hostname using PTR records." },
    { q: "Which DNS record tells senders which server handles a domain's email?", choices: ["NS", "MX", "SRV", "PTR"], answer: 1, explain: "MX (mail exchanger) records direct email to the right mail server." },
    { q: "Active Directory clients locate domain controllers primarily using which record type?", choices: ["MX", "SRV", "CNAME", "AAAA"], answer: 1, explain: "AD publishes SRV records (e.g. _ldap._tcp) so clients can find DCs." },
    { q: "Which record lists the authoritative name servers for a zone?", choices: ["NS", "A", "TXT", "PTR"], answer: 0, explain: "NS records identify the authoritative DNS servers for the domain." },
    { q: "A name change isn't taking effect for some clients even after the record was updated. The most likely reason is…", choices: ["The lease expired", "DNS caching / TTL not yet elapsed", "PoE budget exceeded", "The switch lost power"], answer: 1, explain: "Cached records persist until their TTL expires; flushing the cache or waiting out the TTL resolves it." },
    { q: "Which command clears the local DNS cache on a Windows PC?", choices: ["ipconfig /renew", "ipconfig /flushdns", "nslookup /clear", "ping -f"], answer: 1, explain: "ipconfig /flushdns empties the resolver cache so the next lookup is fresh." },
    { q: "You want to confirm whether DNS is returning the correct IP for a hostname. Best tool?", choices: ["ping by IP", "nslookup", "tracert", "ipconfig /release"], answer: 1, explain: "nslookup queries DNS directly and shows the answer the resolver returns." },
    { q: "A camera connects by IP but ACC can't reach it by hostname. nslookup returns the wrong IP. The fix is…", choices: ["Replace the camera", "Correct the DNS A record (or hosts entry)", "Increase PoE", "Change RAID level"], answer: 1, explain: "A stale/incorrect A record is the cause; fix the DNS record or use a hosts override." },
    { q: "A PC shows 169.254.10.5 and no gateway. Which command sequence is the first thing to try?", choices: ["nslookup then tracert", "ipconfig /release then /renew", "ping then telnet", "arp -a then route print"], answer: 1, explain: "169.254 is APIPA (no DHCP reply); releasing and renewing forces a fresh DORA attempt." },
    { q: "Two devices both end up with 10.10.10.50 and connectivity is intermittent. The DHCP-related cause is most likely…", choices: ["TTL too low", "A static IP that wasn't excluded from the DHCP scope", "Wrong MX record", "IGMP snooping off"], answer: 1, explain: "If the static address is inside the lease pool, DHCP can hand it out too, causing an IP conflict." },
    { q: "Which DHCP option carries the DNS server addresses?", choices: ["Option 3", "Option 6", "Option 15", "Option 51"], answer: 1, explain: "Option 6 = DNS servers; Option 3 = gateway, 15 = domain name, 51 = lease time." },
    { q: "Which DHCP option carries the default gateway?", choices: ["Option 3", "Option 6", "Option 51", "Option 1"], answer: 0, explain: "Option 3 (router) provides the default gateway address." },
    { q: "A switch feature that drops DHCP OFFER/ACK from untrusted ports to stop rogue servers is…", choices: ["IGMP snooping", "DHCP snooping", "Port security", "STP"], answer: 1, explain: "DHCP snooping trusts only designated ports for server replies, blocking rogue DHCP servers." },
    { q: "A rogue DHCP server appears on the LAN. The most likely symptom on affected clients is…", choices: ["No IP at all", "An IP but a wrong gateway/DNS, breaking connectivity", "Higher PoE draw", "RAID degradation"], answer: 1, explain: "Clients may accept a lease with bad gateway/DNS options, so they have an address but cannot reach things." },
    { q: "On the network, which transport and ports does DHCP use?", choices: ["TCP 53", "UDP 67 (server) and 68 (client)", "TCP 80 and 443", "UDP 5353"], answer: 1, explain: "DHCP runs over UDP using port 67 on the server and port 68 on the client." },
    { q: "Which transport/port does DNS normally use for standard queries?", choices: ["UDP 53 (TCP 53 for large/zone transfers)", "UDP 67", "TCP 38880", "UDP 554"], answer: 0, explain: "DNS uses UDP 53 for queries; TCP 53 is used for large responses and zone transfers." },
    { q: "An entry you added to the Windows hosts file is being used instead of the real DNS answer. Why?", choices: ["DNS is down", "The hosts file is checked before DNS and overrides it", "The lease expired", "TTL is zero"], answer: 1, explain: "The local hosts file takes precedence over DNS resolution for the names it lists." }
  ]);
})();
