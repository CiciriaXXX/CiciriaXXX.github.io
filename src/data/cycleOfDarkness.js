import sourceCode from './cycleOfDarknessCode.json';
const p = (text) => ({ type: 'paragraph', text });
const h = (text) => ({ type: 'heading', text });
const diagrams = (...items) => ({ type: 'annotated-diagrams', items });
const diagram = (id, title, caption) => ({ id, title, caption });
const point = (x, y, text) => ({ x, y, text });
const room = (number, points, text) => ({ number, points, text });

// Local review draft: manuscript v5 + asset plan v4, with the author's newer
// confirmation that all six supplied icons are her work. No legacy preview assets.
export const cycleOfDarkness = {
  id: 2,
  slug: 'cycle-of-darkness',
  title: "Cycle of Darkness",
  lang: "en",
  category: "Top-Down Pixel Art Action Roguelike",
  image: '/cycle-of-darkness/walkthrough-poster.jpg',
  previewVideo: '/previews/cycle-of-darkness.mp4',
  walkthroughVideo: '/cycle-of-darkness/walkthrough.mp4',
  walkthroughPoster: '/cycle-of-darkness/walkthrough-poster.jpg',
  description: "Cycle of Darkness is a team-developed, top-down pixel art action roguelike. We completed a playable MVP covering one chapter. After playtesting and a project retrospective, we decided not to continue development.",
  details: 'GAME DESIGNER / PROGRAMMER / ARTIST',
  completed: "April–July 2025 (my involvement)",
  tech: ['Unity', 'PlayMaker', "Team-built skill editor", 'Aseprite'],
  toolsLabel: "Tools",
  breakdownTitle: "Breakdown",
  breakdown: [
    {
      id: 'contribution', title: "Project & Contributions", lang: "en", blocks: [
        p("I took the Elite Fishman and Giant Fishman from animation sketches through pixel animation, AI, and combat integration. I also built most enemy AI state machines, wrote some code outside the editors, designed and assembled every level, and wrote environmental interaction code. The team's programmer provided the editors and underlying APIs; the team's artist supplied the environment assets."),
      ],
    },
    {
      id: 'animation', title: "Game Art · Enemy Animation", lang: "en", blocks: [
        { type: 'animation-gallery' },
        h("From Rough Forms to Finished Motion"),
        p("I first blocked out the head, torso, limbs, and weapon to check weight shifts, attack direction, and silhouette. Once the character design was settled, I added pixel detail, corrected joints and overlaps, and filled in transitions between poses."),
        p("Drawing on animation tutorials, I adjusted the spacing between poses to strengthen slow-in and slow-out, contrasting the pace of wind-up, attack, and recovery. Fins and other details keep moving slightly as the main body comes to rest, carrying the motion through."),
        p("Animation references (AlanBeckerTutorials): [Slow In & Slow Out](https://www.youtube.com/watch?v=fQBFsTqbKhY) · [Follow Through & Overlapping Action](https://www.youtube.com/watch?v=4OxphYV8W3E)."),
        { type: 'animation-comparisons' },
      ],
    },
    {
      id: 'icons', title: "Game Art · Item Icons", lang: "en", blocks: [
        p("I drew these six ice-themed equipment icons, using color and contours to suggest different materials, and silhouettes and structural details to distinguish each item."),
        { type: 'pixel-icons' },
      ],
    },
    {
      id: 'combat', title: "Combat Integration", lang: "en", blocks: [
        p("Beyond the two elite enemies, I planned the other enemies' forms and combat roles around level needs. I discussed the designs with the team's artist and programmer, then prepared the art requirements. Once the animations were ready, I integrated their combat behavior by configuring state machines, combining existing state actions with custom logic I wrote, and configuring the skills triggered by attack states."),
        h("State Conditions & Recovery Timing"),
        p("I built behavior state machines in PlayMaker to control when enemies approach, attack, or retreat. The configurations below use the Elite Fishman, Giant Fishman, and Jellyfish as examples."),
        diagrams(
          diagram('elite-fsm', "Elite Fishman State Machine", "Distance checks, walking and running pursuit, horizontal slashes and leaping slashes, and randomized rest after attacks."),
          diagram('giant-fsm', "Giant Fishman State Machine", "Distance checks and pursuit connect three attacks, with recovery built into the attack chain."),
          diagram('jellyfish-fsm', "Jellyfish State Machine", "Attack and retreat states for a ranged enemy."),
        ),
        h("Custom State Action: Flee"),
        p("I wrote `FleeFsmAction` for the retreat behavior of jellyfish, bladefish, and slimes, using the role-state base class, coordinate, direction-selection, movement, and stat APIs supplied by the team's programmer."),
        { type: 'code', caption: "FleeFsmAction · Complete Class with Comments", code: sourceCode.flee },
        diagrams(
          diagram('flee-config', "Flee Configuration", "Retreat distance, arrival threshold, and timeout settings."),
        ),
        h("Skill Timelines: Animation, Movement & Damage"),
        p("Using the team's skill editor, I coordinated animation, movement, stat changes, and damage events on skill timelines, refining their timing through repeated testing. The examples below show the Elite Fishman's leaping slash and the Giant Fishman's first punch."),
        diagrams(
          diagram('elite-vertical', "Elite Fishman · Leaping Slash", "Upward and downward movement align with the wind-up and attack animations. Damage is checked during the downward strike."),
          diagram('giant-attack-1', "Giant Fishman · First Punch", "The wind-up leads into the punch, with forward movement and damage checks timed to the strike."),
        ),
      ],
    },
    {
      id: 'rooms', title: "Room Design", lang: "en", blocks: [
        p("All 12 rooms below are combat rooms, with no event rooms or shops; their combat design is independent of reward type. I built playable prototypes in Unity using functional blockout prefabs for interactables and existing enemies."),
        p("After team reviews of the prototypes, I arranged environmental props, lighting, and visual hierarchy, then added the interactable art as it became available."),
        p("The team's programmer handled room selection, connections, and the runtime framework."),
        h("Design Notes for Twelve Rooms"),
        p("I wanted repeat runs to reward more than combat skill: familiarity with layouts and interactables could help players find faster or safer approaches. These examples show design intentions and experiments. Their effectiveness still depended on tuning layouts, enemies, and buffs together, which remained unfinished when development ended."),
        p("Orange enemy markers indicate the second wave; blue markers indicate the third. These colors only identify waves. Numbered markers correspond to the notes below, not a verified optimal route."),
        { type: 'room-gallery', items: [
          room(1, [
            point(74, 61, "Circle to the lower right and detonate the bomb flower to hit the three ranged enemies behind the fence. Nearby minor enemies may also be drawn in."),
            point(75, 41, "Then move upward to take the attack crystal buff before fighting the elite enemy."),
            point(33, 48, "When the second wave appears, move to the upper left and prioritize the new ranged enemies."),
          ]),
          room(2, [
            point(52, 43, "Break the central fence during the first wave to open a passage between the two sides."),
            point(39, 56, "In the second wave, use that passage to lure an exploding enemy toward the enemies on the left."),
          ]),
          room(3, [
            point(43, 26, "An attack buff crystal sits beside the bomb flower. Players face a trade-off: prioritizing the nearby jellyfish in wave two inevitably uses up the buff in that wave, leaving it unavailable against the elite enemies in wave three."),
          ]),
          room(4, [
            point(51, 47, "Breaking a box spawns a regular or elite enemy in its place. The room clears once the enemies spawned by four boxes have all been defeated. On repeat visits, players can remember which boxes spawn elite enemies and avoid them."),
          ]),
          room(5, [
            point(34, 38, "Leave the crystal intact during wave one, saving its buff for the elite enemy."),
            point(68, 60, "In wave two, circle to the right of the fence and deal with the ranged enemies first."),
            point(58, 62, "Keep the fence intact to separate the elite from minor enemies. Clear the minor enemies, then step out, take the crystal buff, and fight the elite."),
          ]),
          room(6, [
            point(52, 56, "Avoid unnecessary damage to the fence in wave one."),
            point(79, 60, "Use the remaining barrier in wave two to separate minor enemies from the elite."),
          ]),
          room(7, [
            point(49, 43, "Save the buff crystals for the elite enemies in waves two and three."),
            point(22, 34, "Moving toward the upper left keeps you outside the second wave's ranged attacks, so those enemies do not need to be defeated immediately."),
          ]),
          room(8, [
            point(27, 42, "After wave one, move around the ends of the fence and prioritize the ranged enemies on the outside."),
            point(51, 55, "Staying in the center can expose you to ranged enemies on both sides and the elite at once."),
          ]),
          room(9, [
            point(28, 81, "A buff crystal is hidden in the lower-left area. The prefab image does not show the entrance lighting; in the actual scene, I used light at the entrance as a subtle guide. Players can also lure exploding enemies away from the main fight and detonate them more safely at this entrance, outside the jellyfish's lightning range."),
          ]),
          room(10, [
            point(33, 53, "The fast elite and minor enemies in wave one can be lured into the area on the right."),
            point(73, 32, "Use the bomb flower against that group, or save it for the slower enemies in wave two."),
          ]),
          room(11, [
            point(53, 69, "Avoid detonating exploding enemies near the central fence. If it breaks, the enemies inside may spill out and surround the player."),
            point(39, 24, "A hidden area above the main fight holds another buff crystal for players who explore. The prefab image does not show the entrance lighting; in the actual scene, I used light at the entrance as a subtle guide."),
          ]),
          room(12, [], "This room uses a long, narrow layout to add variety to the room shapes. With suitable positioning, players can use exploding enemies to defeat ranged enemies."),
        ] },
        p("The repetition in scene assembly led me to consider using procedural content generation (PCG) to automate part of the process, but this idea was neither implemented nor evaluated before the project ended."),
      ],
    },
    {
      id: 'interactions', title: "Interactable Objects", lang: "en", blocks: [
        { type: 'interaction-animations' },
        p("Attack buff crystals increase attack power, while attack-speed buff crystals increase attack speed. Both effects end after the holder defeats a specified number of hostile monsters. Shield crystals grant a shield based on the player's maximum health. Bomb flowers deal area damage when their destruction animation ends. Boxes spawn a specified enemy when broken; their looping animations start at random offsets so multiple instances do not play in sync."),
        p("The attack buff crystal provides an example of the interaction logic."),
        { type: 'code', caption: "KillCountModule.cs · Buff Lifetime", code: sourceCode.attackCrystal },
      ],
    },
    {
      id: 'reflection', title: "Outcome & Reflection", lang: "en", blocks: [
        p("The single-chapter MVP connected enemies, skills, rooms, and rewards, and was shared with external playtesters. The team stopped development after testing and reviewing the project."),
        h("Why Development Stopped"),
        p("Action roguelikes face a crowded market where distinctiveness matters. Our mechanics offered limited novelty, and creative decisions were spread across the team. Repeated compromises between different opinions left the setting and art direction without a clear identity. We concluded that adding more enemies and chapters would still struggle to give the game a convincing competitive edge."),
        {
          type: 'release-chart',
          context: "Market context · added after development ended",
          title: "Steam Releases Tagged Action Roguelike",
          series: [
            { year: 2021, count: 354 },
            { year: 2022, count: 529 },
            { year: 2023, count: 897 },
            { year: 2024, count: 1268 },
            { year: 2025, count: 1424 },
          ],
          source: 'https://steamdb.info/stats/releases/?tagid=42804',
          accessed: '2026-10-20',
          note: "SteamDB counts releases under the Action Roguelike tag, which spans several styles of gameplay and may overlap with other tags or change over time. These figures show growth in supply, not demand, sales, or profitability, and are not limited to pixel art melee games.",
        },
        p("Frame-by-frame pixel animation also cost more time than expected. Melee wind-ups, strikes, hits and reactions, recovery, and movement need readable motion and smooth transitions. Each new enemy or move added drawing and integration work. Art suited to separate parts can reuse bones and interpolation through tools such as [Spine](https://esotericsoftware.com/spine-in-depth), and pixel art can use these methods too. We tried tools including PixelOver, but the results fell short of our expectations."),
      ],
    },
  ],
};
