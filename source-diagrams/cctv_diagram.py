import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

fig, ax = plt.subplots(figsize=(20, 14))
ax.set_xlim(0, 20)
ax.set_ylim(0, 14)
ax.axis('off')
fig.patch.set_facecolor('#FAFAFA')

# Title
ax.text(10, 13.5, 'CCTV System Architecture — Organisation Overview',
        fontsize=18, fontweight='bold', ha='center', va='center',
        color='#1a1a2e')
ax.text(10, 13.0, 'Avigilon (Motorola Solutions) Typical Deployment',
        fontsize=11, ha='center', va='center', color='#666666', style='italic')

# --- Color Palette ---
cam_color = '#4FC3F7'
network_color = '#FFB74D'
server_color = '#81C784'
storage_color = '#CE93D8'
client_color = '#EF9A9A'
cloud_color = '#90CAF9'

def draw_box(x, y, w, h, color, label, sublabel='', fontsize=9):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1",
                          facecolor=color, edgecolor='#333333', linewidth=1.5, alpha=0.85)
    ax.add_patch(box)
    ax.text(x + w/2, y + h/2 + (0.12 if sublabel else 0), label,
            fontsize=fontsize, fontweight='bold', ha='center', va='center', color='#1a1a2e')
    if sublabel:
        ax.text(x + w/2, y + h/2 - 0.18, sublabel,
                fontsize=7, ha='center', va='center', color='#444444')

def draw_arrow(x1, y1, x2, y2, color='#555555', style='->', lw=1.5):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle=style, color=color, lw=lw))

def draw_dashed_arrow(x1, y1, x2, y2, color='#888888'):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', color=color, lw=1.2,
                                linestyle='dashed'))

