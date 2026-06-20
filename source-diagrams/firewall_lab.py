"""
Firewall Learning Lab
=====================
This script simulates how firewalls work in a CCTV environment.
It creates a simple server that listens on a port (like an ACC server)
and a client that tries to connect (like an ACC client).

You'll see firsthand what happens when:
- A port is OPEN (connection succeeds)
- A port is BLOCKED (connection fails/times out)

This is exactly what happens on customer networks with Avigilon ACC.
"""

import socket
import threading
import time
import sys

def print_header(text):
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}")

def print_result(success, message):
    status = "ALLOWED" if success else "BLOCKED"
    symbol = "[+]" if success else "[X]"
    print(f"  {symbol} {status}: {message}")

# ============================================================
# EXERCISE 1: Understanding Ports
# ============================================================
def exercise_1():
    print_header("EXERCISE 1: How Ports Work")
    print("""
    In a CCTV system:
    - ACC Server listens on port 38880 (waiting for clients)
    - ACC Client connects TO port 38880 (to view cameras)

    Let's simulate this with a local server and client.
    """)

    # Start a "server" listening on a port (like ACC Server)
    server_port = 19880  # Using a safe port for testing
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('127.0.0.1', server_port))
    server.listen(1)
    print(f"  [Server] ACC Server simulation started on port {server_port}")
    print(f"  [Server] Waiting for client connection...\n")

    # Accept connection in a thread
    result = {'connected': False}
    def accept_conn():
        server.settimeout(5)
        try:
            conn, addr = server.accept()
            result['connected'] = True
            print(f"  [Server] Client connected from {addr}")
            conn.send(b"Welcome to ACC Server! Video stream ready.")
            conn.close()
        except socket.timeout:
            pass

    t = threading.Thread(target=accept_conn)
    t.start()
    time.sleep(0.5)

    # Client connects (like ACC Client)
    print(f"  [Client] ACC Client attempting to connect to port {server_port}...")
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client.connect(('127.0.0.1', server_port))
        data = client.recv(1024)
        print(f"  [Client] Received: {data.decode()}")
        print_result(True, f"Connection to port {server_port} succeeded!")
        client.close()
    except Exception as e:
        print_result(False, f"Connection failed: {e}")

    t.join()
    server.close()

# ============================================================
# EXERCISE 2: What Happens When a Port is Blocked
# ============================================================
def exercise_2():
    print_header("EXERCISE 2: What Happens When a Port is Blocked")
    print("""
    This simulates what customers experience when a firewall
    blocks port 38880 between the ACC Client and Server.

    We'll try to connect to a port where NOTHING is listening.
    This is exactly what happens when a firewall drops the packet.
    """)

    blocked_port = 19881  # Nothing listening here
    print(f"  [Client] Attempting to connect to port {blocked_port} (no server)...")
    print(f"  [Client] This is what happens when a firewall blocks the port...\n")

    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.settimeout(3)
    try:
        client.connect(('127.0.0.1', blocked_port))
        print_result(True, "Connected (unexpected)")
    except ConnectionRefusedError:
        print_result(False, "Connection REFUSED - port is closed/blocked")
        print("""
    This is what the ACC Client sees:
    "Unable to connect to server" or "Connection timed out"

    On a real network with a firewall, the packet is silently
    DROPPED (no response at all), causing a timeout instead
    of an immediate refusal.
    """)
    except socket.timeout:
        print_result(False, "Connection TIMED OUT - firewall dropped the packet")
    finally:
        client.close()

# ============================================================
# EXERCISE 3: Port Scanning (Like Troubleshooting)
# ============================================================
def exercise_3():
    print_header("EXERCISE 3: Port Scanning - Troubleshooting Tool")
    print("""
    When troubleshooting ACC connectivity, you need to check
    if specific ports are open. This is what the command
    "Test-NetConnection -Port 38880" does on Windows.

    Let's scan common CCTV ports on localhost to see which are open.
    """)

    # First, start some test servers
    test_servers = []
    simulated_ports = {
        19880: "ACC Gateway (simulated 38880)",
        19881: "ACC Server-to-Server (simulated 38881)",
        19443: "HTTPS Web Client (simulated 443)",
    }

    # Start servers on first two ports, leave third closed
    for port in [19880, 19881]:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind(('127.0.0.1', port))
        s.listen(1)
        test_servers.append(s)

    print("  Scanning ports...\n")
    print(f"  {'Port':<10} {'Service':<45} {'Status':<15}")
    print(f"  {'-'*10} {'-'*45} {'-'*15}")

    for port, service in simulated_ports.items():
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        try:
            sock.connect(('127.0.0.1', port))
            status = "OPEN"
            print(f"  {port:<10} {service:<45} \033[92m{status}\033[0m")
            sock.close()
        except (ConnectionRefusedError, socket.timeout):
            status = "CLOSED/BLOCKED"
            print(f"  {port:<10} {service:<45} \033[91m{status}\033[0m")

    print(f"""
  RESULT:
  - Port 19880 (ACC Gateway): OPEN - clients CAN connect
  - Port 19881 (Server Comms): OPEN - servers CAN sync
  - Port 19443 (HTTPS): CLOSED - web client will FAIL

  This is exactly the kind of output you'd analyze on a support call.
  If port 38880 shows CLOSED, that's your answer - firewall is blocking it.
    """)

    for s in test_servers:
        s.close()

