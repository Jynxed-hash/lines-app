export type Deal = {
  id: string;
  title: string;
  detail: string;
};

export type Venue = {
  id: string;
  name: string;
  neighborhood: string;
  capacity: number;
  occupancy: number;
  vibe: string;
  deals: Deal[];
};

export const SEED_VENUES: Venue[] = [
  {
    id: 'atlas',
    name: 'Bar Atlas',
    neighborhood: 'East Village',
    capacity: 120,
    occupancy: 86,
    vibe: 'Tight door, loud room, worth it if you like a packed floor.',
    deals: [
      {
        id: 'atlas-early',
        title: 'In before 8',
        detail: '40% off drinks until 8:30 if you join the virtual line before 8.',
      },
    ],
  },
  {
    id: 'harbor',
    name: 'Harbor Room',
    neighborhood: 'Lower East Side',
    capacity: 80,
    occupancy: 41,
    vibe: 'Room for a crew. Slower door, better for a party of 6.',
    deals: [
      {
        id: 'harbor-2for1',
        title: '2-for-1 until midnight',
        detail: 'House pours, first round for the party.',
      },
    ],
  },
  {
    id: 'kiln',
    name: 'Kiln',
    neighborhood: 'Williamsburg',
    capacity: 200,
    occupancy: 190,
    vibe: 'Looks hot from the sidewalk. Long wait for groups over 4.',
    deals: [],
  },
];