# ============================================================
# LAYER 1: CAMERAS (Top)
# ============================================================
ax.text(1.0, 11.8, 'CAMERA LAYER', fontsize=9, fontweight='bold', color='#0277BD',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#E1F5FE', edgecolor='#0277BD'))

# Outdoor cameras
draw_box(1, 10.8, 2.2, 0.8, cam_color, 'Outdoor Bullet', 'IP Camera (PoE)')
draw_box(4, 10.8, 2.2, 0.8, cam_color, 'Outdoor Dome', 'IP Camera (PoE)')
draw_box(7, 10.8, 2.2, 0.8, cam_color, 'PTZ Camera', 'IP Camera (PoE+)')

# Indoor cameras
draw_box(10.5, 10.8, 2.2, 0.8, cam_color, 'Indoor Dome', 'IP Camera (PoE)')
draw_box(13.5, 10.8, 2.2, 0.8, cam_color, 'Fisheye 360', 'IP Camera (PoE)')
draw_box(16.5, 10.8, 2.2, 0.8, cam_color, 'Door Station', 'Intercom + Camera')

# ============================================================
# LAYER 2: NETWORK (Middle-Upper)
# ============================================================
ax.text(1.0, 9.8, 'NETWORK LAYER', fontsize=9, fontweight='bold', color='#E65100',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#FFF3E0', edgecolor='#E65100'))

# PoE Switches
draw_box(2, 8.8, 2.8, 0.8, network_color, 'PoE Switch 1', 'VLAN 100 — Cameras')
draw_box(8.5, 8.8, 2.8, 0.8, network_color, 'PoE Switch 2', 'VLAN 100 — Cameras')
draw_box(15, 8.8, 2.8, 0.8, network_color, 'PoE Switch 3', 'VLAN 100 — Cameras')

# Core Switch / Router
draw_box(7.5, 7.2, 5, 1.0, '#FF8A65', 'Core Switch / Router', 'Inter-VLAN Routing  |  IGMP Snooping  |  QoS', fontsize=11)

# Firewall
draw_box(14.5, 7.2, 3, 1.0, '#FFCC80', 'Firewall', 'Port Filtering  |  VPN Gateway')

# Arrows: Cameras → PoE Switches
for cx in [2.1, 5.1]:
    draw_arrow(cx, 10.8, 3.4, 9.6)
draw_arrow(8.1, 10.8, 9.9, 9.6)
for cx in [11.6, 14.6]:
    draw_arrow(cx, 10.8, 9.9, 9.6)
draw_arrow(17.6, 10.8, 16.4, 9.6)

# Arrows: PoE Switches → Core Switch
draw_arrow(3.4, 8.8, 8.5, 7.8)
draw_arrow(9.9, 8.8, 10.0, 8.2)
draw_arrow(16.4, 8.8, 12.5, 7.8)

# Arrow: Core Switch → Firewall
draw_arrow(12.5, 7.7, 14.5, 7.7)

# ============================================================
# LAYER 3: SERVERS (Middle-Lower)
# ============================================================
ax.text(1.0, 6.3, 'SERVER LAYER', fontsize=9, fontweight='bold', color='#2E7D32',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#E8F5E9', edgecolor='#2E7D32'))

# ACC Server
draw_box(2, 5.0, 3.2, 1.0, server_color, 'ACC Server', 'Recording  |  Analytics  |  Management')

# ACC Secondary / Failover
draw_box(6, 5.0, 3.2, 1.0, server_color, 'ACC Server 2', 'Failover  |  Load Balancing')

# ACC Analytics Appliance
draw_box(10, 5.0, 3.2, 1.0, '#A5D6A7', 'AI Appliance', 'Video Analytics  |  Object Detection')

# Arrows: Core Switch → Servers
draw_arrow(8.5, 7.2, 3.6, 6.0)
draw_arrow(9.5, 7.2, 7.6, 6.0)
draw_arrow(10.5, 7.2, 11.6, 6.0)

# ============================================================
# LAYER 4: STORAGE (Bottom-Left)
# ============================================================
ax.text(1.0, 4.0, 'STORAGE LAYER', fontsize=9, fontweight='bold', color='#6A1B9A',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#F3E5F5', edgecolor='#6A1B9A'))

draw_box(1.5, 2.8, 2.5, 0.9, storage_color, 'RAID Storage', 'DAS / Internal Disks')
draw_box(4.8, 2.8, 2.5, 0.9, storage_color, 'NAS / SAN', 'Network Storage (iSCSI)')
draw_box(8.1, 2.8, 2.5, 0.9, storage_color, 'Archive Storage', 'Long-Term Retention')

# Arrows: Servers → Storage
draw_arrow(3.0, 5.0, 2.75, 3.7)
draw_arrow(7.0, 5.0, 6.05, 3.7)
draw_arrow(7.6, 5.0, 9.35, 3.7)

# ============================================================
# LAYER 5: CLIENTS / MONITORING (Bottom-Right)
# ============================================================
ax.text(12.0, 4.0, 'CLIENT / MONITORING', fontsize=9, fontweight='bold', color='#C62828',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#FFEBEE', edgecolor='#C62828'))

draw_box(11.5, 2.8, 2.3, 0.9, client_color, 'Control Room', 'ACC Client  |  Video Wall')
draw_box(14.3, 2.8, 2.3, 0.9, client_color, 'Admin PC', 'ACC Client  |  Config')
draw_box(17.1, 2.8, 2.3, 0.9, client_color, 'Mobile Device', 'ACC Mobile App')

# Arrows: Core Switch → Clients
draw_arrow(10.0, 7.2, 12.65, 3.7)
draw_arrow(10.5, 7.2, 15.45, 3.7)

# ============================================================
# CLOUD / REMOTE ACCESS (Right Side)
# ============================================================
ax.text(16.0, 6.3, 'REMOTE ACCESS', fontsize=9, fontweight='bold', color='#1565C0',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#E3F2FD', edgecolor='#1565C0'))

draw_box(15.5, 5.0, 3.5, 1.0, cloud_color, 'Cloud / Internet', 'Remote Viewing  |  VPN Access')

# Arrow: Firewall → Cloud
draw_arrow(16.0, 7.2, 17.25, 6.0)

# Arrow: Cloud → Mobile
draw_dashed_arrow(18.25, 5.0, 18.25, 3.7)

# ============================================================
# DATA FLOW LABELS
# ============================================================
ax.text(1.8, 10.2, 'Video + Power\n(PoE)', fontsize=7, ha='center', color='#0277BD', style='italic')
ax.text(5.5, 8.1, 'Video Stream\n(Unicast/Multicast)', fontsize=7, ha='center', color='#E65100', style='italic')
ax.text(13.5, 7.5, 'Managed\nTraffic', fontsize=7, ha='center', color='#BF360C', style='italic')
ax.text(4.0, 4.5, 'Write/Read', fontsize=7, ha='center', color='#6A1B9A', style='italic')
ax.text(13.0, 4.6, 'Live View /\nPlayback', fontsize=7, ha='center', color='#C62828', style='italic')
ax.text(17.8, 4.4, 'Remote\nStream', fontsize=7, ha='center', color='#1565C0', style='italic')

# ============================================================
# LEGEND
# ============================================================
legend_y = 1.2
ax.text(1.5, legend_y + 0.5, 'LEGEND:', fontsize=9, fontweight='bold', color='#333333')
legend_items = [
    (cam_color, 'IP Cameras'), (network_color, 'Network Equipment'),
    (server_color, 'Servers / Appliances'), (storage_color, 'Storage'),
    (client_color, 'Client Devices'), (cloud_color, 'Cloud / Remote'),
]
for i, (color, label) in enumerate(legend_items):
    x = 1.5 + (i * 3)
    box = FancyBboxPatch((x, legend_y - 0.3), 0.4, 0.3, boxstyle="round,pad=0.05",
                          facecolor=color, edgecolor='#333', linewidth=1, alpha=0.85)
    ax.add_patch(box)
    ax.text(x + 0.6, legend_y - 0.15, label, fontsize=8, va='center', color='#333333')

# Footer
ax.text(10, 0.3, 'Typical Avigilon CCTV Deployment — For Training & Reference',
        fontsize=8, ha='center', color='#999999', style='italic')

plt.tight_layout()
plt.savefig('/Users/akshit/Desktop/ai/CCTV_System_Architecture.png', dpi=200, bbox_inches='tight',
            facecolor='#FAFAFA')
print('Diagram saved to: /Users/akshit/Desktop/ai/CCTV_System_Architecture.png')
