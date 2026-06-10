// Project data is grouped by section so the home page and detail routes share one source.
export const projectSections = [
  {
    id: 'game',
    path: '/games',
    title: 'Game Projects',
    projects: [
      {
        id: 1,
        slug: 'time-loop-forest',
        title: 'Time Loop Forest',
        category: 'Puzzle',
        image: '/timeloopforest.png',
        description:
          'A mini-game combining card-flipping memory and path exploration, submitted for GMTK 2025.',
        details: 'Individual Project',
        tech: ['Unity', 'C#', 'Aseprite'],
        link: 'https://ceramicwitch.itch.io/time-loop-forest',
      },
      {
        id: 2,
        slug: 'escape-exe',
        title: 'Escape.exe',
        category: 'Click Point Adventure',
        image: '/EndRoom.png',
        description:
          'A traditional point-and-click escape room game infused with meta elements, offering players a surprising and unexpected experience.',
        details: 'Producer/Programmer/Gameplay Designer/Technical Artist',
        tech: ['Unity', 'C#', 'Shader'],
        link: 'https://www.taptap.cn/app/781649?os=pc',
      },
    ],
  },
  {
    id: 'tech-art',
    path: '/tech-art',
    title: 'Tech Art',
    projects: [
      {
        id: 1,
        slug: 'silhouette-shader',
        title: 'Silhouette Shader',
        category: 'Shader',
        image: '/silh.png',
        description:
          'Automatically generates 3D model contours and occlusions. Users can choose whether to display the model surfaces, laying the foundation for flat rendering or ghost effects.',
        details: 'Coursework',
        tech: ['OpenGL', 'GLSL', 'C++'],
        link: null,
      },
      {
        id: 2,
        slug: 'rendering-toolkit',
        title: 'Rendering Toolkit',
        category: 'Placeholder',
        image: '/silh.png',
        description:
          'A placeholder slot for future tools, shaders, editor utilities, and rendering notes.',
        details: 'Placeholder Project',
        tech: ['Unity', 'Shader Graph', 'Tooling'],
        link: null,
      },
    ],
  },
];

// Fast lookup table for detail routes such as /games/time-loop-forest.
export const projectsBySlug = projectSections
  .flatMap((section) => section.projects.map((project) => ({ ...project, sectionId: section.id })))
  .reduce((index, project) => ({ ...index, [project.slug]: project }), {});

// Section lookup table used by the home page renderer.
export const sectionsById = projectSections.reduce(
  (index, section) => ({ ...index, [section.id]: section }),
  {},
);
