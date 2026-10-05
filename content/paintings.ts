export type PaintingLayout =
  | 'garden'
  | 'dog'
  | 'portrait'
  | 'night-watch'
  | 'saturn'
  | 'colossus'
  | 'tower'

export type SelectedPainting = {
  slug: string
  title: string
  artist: string
  year: string
  museum: string
  city: string
  medium: string
  museumUrl?: string
  imageUrl: string
  imageWidth: number
  imageHeight: number
  imageAlt: string
  imageSourceName: string
  imageSourceUrl: string
  imageRightsLabel: string
  imageRightsUrl: string
  imageCredit?: string
  layout: PaintingLayout
}

export const selectedPaintings: SelectedPainting[] = [
  {
    slug: 'garden-of-earthly-delights',
    title: 'Tríptico del Jardín de las delicias',
    artist: 'Hieronymus Bosch',
    year: '1490–1500',
    museum: 'Museo Nacional del Prado',
    city: 'Madrid',
    medium: 'Grisaille and oil on oak panel',
    museumUrl:
      'https://www.museodelprado.es/en/the-collection/art-work/triptych-garden-earthly-delights/02388242-6d6a-4e9e-a992-e1311eab3609',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/The_Garden_of_Earthly_Delights_by_Hieronymus_Bosch.jpg/1280px-The_Garden_of_Earthly_Delights_by_Hieronymus_Bosch.jpg',
    imageWidth: 1280,
    imageHeight: 655,
    imageAlt:
      'Tríptico del Jardín de las delicias by Hieronymus Bosch',
    imageSourceName: 'Wikimedia Commons',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:The_Garden_of_Earthly_Delights_by_Hieronymus_Bosch.jpg',
    imageRightsLabel: 'Public Domain',
    imageRightsUrl:
      'https://creativecommons.org/publicdomain/mark/1.0/',
    layout: 'garden',
  },
  {
    slug: 'the-dog',
    title: 'Perro semihundido',
    artist: 'Francisco de Goya',
    year: '1820–1823',
    museum: 'Museo Nacional del Prado',
    city: 'Madrid',
    medium: 'Mixed method on mural transferred to canvas',
    museumUrl:
      'https://www.museodelprado.es/en/the-collection/art-work/the-drowning-dog/4ea6a3d1-00ee-49ee-b423-ab1c6969bca6',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Goya_Dog.jpg/960px-Goya_Dog.jpg',
    imageWidth: 960,
    imageHeight: 1630,
    imageAlt: 'Perro semihundido by Francisco de Goya',
    imageSourceName: 'Wikimedia Commons',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Goya_Dog.jpg',
    imageRightsLabel: 'Public Domain',
    imageRightsUrl:
      'https://creativecommons.org/publicdomain/mark/1.0/',
    layout: 'dog',
  },
  {
    slug: 'self-portrait-straw-hat',
    title: 'Self Portrait in a Straw Hat',
    artist: 'Élisabeth Louise Vigée Le Brun',
    year: '1782',
    museum: 'The National Gallery',
    city: 'London',
    medium: 'Oil on canvas',
    museumUrl:
      'https://www.nationalgallery.org.uk/paintings/elisabeth-louise-vigee-le-brun-self-portrait-in-a-straw-hat',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Self-portrait_in_a_Straw_Hat_by_Elisabeth-Louise_Vig%C3%A9e-Lebrun_-_1782.jpg/960px-Self-portrait_in_a_Straw_Hat_by_Elisabeth-Louise_Vig%C3%A9e-Lebrun_-_1782.jpg',
    imageWidth: 960,
    imageHeight: 1320,
    imageAlt:
      'Self Portrait in a Straw Hat by Élisabeth Louise Vigée Le Brun',
    imageSourceName: 'Wikimedia Commons',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Self-portrait_in_a_Straw_Hat_by_Elisabeth-Louise_Vig%C3%A9e-Lebrun_-_1782.jpg',
    imageRightsLabel: 'Public Domain',
    imageRightsUrl:
      'https://creativecommons.org/publicdomain/mark/1.0/',
    layout: 'portrait',
  },
  {
    slug: 'penitent-magdalene',
    title: 'Maddalena penitente',
    artist: 'Domenico Tintoretto',
    year: '1598–1602',
    museum: 'Musei Capitolini',
    city: 'Rome',
    medium: 'Oil on canvas',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/TINTORETTO_-_Magdalena_penitente_%28Musei_Capitolini%2C_Roma%2C_1598-1602%29_-_copia.jpg/960px-TINTORETTO_-_Magdalena_penitente_%28Musei_Capitolini%2C_Roma%2C_1598-1602%29_-_copia.jpg',
    imageWidth: 960,
    imageHeight: 1186,
    imageAlt: 'Maddalena penitente by Domenico Tintoretto',
    imageSourceName: 'Wikimedia Commons',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:TINTORETTO_-_Magdalena_penitente_(Musei_Capitolini,_Roma,_1598-1602)_-_copia.jpg',
    imageRightsLabel: 'Public Domain',
    imageRightsUrl:
      'https://creativecommons.org/publicdomain/mark/1.0/',
    layout: 'portrait',
  },
  {
    slug: 'las-meninas',
    title: 'Las meninas',
    artist: 'Diego Velázquez',
    year: '1656',
    museum: 'Museo Nacional del Prado',
    city: 'Madrid',
    medium: 'Oil on canvas',
    museumUrl:
      'https://www.museodelprado.es/en/the-collection/art-work/las-meninas/9fdc7800-9ade-48b0-ab8b-edee94ea877f',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/7/76/La_familia_de_Felipe_IV_o_Las_Meninas_%28Vel%C3%A1zquez%2C_Museo_del_Prado_de_Madrid%2C_1656%29.jpg',
    imageWidth: 2649,
    imageHeight: 3051,
    imageAlt: 'Las meninas by Diego Velázquez',
    imageSourceName: 'Wikimedia Commons',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:La_familia_de_Felipe_IV_o_Las_Meninas_(Vel%C3%A1zquez,_Museo_del_Prado_de_Madrid,_1656).jpg',
    imageRightsLabel: 'Public Domain',
    imageRightsUrl:
      'https://creativecommons.org/publicdomain/mark/1.0/',
    layout: 'portrait',
  },
  {
    slug: 'night-watch',
    title: 'De Nachtwacht',
    artist: 'Rembrandt van Rijn',
    year: '1642',
    museum: 'Rijksmuseum',
    city: 'Amsterdam',
    medium: 'Oil on canvas',
    museumUrl:
      'https://www.rijksmuseum.nl/en/collection/object/The-Night-Watch-Militia-Company-of-District-II-under-the-Command-of-Captain-Frans-Banninck-Cocq--3137deb45cd7765f9a76084a16c99544',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg/1280px-The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg',
    imageWidth: 1280,
    imageHeight: 1041,
    imageAlt: 'De Nachtwacht by Rembrandt van Rijn',
    imageSourceName: 'Wikimedia Commons',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg',
    imageRightsLabel: 'Public Domain',
    imageRightsUrl:
      'https://creativecommons.org/publicdomain/mark/1.0/',
    imageCredit: 'Rijksmuseum via Wikimedia Commons',
    layout: 'night-watch',
  },
  {
    slug: 'saturn',
    title: 'Saturno',
    artist: 'Francisco de Goya',
    year: '1820–1823',
    museum: 'Museo Nacional del Prado',
    city: 'Madrid',
    medium: 'Mixed method on mural transferred to canvas',
    museumUrl:
      'https://www.museodelprado.es/en/the-collection/art-work/saturn/18110a75-b0e7-430c-bc73-2a4d55893bd6',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/b/bc/Saturn_Devouring_His_Son.jpg',
    imageWidth: 1071,
    imageHeight: 1920,
    imageAlt: 'Saturno by Francisco de Goya',
    imageSourceName: 'Wikimedia Commons',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Saturn_Devouring_His_Son.jpg',
    imageRightsLabel: 'CC BY-SA 4.0',
    imageRightsUrl:
      'https://creativecommons.org/licenses/by-sa/4.0/',
    imageCredit: 'Museo Nacional del Prado via Wikimedia Commons',
    layout: 'saturn',
  },
  {
    slug: 'the-colossus',
    title: 'El coloso',
    artist: 'Attributed to Francisco de Goya y Lucientes',
    year: 'After 1808',
    museum: 'Museo Nacional del Prado',
    city: 'Madrid',
    medium: 'Oil on canvas',
    museumUrl:
      'https://www.museodelprado.es/en/the-collection/art-work/the-colossus/2a678f69-fbdd-409c-8959-5c873f8feb82',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/7/70/Goya.colossus.jpg',
    imageWidth: 882,
    imageHeight: 970,
    imageAlt:
      'El coloso, attributed to Francisco de Goya y Lucientes',
    imageSourceName: 'Wikimedia Commons',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Goya.colossus.jpg',
    imageRightsLabel: 'Public Domain',
    imageRightsUrl:
      'https://creativecommons.org/publicdomain/mark/1.0/',
    layout: 'colossus',
  },
  {
    slug: 'tower-of-babel',
    title: 'Turmbau zu Babel',
    artist: 'Pieter Bruegel the Elder',
    year: '1563',
    museum: 'Kunsthistorisches Museum',
    city: 'Vienna',
    medium: 'Oil on oak panel',
    museumUrl:
      'https://www.khm.at/en/objectdb/detail/323/',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project_-_edited.jpg/1280px-Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project_-_edited.jpg',
    imageWidth: 1280,
    imageHeight: 937,
    imageAlt:
      'Turmbau zu Babel by Pieter Bruegel the Elder, Vienna version',
    imageSourceName: 'Wikimedia Commons',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_(Vienna)_-_Google_Art_Project_-_edited.jpg',
    imageRightsLabel: 'Public Domain',
    imageRightsUrl:
      'https://creativecommons.org/publicdomain/mark/1.0/',
    layout: 'tower',
  },
]

