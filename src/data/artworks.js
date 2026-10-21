// Collections follow the supplied 2D art notes; each opens a looping gallery.
const image = (slug, title, year, description, extension = 'jpg') => ({
  src: `/artworks/${slug}.${extension}`,
  thumbnail: `/artworks/thumbs/${slug}.jpg`,
  title, year, description,
});

export const artworks = [
  {
    id: 'betrayal', title: 'Betrayal', year: '2026',
    description: 'An Elden Ring fan illustration symbolizing the protagonist’s relationship with White Mask Varré, from trust and dependence to betrayal.\n\nIn earlier work, I often began painting as soon as I had a rough idea of the scene. For this piece, I first made deliberate decisions about composition, the arrangement of points, lines, and shapes, and the color palette before developing the details. Throughout the process, I adjusted value contrast, warm and cool colors, and saturated and muted tones to strengthen the focal point and create visual tension.',
    images: [
      image('betrayal-final', 'Betrayal — Final Illustration', null, null, 'png'),
      image('betrayal-values', 'Betrayal — Value Study', null, null, 'png'),
      image('betrayal-color', 'Betrayal — Color Development', null, null, 'png'),
      image('betrayal-refinement', 'Betrayal — Refinement', null, null, 'png'),
    ],
    cover: '/artworks/thumbs/betrayal-final.jpg',
  },
  {
    id: 'character-illustration', title: 'Character Illustration',
    images: [
      image('rest', 'Rest', '2025', 'An Elden Ring fan illustration of an Astrologer resting near a Site of Grace at night.', 'png'),
      image('commission-sheet', 'Commissioned Character Sheet', '2025', 'A commissioned collage illustration featuring the client’s characters in scenes from everyday life.', 'png'),
      image('spotlight', 'Spotlight Study', '2025', 'A painting exercise exploring the effect of a spotlight on a character.', 'png'),
      image('red-haired-character', 'Character Commission', '2024', 'A character illustration commissioned to convey a mysterious, reserved mood. I used dramatic blue environmental lighting to contrast with the character’s red hair.'),
      image('rain-water', 'Rain Water', '2021', 'A solar-term postcard for Beijing Normal University’s White Dove Youth Volunteer Association. The association sends these postcards to volunteers and students interested in volunteering. This illustration celebrates Rain Water (Yushui).'),
      image('grain-rain', 'Grain Rain', '2020', 'A solar-term postcard for Beijing Normal University’s White Dove Youth Volunteer Association, celebrating Grain Rain (Guyu). The postcards are sent to volunteers and students interested in volunteering.'),
    ],
    cover: '/artworks/covers/character-illustration.jpg',
  },
  {
    id: 'graphic-design', title: 'Graphic Design',
    images: [
      image('welcome-banner', 'Welcome Week Banner', '2021', 'A large welcome-week banner for the White Dove Youth Volunteer Association. New students wrote their hopes for university life on sticky notes and placed them over the bottles in the design.'),
      image('philosophy-shirt', 'Philosophy T-Shirt Design', '2020', 'A back print for Beijing Normal University’s School of Philosophy T-shirt. The design combines the sun, referencing Plato’s allegory of the cave; the owl of Minerva; and Φ, the first letter of φιλοσοφία.'),
      image('philosophy-logo', 'Philosophy WeChat Logo', '2020', 'A logo for the official WeChat account of Beijing Normal University’s School of Philosophy. Like the T-shirt design, it combines an owl with Φ, using a more playful visual style.'),
      image('philosophy-month', 'World Philosophy Month Banner', '2020', 'A large-format banner for the World Philosophy Month event at Beijing Normal University’s School of Philosophy.'),
    ],
    cover: '/artworks/covers/graphic-design.jpg',
  },
  {
    id: 'character-design', title: 'Character Design',
    images: [
      image('environment-mascots', 'Environmental Volunteer Mascots', '2022', 'Two mascot designs for the environmental protection branch of Beijing Normal University’s volunteer association, inspired by an owl and a butterfly.'),
      image('graduation-mascots', 'Graduation Standee Characters', '2021', 'Illustrations of the White Dove Youth Volunteer Association’s two mascots, commissioned for graduation-season standees that students could pose with for photographs.'),
      image('campus-characters', 'Campus Character Designs', '2020', 'An entry for Beijing Normal University’s character design competition, using the campus’s well-known ginkgo trees and crows as the main design elements.'),
    ],
    cover: '/artworks/covers/character-design.jpg',
  },
];
