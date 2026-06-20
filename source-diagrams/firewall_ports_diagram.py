import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

fig, ax = plt.subplots(figsize=(24, 18))
fig.patch.set_facecolor('#FAFAFA')
ax.set_xlim(0, 24)
ax.set_ylim(0, 18)
ax.axis('off')

ax.text(12, 17.5, 'Firewalls & Ports — Network Security for CCTV', fontsize=20, fontweight='bold',
        ha='center', color='#1a1a2e')
ax.text(12, 17.0, 'Understanding what ports Avigilon ACC uses and how firewalls affect your system',
        fontsize=11, ha='center', color='#666', style='italic')

def draw_box(x, y, w, h, color, label, sublabel='', fontsize=10, edge='#333'):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1",
                          facecolor=color, edgecolor=edge, linewidth=1.5, alpha=0.85)
    ax.add_patch(box)
    if sublabel:
        ax.text(x + w/2, y + h/2 + 0.15, label,
                fontsize=fontsize, fontweight='bold', ha='center', va='center', color='#1a1a2e')
        ax.text(x + w/2, y + h/2 - 0.2, sublabel, fontsize=8, ha='center', va='center', color='#444')
    else:
        ax.text(x + w/2, y + h/2, label,
                fontsize=fontsize, fontweight='bold', ha='center', va='center', color='#1a1a2e')