export type UnreproducedPainting = {
  title: string
  artist: string
  year: string
  venue: string
  city: string
  url: string
  linkLabel: string
  reason: string
}

export const unreproducedPaintings: UnreproducedPainting[] = [
  {
    title: 'Las distracciones de Dagoberto',
    artist: 'Leonora Carrington',
    year: '1945',
    venue: 'MALBA',
    city: 'Buenos Aires',
    url:
      'https://malba.org.ar/las-distracciones-de-dagoberto-de-leonora-carrington-malba/',
    linkLabel: 'View the work at MALBA',
    reason:
      'The artwork remains protected by copyright, and I have not identified an image licence suitable for republication on this site.',
  },
  {
    title: 'A Walk through Primordial Garden',
    artist: 'Matthew Wong',
    year: '2018',
    venue: 'Van Gogh Museum exhibition',
    city: 'Amsterdam',
    url:
      'https://www.vangoghmuseum.nl/assets/dbe7d644-e1e6-4940-b29b-e02369bd39b7/English%20Gallery%20Texts%20for%20the%20exhibition%20%27Matthew%20Wong%20%7C%20Vincent%20van%20Gogh%3A%20Painting%20as%20a%20Last%20Resort%27?c=3c3cf9132e3025ea8e8d2aa37f18ec7e4f3a4d73e995022254c91856c1023fc4',
    linkLabel: 'View the Van Gogh Museum exhibition text',
    reason:
      'The work remains protected by copyright, and I have not identified an image licence suitable for republication on this site.',
  },
  {
    title: 'L'étagère',
    artist: 'Pablo Picasso',
    year: '1911–1912',
    venue: 'ALBERTINA',
    city: 'Vienna',
    url:
      'https://sammlungenonline.albertina.at/objects/604673/letagere',
    linkLabel: 'View the work at ALBERTINA',
    reason:
      'ALBERTINA explicitly credits the reproduction to Succession Picasso / Bildrecht Wien, so I do not reproduce the image here.',
  },
]
