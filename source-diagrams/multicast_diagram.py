import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

fig, axes = plt.subplots(1, 2, figsize=(24, 14))
fig.patch.set_facecolor('#FAFAFA')

fig.suptitle('Unicast vs Multicast — Video Streaming in CCTV', fontsize=20, fontweight='bold',
             color='#1a1a2e', y=0.97)
fig.text(0.5, 0.93, 'How video gets from cameras to viewers in Avigilon ACC',
         fontsize=11, ha='center', color='#666', style='italic')

def draw_box(ax, x, y, w, h, color, label, sublabel='', fontsize=10, edge='#333'):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1",
                          facecolor=color, edgecolor=edge, linewidth=1.5, alpha=0.85)
    ax.add_patch(box)
    ax.text(x + w/2, y + h/2 + (0.15 if sublabel else 0), label,
            fontsize=fontsize, fontweight='bold', ha='center', va='center', color='#1a1a2e')
    if sublabel:
        ax.text(x + w/2, y + h/2 - 0.2, sublabel, fontsize=7.5, ha='center', va='center', color='#444')

# ============================================================
# LEFT: UNICAST
# ============================================================
ax1 = axes[0]
ax1.set_xlim(0, 12)
ax1.set_ylim(0, 13)
ax1.axis('off')

ax1.text(6, 12.3, 'UNICAST (One-to-One)', fontsize=16, fontweight='bold', ha='center',
         color='#E65100',
         bbox=dict(boxstyle='round,pad=0.4', facecolor='#FFF3E0', edgecolor='#E65100', lw=2))

# Camera
draw_box(ax1, 4, 10.0, 4, 1.0, '#4FC3F7', 'Camera', '4K Stream @ 20 Mbps', fontsize=12)

# ACC Server
draw_box(ax1, 4, 7.5, 4, 1.0, '#81C784', 'ACC Server', 'Sends separate copy to each client', fontsize=10)

# Arrow camera to server
ax1.annotate('', xy=(6, 8.5), xytext=(6, 10.0),
            arrowprops=dict(arrowstyle='->', color='#0277BD', lw=2.5))
ax1.text(7.5, 9.3, '20 Mbps\n(1 stream)', fontsize=9, ha='center', color='#0277BD', fontweight='bold')

# Clients
clients = [
    (0.5, 4.5, 'Client 1\n(Control Room)'),
    (3.5, 4.5, 'Client 2\n(Admin PC)'),
    (6.5, 4.5, 'Client 3\n(Manager)'),
    (9.5, 4.5, 'Client 4\n(Mobile)'),
]

for x, y, label in clients:
    draw_box(ax1, x, y, 2.2, 1.0, '#EF9A9A', label, fontsize=8)

# Arrows from server to each client — separate streams
colors = ['#C62828', '#D32F2F', '#E53935', '#EF5350']
for i, (x, y, _) in enumerate(clients):
    ax1.annotate('', xy=(x+1.1, 5.5), xytext=(6, 7.5),
                arrowprops=dict(arrowstyle='->', color=colors[i], lw=2))
    ax1.text(x+1.1, 6.1, '20\nMbps', fontsize=8, ha='center', color='#C62828', fontweight='bold')

# Total bandwidth
bw_bg = FancyBboxPatch((1.5, 2.5), 9, 1.5, boxstyle="round,pad=0.15",
                         facecolor='#FFEBEE', edgecolor='#C62828', linewidth=2)
ax1.add_patch(bw_bg)
ax1.text(6, 3.7, 'TOTAL BANDWIDTH USED', fontsize=11, fontweight='bold', ha='center', color='#C62828')
ax1.text(6, 3.15, '4 clients x 20 Mbps = 80 Mbps for ONE camera', fontsize=11, ha='center',
         color='#C62828', fontweight='bold')
ax1.text(6, 2.7, '50 cameras x 4 clients = 4,000 Mbps (4 Gbps!!)', fontsize=10, ha='center',
         color='#C62828')

