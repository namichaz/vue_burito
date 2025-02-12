export enum MenuItem {
  ナチョス = "nachos",
  ブリトー = "burrito",
  タコス = "tacos",
  トルティーヤ = "tortilla",
  エンチラーダ = "enchiladas",
  ワカモレ = "guacamole",
}

// label と value のセットを配列として返す
export const getMenuItems = () => {
  return Object.keys(MenuItem).map((key) => ({
    label: key,
    value: MenuItem[key as keyof typeof MenuItem],
  }));
};
