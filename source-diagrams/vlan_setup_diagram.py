import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

fig = plt.figure(figsize=(24, 30))
fig.patch.set_facecolor('#FAFAFA')

ax = fig.add_subplot(111)
ax.set_xlim(0, 24)
ax.set_ylim(0, 30)
ax.axis('off')

ax.text(12, 29.5, 'How to Set Up VLANs — Step-by-Step Guide', fontsize=22, fontweight='bold',
        ha='center', color='#1a1a2e')
ax.text(12, 29.0, 'For CCTV / Avigilon Deployments — Applicable to Cisco, HP/Aruba, Netgear Managed Switches',
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

def draw_code_block(x, y, w, h, title, lines, bg='#263238', title_color='#FFB74D'):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1",
                          facecolor=bg, edgecolor='#455A64', linewidth=2)
    ax.add_patch(box)
    ax.text(x + 0.3, y + h - 0.3, title, fontsize=9, fontweight='bold', color=title_color,
            fontfamily='monospace')
    for i, line in enumerate(lines):
        color = '#E0E0E0'
        if line.startswith('#'):
            color = '#66BB6A'
        elif line.startswith('!'):
            color = '#42A5F5'
        ax.text(x + 0.3, y + h - 0.7 - i * 0.32, line, fontsize=8, color=color,
                fontfamily='monospace')

