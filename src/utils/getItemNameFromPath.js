function getItemNameFromPath(selectedItem) {
  const selecedItemPath = selectedItem?.path.split("/");
  return selecedItemPath ? selecedItemPath[selecedItemPath.length - 1] : "";
}

export default getItemNameFromPath;
