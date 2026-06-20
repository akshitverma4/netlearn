import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

fig, axes = plt.subplots(2, 1, figsize=(22, 20))
fig.patch.set_facecolor('#FAFAFA')
fig.suptitle('DHCP & DNS — How Devices Get IPs and Resolve Names', fontsize=20,
             fontweight='bold', color='#1a1a2e', y=0.98)

def draw_box(ax, x, y, w, h, color, label, sublabel='', fontsize=10, edge='#333'):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1",
                          facecolor=color, edgecolor=edge, linewidth=1.5, alpha=0.85)
    ax.add_patch(box)
    if sublabel:
        ax.text(x + w/2, y + h/2 + 0.2, label,
                fontsize=fontsize, fontweight='bold', ha='center', va='center', color='#1a1a2e')
        ax.text(x + w/2, y + h/2 - 0.2, sublabel, fontsize=8, ha='center', va='center', color='#444')
    else:
        ax.text(x + w/2, y + h/2, label,
                fontsize=fontsize, fontweight='bold', ha='center', va='center', color='#1a1a2e')

# ============================================================
# TOP: DHCP
# ============================================================
ax1 = axes[0]
ax1.set_xlim(0, 22)
ax1.set_ylim(0, 10)
ax1.axis('off')

ax1.text(11, 9.5, 'DHCP — Dynamic Host Configuration Protocol', fontsize=16, fontweight='bold',
         ha='center', color='#0277BD',
         bbox=dict(boxstyle='round,pad=0.4', facecolor='#E1F5FE', edgecolor='#0277BD', lw=2))
ax1.text(11, 8.9, 'Automatically assigns IP addresses to devices when they connect to the network',
         fontsize=10, ha='center', color='#666', style='italic')

# DHCP 4-step process (DORA)
ax1.text(1, 8.2, 'THE DORA PROCESS (How DHCP Works in 4 Steps):', fontsize=12, fontweight='bold', color='#0277BD')

# Camera
draw_box(ax1, 0.5, 5.5, 3, 1.2, '#4FC3F7', 'New Camera', 'Plugged in — No IP yet', fontsize=11)

# DHCP Server
draw_box(ax1, 18, 5.5, 3, 1.2, '#81C784', 'DHCP Server', '(Router or Server)', fontsize=11)

# Step 1: Discover
ax1.annotate('', xy=(18, 7.5), xytext=(3.5, 7.5),
            arrowprops=dict(arrowstyle='->', color='#F57F17', lw=2.5))
draw_box(ax1, 7, 7.2, 7, 0.7, '#FFF9C4', '1. DISCOVER', '"Anyone have an IP for me?" (broadcast)', fontsize=10)

# Step 2: Offer
ax1.annotate('', xy=(3.5, 6.5), xytext=(18, 6.5),
            arrowprops=dict(arrowstyle='->', color='#2E7D32', lw=2.5))
draw_box(ax1, 7, 6.1, 7, 0.7, '#C8E6C9', '2. OFFER', '"Here, use 10.10.100.50" (from server)', fontsize=10)

# Step 3: Request
ax1.annotate('', xy=(18, 5.5), xytext=(3.5, 5.5),
            arrowprops=dict(arrowstyle='->', color='#F57F17', lw=2.5))
draw_box(ax1, 7, 5.0, 7, 0.7, '#FFF9C4', '3. REQUEST', '"OK, I\'ll take 10.10.100.50" (camera confirms)', fontsize=10)

# Step 4: Acknowledge
ax1.annotate('', xy=(3.5, 4.5), xytext=(18, 4.5),
            arrowprops=dict(arrowstyle='->', color='#2E7D32', lw=2.5))
draw_box(ax1, 7, 3.9, 7, 0.7, '#C8E6C9', '4. ACK', '"Confirmed! Lease: 24 hours" (server acknowledges)', fontsize=10)

# DHCP vs Static for CCTV
ax1.text(1, 3.0, 'DHCP vs STATIC IP — What to Use for CCTV?', fontsize=12, fontweight='bold', color='#333')

# DHCP box
dhcp_bg = FancyBboxPatch((1, 0.5), 9.5, 2.2, boxstyle="round,pad=0.15",
                           facecolor='#FFEBEE', edgecolor='#C62828', linewidth=2)
ax1.add_patch(dhcp_bg)
ax1.text(5.75, 2.4, 'DHCP for Cameras — NOT Recommended', fontsize=11, fontweight='bold',
         ha='center', color='#C62828')
ax1.text(5.75, 1.9, '- IP address can CHANGE when lease expires', fontsize=9, ha='center', color='#333')
ax1.text(5.75, 1.5, '- ACC loses connection to camera if IP changes', fontsize=9, ha='center', color='#333')
ax1.text(5.75, 1.1, '- Hard to track which camera has which IP', fontsize=9, ha='center', color='#333')
ax1.text(5.75, 0.7, '- Exception: DHCP Reservation (MAC → fixed IP)', fontsize=9, ha='center', color='#0277BD', fontweight='bold')

