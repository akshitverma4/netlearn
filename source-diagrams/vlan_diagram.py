import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch

fig, axes = plt.subplots(1, 2, figsize=(22, 13))
fig.patch.set_facecolor('#FAFAFA')

fig.suptitle('VLAN (Virtual Local Area Network) Explained', fontsize=20, fontweight='bold',
             color='#1a1a2e', y=0.97)

# ============================================================
# LEFT SIDE: WITHOUT VLANs
# ============================================================
ax1 = axes[0]
ax1.set_xlim(0, 10)
ax1.set_ylim(0, 13)
ax1.axis('off')

ax1.text(5, 12.5, 'WITHOUT VLANs', fontsize=16, fontweight='bold', ha='center',
         color='#C62828',
         bbox=dict(boxstyle='round,pad=0.4', facecolor='#FFEBEE', edgecolor='#C62828', lw=2))
ax1.text(5, 11.8, 'All devices on ONE flat network — 192.168.1.0/24', fontsize=10,
         ha='center', color='#666', style='italic')

def draw_box(ax, x, y, w, h, color, label, sublabel='', fontsize=9):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.08",
                          facecolor=color, edgecolor='#333', linewidth=1.5, alpha=0.85)
    ax.add_patch(box)
    ax.text(x + w/2, y + h/2 + (0.1 if sublabel else 0), label,
            fontsize=fontsize, fontweight='bold', ha='center', va='center', color='#1a1a2e')
    if sublabel:
        ax.text(x + w/2, y + h/2 - 0.15, sublabel, fontsize=7, ha='center', va='center', color='#444')

# Single Switch
draw_box(ax1, 3, 6.5, 4, 1, '#FFB74D', 'Single Switch', 'One Network — No Segmentation')

# All devices mixed together
devices_no_vlan = [
    (0.3, 9.5, '#4FC3F7', 'Camera 1', '192.168.1.10'),
    (2.5, 9.5, '#4FC3F7', 'Camera 2', '192.168.1.11'),
    (4.7, 9.5, '#EF9A9A', 'Office PC', '192.168.1.50'),
    (6.9, 9.5, '#EF9A9A', 'Laptop', '192.168.1.51'),
    (0.3, 4.0, '#81C784', 'ACC Server', '192.168.1.100'),
    (2.5, 4.0, '#CE93D8', 'Printer', '192.168.1.200'),
    (4.7, 4.0, '#EF9A9A', 'Guest WiFi', '192.168.1.201'),
    (6.9, 4.0, '#FFB74D', 'IoT Device', '192.168.1.202'),
]

for x, y, color, label, ip in devices_no_vlan:
    draw_box(ax1, x, y, 2, 0.8, color, label, ip)

# Arrows to switch
for x, y, _, _, _ in devices_no_vlan:
    if y > 8:
        ax1.annotate('', xy=(x+1, 7.5), xytext=(x+1, y),
                     arrowprops=dict(arrowstyle='->', color='#999', lw=1.2))
    else:
        ax1.annotate('', xy=(x+1, 6.5), xytext=(x+1, y+0.8),
                     arrowprops=dict(arrowstyle='->', color='#999', lw=1.2))

# Problems
ax1.text(5, 2.5, 'PROBLEMS:', fontsize=12, fontweight='bold', ha='center', color='#C62828')
problems = [
    'All traffic is shared — cameras flood the network with video',
    'Office PCs slow down because of bandwidth competition',
    'Security risk — anyone can access camera feeds',
    'Broadcast storms affect ALL devices',
    'No isolation between critical and non-critical devices',
]
for i, p in enumerate(problems):
    ax1.text(5, 1.9 - i*0.45, f'  {p}', fontsize=8.5, ha='center', color='#C62828')

# ============================================================
# RIGHT SIDE: WITH VLANs
# ============================================================
ax2 = axes[1]
ax2.set_xlim(0, 10)
ax2.set_ylim(0, 13)
ax2.axis('off')

ax2.text(5, 12.5, 'WITH VLANs', fontsize=16, fontweight='bold', ha='center',
         color='#2E7D32',
         bbox=dict(boxstyle='round,pad=0.4', facecolor='#E8F5E9', edgecolor='#2E7D32', lw=2))
ax2.text(5, 11.8, 'Devices separated into logical networks on the SAME switch', fontsize=10,
         ha='center', color='#666', style='italic')

# Managed Switch
draw_box(ax2, 2.5, 6.2, 5, 1.2, '#FF8A65', 'Managed Switch', 'Trunk Port — Carries All VLANs', fontsize=11)

# VLAN 100 — Cameras (Blue zone)
vlan100_bg = FancyBboxPatch((0.1, 9.0), 4.5, 2.5, boxstyle="round,pad=0.15",
                             facecolor='#E1F5FE', edgecolor='#0277BD', linewidth=2, alpha=0.5)
