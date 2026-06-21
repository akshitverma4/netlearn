(function () {
  "use strict";
  var c = (window.CONCEPTS || []).filter(function (x) { return x.id === "subnetting"; })[0];
  if (!c) return;

  c.flashcards = c.flashcards.concat([
    { front: "Convert a /25 to a dotted-decimal subnet mask.", back: "255.255.255.128 — the 25th bit splits the last octet, giving 126 usable hosts." },
    { front: "Convert a /26 to a dotted-decimal subnet mask.", back: "255.255.255.192 — 62 usable hosts per subnet." },
    { front: "Convert a /27 to a dotted-decimal subnet mask.", back: "255.255.255.224 — 30 usable hosts per subnet." },
    { front: "Convert a /28 to a dotted-decimal subnet mask.", back: "255.255.255.240 — 14 usable hosts per subnet." },
    { front: "Convert a /30 to a dotted-decimal subnet mask, and what is it used for?", back: "255.255.255.252 — only 2 usable hosts. Ideal for point-to-point router links." },
    { front: "Formula for usable hosts in a subnet?", back: "2^(host bits) − 2. Subtract 2 for the network and broadcast addresses." },
    { front: "Why subtract 2 when counting usable hosts?", back: "The all-zeros host address is the network ID and the all-ones host address is the broadcast — neither can be assigned to a device." },
    { front: "What is the network address of any subnet?", back: "The first address (all host bits 0). It identifies the subnet and is not assigned to a host." },
    { front: "What is the broadcast address of a subnet?", back: "The last address (all host bits 1). Traffic to it reaches every host on that subnet." },
    { front: "Device 10.10.100.130 with mask 255.255.255.128 — what subnet is it in?", back: "10.10.100.128/25 (broadcast 10.10.100.255, usable .129–.254)." },
    { front: "What is the 'block size' (magic number) for a mask, and how do you find it?", back: "256 minus the interesting octet value. For 255.255.255.192 it is 256−192 = 64, so subnets start at .0, .64, .128, .192." },
    { front: "How many /24 subnets fit inside a /22?", back: "Four (/22 = four contiguous /24 blocks = 1,024 total addresses)." },
    { front: "Which three RFC 1918 private address ranges exist?", back: "10.0.0.0/8, 172.16.0.0/12 (172.16–172.31), and 192.168.0.0/16." },
    { front: "Is 10.10.100.0/24 a public or private range?", back: "Private — it falls inside the RFC 1918 block 10.0.0.0/8." },
    { front: "Why must a default gateway be inside the device's own subnet?", back: "The device sends off-subnet traffic to the gateway by ARPing for it locally; if the gateway is in a different subnet the device can never reach it." },
    { front: "For 500 cameras in one subnet, what size do you choose and why?", back: "A /23 — it gives 510 usable hosts, the smallest standard block that fits 500." },
    { front: "For ~120 cameras, what is the tightest subnet that fits?", back: "A /25 (126 usable hosts). A /26 (62) is too small." },
    { front: "How many usable hosts does a /21 provide?", back: "2,046 (2^11 − 2)." },
    { front: "What does the prefix length (the number after the slash) count?", back: "The number of contiguous 1 bits in the subnet mask, i.e. the network-portion bits." },
    { front: "Two hosts share a subnet only if what is true?", back: "Both addresses produce the same network address when ANDed with the (same) subnet mask." },
    { front: "Camera at 192.168.10.50/26 — what is its usable host range?", back: "Network 192.168.10.0, usable .1–.62, broadcast .63." },
    { front: "Host 172.16.5.66/26 — what is its network and broadcast?", back: "Network 172.16.5.64, broadcast 172.16.5.127 (block size 64)." },
    { front: "Why use /30 links between routers instead of /24?", back: "A point-to-point link needs only 2 addresses; a /30 avoids wasting 252 addresses per link." },
    { front: "What happens if two camera VLANs accidentally use the same subnet?", back: "Overlapping subnets cause routing ambiguity and address conflicts — each VLAN must have a unique subnet." },
    { front: "Quick rule: how does halving a subnet (e.g. /24 to /25) change host count?", back: "Each step of +1 to the prefix halves the usable hosts: /24=254, /25=126, /26=62, /27=30." },
    { front: "On a /24, what does the .1 address conventionally mean?", back: "By convention it is the default gateway (the router/L3 SVI for that subnet), e.g. 10.10.100.1." },
    { front: "Is 169.254.x.x a usable production subnet?", back: "No — 169.254.0.0/16 is APIPA/link-local, auto-assigned when DHCP fails; it usually signals a config problem." }
  ]);

  c.quiz = c.quiz.concat([
    { q: "What is the network address of 192.168.1.100/26?", choices: ["192.168.1.0", "192.168.1.64", "192.168.1.96", "192.168.1.128"], answer: 1, explain: "Block size for /26 is 64. .100 falls in the .64–.127 block, so the network is 192.168.1.64." },
    { q: "What is the broadcast address of 10.10.100.130/25?", choices: ["10.10.100.127", "10.10.100.128", "10.10.100.255", "10.10.100.254"], answer: 2, explain: "/25 block size is 128. .130 is in the .128–.255 block, so broadcast is 10.10.100.255." },
    { q: "How many usable host addresses does a /26 provide?", choices: ["30", "62", "64", "126"], answer: 1, explain: "/26 has 6 host bits: 2^6 − 2 = 62 usable hosts." },
    { q: "What dotted-decimal mask equals a /27?", choices: ["255.255.255.192", "255.255.255.224", "255.255.255.240", "255.255.255.248"], answer: 1, explain: "/27 = 255.255.255.224 (block size 32, 30 usable hosts)." },
    { q: "A point-to-point link between two routers needs the fewest addresses. Which prefix fits best?", choices: ["/28", "/29", "/30", "/24"], answer: 2, explain: "A /30 gives exactly 2 usable hosts — perfect for a point-to-point link." },
    { q: "What is the usable host range of 192.168.10.50/26?", choices: ["192.168.10.1 – 192.168.10.62", "192.168.10.0 – 192.168.10.63", "192.168.10.49 – 192.168.10.62", "192.168.10.1 – 192.168.10.254"], answer: 0, explain: "Network .0, broadcast .63, so usable hosts are .1 through .62." },
    { q: "You must hold 500 cameras in a single subnet. Smallest standard block that fits?", choices: ["/24 (254)", "/23 (510)", "/22 (1022)", "/25 (126)"], answer: 1, explain: "A /23 = 510 usable hosts, the smallest block that holds 500." },
    { q: "A site has about 120 cameras. Which subnet is the tightest fit?", choices: ["/26 (62)", "/25 (126)", "/24 (254)", "/27 (30)"], answer: 1, explain: "A /25 gives 126 usable hosts; a /26 (62) is too small for 120." },
    { q: "Which mask corresponds to a /28?", choices: ["255.255.255.240", "255.255.255.224", "255.255.255.248", "255.255.255.192"], answer: 0, explain: "/28 = 255.255.255.240, 14 usable hosts." },
    { q: "What is the network address of 172.16.5.66/26?", choices: ["172.16.5.0", "172.16.5.32", "172.16.5.64", "172.16.5.96"], answer: 2, explain: "Block size 64: .66 falls in the .64–.127 block, network = 172.16.5.64." },
    { q: "Which address range is private (RFC 1918)?", choices: ["172.32.0.0/16", "192.169.1.0/24", "10.10.100.0/24", "11.0.0.0/8"], answer: 2, explain: "10.0.0.0/8 is private, so 10.10.100.0/24 is private. 172.16–172.31, 192.168, and 10 are the private ranges." },
    { q: "Which of these is NOT an RFC 1918 private range?", choices: ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "172.32.0.0/12"], answer: 3, explain: "Private 172 space ends at 172.31; 172.32.0.0 is public." },
    { q: "Cameras are 10.10.100.0/24 and servers are 10.10.10.0/24. A camera with no default gateway tries to reach a server. Result?", choices: ["Works — same network", "Fails — it can't reach a different subnet without a gateway", "Works via broadcast", "Fails — needs more PoE"], answer: 1, explain: "Different subnets require routing; with no gateway the camera can only reach its own subnet." },
    { q: "Hosts 10.10.100.50/24 and 10.10.100.200/24 — can they talk directly?", choices: ["No, different subnets", "Yes, both in 10.10.100.0/24", "Only through a router", "Only via DNS"], answer: 1, explain: "Both ANDed with /24 give 10.10.100.0 — same subnet, direct Layer 2 communication." },
    { q: "Hosts 192.168.1.10/25 and 192.168.1.200/25 — same subnet?", choices: ["Yes", "No — .10 is in .0/25 and .200 is in .128/25", "Yes, both /25", "Only with a switch"], answer: 1, explain: "/25 splits the /24 at .128: .10 is in 192.168.1.0/25, .200 is in 192.168.1.128/25 — different subnets." },
    { q: "A device gets 10.10.100.20 with mask 255.255.255.0. What gateway is valid for it?", choices: ["10.10.10.1", "192.168.1.1", "10.10.100.1", "10.10.101.1"], answer: 2, explain: "The gateway must be inside 10.10.100.0/24; only 10.10.100.1 qualifies." },
    { q: "How many usable hosts does a /21 provide?", choices: ["510", "1022", "2046", "4094"], answer: 2, explain: "/21 has 11 host bits: 2^11 − 2 = 2,046." },
    { q: "What is the block size (increment) for a 255.255.255.192 mask?", choices: ["32", "64", "128", "16"], answer: 1, explain: "256 − 192 = 64, so subnets start at .0, .64, .128, .192." },
    { q: "How many /24 networks fit in a /22?", choices: ["2", "4", "8", "16"], answer: 1, explain: "A /22 spans four contiguous /24 blocks (1,024 addresses total)." },
    { q: "What is the broadcast address of 10.10.10.77/28?", choices: ["10.10.10.79", "10.10.10.95", "10.10.10.63", "10.10.10.80"], answer: 0, explain: "/28 block size 16: .77 is in the .64–.79 block, broadcast = 10.10.10.79." },
    { q: "What is the usable host range of 10.1.1.200/27?", choices: ["10.1.1.193 – 10.1.1.222", "10.1.1.192 – 10.1.1.223", "10.1.1.200 – 10.1.1.222", "10.1.1.1 – 10.1.1.30"], answer: 0, explain: "/27 block size 32: .200 is in .192/27, network .192, broadcast .223, usable .193–.222." },
    { q: "Which subnet does 192.168.4.10/22 belong to?", choices: ["192.168.4.0/22", "192.168.0.0/22", "192.168.8.0/22", "192.168.4.0/24"], answer: 0, explain: "/22 block size in the third octet is 4: .4 is in the 4–7 block, network 192.168.4.0/22." },
    { q: "A /30 link gives how many usable host addresses?", choices: ["1", "2", "4", "6"], answer: 1, explain: "/30 = 4 total − 2 = 2 usable, exactly what a point-to-point link needs." },
    { q: "You see a camera with IP 169.254.12.7. What does that usually mean?", choices: ["It is on a public subnet", "DHCP failed and it self-assigned APIPA/link-local", "It is the gateway", "It is on the server VLAN"], answer: 1, explain: "169.254.0.0/16 is APIPA — auto-assigned when no DHCP server answers." },
    { q: "Mask 255.255.255.248 is which prefix?", choices: ["/27", "/28", "/29", "/30"], answer: 2, explain: "248 = 11111000, total 29 network bits, so /29 (6 usable hosts)." },
    { q: "What is the network address of 192.168.20.33/27?", choices: ["192.168.20.0", "192.168.20.32", "192.168.20.33", "192.168.20.64"], answer: 1, explain: "/27 block size 32: .33 is in the .32–.63 block, network = 192.168.20.32 (note .33 is the first usable host)." },
    { q: "Cameras need 200 addresses and you also want room to grow to ~450. Best single subnet?", choices: ["/25", "/24", "/23", "/22"], answer: 2, explain: "A /23 (510 usable) covers 200 now and growth to ~450 with headroom; /24 (254) is too tight for 450." },
    { q: "Adding one bit to the prefix (e.g. /24 to /25) does what to the host count?", choices: ["Doubles it", "Halves it", "Leaves it unchanged", "Adds 2"], answer: 1, explain: "Each extra network bit removes one host bit, halving the usable hosts (254 to 126)." },
    { q: "Two camera VLANs were both configured as 10.10.100.0/24. What is the problem?", choices: ["Nothing, that is fine", "Overlapping subnets cause routing ambiguity and conflicts", "Too many hosts", "Wrong gateway only"], answer: 1, explain: "Each subnet must be unique; identical subnets on two segments break routing and cause address conflicts." },
    { q: "A /16 such as 10.10.0.0/16 provides how many usable hosts?", choices: ["256", "1022", "65534", "65536"], answer: 2, explain: "/16 = 2^16 − 2 = 65,534 usable hosts." }
  ]);
})();
