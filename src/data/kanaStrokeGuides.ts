export interface StrokeStep {
  num: number;
  direction: string;
  arrow: string;
  start: { x: number; y: number }; // Percentage (0-100)
  tip: string;
}

export interface CharStrokeGuide {
  char: string;
  generalRule: string;
  steps: StrokeStep[];
}

export const KANA_STROKE_GUIDES: Record<string, CharStrokeGuide> = {
  // ================= HIRAGANA =================
  'あ': {
    char: 'あ',
    generalRule: 'Ngang trước, dọc giữa sau, uốn vòng tròn lớn sau cùng.',
    steps: [
      { num: 1, direction: 'Trái sang phải', arrow: '→', start: { x: 26, y: 32 }, tip: 'Kéo nét ngang ngắn hơi chếch nhẹ lên trên.' },
      { num: 2, direction: 'Trên xuống dưới', arrow: '↓', start: { x: 50, y: 16 }, tip: 'Kéo nét sổ dọc cong nhẹ cắt qua nét 1 xuống đáy.' },
      { num: 3, direction: 'Lượn chéo & vòng tròn', arrow: '⤾', start: { x: 68, y: 38 }, tip: 'Bắt đầu bên phải, kéo chéo xuống trái rồi uốn vòng tròn lớn theo chiều kim đồng hồ.' },
    ],
  },
  'い': {
    char: 'い',
    generalRule: 'Nét dài bên trái có móc trước, nét ngắn bên phải sau.',
    steps: [
      { num: 1, direction: 'Trên xuống có móc', arrow: '↓⤴', start: { x: 30, y: 26 }, tip: 'Kéo từ trên xuống hơi cong vào trong, hất nhẹ đuôi lên.' },
      { num: 2, direction: 'Trên xuống dưới', arrow: '↓', start: { x: 70, y: 36 }, tip: 'Nét ngắn hơn bên phải, kéo hơi nghiêng theo nét 1.' },
    ],
  },
  'う': {
    char: 'う',
    generalRule: 'Nét phẩy trên trước, thân cong vòm dưới sau.',
    steps: [
      { num: 1, direction: 'Xiên chéo ngắn', arrow: '↘', start: { x: 46, y: 20 }, tip: 'Chấm nét phẩy ngắn từ trái sang phải ở trên đỉnh.' },
      { num: 2, direction: 'Vòm cong tròn', arrow: '⤾', start: { x: 34, y: 40 }, tip: 'Kéo ngang sang phải rồi uốn cong hình vòm xuống đáy trái.' },
    ],
  },
  'え': {
    char: 'え',
    generalRule: 'Mũ phẩy trên trước, thân ziczac gập sóng sau.',
    steps: [
      { num: 1, direction: 'Chấm phẩy đỉnh', arrow: '↘', start: { x: 48, y: 20 }, tip: 'Nét phẩy nhỏ ở đỉnh giữa.' },
      { num: 2, direction: 'Ziczac lượn sóng', arrow: 'Z→', start: { x: 30, y: 44 }, tip: 'Kéo ngang sang phải, chéo xuống trái, lượn sóng sang phải rồi dừng dứt khoát.' },
    ],
  },
  'お': {
    char: 'お',
    generalRule: 'Ngang trước, thân sổ lượn tròn giữa, chấm ngoài sau cùng.',
    steps: [
      { num: 1, direction: 'Trái sang phải', arrow: '→', start: { x: 26, y: 34 }, tip: 'Kéo nét ngang ngắn ở phần trên.' },
      { num: 2, direction: 'Dọc xuống & vòng bụng', arrow: '↓⤾', start: { x: 48, y: 20 }, tip: 'Sổ dọc xuống, lượn thắt nút sang trái rồi tạo bụng tròn to sang phải.' },
      { num: 3, direction: 'Phẩy góc phải', arrow: '↘', start: { x: 76, y: 32 }, tip: 'Chấm nét phẩy nhỏ độc lập ở góc trên bên phải.' },
    ],
  },
  'か': {
    char: 'か',
    generalRule: 'Thân có móc trước, nét sổ xiên cắt ngang, chấm phụ ngoài sau.',
    steps: [
      { num: 1, direction: 'Ngang gập móc', arrow: '→↓⤴', start: { x: 28, y: 30 }, tip: 'Kéo ngang, gập góc xuống dưới hơi lượn móc nhẹ.' },
      { num: 2, direction: 'Sổ xiên trái', arrow: '↙', start: { x: 50, y: 18 }, tip: 'Kéo nét sổ hơi cong cắt qua nét 1 từ trên xuống.' },
      { num: 3, direction: 'Chấm phụ phải', arrow: '↘', start: { x: 76, y: 34 }, tip: 'Dấu phẩy nhỏ phía ngoài bên phải.' },
    ],
  },
  'き': {
    char: 'き',
    generalRule: '2 nét ngang trên trước, nét chéo giữa, bụng cong tách rời sau.',
    steps: [
      { num: 1, direction: 'Ngang trên', arrow: '→', start: { x: 32, y: 28 }, tip: 'Nét ngang trên ngắn hơi dốc lên.' },
      { num: 2, direction: 'Ngang dưới', arrow: '→', start: { x: 28, y: 42 }, tip: 'Nét ngang dưới dài hơn nét trên.' },
      { num: 3, direction: 'Sổ xiên có móc', arrow: '↘⤴', start: { x: 52, y: 18 }, tip: 'Kéo chéo cắt 2 nét ngang, hất nhẹ ở đuôi.' },
      { num: 4, direction: 'Vòm cong dưới', arrow: '⤾', start: { x: 34, y: 72 }, tip: 'Vòng cung uốn tròn ở đáy (không dính vào nét 3).' },
    ],
  },
  'く': {
    char: 'く',
    generalRule: '1 nét gập góc tù liền mạch giống dấu bé hơn (<).',
    steps: [
      { num: 1, direction: 'Xiên trái rồi xiên phải', arrow: '↙↘', start: { x: 62, y: 22 }, tip: 'Kéo chéo xuống giữa bên trái, gập góc nhọn rồi kéo xéo xuống phải.' },
    ],
  },
  'け': {
    char: 'け',
    generalRule: 'Nét sổ thẳng trái có móc trước, ngang giữa, sổ dọc phải sau.',
    steps: [
      { num: 1, direction: 'Sổ trái có móc', arrow: '↓⤴', start: { x: 28, y: 20 }, tip: 'Sổ thẳng hơi cong vào trong, hất đuôi nhẹ lên.' },
      { num: 2, direction: 'Ngang ngắn giữa', arrow: '→', start: { x: 46, y: 36 }, tip: 'Kéo nét ngang ngắn ở nửa trên bên phải.' },
      { num: 3, direction: 'Sổ dọc phải', arrow: '↓', start: { x: 68, y: 22 }, tip: 'Sổ từ trên xuống cắt qua nét 2, đuôi hơi cong nhẹ sang trái.' },
    ],
  },
  'こ': {
    char: 'こ',
    generalRule: 'Nét ngang trên có móc nhẹ trước, nét ngang dưới uốn sau.',
    steps: [
      { num: 1, direction: 'Ngang trên móc', arrow: '→⤵', start: { x: 32, y: 32 }, tip: 'Kéo ngang sang phải rồi móc nhẹ đuôi xuống.' },
      { num: 2, direction: 'Vòm ngang dưới', arrow: '→', start: { x: 32, y: 68 }, tip: 'Đáy vòm hơi cong lên, tương xứng với nét 1.' },
    ],
  },
  'さ': {
    char: 'さ',
    generalRule: 'Ngang trước, nét sổ cắt xiên, bụng cong dưới sau.',
    steps: [
      { num: 1, direction: 'Ngang chếch', arrow: '→', start: { x: 30, y: 32 }, tip: 'Kéo nét ngang hơi dốc lên.' },
      { num: 2, direction: 'Xiên cắt có móc', arrow: '↘⤴', start: { x: 54, y: 20 }, tip: 'Sổ xiên cắt nét ngang rồi hất nhẹ sang trái.' },
      { num: 3, direction: 'Vòng cong đáy', arrow: '⤾', start: { x: 36, y: 70 }, tip: 'Vòm cung tròn cong sang phải ở đáy.' },
    ],
  },
  'し': {
    char: 'し',
    generalRule: '1 nét uốn cong như chiếc lưỡi câu ngược.',
    steps: [
      { num: 1, direction: 'Sổ xuống lượn vòm lên', arrow: '↓⤴', start: { x: 42, y: 20 }, tip: 'Kéo thẳng từ trên xuống, uốn đáy cong tròn rồi hất vút lên phải.' },
    ],
  },
  'す': {
    char: 'す',
    generalRule: 'Ngang trên trước, sổ dọc thắt nút tròn rồi kéo thẳng xuống.',
    steps: [
      { num: 1, direction: 'Ngang dài', arrow: '→', start: { x: 24, y: 32 }, tip: 'Kéo nét ngang dài cân đối hai bên.' },
      { num: 2, direction: 'Sổ dọc & thắt nút', arrow: '↓⤾↓', start: { x: 56, y: 16 }, tip: 'Sổ dọc xuống, uốn vòng tròn thắt nút sang trái rồi kéo thẳng xuống đáy.' },
    ],
  },
  'せ': {
    char: 'せ',
    generalRule: 'Ngang dài trước, nét sổ phải móc đáy, nét sổ trái sau cùng.',
    steps: [
      { num: 1, direction: 'Ngang dài', arrow: '→', start: { x: 26, y: 34 }, tip: 'Kéo nét ngang dài thẳng.' },
      { num: 2, direction: 'Sổ phải gập đáy', arrow: '↓→', start: { x: 68, y: 22 }, tip: 'Sổ dọc bên phải rồi bẻ gập ngang sang trái ở đáy.' },
      { num: 3, direction: 'Sổ trái có móc', arrow: '↓⤴', start: { x: 42, y: 24 }, tip: 'Sổ dọc bên trái cắt qua nét 1, đuôi hất nhẹ.' },
    ],
  },
  'そ': {
    char: 'そ',
    generalRule: '1 nét liền mạch ziczac giống chữ Z nối liền chữ C uốn cong.',
    steps: [
      { num: 1, direction: 'Ziczac nối vòm tròn', arrow: 'Z⤾', start: { x: 34, y: 24 }, tip: 'Kéo ngang sang phải, chéo xuống trái, ngang sang phải rồi uốn vòng cung lớn ở đáy.' },
    ],
  },
  'た': {
    char: 'た',
    generalRule: 'Ngang trước, sổ xiên trái, 2 nét ngắn tạo chữ こ bên trong.',
    steps: [
      { num: 1, direction: 'Ngang ngắn', arrow: '→', start: { x: 26, y: 32 }, tip: 'Kéo nét ngang ngắn bên trái.' },
      { num: 2, direction: 'Xiên trái', arrow: '↙', start: { x: 44, y: 20 }, tip: 'Sổ xiên cắt qua nét 1 từ trên xuống.' },
      { num: 3, direction: 'Ngang trong trên', arrow: '→', start: { x: 56, y: 44 }, tip: 'Nét ngang ngắn phía trong.' },
      { num: 4, direction: 'Ngang trong dưới', arrow: '→', start: { x: 52, y: 64 }, tip: 'Nét ngang hơi cong ở đáy phía trong.' },
    ],
  },
  'ち': {
    char: 'ち',
    generalRule: 'Ngang trước, sổ cắt uốn bụng tròn lớn như số 5.',
    steps: [
      { num: 1, direction: 'Ngang trên', arrow: '→', start: { x: 28, y: 32 }, tip: 'Nét ngang ngắn hơi dốc lên.' },
      { num: 2, direction: 'Sổ cắt uốn vòm', arrow: '↙⤾', start: { x: 52, y: 18 }, tip: 'Sổ chéo cắt nét 1 rồi uốn vòng bụng tròn lớn sang phải.' },
    ],
  },
  'つ': {
    char: 'つ',
    generalRule: '1 nét uốn vòng cung lớn như cơn sóng thần dâng trào.',
    steps: [
      { num: 1, direction: 'Ngang rồi vòng cung', arrow: '→⤾', start: { x: 28, y: 36 }, tip: 'Kéo ngang sang phải rồi uốn một vòng cung lớn đều xuống đáy trái.' },
    ],
  },
  'て': {
    char: 'て',
    generalRule: '1 nét ngang rồi uốn vòm cong như chữ C ngược.',
    steps: [
      { num: 1, direction: 'Ngang rồi lượn vòm', arrow: '→⤾', start: { x: 28, y: 30 }, tip: 'Kéo ngang sang phải, gập góc nhẹ rồi uốn vòng cung tròn xuống đáy.' },
    ],
  },
  'と': {
    char: 'と',
    generalRule: 'Nét sổ xiên ngắn trước, vòm cong lớn ôm đáy sau.',
    steps: [
      { num: 1, direction: 'Xiên ngắn', arrow: '↘', start: { x: 40, y: 20 }, tip: 'Kéo nét xiên ngắn từ trên xuống phải.' },
      { num: 2, direction: 'Vòm cong lớn', arrow: '⤾', start: { x: 34, y: 42 }, tip: 'Bắt đầu từ trái, uốn vòng cung lớn sang phải rồi dừng ở đáy.' },
    ],
  },
  'な': {
    char: 'な',
    generalRule: 'Chữ thập 十 bên trái trước, dấu phẩy giữa, thắt nút phải sau.',
    steps: [
      { num: 1, direction: 'Ngang ngắn', arrow: '→', start: { x: 24, y: 34 }, tip: 'Nét ngang ngắn bên trái.' },
      { num: 2, direction: 'Sổ xiên', arrow: '↙', start: { x: 38, y: 20 }, tip: 'Sổ xiên cắt qua nét 1.' },
      { num: 3, direction: 'Chấm phẩy nhỏ', arrow: '↘', start: { x: 58, y: 30 }, tip: 'Dấu phẩy nhỏ phía trên bên phải.' },
      { num: 4, direction: 'Sổ thắt nút', arrow: '↓⤾', start: { x: 62, y: 44 }, tip: 'Sổ dọc xuống rồi uốn thắt nút tròn ở đáy.' },
    ],
  },
  'に': {
    char: 'に',
    generalRule: 'Nét sổ thẳng trái trước, 2 nét ngang song song phải sau.',
    steps: [
      { num: 1, direction: 'Sổ trái có móc', arrow: '↓⤴', start: { x: 28, y: 20 }, tip: 'Sổ thẳng hơi cong vào, hất đuôi nhẹ.' },
      { num: 2, direction: 'Ngang phải trên', arrow: '→', start: { x: 52, y: 34 }, tip: 'Nét ngang trên bên phải.' },
      { num: 3, direction: 'Ngang phải dưới', arrow: '→', start: { x: 50, y: 64 }, tip: 'Nét ngang dưới hơi cong đáy.' },
    ],
  },
  'ぬ': {
    char: 'ぬ',
    generalRule: 'Xiên trái trước, thân lượn vòng thắt nút đuôi sau.',
    steps: [
      { num: 1, direction: 'Xiên trái', arrow: '↘', start: { x: 36, y: 24 }, tip: 'Kéo nét xiên nhẹ từ trên xuống phải.' },
      { num: 2, direction: 'Vòng thắt nút', arrow: '⤾', start: { x: 58, y: 18 }, tip: 'Uốn cong cắt nét 1, lượn bụng tròn rồi thắt nút nhỏ ở đuôi.' },
    ],
  },
  'ね': {
    char: 'ね',
    generalRule: 'Sổ thẳng đứng trước, ziczac thắt nút đuôi bên phải sau.',
    steps: [
      { num: 1, direction: 'Sổ thẳng', arrow: '↓', start: { x: 32, y: 18 }, tip: 'Sổ thẳng đứng từ trên xuống đáy.' },
      { num: 2, direction: 'Ziczac thắt nút', arrow: 'Z⤾', start: { x: 42, y: 30 }, tip: 'Kéo ngang, chéo xuống, lượn vòm rồi thắt nút tròn ở đuôi.' },
    ],
  },
  'の': {
    char: 'の',
    generalRule: '1 nét uốn tròn xoắn ốc khép kín hài hòa.',
    steps: [
      { num: 1, direction: 'Xiên rồi vòng tròn', arrow: '↙⤾', start: { x: 56, y: 26 }, tip: 'Kéo xiên xuống trái, rồi uốn một vòng tròn lớn theo chiều kim đồng hồ.' },
    ],
  },
  'は': {
    char: 'は',
    generalRule: 'Sổ trái có móc trước, ngang trên, sổ thắt nút tròn sau.',
    steps: [
      { num: 1, direction: 'Sổ trái có móc', arrow: '↓⤴', start: { x: 28, y: 20 }, tip: 'Sổ thẳng hơi uốn nhẹ, hất đuôi lên.' },
      { num: 2, direction: 'Ngang ngắn', arrow: '→', start: { x: 48, y: 34 }, tip: 'Nét ngang ngắn bên phải.' },
      { num: 3, direction: 'Sổ thắt nút', arrow: '↓⤾', start: { x: 64, y: 20 }, tip: 'Sổ thẳng cắt qua nét 2, thắt nút tròn ở đáy.' },
    ],
  },
  'ひ': {
    char: 'ひ',
    generalRule: '1 nét uốn vòng nụ cười hì hì từ trái sang phải.',
    steps: [
      { num: 1, direction: 'Ngang rồi võng tròn', arrow: '→↓⤴', start: { x: 26, y: 36 }, tip: 'Ngang ngắn, kéo xiên xuống, võng đáy tròn rồi vút đuôi dài lên.' },
    ],
  },
  'ふ': {
    char: 'ふ',
    generalRule: 'Mũ phẩy trên trước, thân cong giữa, 2 nét phẩy hai bên sườn sau.',
    steps: [
      { num: 1, direction: 'Mũ phẩy đỉnh', arrow: '↘', start: { x: 50, y: 18 }, tip: 'Nét phẩy nhỏ ở đỉnh giữa.' },
      { num: 2, direction: 'Thân cong giữa', arrow: '↓⤴', start: { x: 48, y: 34 }, tip: 'Kéo cong lưng như cánh cung, hất nhẹ.' },
      { num: 3, direction: 'Phẩy sườn trái', arrow: '↙', start: { x: 28, y: 50 }, tip: 'Nét phẩy nhỏ bên sườn trái.' },
      { num: 4, direction: 'Phẩy sườn phải', arrow: '↘', start: { x: 74, y: 52 }, tip: 'Nét phẩy nhỏ bên sườn phải.' },
    ],
  },
  'へ': {
    char: 'へ',
    generalRule: '1 nét dốc mái nhà: lên dốc ngắn, xuống dốc dài.',
    steps: [
      { num: 1, direction: 'Lên dốc rồi xuống dốc', arrow: '↗↘', start: { x: 26, y: 56 }, tip: 'Lên dốc ngắn góc 45 độ, đổi hướng kéo xuống dốc dài sang phải.' },
    ],
  },
  'ほ': {
    char: 'ほ',
    generalRule: 'Sổ trái trước, 2 nét ngang phải, sổ thắt nút đáy sau.',
    steps: [
      { num: 1, direction: 'Sổ trái có móc', arrow: '↓⤴', start: { x: 28, y: 20 }, tip: 'Sổ thẳng bên trái, hất nhẹ.' },
      { num: 2, direction: 'Ngang trên', arrow: '→', start: { x: 48, y: 32 }, tip: 'Nét ngang trên bên phải.' },
      { num: 3, direction: 'Ngang dưới', arrow: '→', start: { x: 48, y: 48 }, tip: 'Nét ngang dưới dài hơn.' },
      { num: 4, direction: 'Sổ thắt nút', arrow: '↓⤾', start: { x: 64, y: 20 }, tip: 'Sổ thẳng cắt 2 nét ngang (không nhô đầu quá cao), thắt nút tròn ở đáy.' },
    ],
  },
  'ま': {
    char: 'ま',
    generalRule: '2 nét ngang song song trước, sổ thắt nút tròn sau.',
    steps: [
      { num: 1, direction: 'Ngang trên', arrow: '→', start: { x: 30, y: 30 }, tip: 'Nét ngang trên dài.' },
      { num: 2, direction: 'Ngang dưới', arrow: '→', start: { x: 32, y: 48 }, tip: 'Nét ngang dưới ngắn hơn.' },
      { num: 3, direction: 'Sổ thắt nút', arrow: '↓⤾', start: { x: 52, y: 18 }, tip: 'Sổ thẳng cắt qua 2 nét ngang rồi thắt nút tròn ở đáy.' },
    ],
  },
  'み': {
    char: 'み',
    generalRule: 'Lượn thắt nút chéo trước, nét phẩy chéo dài sau.',
    steps: [
      { num: 1, direction: 'Ngang thắt nút chéo', arrow: '→↓⤾', start: { x: 28, y: 30 }, tip: 'Kéo ngang, chéo xuống thắt nút tròn rồi vút sang phải.' },
      { num: 2, direction: 'Xiên dài', arrow: '↙', start: { x: 68, y: 26 }, tip: 'Kéo nét xiên dài cắt qua đuôi nét 1.' },
    ],
  },
  'む': {
    char: 'む',
    generalRule: 'Ngang trước, sổ thắt nút tròn hất lên, chấm phụ sau.',
    steps: [
      { num: 1, direction: 'Ngang ngắn', arrow: '→', start: { x: 26, y: 32 }, tip: 'Nét ngang ngắn phần trên.' },
      { num: 2, direction: 'Sổ thắt nút hất', arrow: '↓⤾⤴', start: { x: 46, y: 20 }, tip: 'Sổ thẳng xuống, thắt nút tròn, kéo ngang rồi hất đuôi lên.' },
      { num: 3, direction: 'Chấm phụ phải', arrow: '↘', start: { x: 74, y: 30 }, tip: 'Dấu phẩy nhỏ góc trên bên phải.' },
    ],
  },
  'め': {
    char: 'め',
    generalRule: 'Xiên ngắn trái trước, nét vòm lượn tròn bao bọc sau.',
    steps: [
      { num: 1, direction: 'Xiên trái', arrow: '↘', start: { x: 40, y: 26 }, tip: 'Nét xiên hơi cong từ trên xuống phải.' },
      { num: 2, direction: 'Vòm ôm tròn', arrow: '⤾', start: { x: 56, y: 20 }, tip: 'Uốn cong cắt nét 1 rồi lượn vòng tròn lớn đều.' },
    ],
  },
  'も': {
    char: 'も',
    generalRule: 'Thân cong lưỡi câu giữa trước, 2 nét ngang phụ cắt sau.',
    steps: [
      { num: 1, direction: 'Sổ lượn lưỡi câu', arrow: '↓⤴', start: { x: 50, y: 18 }, tip: 'Sổ dọc từ trên xuống, uốn đáy cong tròn sang phải.' },
      { num: 2, direction: 'Ngang trên', arrow: '→', start: { x: 30, y: 36 }, tip: 'Nét ngang trên cắt qua thân.' },
      { num: 3, direction: 'Ngang dưới', arrow: '→', start: { x: 32, y: 50 }, tip: 'Nét ngang dưới song song.' },
    ],
  },
  'や': {
    char: 'や',
    generalRule: 'Thân vòm có móc trước, chấm phụ trên, nét sổ xiên trái sau.',
    steps: [
      { num: 1, direction: 'Vòm móc', arrow: '→↓⤴', start: { x: 28, y: 40 }, tip: 'Kéo ngang vòm cong lên rồi móc đuôi.' },
      { num: 2, direction: 'Chấm đỉnh', arrow: '↘', start: { x: 62, y: 24 }, tip: 'Dấu phẩy ngắn phía trên.' },
      { num: 3, direction: 'Sổ xiên', arrow: '↙', start: { x: 40, y: 22 }, tip: 'Sổ xiên cắt qua nét 1.' },
    ],
  },
  'ゆ': {
    char: 'ゆ',
    generalRule: 'Sổ thắt vòng bụng trước, sổ dọc cắt xuyên sau.',
    steps: [
      { num: 1, direction: 'Sổ lượn bụng', arrow: '↓⤾', start: { x: 34, y: 22 }, tip: 'Sổ xuống, lượn vòng tròn to sang phải rồi vút lên.' },
      { num: 2, direction: 'Sổ dọc xuyên', arrow: '↓', start: { x: 64, y: 18 }, tip: 'Sổ dọc từ trên đỉnh cắt qua bụng nét 1 xuống đáy.' },
    ],
  },
  'よ': {
    char: 'よ',
    generalRule: 'Ngang ngắn trên trước, sổ dọc thắt nút tròn sau.',
    steps: [
      { num: 1, direction: 'Ngang ngắn', arrow: '→', start: { x: 28, y: 32 }, tip: 'Nét ngang ngắn bên trái.' },
      { num: 2, direction: 'Sổ thắt nút', arrow: '↓⤾', start: { x: 56, y: 20 }, tip: 'Sổ dọc xuống, chạm nét 1, thắt nút tròn rồi kéo ngang sang phải.' },
    ],
  },
  'ら': {
    char: 'ら',
    generalRule: 'Chấm phẩy trên trước, thân cong vòm dưới sau.',
    steps: [
      { num: 1, direction: 'Chấm đỉnh', arrow: '↘', start: { x: 44, y: 22 }, tip: 'Nét phẩy ngắn ở trên đầu.' },
      { num: 2, direction: 'Sổ cong vòm', arrow: '↓⤾', start: { x: 38, y: 40 }, tip: 'Sổ ngắn rồi uốn cong hình vòm sang phải.' },
    ],
  },
  'り': {
    char: 'り',
    generalRule: 'Nét ngắn trái có móc trước, nét dài phải vuốt xuống sau.',
    steps: [
      { num: 1, direction: 'Sổ ngắn trái có móc', arrow: '↓⤴', start: { x: 34, y: 28 }, tip: 'Sổ ngắn bên trái, móc nhẹ lên.' },
      { num: 2, direction: 'Sổ dài phải', arrow: '↓', start: { x: 66, y: 18 }, tip: 'Sổ dài từ trên đỉnh xuống, vuốt nhẹ ở đuôi.' },
    ],
  },
  'る': {
    char: 'る',
    generalRule: '1 nét ziczac uốn bụng tròn thắt nút nhỏ ở đuôi.',
    steps: [
      { num: 1, direction: 'Ziczac thắt nút', arrow: 'Z⤾', start: { x: 32, y: 26 }, tip: 'Ngang, chéo xuống trái, lượn vòm tròn rồi thắt một nút nhỏ ở đuôi.' },
    ],
  },
  'れ': {
    char: 'れ',
    generalRule: 'Sổ thẳng đứng trước, thân ziczac hất đuôi sang phải sau.',
    steps: [
      { num: 1, direction: 'Sổ thẳng', arrow: '↓', start: { x: 32, y: 18 }, tip: 'Sổ thẳng đứng từ trên xuống đáy.' },
      { num: 2, direction: 'Ziczac hất đuôi', arrow: 'Z⤴', start: { x: 44, y: 30 }, tip: 'Ngang, chéo xuống, lượn vòm rồi hất nhẹ đuôi sang phải.' },
    ],
  },
  'ろ': {
    char: 'ろ',
    generalRule: '1 nét ziczac giống chữ る nhưng KHÔNG có thắt nút ở đuôi.',
    steps: [
      { num: 1, direction: 'Ziczac vòm tròn mở', arrow: 'Z⤾', start: { x: 32, y: 26 }, tip: 'Ngang, chéo xuống trái rồi uốn bụng tròn để hở ở đuôi.' },
    ],
  },
  'わ': {
    char: 'わ',
    generalRule: 'Sổ thẳng đứng trước, thân tròn vòm mềm mại sau.',
    steps: [
      { num: 1, direction: 'Sổ thẳng', arrow: '↓', start: { x: 32, y: 18 }, tip: 'Sổ thẳng đứng từ trên xuống đáy.' },
      { num: 2, direction: 'Ziczac vòm tròn', arrow: 'Z⤾', start: { x: 44, y: 30 }, tip: 'Ngang, chéo xuống rồi uốn một vòng tròn lớn sang phải.' },
    ],
  },
  'を': {
    char: 'を',
    generalRule: 'Ngang trước, thân ziczac, nét vòm cắt ngang dưới sau.',
    steps: [
      { num: 1, direction: 'Ngang ngắn', arrow: '→', start: { x: 30, y: 28 }, tip: 'Nét ngang ngắn phần trên.' },
      { num: 2, direction: 'Xiên gập ngang', arrow: '↙→', start: { x: 50, y: 18 }, tip: 'Sổ chéo xuống rồi kéo ngang sang phải.' },
      { num: 3, direction: 'Vòm cắt đáy', arrow: '⤾', start: { x: 40, y: 54 }, tip: 'Uốn vòng cung cắt qua thân chữ ở đáy.' },
    ],
  },
  'ん': {
    char: 'ん',
    generalRule: '1 nét liền mạch lượn sóng từ trên xuống rồi hất vút lên phải.',
    steps: [
      { num: 1, direction: 'Xiên xuống rồi lượn vút', arrow: '↘⤴', start: { x: 36, y: 22 }, tip: 'Kéo xiên xuống đáy, đổi hướng lượn vòm rồi vút nhọn sang phải.' },
    ],
  },

  // ================= KATAKANA CHỌN LỌC =================
  'ア': {
    char: 'ア',
    generalRule: 'Ngang gập móc nhẹ trước, nét phẩy cong trái sau.',
    steps: [
      { num: 1, direction: 'Ngang gập xiên', arrow: '→↙', start: { x: 28, y: 30 }, tip: 'Kéo ngang rồi bẻ góc xiên xuống trái.' },
      { num: 2, direction: 'Phẩy cong trái', arrow: '↙', start: { x: 62, y: 30 }, tip: 'Kéo cong dài từ trên xuống đáy trái.' },
    ],
  },
  'イ': {
    char: 'イ',
    generalRule: 'Nét phẩy xiên trái trước, nét sổ thẳng đứng sau.',
    steps: [
      { num: 1, direction: 'Phẩy xiên trái', arrow: '↙', start: { x: 50, y: 20 }, tip: 'Phẩy xiên dứt khoát từ trên xuống trái.' },
      { num: 2, direction: 'Sổ thẳng đứng', arrow: '↓', start: { x: 42, y: 40 }, tip: 'Sổ thẳng đứng từ giữa nét 1 xuống đáy.' },
    ],
  },
  'ウ': {
    char: 'ウ',
    generalRule: 'Chấm đỉnh trước, nét sổ ngắn trái, ngang gập xiên sau.',
    steps: [
      { num: 1, direction: 'Chấm đỉnh', arrow: '↓', start: { x: 50, y: 16 }, tip: 'Chấm nét ngắn trên đầu.' },
      { num: 2, direction: 'Sổ ngắn trái', arrow: '↓', start: { x: 30, y: 36 }, tip: 'Nét sổ ngắn bên trái.' },
      { num: 3, direction: 'Ngang gập xiên', arrow: '→↙', start: { x: 30, y: 38 }, tip: 'Ngang sang phải, gập góc rồi xiên cong xuống trái.' },
    ],
  },
  'エ': {
    char: 'エ',
    generalRule: 'Ngang trên trước, sổ dọc giữa, ngang đáy sau cùng.',
    steps: [
      { num: 1, direction: 'Ngang trên', arrow: '→', start: { x: 32, y: 24 }, tip: 'Nét ngang trên ngắn.' },
      { num: 2, direction: 'Sổ giữa', arrow: '↓', start: { x: 50, y: 24 }, tip: 'Sổ thẳng đứng ở trục giữa.' },
      { num: 3, direction: 'Ngang đáy', arrow: '→', start: { x: 26, y: 76 }, tip: 'Nét ngang đáy dài vững chãi.' },
    ],
  },
  'オ': {
    char: 'オ',
    generalRule: 'Ngang trước, sổ có móc trái, nét phẩy xiên phải sau.',
    steps: [
      { num: 1, direction: 'Ngang', arrow: '→', start: { x: 26, y: 32 }, tip: 'Nét ngang thẳng.' },
      { num: 2, direction: 'Sổ móc', arrow: '↓⤴', start: { x: 48, y: 18 }, tip: 'Sổ thẳng cắt nét 1 rồi móc nhẹ sang trái.' },
      { num: 3, direction: 'Xiên phải', arrow: '↘', start: { x: 46, y: 44 }, tip: 'Nét xiên kéo từ giao điểm xuống phải.' },
    ],
  },
  'カ': {
    char: 'カ',
    generalRule: 'Ngang gập móc trước, nét phẩy xiên cắt sau (không có chấm phụ như か).',
    steps: [
      { num: 1, direction: 'Ngang gập móc', arrow: '→↓⤴', start: { x: 28, y: 32 }, tip: 'Kéo ngang, gập góc nhọn rồi móc nhẹ.' },
      { num: 2, direction: 'Phẩy xiên trái', arrow: '↙', start: { x: 54, y: 20 }, tip: 'Nét phẩy cong dài cắt qua nét 1 xuống đáy trái.' },
    ],
  },
  'サ': {
    char: 'サ',
    generalRule: 'Ngang dài trước, sổ thẳng trái ngắn, sổ thẳng phải dài.',
    steps: [
      { num: 1, direction: 'Ngang dài', arrow: '→', start: { x: 24, y: 36 }, tip: 'Nét ngang dài cân đối.' },
      { num: 2, direction: 'Sổ trái', arrow: '↓', start: { x: 40, y: 24 }, tip: 'Sổ ngắn cắt nét ngang.' },
      { num: 3, direction: 'Sổ phải', arrow: '↓', start: { x: 62, y: 24 }, tip: 'Sổ dài hơn nét trái, hơi cong nhẹ ở đáy.' },
    ],
  },
  'シ': {
    char: 'シ',
    generalRule: '2 chấm trên phẩy xuống trước, nét hất từ DƯỚI lên TRÊN sau.',
    steps: [
      { num: 1, direction: 'Chấm trên', arrow: '↘', start: { x: 34, y: 28 }, tip: 'Chấm ngắn thứ nhất ở trên.' },
      { num: 2, direction: 'Chấm giữa', arrow: '↘', start: { x: 30, y: 50 }, tip: 'Chấm ngắn thứ hai ở giữa.' },
      { num: 3, direction: 'Hất từ dưới lên', arrow: '↗', start: { x: 26, y: 80 }, tip: 'Bắt đầu từ ĐÁY TRÁI hất dứt khoát chéo lên ĐỈNH PHẢI.' },
    ],
  },
  'ツ': {
    char: 'ツ',
    generalRule: '2 chấm phẩy từ trên trước, nét chém từ TRÊN xuống DƯỚI sau.',
    steps: [
      { num: 1, direction: 'Chấm trái', arrow: '↘', start: { x: 34, y: 24 }, tip: 'Chấm ngắn bên trái.' },
      { num: 2, direction: 'Chấm phải', arrow: '↘', start: { x: 52, y: 34 }, tip: 'Chấm ngắn bên phải cao hơn nét 1.' },
      { num: 3, direction: 'Phẩy từ trên xuống', arrow: '↙', start: { x: 74, y: 22 }, tip: 'Bắt đầu từ ĐỈNH PHẢI kéo xiên dứt khoát xuống ĐÁY TRÁI.' },
    ],
  },
  'ン': {
    char: 'ン',
    generalRule: '1 chấm trên trước, nét hất từ DƯỚI lên TRÊN sau (như chữ シ nhưng chỉ có 1 chấm).',
    steps: [
      { num: 1, direction: 'Chấm trên', arrow: '↘', start: { x: 34, y: 32 }, tip: 'Chấm ngắn ở góc trên bên trái.' },
      { num: 2, direction: 'Hất từ dưới lên', arrow: '↗', start: { x: 28, y: 78 }, tip: 'Đặt bút ở ĐÁY TRÁI rồi hất vút chéo lên ĐỈNH PHẢI.' },
    ],
  },
  'ソ': {
    char: 'ソ',
    generalRule: '1 chấm ngắn trước, nét chém từ TRÊN xuống DƯỚI sau.',
    steps: [
      { num: 1, direction: 'Chấm trái', arrow: '↘', start: { x: 36, y: 26 }, tip: 'Nét chấm phẩy ngắn bên trái.' },
      { num: 2, direction: 'Phẩy từ trên xuống', arrow: '↙', start: { x: 70, y: 22 }, tip: 'Đặt bút ở ĐỈNH PHẢI kéo dứt khoát xuống ĐÁY TRÁI.' },
    ],
  },
};

