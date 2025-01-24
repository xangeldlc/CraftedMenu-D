export function parseMiniMessage(text: string): string {
  // Reemplaza códigos & por estilos HTML
  let parsedText = text.replace(/&([0-9a-f])/gi, (match, color) => {
    const colors: { [key: string]: string } = {
      "0": "#000000", "1": "#0000AA", "2": "#00AA00", "3": "#00AAAA",
      "4": "#AA0000", "5": "#AA00AA", "6": "#FFAA00", "7": "#AAAAAA",
      "8": "#555555", "9": "#5555FF", "a": "#55FF55", "b": "#55FFFF",
      "c": "#FF5555", "d": "#FF55FF", "e": "#FFFF55", "f": "#FFFFFF"
    };
    return `<span style="color: ${colors[color.toLowerCase()]};">`;
  });

  // Reemplaza códigos de formato
  parsedText = parsedText
    .replace(/&l/g, "<span style='font-weight: bold;'>")
    .replace(/&o/g, "<span style='font-style: italic;'>")
    .replace(/&n/g, "<span style='text-decoration: underline;'>")
    .replace(/&m/g, "<span style='text-decoration: line-through;'>")
    .replace(/&#([0-9A-Fa-f]{6})/g, (match, hex) => `<span style="color: #${hex};">`)
    .replace(/<(\w+)>/g, (match, tag) => {
      switch (tag) {
        case 'bold': return '<span style="font-weight: bold;">';
        case 'italic': return '<span style="font-style: italic;">';
        case 'underline': return '<span style="text-decoration: underline;">';
        case 'strikethrough': return '<span style="text-decoration: line-through;">';
        default: return match; // Si no es un tag conocido, lo dejamos como está
      }
    })
    .replace(/<#([0-9A-Fa-f]{6})>/g, (match, hex) => `<span style="color: #${hex};">`);

  // Cerramos todos los spans abiertos
  const openSpans = (parsedText.match(/<span/g) || []).length;
  return parsedText + "</span>".repeat(openSpans);
}

