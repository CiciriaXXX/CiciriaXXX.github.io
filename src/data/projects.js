import renderingPractice from './renderingPractice.json';
import { sisterhoodPasture } from './sisterhoodPasture';
import { cycleOfDarkness } from './cycleOfDarkness';

// Project data is grouped by section so the home page and detail routes share one source.
export const projectSections = [
  {
    id: 'long-term',
    path: '/long-term',
    title: 'Long-Term Projects',
    projects: [sisterhoodPasture, cycleOfDarkness],
  },
  {
    id: 'game',
    path: '/games',
    title: 'Game Jam Projects',
    projects: [
      {
        id: 4,
        slug: 'textrix-veritatis',
        title: 'Textrix Veritatis',
        previewVideo: '/previews/textrix-veritatis.mp4?v=start239',
        category: 'Educational Puzzle Game',
        image: '/textrix-veritatis.png',
        description: 'Weave threads of logic into formal proofs in an alternate 1880s London. An educational puzzle game that turns propositional natural deduction into a hands-on craft.',
        details: 'Artist / Game Designer',
        tech: ['Godot', 'Clip Studio Paint'],
        completed: 'August 2026',
        jam: 'SheNicest 96h Game Jam',
        team: [
          { name: 'Shichun Xu', role: 'Art, game design', owner: true },
          { name: 'Yiyuan Li', role: 'Music, sound effects, technical support' },
        ],
        videoId: 'c8p_lA0UTy4',
        link: 'https://yiyuanli.itch.io/textrix-veritatis',
      },
      {
        id: 3,
        slug: 'clipping-mask',
        title: 'Clipping Mask',
        previewVideo: '/previews/clipping-mask.mp4?v=start75',
        category: 'Puzzle Platformer',
        image: '/clipping-mask.png',
        description: 'Switch between two layers through a clipping mask to uncover paths and dodge obstacles. Use collision quirks at the moment of switching to pull off otherwise impossible jumps.',
        details: 'Artist / Core Mechanics & Level Designer',
        tech: ['Unity', 'Aseprite'],
        completed: 'January 2026',
        jam: 'Global Game Jam 2026 — “Mask”',
        team: [
          { name: 'Shichun Xu', role: 'Art, core mechanics, all level design', owner: true },
          { name: 'Hongzhi Xia', role: 'Programming, additional mechanics design, music, sound effects' },
        ],
        videoId: 'Mv3JA6N7eDg',
        link: 'https://ceramicwitch.itch.io/clippingmask',
      },
      {
        id: 2,
        slug: 'escape-exe',
        title: 'Escape.exe',
        previewVideo: '/previews/escape-exe.mp4?v=start46',
        category: 'Click Point Adventure',
        image: '/EndRoom.png',
        description:
          'A traditional point-and-click escape room game infused with meta elements, offering players a surprising and unexpected experience.',
        details: 'Programmer / Gameplay & Interaction Designer / Technical Artist',
        tech: ['Unity'],
        completed: 'October 2025',
        jam: 'TapTap Spotlight Game Jam 2025 — “BUG?”',
        team: [
          { name: 'Shichun Xu', role: 'Programming, gameplay and interaction design, technical art', owner: true },
          { name: 'Yixin Dong', role: 'Art, story setting, narrative design' },
        ],
        videoId: 'gocr3YPA7HE',
        link: 'https://ceramicwitch.itch.io/escapeexe',
      },
      {
        id: 1,
        slug: 'time-loop-forest',
        title: 'Time Loop Forest',
        previewVideo: '/previews/time-loop-forest.mp4?v=midpoint',
        category: 'Puzzle',
        image: '/timeloopforest.png',
        description:
          'A mini-game combining card-flipping memory and path exploration, submitted for GMTK 2025.',
        details: 'Individual Project',
        tech: ['Unity'],
        completed: 'August 2025',
        jam: 'GMTK Game Jam 2025 — “LOOP”',
        solo: true,
        videoId: '4uXXVPfQtk8',
        link: 'https://ceramicwitch.itch.io/time-loop-forest',
      },
    ],
  },
  {
    id: 'tech-art',
    path: '/tech-art',
    title: 'Tech Art',
    projects: [
      {
        id: 2,
        slug: 'a-great-big-tree',
        title: 'A Great Big Tree',
        previewVideo: '/previews/a-great-big-tree.mp4',
        category: 'First-Person Narrative Exploration',
        image: '/a-great-big-tree/cover.png',
        description:
          'A first-person exploration game based on the paintings of my grandfather, Peng Rongxin, and my memories of him. Players enter the world of his paintings from an exhibition gallery, interacting with the world while listening to narration about his life.',
        details: 'Individual Project',
        tech: ['Unity'],
        completed: 'August–October 2026',
        jam: 'Tripothon S1',
        solo: true,
        videoId: 'WkL9iV9cpEk',
        link: 'https://ceramicwitch.itch.io/the-great-big-tree',
        breakdown: [
          { id: 'rendering', title: 'Rendering', text: 'Rendering breakdown coming soon.' },
          { id: 'design', title: 'Design', text: 'Design breakdown coming soon.' },
        ],
      },
      {
        id: 1,
        slug: 'rendering-practice',
        title: 'Rendering Studies',
        overviewLayout: 'metadata-description',
        hideBreakdownHeading: true,
        category: 'Shader & Rendering Studies',
        image: '/rendering-practice/cover.webp?v=user-stills',
        description:
          'A series of rendering studies to deepen my understanding of shaders after learning the fundamentals of computer graphics. I primarily used Amplify Shader Editor, while most reference tutorials used different tools, such as Unreal Engine, Unity HLSL, and Shader Graph, or provided explanations without complete code. I made technical adjustments to improve the robustness of the effects and better match my aesthetic preferences.',
        details: 'Individual Project',
        completed: 'March–June 2026',
        tech: ['Unity', 'Amplify Shader Editor'],
        breakdown: renderingPractice,
        link: null,
      },
    ],
  },
];

// Fast lookup table for detail routes such as /games/time-loop-forest.
export const projectsBySlug = projectSections
  .flatMap((section) => section.projects.map((project) => ({ ...project, sectionId: section.id, sectionPath: section.path })))
  .reduce((index, project) => ({ ...index, [project.slug]: project }), {});

// Section lookup table used by the home page renderer.
export const sectionsById = projectSections.reduce(
  (index, section) => ({ ...index, [section.id]: section }),
  {},
);
