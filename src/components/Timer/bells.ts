const BASE_URL = import.meta.env.BASE_URL || '/';

const bells = [
  {
    name: 'none',
    description: 'No sound notification',
    sounds: null,
  },
  {
    name: 'classic',
    description: 'Traditional boxing bell sound',
    sounds: [
      {
        src: `${BASE_URL}bells/classic_start.wav`,
        offsetSeconds: 0,
      },
      {
        src: `${BASE_URL}bells/classic_end.wav`,
        offsetSeconds: 0,
      },
    ],
  },
  {
    name: 'digital',
    description: 'Modern digital notification sound',
    sounds: [
      {
        src: `${BASE_URL}bells/digital_start.wav`,
        offsetSeconds: 1.6,
      },
      {
        src: `${BASE_URL}bells/digital_end.wav`,
        offsetSeconds: 0.05,
      },
    ],
  },
];

export default bells;
