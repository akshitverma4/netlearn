# NetLearn — Computer Networking Learning App

A self-contained static web app to learn and self-test computer networking concepts, built around
real Avigilon / CCTV support scenarios (Motorola Solutions). No build step — open `index.html` in a
browser. Progress is saved in the browser via `localStorage`.

## Features
- **Flash Cards** — flip cards with lightweight spaced repetition
- **Diagrams** — annotated learning from the rendered network diagrams
- **Games** — matching, sorting, and sequencing mini-games
- **Interactive Quizzes** — per-concept multiple choice with explanations
- **Knowledge Tests** — timed, mixed-concept exam mode with a scored report
- **Situation-Based Questions** — real support troubleshooting scenarios
- **Score on Level** — XP, levels, per-concept mastery, streaks, and badges

## Concepts covered (10)
CCTV Architecture · DHCP & DNS · Firewalls & Ports · Unicast vs Multicast · PoE · Storage & RAID ·
Subnetting · VLANs · VLAN Setup · Firewall Lab

## Project layout
```
index.html              # app shell (to be built)
css/styles.css          # styles (to be built)
js/                     # app logic + content model (to be built)
  data/concepts.js      # single content model that drives all features
assets/diagrams/        # rendered diagram PNGs (content source)
source-diagrams/        # original Python scripts the PNGs were generated from
```

The full implementation plan lives outside the repo (Claude Code plan file). `assets/diagrams/` and
`source-diagrams/` hold the source content the app's flashcards, quizzes, and scenarios are built
from.
