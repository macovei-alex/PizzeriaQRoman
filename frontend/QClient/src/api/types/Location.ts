export type Coordinates = {
  lat: number;
  lng: number;
};

export type Directions = {
  routes: [
    {
      overview_polyline: {
        points: string;
      };
    },
  ];
};
