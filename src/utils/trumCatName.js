export default function trumCatName(name) {
  if (name.length > 25) {
    return name.substring(0, 25) + "...";
  }
  return name;
}