# ============================================================
# STEP 0: PREREQUISITES
# ============================================================
step_y = 28.0
ax.text(1, step_y, 'BEFORE YOU START — What You Need', fontsize=14, fontweight='bold', color='#C62828',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#FFEBEE', edgecolor='#C62828', lw=2))

prereqs = [
    'A MANAGED switch (not an unmanaged switch — unmanaged switches do NOT support VLANs)',
    'Access to the switch management interface (Web GUI, SSH, or Console cable)',
    'A planned IP addressing scheme (which subnets for which VLANs)',
    'A Layer 3 switch or router if VLANs need to communicate with each other',
]
for i, p in enumerate(prereqs):
    ax.text(1.5, step_y - 0.6 - i*0.4, f'{i+1}.  {p}', fontsize=9.5, color='#C62828')

# ============================================================
# STEP 1: PLAN YOUR VLANs
# ============================================================
step_y = 25.5
ax.text(1, step_y, 'STEP 1: Plan Your VLANs', fontsize=14, fontweight='bold', color='#0277BD',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#E1F5FE', edgecolor='#0277BD', lw=2))

# Planning table
headers = ['VLAN ID', 'Name', 'Subnet', 'Gateway', 'Purpose', 'Ports']
col_x = [1, 3.5, 6.5, 10, 13.5, 17.5]
col_w = [2.2, 2.7, 3.2, 3.2, 3.7, 4.5]
for i, h in enumerate(headers):
    draw_box(col_x[i], step_y - 0.8, col_w[i], 0.55, '#BBDEFB', h, fontsize=9)

rows = [
    ['VLAN 100', 'Cameras', '10.10.100.0/24', '10.10.100.1', 'IP Cameras', 'Ports 1–16 (Access)'],
    ['VLAN 10', 'Servers', '10.10.10.0/24', '10.10.10.1', 'ACC Servers', 'Ports 17–20 (Access)'],
    ['VLAN 200', 'Corporate', '10.10.200.0/24', '10.10.200.1', 'Office PCs', 'Ports 21–23 (Access)'],
    ['VLAN 1', 'Default', '192.168.1.0/24', '192.168.1.1', 'Management', 'Port 24 (Trunk)'],
]
row_colors = ['#E1F5FE', '#E8F5E9', '#FFEBEE', '#FFF3E0']
for r, row in enumerate(rows):
    ry = step_y - 1.45 - r * 0.55
    for c, val in enumerate(row):
        draw_box(col_x[c], ry, col_w[c], 0.45, row_colors[r], val, fontsize=8)

# ============================================================
# STEP 2: ACCESS THE SWITCH
# ============================================================
step_y = 22.5
ax.text(1, step_y, 'STEP 2: Access the Switch Management Interface', fontsize=14, fontweight='bold',
        color='#2E7D32',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#E8F5E9', edgecolor='#2E7D32', lw=2))

# Three methods
draw_box(1, step_y - 1.5, 6, 1.2, '#C8E6C9', 'Method 1: Web GUI', 'Open browser → type switch IP\ne.g. http://192.168.1.1', fontsize=10)
draw_box(8, step_y - 1.5, 6, 1.2, '#C8E6C9', 'Method 2: SSH / Telnet', 'ssh admin@192.168.1.1\nCommand line interface', fontsize=10)
draw_box(15, step_y - 1.5, 7, 1.2, '#C8E6C9', 'Method 3: Console Cable', 'USB/Serial console cable → PuTTY\nBaud: 9600 | Used for initial setup', fontsize=10)

# ============================================================
# STEP 3: CREATE VLANs (Cisco Example)
# ============================================================
step_y = 19.8
ax.text(1, step_y, 'STEP 3: Create the VLANs on the Switch', fontsize=14, fontweight='bold',
        color='#E65100',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#FFF3E0', edgecolor='#E65100', lw=2))

# Cisco CLI
cisco_lines = [
    '# Enter global configuration mode',
    'Switch> enable',
    'Switch# configure terminal',
    '',
    '# Create VLAN 100 for cameras',
    'Switch(config)# vlan 100',
    'Switch(config-vlan)# name Cameras',
    'Switch(config-vlan)# exit',
    '',
    '# Create VLAN 10 for servers',
    'Switch(config)# vlan 10',
    'Switch(config-vlan)# name Servers',
    'Switch(config-vlan)# exit',
    '',
    '# Create VLAN 200 for corporate',
    'Switch(config)# vlan 200',
    'Switch(config-vlan)# name Corporate',
    'Switch(config-vlan)# exit',
]
draw_code_block(1, step_y - 6.8, 10.5, 6.5, 'CISCO IOS — CLI Commands', cisco_lines)

# HP/Aruba
hp_lines = [
    '# Enter configuration mode',
    'Switch# configure terminal',
    '',
    '# Create VLAN 100',
    'Switch(config)# vlan 100',
    'Switch(vlan-100)# name Cameras',
    'Switch(vlan-100)# exit',
    '',
    '# Create VLAN 10',
    'Switch(config)# vlan 10',
    'Switch(vlan-10)# name Servers',
    'Switch(vlan-10)# exit',
    '',
    '# Create VLAN 200',
    'Switch(config)# vlan 200',
    'Switch(vlan-200)# name Corporate',
    'Switch(vlan-200)# exit',
]
draw_code_block(12.5, step_y - 6.8, 10.5, 6.5, 'HP / ARUBA — CLI Commands', hp_lines)

# ============================================================
# STEP 4: ASSIGN PORTS TO VLANs
# ============================================================
step_y = 12.2
ax.text(1, step_y, 'STEP 4: Assign Switch Ports to VLANs (Access Ports)', fontsize=14, fontweight='bold',
        color='#6A1B9A',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#F3E5F5', edgecolor='#6A1B9A', lw=2))

ax.text(1, step_y - 0.5, 'Access Port = connects to ONE device (camera, PC, server). It belongs to ONE VLAN only.',
        fontsize=10, color='#6A1B9A', style='italic')

access_lines = [
    '# Assign ports 1-16 to VLAN 100 (Cameras)',
    'Switch(config)# interface range GigabitEthernet 0/1 - 16',
    'Switch(config-if-range)# switchport mode access',
    'Switch(config-if-range)# switchport access vlan 100',
    'Switch(config-if-range)# spanning-tree portfast',
    'Switch(config-if-range)# exit',
    '',
    '# Assign ports 17-20 to VLAN 10 (Servers)',
    'Switch(config)# interface range GigabitEthernet 0/17 - 20',
    'Switch(config-if-range)# switchport mode access',
    'Switch(config-if-range)# switchport access vlan 10',
    'Switch(config-if-range)# exit',
    '',
    '# Assign ports 21-23 to VLAN 200 (Corporate)',
    'Switch(config)# interface range GigabitEthernet 0/21 - 23',
    'Switch(config-if-range)# switchport mode access',
    'Switch(config-if-range)# switchport access vlan 200',
    'Switch(config-if-range)# exit',
]
draw_code_block(1, step_y - 6.6, 14, 5.8, 'CISCO — Assigning Access Ports', access_lines)

# Visual port diagram
port_y = step_y - 1.2
ax.text(17, port_y, 'PORT LAYOUT:', fontsize=10, fontweight='bold', color='#333')

# Draw ports visually
for i in range(24):
    row = i // 12
    col = i % 12
    px = 16 + col * 0.65
    py = port_y - 1.0 - row * 0.8
    if i < 16:
        color = '#4FC3F7'  # Camera VLAN
    elif i < 20:
        color = '#81C784'  # Server VLAN
    elif i < 23:
        color = '#EF9A9A'  # Corporate VLAN
    else:
        color = '#FFB74D'  # Trunk
    box = FancyBboxPatch((px, py), 0.55, 0.55, boxstyle="round,pad=0.02",
                          facecolor=color, edgecolor='#333', linewidth=1)
    ax.add_patch(box)
    ax.text(px + 0.275, py + 0.275, str(i+1), fontsize=7, ha='center', va='center', fontweight='bold')

# Legend for ports
leg_y = port_y - 2.8
ax.text(16, leg_y + 0.5, 'Port Legend:', fontsize=9, fontweight='bold')
for i, (color, label) in enumerate([('#4FC3F7', 'VLAN 100 (Cameras) — Ports 1-16'),
                                      ('#81C784', 'VLAN 10 (Servers) — Ports 17-20'),
                                      ('#EF9A9A', 'VLAN 200 (Corporate) — Ports 21-23'),
                                      ('#FFB74D', 'Trunk Port — Port 24')]):
    box = FancyBboxPatch((16, leg_y - i*0.4), 0.4, 0.3, boxstyle="round,pad=0.02",
                          facecolor=color, edgecolor='#333', linewidth=1)
    ax.add_patch(box)
    ax.text(16.6, leg_y + 0.12 - i*0.4, label, fontsize=8, va='center')

# ============================================================
# STEP 5: CONFIGURE TRUNK PORT
# ============================================================
step_y = 5.2
ax.text(1, step_y, 'STEP 5: Configure Trunk Port (Carries ALL VLANs between switches)', fontsize=14,
        fontweight='bold', color='#00695C',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#E0F2F1', edgecolor='#00695C', lw=2))

trunk_lines = [
    '# Configure port 24 as a trunk',
    'Switch(config)# interface GigabitEthernet 0/24',
    'Switch(config-if)# switchport mode trunk',
    'Switch(config-if)# switchport trunk allowed vlan 10,100,200',
    'Switch(config-if)# exit',
    '',
    '# Save configuration!',
    'Switch# copy running-config startup-config',
]
draw_code_block(1, step_y - 3.3, 11, 3.0, 'CISCO — Trunk Port Configuration', trunk_lines)

# Trunk explanation
trunk_bg = FancyBboxPatch((13, step_y - 3.3), 9.5, 3.0, boxstyle="round,pad=0.15",
                            facecolor='#E0F2F1', edgecolor='#00695C', linewidth=2)
ax.add_patch(trunk_bg)
ax.text(17.75, step_y - 0.6, 'TRUNK vs ACCESS — Quick Reference', fontsize=11, fontweight='bold',
        ha='center', color='#00695C')

ax.text(14, step_y - 1.2, 'ACCESS PORT', fontsize=10, fontweight='bold', color='#0277BD')
ax.text(14, step_y - 1.6, '- Belongs to ONE VLAN', fontsize=9, color='#333')
ax.text(14, step_y - 1.9, '- Connects to end device (camera, PC)', fontsize=9, color='#333')
ax.text(14, step_y - 2.2, '- Traffic is UNTAGGED', fontsize=9, color='#333')

ax.text(18.5, step_y - 1.2, 'TRUNK PORT', fontsize=10, fontweight='bold', color='#E65100')
ax.text(18.5, step_y - 1.6, '- Carries MULTIPLE VLANs', fontsize=9, color='#333')
ax.text(18.5, step_y - 1.9, '- Connects switch-to-switch or to router', fontsize=9, color='#333')
ax.text(18.5, step_y - 2.2, '- Traffic is TAGGED (802.1Q)', fontsize=9, color='#333')

# ============================================================
# STEP 6: ENABLE INTER-VLAN ROUTING
# ============================================================
step_y = 1.5
ax.text(1, step_y, 'STEP 6: Enable Inter-VLAN Routing (So cameras can reach the ACC server)',
        fontsize=14, fontweight='bold', color='#AD1457',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#FCE4EC', edgecolor='#AD1457', lw=2))

routing_lines = [
    '# Create VLAN interfaces (SVIs)',
    'Switch(config)# interface vlan 100',
    'Switch(config-if)# ip address 10.10.100.1 255.255.255.0',
    'Switch(config-if)# no shutdown',
    'Switch(config-if)# exit',
    '',
    'Switch(config)# interface vlan 10',
    'Switch(config-if)# ip address 10.10.10.1 255.255.255.0',
    'Switch(config-if)# no shutdown',
    '',
    '# Enable routing',
    'Switch(config)# ip routing',
]
draw_code_block(1, step_y - 4.5, 11, 4.2, 'CISCO L3 SWITCH — Inter-VLAN Routing', routing_lines)

# Explanation
route_bg = FancyBboxPatch((13, step_y - 4.5), 9.5, 4.2, boxstyle="round,pad=0.15",
                            facecolor='#FCE4EC', edgecolor='#AD1457', linewidth=2)
ax.add_patch(route_bg)
ax.text(17.75, step_y - 0.6, 'WHY IS THIS NEEDED?', fontsize=12, fontweight='bold',
        ha='center', color='#AD1457')
ax.text(13.5, step_y - 1.2, 'Without inter-VLAN routing:', fontsize=10, fontweight='bold', color='#C62828')
ax.text(13.5, step_y - 1.6, '- Camera (VLAN 100) CANNOT reach ACC Server (VLAN 10)', fontsize=9, color='#333')
ax.text(13.5, step_y - 1.9, '- Each VLAN is completely isolated', fontsize=9, color='#333')
ax.text(13.5, step_y - 2.3, 'With inter-VLAN routing:', fontsize=10, fontweight='bold', color='#2E7D32')
ax.text(13.5, step_y - 2.7, '- L3 switch acts as the gateway for each VLAN', fontsize=9, color='#333')
ax.text(13.5, step_y - 3.0, '- Camera sends traffic to gateway (10.10.100.1)', fontsize=9, color='#333')
ax.text(13.5, step_y - 3.3, '- Switch routes it to server VLAN (10.10.10.0)', fontsize=9, color='#333')
ax.text(13.5, step_y - 3.7, 'Set camera default gateway = 10.10.100.1', fontsize=10,
        fontweight='bold', color='#AD1457')

plt.tight_layout()
plt.savefig('/Users/akshit/Desktop/ai/VLAN_Setup_Guide.png', dpi=180, bbox_inches='tight',
            facecolor='#FAFAFA')
print('VLAN Setup Guide saved.')
