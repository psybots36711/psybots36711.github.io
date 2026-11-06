export type BoltDesign = {
  index: number;
  path: string;
};

const designCount = 20;
const strikeYs = [
  -40, 15, 70, 125, 180, 235, 280, 332, 385, 438, 491, 544, 600,
];

function createRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function createBoltDesign(seed: number, startX: number, endX: number): string {
  const random = createRandom(seed);
  const topPoints = strikeYs.slice(0, 6).map((y, index) => {
    const progress = index / 6;
    const drift = (random() - 0.5) * 90 * (1 - progress);

    return {
      x: Math.round(startX + (600 - startX) * progress + drift),
      y,
    };
  });
  const bottomPoints = strikeYs.slice(7).map((y, index) => {
    const progress = (index + 1) / 6;
    const drift = (random() - 0.5) * 42 * progress * (1 - progress);

    return {
      x: Math.round(600 + (endX - 600) * progress + drift),
      y,
    };
  });
  const points = [...topPoints, { x: 600, y: 280 }, ...bottomPoints];
  const mainPath = `M ${points.map(({ x, y }) => `${x} ${y}`).join(" L ")}`;
  const branches = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11].map(
    (pointIndex, branchIndex) => {
      const start = points[pointIndex];
      const direction = random() > 0.5 ? 1 : -1;
      const first = {
        x: Math.round(start.x + direction * (30 + random() * 56)),
        y: Math.round(start.y + 24 + random() * 34),
      };
      const end = {
        x: Math.round(first.x + direction * (28 + random() * 58)),
        y: Math.round(first.y + 22 + random() * 38),
      };
      const twigDirection = branchIndex % 2 === 0 ? -1 : 1;
      const twigEnd = {
        x: Math.round(first.x + twigDirection * (24 + random() * 42)),
        y: Math.round(first.y + 16 + random() * 30),
      };

      return `M ${start.x} ${start.y} L ${first.x} ${first.y} L ${end.x} ${end.y} M ${first.x} ${first.y} L ${twigEnd.x} ${twigEnd.y}`;
    },
  );

  return `${mainPath} ${branches.join(" ")}`;
}

const boltDesignSeeds = Array.from(
  { length: designCount },
  (_, index) => index + 1,
);

export function pickBoltDesign(previousIndex: number): BoltDesign {
  const offset = 1 + Math.floor(Math.random() * (designCount - 1));
  const index =
    previousIndex < 0
      ? Math.floor(Math.random() * designCount)
      : (previousIndex + offset) % designCount;
  const startX = Math.round(Math.random() * 1200);
  const endX = Math.round(Math.random() * 1200);

  return {
    index,
    path: createBoltDesign(boltDesignSeeds[index], startX, endX),
  };
}