# ============================================================
# SECTION 1: What is a Firewall
# ============================================================
ax.text(1, 16.2, '1. WHAT IS A FIREWALL?', fontsize=14, fontweight='bold', color='#C62828',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#FFEBEE', edgecolor='#C62828', lw=2))

# Visual: Traffic flow through firewall
draw_box(1, 14.5, 3.5, 1.2, '#4FC3F7', 'ACC Client', 'Wants to view cameras')

ax.annotate('', xy=(5, 15.1), xytext=(4.5, 15.1),
            arrowprops=dict(arrowstyle='->', color='#333', lw=2))

# Firewall as a wall with gates
fw_bg = FancyBboxPatch((5, 14.0), 6, 2.2, boxstyle="round,pad=0.1",
                         facecolor='#FFCDD2', edgecolor='#C62828', linewidth=3)
ax.add_patch(fw_bg)
ax.text(8, 15.9, 'FIREWALL', fontsize=14, fontweight='bold', ha='center', color='#C62828')
ax.text(8, 15.4, 'Checks every packet:', fontsize=9, ha='center', color='#333')

# Rules
ax.text(5.5, 14.9, 'Port 38880?', fontsize=9, color='#2E7D32', fontweight='bold')
ax.text(8, 14.9, 'ALLOW', fontsize=9, color='#2E7D32', fontweight='bold')
ax.text(5.5, 14.5, 'Port 12345?', fontsize=9, color='#C62828', fontweight='bold')
ax.text(8, 14.5, 'BLOCK', fontsize=9, color='#C62828', fontweight='bold')
ax.text(5.5, 14.1, 'Unknown?', fontsize=9, color='#C62828', fontweight='bold')
ax.text(8, 14.1, 'DROP', fontsize=9, color='#C62828', fontweight='bold')

ax.annotate('', xy=(11.5, 15.1), xytext=(11, 15.1),
            arrowprops=dict(arrowstyle='->', color='#2E7D32', lw=2))

draw_box(12, 14.5, 3.5, 1.2, '#81C784', 'ACC Server', 'Video streams')

# Types
ax.text(17, 16.0, 'Types of Firewalls:', fontsize=11, fontweight='bold', color='#333')
types = [
    ('Windows Firewall', 'Built into every Windows PC/Server'),
    ('Hardware Firewall', 'Dedicated device (Cisco ASA, Fortinet, SonicWall)'),
    ('Network Firewall', 'At the network edge — controls all traffic in/out'),
]
for i, (t, d) in enumerate(types):
    ax.text(17, 15.4 - i*0.5, f'{t}:', fontsize=9, fontweight='bold', color='#0277BD')
    ax.text(20.5, 15.4 - i*0.5, d, fontsize=8.5, color='#333')

# ============================================================
# SECTION 2: What is a Port
# ============================================================
ax.text(1, 13.0, '2. WHAT IS A PORT?', fontsize=14, fontweight='bold', color='#0277BD',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#E1F5FE', edgecolor='#0277BD', lw=2))

ax.text(1, 12.3, 'Think of an IP address as a building address, and ports as apartment numbers inside that building.',
        fontsize=10.5, color='#555', style='italic')
ax.text(1, 11.8, 'A server has ONE IP but runs MANY services — each service listens on a specific port number (0–65535).',
        fontsize=10.5, color='#555', style='italic')

# Building analogy
draw_box(1, 10.2, 5, 1.2, '#81C784', 'ACC Server', 'IP: 10.10.10.100', fontsize=12)

services = [
    (7, 10.8, 'Port 38880', 'ACC Gateway', '#FFB74D'),
    (10.5, 10.8, 'Port 38881', 'Server-to-Server', '#FFB74D'),
    (14, 10.8, 'Port 443', 'HTTPS Web', '#FFB74D'),
    (17.5, 10.8, 'Port 554', 'RTSP Video', '#FFB74D'),
    (21, 10.8, 'Port 80', 'HTTP', '#FFB74D'),
]
for x, y, port, svc, color in services:
    draw_box(x, y - 0.5, 3, 0.9, color, port, svc)
    ax.annotate('', xy=(x + 1.5, 10.8), xytext=(5.5, 10.8),
                arrowprops=dict(arrowstyle='->', color='#E65100', lw=1.2))

# ============================================================
# SECTION 3: Avigilon ACC Port Reference
# ============================================================
ax.text(1, 9.4, '3. AVIGILON ACC PORT REFERENCE — Must Know!', fontsize=14, fontweight='bold',
        color='#2E7D32',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#E8F5E9', edgecolor='#2E7D32', lw=2))

# Table
headers = ['Port', 'Protocol', 'Direction', 'Service', 'When You Need It']
col_x = [1, 3.5, 5.8, 8.5, 13]
col_w = [2.2, 2, 2.4, 4.2, 9]
for i, h in enumerate(headers):
    draw_box(col_x[i], 8.5, col_w[i], 0.6, '#A5D6A7', h, fontsize=9)

rows = [
    ['38880', 'TCP', 'Client → Server', 'ACC Gateway', 'ACC Client connecting to server (THE most common port issue)'],
    ['38881', 'TCP', 'Server ↔ Server', 'ACC Server Comms', 'Multi-server sites — servers syncing with each other'],
    ['38882', 'TCP', 'Client → Server', 'ACC Web Client', 'Browser-based access to ACC'],
    ['443', 'TCP', 'Both', 'HTTPS', 'ACC Web Client (secure), Cloud access, API connections'],
    ['554', 'TCP', 'Server → Camera', 'RTSP', 'Video streaming from cameras (if using RTSP instead of native)'],
    ['80', 'TCP', 'Browser → Camera', 'HTTP', 'Camera web interface for direct config'],
    ['5353', 'UDP', 'Local', 'mDNS/Bonjour', 'Auto-discovery of cameras on the local network'],
    ['67-68', 'UDP', 'Local', 'DHCP', 'IP address assignment (if cameras use DHCP)'],
]
row_colors = ['#E8F5E9', '#F1F8E9'] * 4
for r, row in enumerate(rows):
    ry = 7.8 - r * 0.55
    for c, val in enumerate(row):
        draw_box(col_x[c], ry, col_w[c], 0.45, row_colors[r], val, fontsize=8)

# ============================================================
# SECTION 4: Common Firewall Scenarios
# ============================================================
ax.text(1, 3.5, '4. COMMON FIREWALL ISSUES IN SUPPORT', fontsize=14, fontweight='bold',
        color='#E65100',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#FFF3E0', edgecolor='#E65100', lw=2))

scenarios = [
    ('ACC Client can\'t connect to server',
     'Port 38880 blocked by Windows Firewall or network firewall',
     'Open port 38880 TCP on both the server\'s Windows Firewall and any network firewalls in the path'),
    ('Remote access not working',
     'Ports 38880/443 not port-forwarded on the edge firewall/router',
     'Configure port forwarding on the customer\'s router: external port 38880 → internal server IP:38880'),
    ('Multi-server site — servers can\'t sync',
     'Port 38881 blocked between server subnets',
     'Open port 38881 TCP bidirectionally between all ACC server IPs'),
    ('Cameras not discovered',
     'mDNS (5353) or broadcast traffic blocked between VLANs',
     'Manually add camera by IP, or enable mDNS forwarding on the L3 switch'),
]

for i, (issue, cause, fix) in enumerate(scenarios):
    y = 2.8 - i * 0.8
    ax.text(1.3, y, f'Issue: {issue}', fontsize=9.5, fontweight='bold', color='#E65100')
    ax.text(1.3, y - 0.3, f'Cause: {cause}', fontsize=9, color='#C62828')
    ax.text(12, y - 0.3, f'Fix: {fix}', fontsize=9, color='#2E7D32')

# Quick test commands
cmd_bg = FancyBboxPatch((1, -0.3), 22, 0.8, boxstyle="round,pad=0.1",
                          facecolor='#263238', edgecolor='#455A64', linewidth=2)
ax.add_patch(cmd_bg)
ax.text(12, 0.3, 'QUICK TEST:   telnet <server-ip> 38880   |   Test-NetConnection <server-ip> -Port 38880 (PowerShell)   |   If it fails → port is blocked',
        fontsize=10, ha='center', color='#E0E0E0', fontfamily='monospace', fontweight='bold')

plt.tight_layout()
plt.savefig('/Users/akshit/Desktop/ai/Firewalls_Ports_Explained.png', dpi=180, bbox_inches='tight',
            facecolor='#FAFAFA')
print('Firewalls & Ports diagram saved.')
