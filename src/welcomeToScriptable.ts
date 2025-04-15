function extractImageURL(html: string): string | null {
  const regex = /<img src="(.*?)" alt="/;
  const matches = html.match(regex);
  return matches && matches[1] ? matches[1] : null;
}

function decode(str: string): string {
  const regex = /&#(\d+);/g;
  return str.replace(regex, (_, dec) => String.fromCharCode(Number(dec)));
}

async function main() {
  const url = 'https://macstories.net/feed/json';
  const req = new Request(url);
  const json = await req.loadJSON();

  const table = new UITable();

  for (const item of json.items) {
    const row = new UITableRow();

    const body = item.content_html;
    const imageURL = extractImageURL(body);
    const title = decode(item.title);

    const imageCell = row.addImageAtURL(imageURL ?? '');
    const titleCell = row.addText(title);

    imageCell.widthWeight = 20;
    titleCell.widthWeight = 80;

    row.height = 60;
    row.cellSpacing = 10;

    table.addRow(row);
  }

  QuickLook.present(table);

  if (config.runsWithSiri) {
    Speech.speak("Here's the latest news.");
  }
}

main();