ax2.add_patch(vlan100_bg)
ax2.text(2.35, 11.2, 'VLAN 100 — Cameras', fontsize=10, fontweight='bold', ha='center', color='#0277BD')
ax2.text(2.35, 10.8, '10.10.100.0/24', fontsize=8, ha='center', color='#0277BD')

draw_box(ax2, 0.3, 9.3, 1.9, 0.7, '#4FC3F7', 'Camera 1', '10.10.100.10')
draw_box(ax2, 2.5, 9.3, 1.9, 0.7, '#4FC3F7', 'Camera 2', '10.10.100.11')

# VLAN 200 — Corporate (Red zone)
vlan200_bg = FancyBboxPatch((5.4, 9.0), 4.5, 2.5, boxstyle="round,pad=0.15",
                             facecolor='#FFEBEE', edgecolor='#C62828', linewidth=2, alpha=0.5)
ax2.add_patch(vlan200_bg)
ax2.text(7.65, 11.2, 'VLAN 200 — Corporate', fontsize=10, fontweight='bold', ha='center', color='#C62828')
ax2.text(7.65, 10.8, '10.10.200.0/24', fontsize=8, ha='center', color='#C62828')

draw_box(ax2, 5.6, 9.3, 1.9, 0.7, '#EF9A9A', 'Office PC', '10.10.200.50')
draw_box(ax2, 7.8, 9.3, 1.9, 0.7, '#EF9A9A', 'Laptop', '10.10.200.51')

# VLAN 10 — Servers (Green zone)
vlan10_bg = FancyBboxPatch((0.1, 3.5), 4.5, 2.2, boxstyle="round,pad=0.15",
                            facecolor='#E8F5E9', edgecolor='#2E7D32', linewidth=2, alpha=0.5)
ax2.add_patch(vlan10_bg)
ax2.text(2.35, 5.4, 'VLAN 10 — Servers', fontsize=10, fontweight='bold', ha='center', color='#2E7D32')
ax2.text(2.35, 5.0, '10.10.10.0/24', fontsize=8, ha='center', color='#2E7D32')

draw_box(ax2, 0.3, 3.8, 1.9, 0.7, '#81C784', 'ACC Server', '10.10.10.100')
draw_box(ax2, 2.5, 3.8, 1.9, 0.7, '#A5D6A7', 'ACC Server 2', '10.10.10.101')

# VLAN 300 — Guest (Purple zone)
vlan300_bg = FancyBboxPatch((5.4, 3.5), 4.5, 2.2, boxstyle="round,pad=0.15",
                             facecolor='#F3E5F5', edgecolor='#6A1B9A', linewidth=2, alpha=0.5)
ax2.add_patch(vlan300_bg)
ax2.text(7.65, 5.4, 'VLAN 300 — Guest', fontsize=10, fontweight='bold', ha='center', color='#6A1B9A')
ax2.text(7.65, 5.0, '10.10.300.0/24 (Isolated)', fontsize=8, ha='center', color='#6A1B9A')

draw_box(ax2, 5.6, 3.8, 1.9, 0.7, '#CE93D8', 'Guest WiFi', '10.10.300.10')
draw_box(ax2, 7.8, 3.8, 1.9, 0.7, '#CE93D8', 'Visitor PC', '10.10.300.11')

# Arrows to switch
for x in [1.25, 3.45]:
    ax2.annotate('', xy=(x, 7.4), xytext=(x, 9.3),
                 arrowprops=dict(arrowstyle='->', color='#0277BD', lw=1.5))
for x in [6.55, 8.75]:
    ax2.annotate('', xy=(x, 7.4), xytext=(x, 9.3),
                 arrowprops=dict(arrowstyle='->', color='#C62828', lw=1.5))
for x in [1.25, 3.45]:
    ax2.annotate('', xy=(x, 6.2), xytext=(x, 4.5),
                 arrowprops=dict(arrowstyle='->', color='#2E7D32', lw=1.5))
for x in [6.55, 8.75]:
    ax2.annotate('', xy=(x, 6.2), xytext=(x, 4.5),
                 arrowprops=dict(arrowstyle='->', color='#6A1B9A', lw=1.5))

# Benefits
ax2.text(5, 2.5, 'BENEFITS:', fontsize=12, fontweight='bold', ha='center', color='#2E7D32')
benefits = [
    'Camera traffic isolated — no impact on office network',
    'Security — guests cannot access camera or server VLANs',
    'Performance — each VLAN has dedicated bandwidth',
    'Broadcast containment — storms stay within one VLAN',
    'Easy management — apply policies per VLAN (QoS, ACLs)',
]
for i, b in enumerate(benefits):
    ax2.text(5, 1.9 - i*0.45, f'  {b}', fontsize=8.5, ha='center', color='#2E7D32')

plt.tight_layout(rect=[0, 0, 1, 0.95])
plt.savefig('/Users/akshit/Desktop/ai/VLAN_Explained.png', dpi=200, bbox_inches='tight',
            facecolor='#FAFAFA')
print('Diagram saved to: /Users/akshit/Desktop/ai/VLAN_Explained.png')
