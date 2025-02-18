export enum MenuItem {
  nachos = "nachos",
  burrito = "burrito",
  tacos = "tacos",
  tortilla = "tortilla",
  enchiladas = "enchiladas",
  guacamole = "guacamole",
}

// label と value のセットを配列として返す
export const getMenuItems = () => {
  return Object.keys(MenuItem).map((key) => ({
    label: key,
    value: MenuItem[key as keyof typeof MenuItem],
  }));
};

export const getStringMenuItems = (): string[] => {
  return Object.values(MenuItem); // これで値の配列を取得
};
