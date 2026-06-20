import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

fig, ax = plt.subplots(figsize=(22, 16))
fig.patch.set_facecolor('#FAFAFA')
ax.set_xlim(0, 22)
ax.set_ylim(0, 16)
ax.axis('off')

ax.text(11, 15.5, 'Subnetting Explained — For CCTV Networks', fontsize=20, fontweight='bold',
        ha='center', color='#1a1a2e')
ax.text(11, 15.0, 'How IP addresses and subnets work in surveillance deployments',
        fontsize=11, ha='center', color='#666', style='italic')

def draw_box(x, y, w, h, color, label, sublabel='', fontsize=10, edge='#333'):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1",
                          facecolor=color, edgecolor=edge, linewidth=1.5, alpha=0.85)
    ax.add_patch(box)
    ax.text(x + w/2, y + h/2 + (0.13 if sublabel else 0), label,
            fontsize=fontsize, fontweight='bold', ha='center', va='center', color='#1a1a2e')
    if sublabel:
        ax.text(x + w/2, y + h/2 - 0.18, sublabel, fontsize=8, ha='center', va='center', color='#444')

# ============================================================
# SECTION 1: IP Address Anatomy
# ============================================================
ax.text(1, 14.2, '1. IP ADDRESS ANATOMY', fontsize=13, fontweight='bold', color='#0277BD',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#E1F5FE', edgecolor='#0277BD'))

# IP address broken down
ip_y = 13.2
draw_box(1, ip_y, 2.5, 0.7, '#BBDEFB', '192', 'Octet 1')
ax.text(3.6, ip_y+0.35, '.', fontsize=20, fontweight='bold', ha='center', va='center')
draw_box(3.8, ip_y, 2.5, 0.7, '#BBDEFB', '168', 'Octet 2')
ax.text(6.4, ip_y+0.35, '.', fontsize=20, fontweight='bold', ha='center', va='center')
draw_box(6.6, ip_y, 2.5, 0.7, '#C8E6C9', '1', 'Octet 3')
ax.text(9.2, ip_y+0.35, '.', fontsize=20, fontweight='bold', ha='center', va='center')
draw_box(9.4, ip_y, 2.5, 0.7, '#FFCDD2', '100', 'Octet 4')

# Brackets
ax.annotate('', xy=(1, ip_y - 0.1), xytext=(9.1, ip_y - 0.1),
            arrowprops=dict(arrowstyle='-', color='#0277BD', lw=2))
ax.text(5, ip_y - 0.4, 'NETWORK PART (identifies the network)', fontsize=9,
        fontweight='bold', ha='center', color='#0277BD')

ax.annotate('', xy=(9.4, ip_y - 0.1), xytext=(11.9, ip_y - 0.1),
            arrowprops=dict(arrowstyle='-', color='#C62828', lw=2))
ax.text(10.65, ip_y - 0.4, 'HOST\n(device)', fontsize=8,
        fontweight='bold', ha='center', color='#C62828')

# Subnet mask
ax.text(13.5, 13.8, 'Subnet Mask:', fontsize=11, fontweight='bold', color='#333')
ax.text(13.5, 13.3, '255.255.255.0  =  /24', fontsize=11, color='#0277BD', fontweight='bold',
        fontfamily='monospace')
ax.text(13.5, 12.8, 'Tells devices: "First 3 octets = network,\nlast octet = host addresses"', fontsize=9, color='#555')

# ============================================================
# SECTION 2: Common Subnets Table
# ============================================================
ax.text(1, 11.8, '2. COMMON SUBNETS YOU\'LL SEE ON CALLS', fontsize=13, fontweight='bold', color='#2E7D32',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#E8F5E9', edgecolor='#2E7D32'))

# Table header
table_y = 11.0
headers = ['CIDR', 'Subnet Mask', 'Usable Hosts', 'Best For']
col_x = [1.5, 4.5, 8.5, 12.5]
for i, h in enumerate(headers):
    draw_box(col_x[i]-0.3, table_y, 3.2 if i < 3 else 5, 0.55, '#A5D6A7', h, fontsize=9)

# Table rows
rows = [
    ['/24', '255.255.255.0', '254 hosts', 'Small sites (< 200 cameras)'],
    ['/23', '255.255.254.0', '510 hosts', 'Medium sites (200-400 cameras)'],
    ['/22', '255.255.252.0', '1,022 hosts', 'Large sites (400-900 cameras)'],
    ['/16', '255.255.0.0', '65,534 hosts', 'Enterprise / campus-wide'],
]
for r, row in enumerate(rows):
    ry = table_y - 0.65 * (r + 1)
    colors = ['#E8F5E9', '#F1F8E9', '#E8F5E9', '#F1F8E9']
    for c, val in enumerate(row):
        draw_box(col_x[c]-0.3, ry, 3.2 if c < 3 else 5, 0.55, colors[r], val, fontsize=9)

# ============================================================
# SECTION 3: Real-World CCTV Subnet Example
# ============================================================
ax.text(1, 8.0, '3. REAL-WORLD CCTV SUBNET DESIGN', fontsize=13, fontweight='bold', color='#E65100',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#FFF3E0', edgecolor='#E65100'))

# Router in the middle
draw_box(8.5, 5.8, 5, 1.2, '#FF8A65', 'Core Router / L3 Switch',
         'Routes traffic between subnets', fontsize=12)

# Subnet 1: Cameras
s1_bg = FancyBboxPatch((0.3, 2.5), 5.5, 3.0, boxstyle="round,pad=0.15",
                         facecolor='#E1F5FE', edgecolor='#0277BD', linewidth=2, alpha=0.4)
ax.add_patch(s1_bg)
ax.text(3.05, 5.2, 'Subnet: 10.10.100.0/24', fontsize=10, fontweight='bold', ha='center', color='#0277BD')
ax.text(3.05, 4.8, 'Gateway: 10.10.100.1', fontsize=8, ha='center', color='#0277BD')
ax.text(3.05, 4.45, 'Range: 10.10.100.2 — 10.10.100.254', fontsize=8, ha='center', color='#0277BD')

draw_box(0.5, 3.3, 2.2, 0.7, '#4FC3F7', 'Camera 1', '10.10.100.10')
draw_box(3.1, 3.3, 2.2, 0.7, '#4FC3F7', 'Camera 2', '10.10.100.11')
draw_box(0.5, 2.6, 2.2, 0.55, '#4FC3F7', '...up to 252 more cameras', fontsize=7)

# Arrow
ax.annotate('', xy=(5.8, 6.4), xytext=(8.5, 6.4),
            arrowprops=dict(arrowstyle='<->', color='#0277BD', lw=2))

# Subnet 2: Servers
s2_bg = FancyBboxPatch((8.2, 2.5), 5.5, 3.0, boxstyle="round,pad=0.15",
                         facecolor='#E8F5E9', edgecolor='#2E7D32', linewidth=2, alpha=0.4)
ax.add_patch(s2_bg)
ax.text(10.95, 5.2, 'Subnet: 10.10.10.0/24', fontsize=10, fontweight='bold', ha='center', color='#2E7D32')
ax.text(10.95, 4.8, 'Gateway: 10.10.10.1', fontsize=8, ha='center', color='#2E7D32')
ax.text(10.95, 4.45, 'Range: 10.10.10.2 — 10.10.10.254', fontsize=8, ha='center', color='#2E7D32')

draw_box(8.4, 3.3, 2.4, 0.7, '#81C784', 'ACC Server', '10.10.10.100')
draw_box(11.2, 3.3, 2.4, 0.7, '#A5D6A7', 'ACC Server 2', '10.10.10.101')

# Subnet 3: Clients
s3_bg = FancyBboxPatch((16.0, 2.5), 5.5, 3.0, boxstyle="round,pad=0.15",
                         facecolor='#FFEBEE', edgecolor='#C62828', linewidth=2, alpha=0.4)
ax.add_patch(s3_bg)
ax.text(18.75, 5.2, 'Subnet: 10.10.200.0/24', fontsize=10, fontweight='bold', ha='center', color='#C62828')
ax.text(18.75, 4.8, 'Gateway: 10.10.200.1', fontsize=8, ha='center', color='#C62828')
ax.text(18.75, 4.45, 'Range: 10.10.200.2 — 10.10.200.254', fontsize=8, ha='center', color='#C62828')

draw_box(16.2, 3.3, 2.4, 0.7, '#EF9A9A', 'Control Room', '10.10.200.50')
draw_box(18.9, 3.3, 2.4, 0.7, '#EF9A9A', 'Admin PC', '10.10.200.51')

# Arrows to router
ax.annotate('', xy=(13.5, 6.4), xytext=(16.0, 5.5),
            arrowprops=dict(arrowstyle='<->', color='#C62828', lw=2))

# ============================================================
# SECTION 4: Key Rules
# ============================================================
ax.text(1, 1.8, 'KEY RULES:', fontsize=12, fontweight='bold', color='#333')
rules = [
    'Devices on the SAME subnet can talk directly (no router needed)',
    'Devices on DIFFERENT subnets need a ROUTER or L3 SWITCH (gateway)',
    'Each device must have: IP address + Subnet Mask + Default Gateway',
    'If a camera and server are on different subnets with no route between them = NO CONNECTION',
]
for i, r in enumerate(rules):
    marker_color = ['#0277BD', '#2E7D32', '#E65100', '#C62828'][i]
    ax.text(1.3, 1.3 - i*0.4, f'{i+1}. {r}', fontsize=9, color=marker_color, fontweight='bold')

plt.tight_layout()
plt.savefig('/Users/akshit/Desktop/ai/Subnetting_Explained.png', dpi=200, bbox_inches='tight',
            facecolor='#FAFAFA')
print('Subnetting diagram saved.')
