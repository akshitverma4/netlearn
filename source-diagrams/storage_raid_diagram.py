import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

fig, ax = plt.subplots(figsize=(24, 20))
fig.patch.set_facecolor('#FAFAFA')
ax.set_xlim(0, 24)
ax.set_ylim(0, 20)
ax.axis('off')

ax.text(12, 19.5, 'Storage & RAID — How Video is Stored in CCTV Systems', fontsize=20,
        fontweight='bold', ha='center', color='#1a1a2e')
ax.text(12, 19.0, 'Understanding storage types, RAID levels, and retention calculations for Avigilon',
        fontsize=11, ha='center', color='#666', style='italic')

def draw_box(x, y, w, h, color, label, sublabel='', fontsize=10, edge='#333'):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1",
                          facecolor=color, edgecolor=edge, linewidth=1.5, alpha=0.85)
    ax.add_patch(box)
    if sublabel:
        ax.text(x + w/2, y + h/2 + 0.18, label,
                fontsize=fontsize, fontweight='bold', ha='center', va='center', color='#1a1a2e')
        ax.text(x + w/2, y + h/2 - 0.2, sublabel, fontsize=8, ha='center', va='center', color='#444')
    else:
        ax.text(x + w/2, y + h/2, label,
                fontsize=fontsize, fontweight='bold', ha='center', va='center', color='#1a1a2e')

def draw_disk(x, y, color, label, status='OK'):
    box = FancyBboxPatch((x, y), 1.2, 1.8, boxstyle="round,pad=0.08",
                          facecolor=color, edgecolor='#333', linewidth=1.5)
    ax.add_patch(box)
    ax.text(x + 0.6, y + 1.1, label, fontsize=8, fontweight='bold', ha='center', va='center')
    ax.text(x + 0.6, y + 0.5, status, fontsize=7, ha='center', va='center', color='#444')

