const responsibilities = (...items) => [{ type: 'list', items }];

// Contribution scope comes from the author's recollections, March 2024–March 2025.
// Public project identity and artwork: Steam app 3297080, checked October 2026.
// Keep internal documents, implementation specifics, and unverified outcomes private.
export const sisterhoodPasture = {
  id: 1,
  slug: 'the-sisterhood-pasture',
  title: 'The Sisterhood Pasture: Cozy Folklore Farming',
  category: 'Studio Project / Pixel-Art Life Simulation',
  image: '/the-sisterhood-pasture/cover.jpg',
  overviewImage: '/the-sisterhood-pasture/store-screenshot.jpg',
  overviewImageAlt: 'Official Steam screenshot showing farming and the pixel-art interface in The Sisterhood Pasture.',
  previewDescription: 'A life simulation and management adventure inspired by the cultures and folklore of Southwestern China. During a year at Kimmie Studio, I worked across game design, pixel art, UI/UX, and content implementation in a team of around ten people.',
  description: 'Developed by Kimmie Studio with investment from Hypergryph and published by Gamirror Games, The Sisterhood Pasture is a pixel-art life simulation, management, and adventure game rooted in the cultures and folklore of ethnic communities in Southwestern China. I contributed to this project as a full-time employee of Kimmie Studio.',
  details: 'Game Designer / Artist',
  completed: 'March 2024–March 2025',
  tech: ['Unity'],
  toolsLabel: 'Engine',
  metadata: [
    { label: 'Studio', value: 'Kimmie Studio' },
    { label: 'Publisher', value: 'Gamirror Games' },
    { label: 'Team', value: 'Approximately 10 people; team size varied during my involvement.' },
  ],
  link: 'https://store.steampowered.com/app/3297080/?l=english',
  linkLabel: 'View on Steam',
  mediaCredit: 'Official promotional image from the Steam store. Artwork and game footage represent the work of the wider development team.',
  disclosure: 'This retrospective covers my contributions during March 2024–March 2025. Under my confidentiality agreement, I can describe my responsibilities at a high level, but cannot share internal assets, design documents, configuration tables, or detailed implementation breakdowns. Public store imagery may reflect a later version of the game.',
  breakdownTitle: 'My Responsibilities',
  breakdown: [
    {
      id: "outfit-system",
      title: "Outfit System & Sprite Pipeline",
      blocks: responsibilities(
        "**Outfit functionality and interaction design:** Designed how players access outfit changes, use the dressing interface, and unlock clothing. Designed configuration tables covering clothing IDs, equipment slots, unlock conditions, and sprite references, in collaboration with programmers.",
        "**Clothing-to-character animation interface:** Mapped clothing resources to character actions, facing directions, and frame sequences. Collaborated with artists and programmers on sprite decomposition, shared canvas dimensions and alignment points, matching body and clothing frame counts, and direction-dependent layer order.",
        "**Resource integration and configuration:** Populated and maintained the tables I designed, covering outfit functionality and the associated clothing animation resources. Handled all related content configuration through later production.",
      ),
    },
    {
      id: "narrative",
      title: "Quest & NPC Implementation",
      blocks: responsibilities(
        "**Two chapters of main and side quests:** Converted the lead writer’s narrative into executable quest steps and dialogue tables. Configured prerequisites, trigger and completion conditions, dialogue references, and next-step links in the existing quest system. Placed scene triggers and assembled Timeline sequences in Unity, checking progression order, repeated triggers, and the timing of dialogue and story events.",
        "**Conditional NPC schedules and dialogue:** Designed and configured activities and ambient conversations for selected NPCs. Used weather, festival, and weekday conditions to determine routines, with movement routes and activity points placed in Unity.",
      ),
    },
    {
      id: "gameplay",
      title: "Gameplay Design & Feature Delivery",
      blocks: responsibilities(
        "**Four cooking minigames, from design to acceptance:** Specified player inputs, timing and progression rules, and success and failure conditions. Created all art assets and the animation and VFX cues for gameplay states, then checked the programmed versions against these requirements.",
        "**Player combat skills:** Designed player skills, prepared their art requirements, and reviewed the delivered assets against those specifications.",
        "**Content planning and design coordination:** Planned fish and clothing resources with quantities, priorities, and per-asset requirements. For feature proposals, researched comparable games, prepared programming and art specifications, and reviewed the design with the lead designer and relevant developers.",
      ),
    },
    {
      id: "art-pipeline",
      title: "UI/UX, Art & Production Tools",
      blocks: responsibilities(
        "**Interface production and acceptance:** Handled UX improvements, UI artwork, interface animation, and functional acceptance checks across most interfaces. Checked selected, unavailable, and locked states, confirmation and cancellation flows, and consistency between visual feedback and the underlying operation.",
        "**Illustration and environment assets:** Produced selected character and promotional illustrations, props, icons, wallpaper, flooring, and furniture under the lead artist’s style guidelines. Assisted in defining Rule Tile specifications for ground and decoration assets.",
        "**Clothing recoloring tool:** Developed a plugin that replaces designated palette entries while preserving transparency and the sprite’s light-to-dark relationships. Used it to produce clothing color variants.",
        "**Pixel-animation R&D:** Investigated the use of Spine for 2D pixel-art animation.",
      ),
    },
    {
      id: "production-support",
      title: "Research & Production Support",
      blocks: responsibilities(
        "**Investor-facing research and presentations:** Collected and organized competitor data and contributed to sales forecasting. Helped write the business pitch and handled its layout and visual design.",
        "**Platform submissions and communication:** Prepared materials for programs including ID@Xbox and handled English-language correspondence with platform representatives.",
        "**Exhibition support:** Represented the project at in-person events, handling booth setup, player reception, and feedback collection.",
      ),
    },
  ],
};