# Static box
static_bg = FancyBboxPatch((11.5, 0.5), 9.5, 2.2, boxstyle="round,pad=0.15",
                             facecolor='#E8F5E9', edgecolor='#2E7D32', linewidth=2)
ax1.add_patch(static_bg)
ax1.text(16.25, 2.4, 'Static IP for Cameras — RECOMMENDED', fontsize=11, fontweight='bold',
         ha='center', color='#2E7D32')
ax1.text(16.25, 1.9, '- IP never changes — ACC always knows where to find it', fontsize=9, ha='center', color='#333')
ax1.text(16.25, 1.5, '- Easier to manage and document', fontsize=9, ha='center', color='#333')
ax1.text(16.25, 1.1, '- Requires manual assignment (more setup work)', fontsize=9, ha='center', color='#333')
ax1.text(16.25, 0.7, '- Best practice: Use an IP spreadsheet to track', fontsize=9, ha='center', color='#2E7D32', fontweight='bold')

# ============================================================
# BOTTOM: DNS
# ============================================================
ax2 = axes[1]
ax2.set_xlim(0, 22)
ax2.set_ylim(0, 10)
ax2.axis('off')

ax2.text(11, 9.5, 'DNS — Domain Name System', fontsize=16, fontweight='bold',
         ha='center', color='#6A1B9A',
         bbox=dict(boxstyle='round,pad=0.4', facecolor='#F3E5F5', edgecolor='#6A1B9A', lw=2))
ax2.text(11, 8.9, 'Translates human-readable names to IP addresses (like a phone book for the network)',
         fontsize=10, ha='center', color='#666', style='italic')

# DNS Process
draw_box(ax2, 0.5, 6.0, 3.5, 1.2, '#EF9A9A', 'ACC Client PC', 'Wants to reach the server', fontsize=10)
draw_box(ax2, 9, 6.0, 4, 1.2, '#CE93D8', 'DNS Server', 'Has the name-to-IP mapping', fontsize=10)
draw_box(ax2, 17.5, 6.0, 4, 1.2, '#81C784', 'ACC Server', '10.10.10.100', fontsize=10)

# Step 1
ax2.annotate('', xy=(9, 7.0), xytext=(4, 7.0),
            arrowprops=dict(arrowstyle='->', color='#6A1B9A', lw=2))
ax2.text(6.5, 7.6, '1. "What is the IP of\nacc-server.company.local?"', fontsize=9,
         ha='center', color='#6A1B9A', fontweight='bold')

# Step 2
ax2.annotate('', xy=(4, 6.3), xytext=(9, 6.3),
            arrowprops=dict(arrowstyle='->', color='#2E7D32', lw=2))
ax2.text(6.5, 5.7, '2. "It\'s 10.10.10.100"', fontsize=9,
         ha='center', color='#2E7D32', fontweight='bold')

# Step 3
ax2.annotate('', xy=(17.5, 6.6), xytext=(4, 6.6),
            arrowprops=dict(arrowstyle='->', color='#E65100', lw=2, linestyle='dashed'))
ax2.text(11, 5.2, '3. Client connects directly to 10.10.10.100', fontsize=9,
         ha='center', color='#E65100', fontweight='bold')

# When DNS matters for CCTV
ax2.text(1, 4.2, 'WHEN DNS MATTERS IN AVIGILON:', fontsize=12, fontweight='bold', color='#6A1B9A')

matters = [
    ('Multi-Server ACC Setup', 'Servers find each other by hostname. If DNS fails, server-to-server communication breaks.'),
    ('ACC Web Client / Cloud', 'Browser needs to resolve the server hostname to connect remotely.'),
    ('Active Directory Integration', 'ACC uses AD for user login. AD requires working DNS.'),
    ('Firmware Updates', 'Cameras/servers may need to reach update.avigilon.com — requires DNS to resolve the URL.'),
]
for i, (title, desc) in enumerate(matters):
    y = 3.6 - i * 0.65
    ax2.text(1.5, y, f'{title}:', fontsize=10, fontweight='bold', color='#6A1B9A')
    ax2.text(8, y, desc, fontsize=9, color='#333')

# Common issue
issue_bg = FancyBboxPatch((1, 0.3), 20, 1.2, boxstyle="round,pad=0.15",
                            facecolor='#FFF3E0', edgecolor='#E65100', linewidth=2)
ax2.add_patch(issue_bg)
ax2.text(11, 1.2, 'COMMON SUPPORT SCENARIO', fontsize=11, fontweight='bold', ha='center', color='#E65100')
ax2.text(11, 0.7, '"ACC Client can\'t connect to server by hostname but CAN connect by IP address"  →  DNS issue! Check DNS settings on the client PC,',
         fontsize=9.5, ha='center', color='#333')
ax2.text(11, 0.4, 'or add the server hostname to C:\\Windows\\System32\\drivers\\etc\\hosts as a temporary fix.',
         fontsize=9.5, ha='center', color='#333')

plt.tight_layout(rect=[0, 0, 1, 0.96])
plt.savefig('/Users/akshit/Desktop/ai/DHCP_DNS_Explained.png', dpi=180, bbox_inches='tight',
            facecolor='#FAFAFA')
print('DHCP & DNS diagram saved.')