# ============================================================
# SECTION 1: Storage Types
# ============================================================
ax.text(1, 18.2, '1. STORAGE TYPES IN CCTV', fontsize=14, fontweight='bold', color='#6A1B9A',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#F3E5F5', edgecolor='#6A1B9A', lw=2))

# DAS
das_bg = FancyBboxPatch((1, 15.8), 6.5, 2.0, boxstyle="round,pad=0.15",
                          facecolor='#E1F5FE', edgecolor='#0277BD', linewidth=2)
ax.add_patch(das_bg)
ax.text(4.25, 17.5, 'DAS — Direct Attached Storage', fontsize=11, fontweight='bold',
        ha='center', color='#0277BD')
ax.text(4.25, 17.0, 'Hard drives INSIDE the server', fontsize=9, ha='center', color='#333')
ax.text(4.25, 16.6, 'Simplest & cheapest option', fontsize=9, ha='center', color='#333')
ax.text(4.25, 16.2, 'Best for: Small sites (< 32 cameras)', fontsize=9, ha='center', color='#0277BD', fontweight='bold')

# NAS
nas_bg = FancyBboxPatch((8.5, 15.8), 6.5, 2.0, boxstyle="round,pad=0.15",
                          facecolor='#E8F5E9', edgecolor='#2E7D32', linewidth=2)
ax.add_patch(nas_bg)
ax.text(11.75, 17.5, 'NAS — Network Attached Storage', fontsize=11, fontweight='bold',
        ha='center', color='#2E7D32')
ax.text(11.75, 17.0, 'Separate storage box on the network', fontsize=9, ha='center', color='#333')
ax.text(11.75, 16.6, 'Shared via SMB/NFS protocols', fontsize=9, ha='center', color='#333')
ax.text(11.75, 16.2, 'Best for: Medium sites, shared storage', fontsize=9, ha='center', color='#2E7D32', fontweight='bold')

# SAN
san_bg = FancyBboxPatch((16, 15.8), 7, 2.0, boxstyle="round,pad=0.15",
                          facecolor='#FFF3E0', edgecolor='#E65100', linewidth=2)
ax.add_patch(san_bg)
ax.text(19.5, 17.5, 'SAN — Storage Area Network', fontsize=11, fontweight='bold',
        ha='center', color='#E65100')
ax.text(19.5, 17.0, 'High-speed dedicated storage network (iSCSI/FC)', fontsize=9, ha='center', color='#333')
ax.text(19.5, 16.6, 'Appears as local disk to the server', fontsize=9, ha='center', color='#333')
ax.text(19.5, 16.2, 'Best for: Enterprise / 100+ cameras', fontsize=9, ha='center', color='#E65100', fontweight='bold')

# ============================================================
# SECTION 2: RAID Levels
# ============================================================
ax.text(1, 15.0, '2. RAID LEVELS — Protecting Against Disk Failure', fontsize=14, fontweight='bold',
        color='#C62828',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#FFEBEE', edgecolor='#C62828', lw=2))

ax.text(1, 14.4, 'RAID = Redundant Array of Independent Disks — combines multiple drives for speed and/or safety',
        fontsize=10, color='#666', style='italic')

# RAID 0
r0_bg = FancyBboxPatch((0.5, 11.5), 5.5, 2.6, boxstyle="round,pad=0.1",
                         facecolor='#FFEBEE', edgecolor='#C62828', linewidth=2)
ax.add_patch(r0_bg)
ax.text(3.25, 13.9, 'RAID 0 — Striping', fontsize=11, fontweight='bold', ha='center', color='#C62828')
ax.text(3.25, 13.5, 'Data split across drives — FAST but NO protection', fontsize=8, ha='center', color='#333')
draw_disk(1, 11.7, '#EF9A9A', 'Disk 1', 'Data A')
draw_disk(2.5, 11.7, '#EF9A9A', 'Disk 2', 'Data B')
ax.text(4.3, 12.5, 'If 1 disk\nfails =\nALL DATA\nLOST', fontsize=8, fontweight='bold', color='#C62828')

# RAID 1
r1_bg = FancyBboxPatch((6.5, 11.5), 5.5, 2.6, boxstyle="round,pad=0.1",
                         facecolor='#FFF3E0', edgecolor='#E65100', linewidth=2)
ax.add_patch(r1_bg)
ax.text(9.25, 13.9, 'RAID 1 — Mirroring', fontsize=11, fontweight='bold', ha='center', color='#E65100')
ax.text(9.25, 13.5, 'Exact copy on 2 drives — safe but 50% capacity lost', fontsize=8, ha='center', color='#333')
draw_disk(7, 11.7, '#FFB74D', 'Disk 1', 'Data A')
draw_disk(8.5, 11.7, '#FFB74D', 'Disk 2', 'Data A\n(copy)')
ax.text(10.3, 12.5, '1 disk fails\n= No data\nloss!', fontsize=8, fontweight='bold', color='#2E7D32')

# RAID 5
r5_bg = FancyBboxPatch((12.5, 11.5), 5.5, 2.6, boxstyle="round,pad=0.1",
                         facecolor='#E8F5E9', edgecolor='#2E7D32', linewidth=2)
ax.add_patch(r5_bg)
ax.text(15.25, 13.9, 'RAID 5 — Striping + Parity', fontsize=11, fontweight='bold', ha='center', color='#2E7D32')
ax.text(15.25, 13.5, 'Data + parity spread across 3+ drives — MOST COMMON', fontsize=8, ha='center', color='#333')
draw_disk(12.8, 11.7, '#81C784', 'Disk 1', 'A + P')
draw_disk(14.1, 11.7, '#81C784', 'Disk 2', 'B + P')
draw_disk(15.4, 11.7, '#81C784', 'Disk 3', 'C + P')
ax.text(17, 12.5, '1 disk fails\n= Rebuild\nfrom parity', fontsize=8, fontweight='bold', color='#2E7D32')

# RAID 6
r6_bg = FancyBboxPatch((18.5, 11.5), 5, 2.6, boxstyle="round,pad=0.1",
                         facecolor='#E1F5FE', edgecolor='#0277BD', linewidth=2)
ax.add_patch(r6_bg)
ax.text(21, 13.9, 'RAID 6 — Double Parity', fontsize=11, fontweight='bold', ha='center', color='#0277BD')
ax.text(21, 13.5, '2 disks can fail — safest for large arrays', fontsize=8, ha='center', color='#333')
draw_disk(18.7, 11.7, '#4FC3F7', 'Disk 1', 'A+P1')
draw_disk(19.9, 11.7, '#4FC3F7', 'Disk 2', 'B+P2')
draw_disk(21.1, 11.7, '#4FC3F7', 'Disk 3', 'C+P1')
draw_disk(22.3, 11.7, '#4FC3F7', 'Disk 4', 'D+P2')

# RAID recommendation
rec_bg = FancyBboxPatch((1, 10.2), 22, 1.0, boxstyle="round,pad=0.1",
                          facecolor='#E8F5E9', edgecolor='#2E7D32', linewidth=2)
ax.add_patch(rec_bg)
ax.text(12, 10.9, 'RECOMMENDATION FOR CCTV:', fontsize=11, fontweight='bold', ha='center', color='#2E7D32')
ax.text(12, 10.45, 'RAID 5 (minimum) for recording drives  |  RAID 1 for OS drive  |  NEVER use RAID 0 for surveillance — one disk failure = all footage lost',
        fontsize=10, ha='center', color='#333')

# ============================================================
# SECTION 3: Storage Calculation
# ============================================================
ax.text(1, 9.2, '3. STORAGE CALCULATION — How Much Storage Do You Need?', fontsize=14, fontweight='bold',
        color='#0277BD',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#E1F5FE', edgecolor='#0277BD', lw=2))

# Formula
formula_bg = FancyBboxPatch((1, 7.0), 22, 1.8, boxstyle="round,pad=0.15",
                              facecolor='#263238', edgecolor='#455A64', linewidth=2)
ax.add_patch(formula_bg)
ax.text(12, 8.5, 'FORMULA:', fontsize=12, fontweight='bold', ha='center', color='#FFB74D', fontfamily='monospace')
ax.text(12, 8.0, 'Storage (GB) = Bitrate (Mbps) x 0.0432 x Hours/Day x Retention Days x Number of Cameras',
        fontsize=12, ha='center', color='#E0E0E0', fontfamily='monospace', fontweight='bold')
ax.text(12, 7.4, '0.0432 = conversion factor (Mbps to GB per hour:  Mbps x 3600 sec / 8 bits / 1024 MB)',
        fontsize=9, ha='center', color='#90CAF9', fontfamily='monospace')

# Example calculation
ax.text(1, 6.4, 'EXAMPLE:', fontsize=12, fontweight='bold', color='#0277BD')

example_bg = FancyBboxPatch((1, 3.5), 10.5, 2.7, boxstyle="round,pad=0.15",
                              facecolor='#E1F5FE', edgecolor='#0277BD', linewidth=2)
ax.add_patch(example_bg)
ax.text(6.25, 5.9, 'Scenario: Small Office', fontsize=11, fontweight='bold', ha='center', color='#0277BD')
lines = [
    '16 cameras  @  1080p  @  15fps  =  ~5 Mbps each',
    'Recording 24 hours/day',
    'Retention: 30 days',
    '',
    '5 Mbps x 0.0432 x 24 hrs x 30 days x 16 cams',
    '= 5 x 0.0432 x 24 x 30 x 16',
    '= 24,883 GB  ≈  25 TB needed',
]
for i, line in enumerate(lines):
    weight = 'bold' if i >= 4 else 'normal'
    color = '#C62828' if i >= 5 else '#333'
    ax.text(1.5, 5.4 - i * 0.3, line, fontsize=9, color=color, fontweight=weight, fontfamily='monospace')

# Quick reference
ref_bg = FancyBboxPatch((12.5, 3.5), 10.5, 2.7, boxstyle="round,pad=0.15",
                          facecolor='#FFF3E0', edgecolor='#E65100', linewidth=2)
ax.add_patch(ref_bg)
ax.text(17.75, 5.9, 'Quick Reference — Storage per Camera per Day', fontsize=11, fontweight='bold',
        ha='center', color='#E65100')

ref_headers = ['Resolution', 'Bitrate', 'GB / Day']
ref_x = [13, 16, 19.5]
ref_w = [2.5, 3, 3]
for i, h in enumerate(ref_headers):
    draw_box(ref_x[i], 5.0, ref_w[i], 0.5, '#FFE0B2', h, fontsize=9)

ref_rows = [
    ['720p @ 15fps', '~3 Mbps', '~31 GB'],
    ['1080p @ 15fps', '~5 Mbps', '~52 GB'],
    ['1080p @ 30fps', '~8 Mbps', '~83 GB'],
    ['4K @ 30fps', '~20 Mbps', '~207 GB'],
]
for r, row in enumerate(ref_rows):
    ry = 4.4 - r * 0.5
    rc = ['#FFF3E0', '#FFE0B2'] [r % 2]
    for c, val in enumerate(row):
        draw_box(ref_x[c], ry, ref_w[c], 0.4, rc, val, fontsize=8)

# ============================================================
# SECTION 4: Common Storage Issues
# ============================================================
ax.text(1, 2.8, '4. COMMON STORAGE ISSUES ON SUPPORT CALLS', fontsize=14, fontweight='bold',
        color='#AD1457',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#FCE4EC', edgecolor='#AD1457', lw=2))

issues = [
    ('"Recording stops unexpectedly"', 'Disk full — retention set too high for available storage, or a disk failed in the RAID'),
    ('"Playback is slow/choppy"', 'Disk I/O bottleneck — too many cameras writing to the same disk, or drive failing (check SMART status)'),
    ('"Lost 3 days of footage"', 'RAID rebuild failed after disk replacement. ALWAYS monitor RAID health and replace failed disks ASAP'),
    ('"Storage fills up faster than expected"', 'Camera bitrate higher than estimated — check if quality/resolution was changed, or motion-heavy scenes'),
]
for i, (issue, fix) in enumerate(issues):
    y = 2.1 - i * 0.55
    ax.text(1.3, y, issue, fontsize=9, fontweight='bold', color='#AD1457')
    ax.text(8, y, f'→  {fix}', fontsize=8.5, color='#333')

plt.tight_layout()
plt.savefig('/Users/akshit/Desktop/ai/Storage_RAID_Explained.png', dpi=180, bbox_inches='tight',
            facecolor='#FAFAFA')
print('Storage & RAID diagram saved.')