/**
 * Intelligent stroke guide resolver with fallback for any Kana or Kanji character
 */
export function getStrokeGuide(char: string, totalStrokes: number): CharStrokeGuide {
  // 1. Direct match
  if (KANA_STROKE_GUIDES[char]) {
    return KANA_STROKE_GUIDES[char];
  }

  // 2. Dakuon / Handakuon characters
  const baseChar = char.replace(/[\u3099\u309A]/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (KANA_STROKE_GUIDES[baseChar]) {
    const baseGuide = KANA_STROKE_GUIDES[baseChar];
    return {
      char,
      generalRule: `${baseGuide.generalRule} Sau đó thêm dấu tenten (゛) hoặc maru (゜) ở góc trên bên phải.`,
      steps: [
        ...baseGuide.steps,
        {
          num: baseGuide.steps.length + 1,
          direction: 'Phẩy góc trên phải',
          arrow: '↘',
          start: { x: 75, y: 20 },
          tip: 'Nét phẩy tenten thứ nhất ở góc trên bên phải.',
        },
        {
          num: baseGuide.steps.length + 2,
          direction: 'Phẩy góc trên phải',
          arrow: '↘',
          start: { x: 82, y: 28 },
          tip: 'Nét phẩy tenten thứ hai song song phía dưới nét trước.',
        },
      ].slice(0, totalStrokes),
    };
  }

  // 3. Fallback generic stroke order generator based on standard Japanese calligraphy rules
  const fallbackSteps: StrokeStep[] = [];
  for (let i = 1; i <= totalStrokes; i++) {
    let arrow = '↓';
    let direction = 'Từ trên xuống dưới';
    let start = { x: 30 + (i * 12) % 40, y: 20 + (i * 15) % 55 };
    let tip = `Nét ${i}: Bút thuận tiếng Nhật - Viết theo thứ tự từ trên xuống dưới, từ trái sang phải.`;

    if (i === 1) {
      arrow = '→';
      direction = 'Nét ngang khởi đầu';
      start = { x: 28, y: 28 };
      tip = 'Nét 1: Bắt đầu từ phía trên hoặc bên trái, kéo ngang hoặc phẩy dứt khoát.';
    } else if (i === totalStrokes) {
      arrow = totalStrokes > 2 ? '→' : '↓⤴';
      direction = 'Nét kết thúc đáy';
      start = { x: 35, y: 72 };
      tip = `Nét ${i}: Nét kết thúc ở đáy chữ, hoàn thiện kết cấu cân đối.`;
    }

    fallbackSteps.push({ num: i, direction, arrow, start, tip });
  }

  return {
    char,
    generalRule: `Quy tắc chuẩn (${totalStrokes} nét): Từ trên xuống dưới, từ trái sang phải, nét ngang trước nét sổ sau.`,
    steps: fallbackSteps,
  };
}
