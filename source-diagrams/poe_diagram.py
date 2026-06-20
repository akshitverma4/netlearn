import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

fig, ax = plt.subplots(figsize=(22, 15))
fig.patch.set_facecolor('#FAFAFA')
ax.set_xlim(0, 22)
ax.set_ylim(0, 15)
ax.axis('off')

ax.text(11, 14.5, 'PoE (Power over Ethernet) Explained', fontsize=20, fontweight='bold',
        ha='center', color='#1a1a2e')
ax.text(11, 14.0, 'How cameras get power through the same cable that carries data',
        fontsize=11, ha='center', color='#666', style='italic')

def draw_box(x, y, w, h, color, label, sublabel='', fontsize=10, edge='#333'):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1",
                          facecolor=color, edgecolor=edge, linewidth=1.5, alpha=0.85)
    ax.add_patch(box)
    ax.text(x + w/2, y + h/2 + (0.15 if sublabel else 0), label,
            fontsize=fontsize, fontweight='bold', ha='center', va='center', color='#1a1a2e')
    if sublabel:
        ax.text(x + w/2, y + h/2 - 0.2, sublabel, fontsize=8, ha='center', va='center', color='#444')

# ============================================================
# SECTION 1: How PoE Works
# ============================================================
ax.text(1, 13.0, '1. HOW PoE WORKS', fontsize=13, fontweight='bold', color='#0277BD',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#E1F5FE', edgecolor='#0277BD'))

# PoE Switch
draw_box(1, 11.2, 4, 1.2, '#FFB74D', 'PoE Switch', 'Power Sourcing Equipment (PSE)', fontsize=12)

# Ethernet Cable
cable_bg = FancyBboxPatch((5.5, 11.3), 5.5, 1.0, boxstyle="round,pad=0.1",
                            facecolor='#FFF9C4', edgecolor='#F57F17', linewidth=2)
ax.add_patch(cable_bg)
ax.text(8.25, 12.0, 'Single Ethernet Cable (Cat5e/Cat6)', fontsize=10, fontweight='bold',
        ha='center', color='#F57F17')
ax.text(8.25, 11.55, 'Carries BOTH Data + Power  |  Max 100 meters', fontsize=9,
        ha='center', color='#F57F17')

# Arrows
ax.annotate('', xy=(5.5, 11.8), xytext=(5.0, 11.8),
            arrowprops=dict(arrowstyle='->', color='#F57F17', lw=2.5))
ax.annotate('', xy=(11.5, 11.8), xytext=(11.0, 11.8),
            arrowprops=dict(arrowstyle='->', color='#F57F17', lw=2.5))

# Camera
draw_box(11.5, 11.2, 4, 1.2, '#4FC3F7', 'IP Camera', 'Powered Device (PD)', fontsize=12)

# What goes through the cable
ax.text(7, 10.6, 'Data (video stream)', fontsize=9, ha='center', color='#0277BD',
        fontweight='bold')
ax.text(9.5, 10.6, '+', fontsize=12, ha='center', color='#333', fontweight='bold')
ax.text(12, 10.6, 'Power (DC voltage)', fontsize=9, ha='center', color='#C62828',
        fontweight='bold')

# No separate power cable needed
ax.text(17.5, 11.8, 'No separate\npower outlet needed\nat camera location!', fontsize=10,
        ha='center', color='#2E7D32', fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.4', facecolor='#E8F5E9', edgecolor='#2E7D32'))

# ============================================================
# SECTION 2: PoE Standards Comparison
# ============================================================
ax.text(1, 9.6, '2. PoE STANDARDS — WHICH ONE DO YOU NEED?', fontsize=13, fontweight='bold', color='#E65100',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#FFF3E0', edgecolor='#E65100'))

# Table
headers = ['Standard', 'IEEE', 'Max Power', 'At Device', 'Camera Type']
col_x = [1, 4.2, 7.8, 11, 14.5]
col_w = [2.8, 3.2, 2.8, 3.1, 5.5]
for i, h in enumerate(headers):
    draw_box(col_x[i], 8.7, col_w[i], 0.6, '#FFE0B2', h, fontsize=9)

rows = [
    ['PoE', '802.3af', '15.4W', '12.95W', 'Fixed dome, bullet (basic)'],
    ['PoE+', '802.3at', '30W', '25.5W', 'PTZ, IR cameras, multi-sensor'],
    ['PoE++', '802.3bt Type 3', '60W', '51W', 'PTZ with heater, speed domes'],
    ['PoE++', '802.3bt Type 4', '100W', '71W', 'Large PTZ + heater + wiper'],
]
colors_row = ['#FFF3E0', '#FFE0B2', '#FFF3E0', '#FFE0B2']
for r, row in enumerate(rows):
    ry = 8.0 - r * 0.65
    for c, val in enumerate(row):
        draw_box(col_x[c], ry, col_w[c], 0.55, colors_row[r], val, fontsize=9)

# ============================================================
# SECTION 3: PoE Budget
# ============================================================
ax.text(1, 5.5, '3. PoE BUDGET — THE #1 ISSUE ON SUPPORT CALLS', fontsize=13, fontweight='bold',
        color='#C62828',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#FFEBEE', edgecolor='#C62828'))

# Switch with budget
draw_box(1, 3.5, 5, 1.5, '#FFB74D', '24-Port PoE+ Switch', 'Total PoE Budget: 370W', fontsize=12)

# Cameras consuming power
cam_data = [
    (7.5, 4.5, 'Cam 1\n15W', '#4FC3F7'),
    (9.5, 4.5, 'Cam 2\n15W', '#4FC3F7'),
    (11.5, 4.5, 'Cam 3\n15W', '#4FC3F7'),
    (13.5, 4.5, 'Cam 4\n15W', '#4FC3F7'),
    (7.5, 3.5, 'Cam 5\n15W', '#4FC3F7'),
    (9.5, 3.5, 'Cam 6\n15W', '#4FC3F7'),
    (11.5, 3.5, 'PTZ\n30W', '#81C784'),
    (13.5, 3.5, 'PTZ\n30W', '#81C784'),
]
for x, y, label, color in cam_data:
    draw_box(x, y, 1.6, 0.8, color, label, fontsize=8)

# Arrows
for x, y, _, _ in cam_data:
    ax.annotate('', xy=(6.0, 4.25), xytext=(x, y + 0.4),
                arrowprops=dict(arrowstyle='<-', color='#999', lw=1))

# Power calculation
calc_bg = FancyBboxPatch((16, 3.2), 5.5, 2.2, boxstyle="round,pad=0.15",
                           facecolor='#FFF9C4', edgecolor='#F57F17', linewidth=2)
ax.add_patch(calc_bg)
ax.text(18.75, 5.1, 'POWER CALCULATION', fontsize=10, fontweight='bold', ha='center', color='#F57F17')
ax.text(18.75, 4.6, '6 Fixed cams x 15W  =   90W', fontsize=9, ha='center', fontfamily='monospace')
ax.text(18.75, 4.2, '2 PTZ cams   x 30W  =   60W', fontsize=9, ha='center', fontfamily='monospace')
ax.text(18.75, 3.8, '─────────────────────────', fontsize=9, ha='center', fontfamily='monospace')
ax.text(18.75, 3.5, 'Total Used: 150W / 370W Budget', fontsize=10, ha='center',
        fontweight='bold', color='#2E7D32', fontfamily='monospace')

# ============================================================
# SECTION 4: Common PoE Issues
# ============================================================
ax.text(1, 2.5, '4. COMMON PoE ISSUES YOU\'LL TROUBLESHOOT', fontsize=13, fontweight='bold',
        color='#6A1B9A',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#F3E5F5', edgecolor='#6A1B9A'))

issues = [
    ('Camera reboots randomly', 'PoE budget exceeded — switch can\'t power all devices. Check total wattage.'),
    ('Camera won\'t power on', 'Switch port doesn\'t support required PoE standard (e.g., PTZ needs PoE+ but port is PoE only).'),
    ('Intermittent disconnects', 'Cable run > 100m causes voltage drop. Use PoE extender or move switch closer.'),
    ('Camera boots then drops', 'Camera draws more power during boot (inrush current). Check if switch supports it.'),
]
for i, (issue, fix) in enumerate(issues):
    y = 1.9 - i * 0.5
    ax.text(1.3, y, f'{issue}:', fontsize=9, fontweight='bold', color='#6A1B9A')
    ax.text(7.5, y, fix, fontsize=9, color='#444')

plt.tight_layout()
plt.savefig('/Users/akshit/Desktop/ai/PoE_Explained.png', dpi=200, bbox_inches='tight',
            facecolor='#FAFAFA')
print('PoE diagram saved.')
