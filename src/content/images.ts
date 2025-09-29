// /content/images.ts
export const imageUrls = [
  "https://cdwwp1j6bk.ufs.sh/f/YDTKbsayXpbwwzxlo7pnySrvfcji6sUtDQHepkYTIG1FJh3N",
  "https://cdwwp1j6bk.ufs.sh/f/YDTKbsayXpbwjECSjVZXQx9wikGsu3IvaoFqRj6fyEA1BL2Y"
];

export const pictures = imageUrls.map((url, index) => ({
  id: index + 1,
  url
}));