# ============================================================
# EXERCISE 4: Simple Firewall Simulation
# ============================================================
def exercise_4():
    print_header("EXERCISE 4: Build Your Own Firewall (Simulation)")
    print("""
    Let's build a simple firewall that filters connections
    based on rules - just like a real network firewall.
    """)

    # Firewall rules (like ACLs on a real firewall)
    firewall_rules = {
        "10.10.100.10": {"allowed_ports": [38880, 443], "name": "Camera 1"},
        "10.10.200.50": {"allowed_ports": [38880, 38881, 443], "name": "Control Room PC"},
        "10.10.300.10": {"allowed_ports": [], "name": "Guest Device"},
        "192.168.1.100": {"allowed_ports": [443], "name": "Remote User (VPN)"},
    }

    print("  FIREWALL RULES:")
    print(f"  {'Source IP':<20} {'Device':<25} {'Allowed Ports':<30}")
    print(f"  {'-'*20} {'-'*25} {'-'*30}")
    for ip, rule in firewall_rules.items():
        ports = ', '.join(str(p) for p in rule['allowed_ports']) if rule['allowed_ports'] else 'NONE (blocked)'
        print(f"  {ip:<20} {rule['name']:<25} {ports:<30}")

    print("\n  INCOMING CONNECTION ATTEMPTS:\n")

    # Simulate connection attempts
    attempts = [
        ("10.10.100.10", 38880, "Camera 1 -> ACC Server (video stream)"),
        ("10.10.100.10", 22, "Camera 1 -> SSH (unauthorized)"),
        ("10.10.200.50", 38880, "Control Room -> ACC Server (live view)"),
        ("10.10.200.50", 38881, "Control Room -> Server sync"),
        ("10.10.300.10", 38880, "Guest Device -> ACC Server (unauthorized)"),
        ("10.10.300.10", 443, "Guest Device -> Web interface (unauthorized)"),
        ("192.168.1.100", 443, "Remote User -> HTTPS (VPN)"),
        ("192.168.1.100", 38880, "Remote User -> ACC Gateway (no VPN rule)"),
    ]

    allowed_count = 0
    blocked_count = 0

    for src_ip, port, description in attempts:
        rules = firewall_rules.get(src_ip, {"allowed_ports": []})
        is_allowed = port in rules["allowed_ports"]

        if is_allowed:
            allowed_count += 1
            print(f"  \033[92m[ALLOW]\033[0m {description}")
            print(f"          Port {port} is in the allowed list for {src_ip}")
        else:
            blocked_count += 1
            print(f"  \033[91m[BLOCK]\033[0m {description}")
            print(f"          Port {port} is NOT allowed for {src_ip}")
        print()

    print(f"  SUMMARY: {allowed_count} allowed, {blocked_count} blocked")
    print(f"""
  KEY TAKEAWAY:
  This is exactly how firewalls work in CCTV networks.
  - Camera VLAN only needs port 38880 (video to server)
  - Control Room needs 38880 + 38881 + 443 (full access)
  - Guest network gets NOTHING (completely isolated)
  - Remote users only get 443 (HTTPS through VPN)

  When a customer says "client can't connect" - check if
  their IP/VLAN has the right port rules in the firewall.
    """)

# ============================================================
# RUN ALL EXERCISES
# ============================================================
if __name__ == "__main__":
    print("\n" + "="*60)
    print("  FIREWALL LEARNING LAB")
    print("  Understanding Firewalls for CCTV Tech Support")
    print("="*60)

    exercises = [exercise_1, exercise_2, exercise_3, exercise_4]

    for i, exercise in enumerate(exercises):
        exercise()
        if i < len(exercises) - 1:
            print(f"\n  --- Press Enter for next exercise ---")
            # Auto-continue for non-interactive mode
            time.sleep(1)

    print_header("LAB COMPLETE!")
    print("""
    You now understand:
    1. How ports work (server listens, client connects)
    2. What happens when a port is blocked (timeout/refused)
    3. How to scan ports for troubleshooting
    4. How firewall rules filter traffic by IP and port

    Apply this to Avigilon support:
    - ACC Client can't connect? -> Check port 38880
    - Servers can't sync? -> Check port 38881
    - Web client fails? -> Check port 443
    - Camera not found? -> Check network/VLAN routing

    Command to remember:
    Test-NetConnection <server-ip> -Port 38880 (PowerShell)
    """)