# Verdict
ax1.text(6, 1.5, 'Simple but EXPENSIVE on bandwidth', fontsize=12, fontweight='bold',
         ha='center', color='#C62828')
ax1.text(6, 1.0, 'Good for: Few viewers, remote access, WAN connections',
         fontsize=9, ha='center', color='#666')

# ============================================================
# RIGHT: MULTICAST
# ============================================================
ax2 = axes[1]
ax2.set_xlim(0, 12)
ax2.set_ylim(0, 13)
ax2.axis('off')

ax2.text(6, 12.3, 'MULTICAST (One-to-Many)', fontsize=16, fontweight='bold', ha='center',
         color='#2E7D32',
         bbox=dict(boxstyle='round,pad=0.4', facecolor='#E8F5E9', edgecolor='#2E7D32', lw=2))

# Camera
draw_box(ax2, 4, 10.0, 4, 1.0, '#4FC3F7', 'Camera', '4K Stream @ 20 Mbps', fontsize=12)

# ACC Server
draw_box(ax2, 4, 7.5, 4, 1.0, '#81C784', 'ACC Server', 'Sends ONE stream to the network', fontsize=10)

# Arrow camera to server
ax2.annotate('', xy=(6, 8.5), xytext=(6, 10.0),
            arrowprops=dict(arrowstyle='->', color='#0277BD', lw=2.5))
ax2.text(7.5, 9.3, '20 Mbps\n(1 stream)', fontsize=9, ha='center', color='#0277BD', fontweight='bold')

# Network switch (replicates)
draw_box(ax2, 3.5, 5.8, 5, 0.8, '#FFB74D', 'Network Switch (IGMP)', 'Replicates to subscribers only')

# Arrow server to switch — single stream
ax2.annotate('', xy=(6, 6.6), xytext=(6, 7.5),
            arrowprops=dict(arrowstyle='->', color='#2E7D32', lw=3))
ax2.text(7.8, 7.1, '20 Mbps\n(ONLY 1 stream!)', fontsize=9, ha='center', color='#2E7D32', fontweight='bold')

# Clients
for x, y, label in clients:
    draw_box(ax2, x, y, 2.2, 1.0, '#EF9A9A', label, fontsize=8)

# Arrows from switch to each client
for i, (x, y, _) in enumerate(clients):
    ax2.annotate('', xy=(x+1.1, 5.5), xytext=(6, 5.8),
                arrowprops=dict(arrowstyle='->', color='#2E7D32', lw=1.5, linestyle='dashed'))

ax2.text(6, 5.55, 'Switch copies stream only to ports that requested it',
         fontsize=8, ha='center', color='#E65100', style='italic')

# Total bandwidth
bw_bg2 = FancyBboxPatch((1.5, 2.5), 9, 1.5, boxstyle="round,pad=0.15",
                          facecolor='#E8F5E9', edgecolor='#2E7D32', linewidth=2)
ax2.add_patch(bw_bg2)
ax2.text(6, 3.7, 'TOTAL BANDWIDTH USED', fontsize=11, fontweight='bold', ha='center', color='#2E7D32')
ax2.text(6, 3.15, '4 clients x 20 Mbps = STILL 20 Mbps for ONE camera', fontsize=11, ha='center',
         color='#2E7D32', fontweight='bold')
ax2.text(6, 2.7, '50 cameras x 1 stream each = 1,000 Mbps (1 Gbps)', fontsize=10, ha='center',
         color='#2E7D32')

# Verdict
ax2.text(6, 1.5, 'Efficient — bandwidth stays FLAT regardless of viewers', fontsize=12,
         fontweight='bold', ha='center', color='#2E7D32')
ax2.text(6, 1.0, 'Good for: LAN, multiple viewers, control rooms, video walls',
         fontsize=9, ha='center', color='#666')

plt.tight_layout(rect=[0, 0, 1, 0.92])
plt.savefig('/Users/akshit/Desktop/ai/Multicast_vs_Unicast.png', dpi=200, bbox_inches='tight',
            facecolor='#FAFAFA')
print('Multicast diagram saved.')
