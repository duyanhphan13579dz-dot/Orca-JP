import { JLPTLevel } from '../types';

export interface NuanceDuel {
  id: string;
  level: JLPTLevel;
  patternA: string;
  patternB: string;
  title: string;
  coreDifference: string;
  whenToUseA: string;
  whenToUseB: string;
  mnemonicTrick: string;
  exampleA: { jp: string; vi: string };
  exampleB: { jp: string; vi: string };
  commonTrap: string;
}

export const NUANCE_PAIRS: NuanceDuel[] = [
  // --- N5 NUANCES ---
  {
    id: 'nuance-wa-ga',
    level: 'N5',
    patternA: 'N は',
    patternB: 'N が',
    title: 'Trợ từ は (Wa) vs が (Ga)',
    coreDifference: 'は nhấn mạnh thông tin VỊ NGỮ phía sau (chủ đề câu chuyện); が nhấn mạnh chính CHỦ THỂ phía trước hoặc miêu tả hiện tượng tự nhiên khách quan.',
    whenToUseA: 'Dùng は khi giới thiệu bản thân, đưa ra thông tin mới về đối tượng đã biết.',
    whenToUseB: 'Dùng が khi trả lời câu hỏi "Ai / Cái gì?", hoặc miêu tả sự việc trước mắt (Trời mưa: 雨が降る).',
    mnemonicTrick: 'Mẹo: は nhìn ra sau (hướng ra câu chuyện), が ghìm chặt về trước (chính danh từ đó!).',
    exampleA: { jp: '私は田中です。', vi: 'Tôi là Tanaka (Thông tin quan trọng là "Tanaka").' },
    exampleB: { jp: '私が田中です。', vi: 'CHÍNH TÔI là Tanaka (Người bạn đang tìm chính là tôi!).' },
    commonTrap: 'Trong câu có từ để hỏi đứng đầu câu (Ai, Cái gì: だれ, なに) thì BẮT BUỘC dùng が, không dùng は (Ai đến đấy? -> だれが来ましたか).',
  },
  {
    id: 'nuance-ni-de',
    level: 'N5',
    patternA: 'Địa điểm + に',
    patternB: 'Địa điểm + で',
    title: 'Địa điểm に (Ni) vs で (De)',
    coreDifference: 'に chỉ sự TỒN TẠI tĩnh (ở đó có gì) hoặc đích đến; で chỉ nơi HÀNH ĐỘNG diễn ra hoặc phương tiện tiến hành.',
    whenToUseA: 'Dùng với động từ tồn tại (ある, いる, 住む) hoặc đích đến (行く, 着く).',
    whenToUseB: 'Dùng với bất kỳ động từ có tính hành động, động tác (ăn, học, chơi, làm việc: 食べる, 勉強する).',
    mnemonicTrick: 'Có động tác vận động -> chọn で; Chỉ đứng yên tồn tại hoặc mũi tên hướng tới -> chọn に.',
    exampleA: { jp: '部屋に猫がいます。', vi: 'Có một con mèo ở trong phòng.' },
    exampleB: { jp: '部屋で勉強します。', vi: 'Tôi học bài ở trong phòng.' },
    commonTrap: 'Sự kiện diễn ra (Hội nghị, tiệc, kỳ thi) dù mang tính tồn tại nhưng là "sự kiện tổ chức" nên dùng で (東京で会議がある).',
  },
  {
    id: 'nuance-kara-made-ni',
    level: 'N5',
    patternA: 'まで (Made)',
    patternB: 'までに (Made ni)',
    title: 'Hạn định: まで vs までに',
    coreDifference: 'まで biểu thị hành động diễn ra LIÊN TỤC kéo dài suốt từ đầu đến mốc thời gian; までに biểu thị HẠN CHÓT (chỉ cần hoàn thành XONG trước thời điểm đó).',
    whenToUseA: 'Dùng với hành động kéo dài (học từ 7h ĐẾN 9h, đợi ĐẾN chiều: 待つ, 働く).',
    whenToUseB: 'Dùng khi nộp bài, thanh toán, đến nơi (chỉ hoàn thành 1 lần trước deadline: 出す, 払う, 終わる).',
    mnemonicTrick: 'までに có "Ni" là ĐIỂM HẠN CHÓT duy nhất! Không phải kéo dài liên tục.',
    exampleA: { jp: '5時まで仕事をします。', vi: 'Tôi làm việc liên tục đến tận 5 giờ chiều.' },
    exampleB: { jp: '5時までにレポートを出してください。', vi: 'Hãy nộp báo cáo trước 5 giờ chiều (Hạn chót).' },
    commonTrap: 'Đề thi thường gài động từ nộp bài 提出する hoặc 帰る với まで thay vì までに.',
  },

  // --- N4 NUANCES ---
  {
    id: 'nuance-tara-ba-to-nara',
    level: 'N4',
    patternA: '～たら (Tara)',
    patternB: '～ば (Ba) / ～と (To)',
    title: 'Bộ tứ điều kiện: ～たら vs ～ば / ～と',
    coreDifference: '～たら có phạm vi rộng nhất (dùng được cho ý chí, mệnh lệnh); ～と chỉ quy luật tự nhiên/máy móc tất yếu (Hễ A thì B); ～ば là điều kiện giả định thuần túy.',
    whenToUseA: 'Dùng たら khi vế sau có rủ rê, mệnh lệnh, ý chí (Nếu rảnh thì ĐI CHƠI NHÉ: 暇だったら、遊びに行こう).',
    whenToUseB: 'Dùng と khi nói sự thật hiển nhiên (Ấn nút thì nước chảy: ボタンを押すと、水が出る). KHÔNG dùng と cho câu rủ rê!',
    mnemonicTrick: 'たら là vạn năng (chấp hết mời mọc, rủ rê); と là chân lý khách quan (cấm vế sau mời mọc).',
    exampleA: { jp: '雨が降ったら、行きません。', vi: 'Nếu trời mưa thì tôi sẽ không đi (Quyết định cá nhân).' },
    exampleB: { jp: '春になると、桜が咲きます。', vi: 'Hễ mùa xuân đến là hoa anh đào nở (Quy luật tự nhiên tất yếu).' },
    commonTrap: 'Không bao giờ dùng "と" khi vế sau là "してください" hoặc "しましょう"!',
  },
  {
    id: 'nuance-temiru-teshimau',
    level: 'N4',
    patternA: '～てみる (Te miru)',
    patternB: '～てしまう (Te shimau)',
    title: 'Phụ trợ: ～てみる vs ～てしまう',
    coreDifference: '～てみる mang sắc thái THỬ LÀM LẦN ĐẦU xem thế nào; ～てしまう biểu thị sự HOÀN TẤT TRIỆT ĐỂ hoặc sự HỐI TIẾC, lỡ làm điều không mong muốn.',
    whenToUseA: 'Dùng khi muốn trải nghiệm món ăn mới, mặc thử áo quần, đi thử nơi mới.',
    whenToUseB: 'Dùng khi lỡ làm mất ví, ăn hết sạch mất rồi, hoặc trót lỡ miệng.',
    mnemonicTrick: 'Miru là "xem sao" (thử); Shimau là "tiêu rồi / xong xuôi hết rồi".',
    exampleA: { jp: '納豆を食べてみます。', vi: 'Tôi sẽ ăn thử món Natto xem sao.' },
    exampleB: { jp: '財布を忘れてしまいました。', vi: 'Tôi trót để quên ví mất rồi (Hối tiếc).' },
    commonTrap: 'てしまう trong văn nói thường biến âm thành ちゃう (Chau) hoặc じゃう (Jau).',
  },
  {
    id: 'nuance-tearu-teiru',
    level: 'N4',
    patternA: 'V-てある (Te aru)',
    patternB: 'V-ておく (Te oku)',
    title: 'Trạng thái chuẩn bị: ～てある vs ～ておく',
    coreDifference: '～ておく là HÀNH ĐỘNG chuẩn bị trước cho tương lai; ～てある là KẾT QUẢ/TRẠNG THÁI của một hành động đã được chuẩn bị sẵn có chủ đích.',
    whenToUseA: 'Dùng てある khi nhìn vào kết quả trước mắt (Cửa sổ đang được mở sẵn, lịch đã được dán sẵn).',
    whenToUseB: 'Dùng ておく khi chính bản thân chuẩn bị làm trước (Trước khi đi du lịch tôi sẽ ĐẶT PHÒNG TRƯỚC).',
    mnemonicTrick: 'ておく là "Hành động chuẩn bị trước"; てある là "Kết quả đã xong xuôi sẵn sàng".',
    exampleA: { jp: 'カレンダーに予定が書いてあります。', vi: 'Dự định đã được viết sẵn trên lịch (Trạng thái hiện tại).' },
    exampleB: { jp: '旅行の前にホテルを予約しておきます。', vi: 'Tôi sẽ đặt phòng khách sạn trước chuyến đi (Hành động).' },
    commonTrap: 'V-てある luôn đi với Tha động từ nhưng trợ từ đứng trước là が (Bia đã được ướp lạnh: ビールが冷やしてある).',
  },

  // --- N3 NUANCES ---
  {
    id: 'nuance-uchini-aidani',
    level: 'N3',
    patternA: '～うちに (Uchi ni)',
    patternB: '～あいだに (Aida ni)',
    title: 'Khoảng thời gian: ～うちに vs ～あいだに',
    coreDifference: '～うちに nhấn mạnh nếu KHÔNG LÀM NGAY thì điều kiện thuận lợi sẽ biến mất; ～あいだに chỉ đơn thuần là một mốc thời gian khách quan có điểm đầu và điểm cuối.',
    whenToUseA: 'Dùng khi trạng thái có thể biến đổi (Trong lúc còn nóng hãy ăn đi, trong lúc chưa mưa hãy về: 熱いうちに食べて).',
    whenToUseB: 'Dùng khi nói hai sự việc diễn ra trong cùng một khung thời gian (Trong lúc mẹ đang nấu ăn thì tôi làm bài tập).',
    mnemonicTrick: 'Uchi ni chứa đựng sự "TRANH THỦ" cấp bách trước khi điều kiện biến mất!',
    exampleA: { jp: '若いうちに、たくさん勉強しなさい。', vi: 'Hãy tranh thủ học nhiều khi còn trẻ (Kẻo già rồi sẽ muộn).' },
    exampleB: { jp: '母が料理している間に、掃除しました。', vi: 'Trong lúc mẹ đang nấu ăn, tôi đã dọn nhà.' },
    commonTrap: 'Không dùng うちに cho các khoảng thời gian cố định như "Trong giờ học" hay "Trong kỳ nghỉ hè" (hãy dùng あいだに).',
  },
  {
    id: 'nuance-wakedehanai-hazuganai',
    level: 'N3',
    patternA: '～わけではない',
    patternB: '～はずがない',
    title: 'Phủ định sắc thái: ～わけではない vs ～はずがない',
    coreDifference: '～わけではない là PHỦ ĐỊNH MỘT PHẦN ("Không hẳn là..."); ～はずがない là PHỦ ĐỊNH TUYỆT ĐỐI dựa trên bằng chứng logic ("Tuyệt đối không thể có chuyện...").',
    whenToUseA: 'Dùng khi muốn đính chính khéo léo để không làm mất lòng (Không hẳn là ghét, chỉ là không ăn được cay).',
    whenToUseB: 'Dùng khi tin tưởng chắc chắn 100% điều đó là phi lý (Anh ấy vừa ở đây, tuyệt đối không thể là kẻ trộm).',
    mnemonicTrick: 'Wake dewa nai là "Nói thế thôi chứ không hẳn"; Hazu ga nai là "Chắc chắn 100% không đời nào!".',
    exampleA: { jp: '嫌いなわけではないが、辛い物が苦手だ。', vi: 'Không hẳn là tôi ghét, chỉ là tôi không ăn cay được.' },
    exampleB: { jp: 'そんな嘘をつくはずがない。', vi: 'Anh ấy tuyệt đối không thể nào nói lời nói dối như vậy được!' },
    commonTrap: 'Hazu ga nai tương đương nghĩa với わけがない, nhưng đối lập hoàn toàn với sắc thái lưng chừng của わけではない.',
  },
  {
    id: 'nuance-youtosuru-kotoninaru',
    level: 'N3',
    patternA: 'V-ようとする',
    patternB: 'V-ことになる',
    title: 'Ý chí vs Quyết định khách quan: ～ようとする vs ～ことになる',
    coreDifference: 'V-ようとする diễn tả hành động NGAY TRƯỚC KHI BẮT ĐẦU hoặc nỗ lực làm gì; V-ことになる diễn tả quyết định KHÁCH QUAN do tập thể, hoàn cảnh đưa ra (không do cá nhân quyết định hoàn toàn).',
    whenToUseA: 'Dùng khi vừa định bước lên tàu thì cửa đóng, hoặc em bé đang cố gắng đứng dậy.',
    whenToUseB: 'Dùng khi công ty điều chuyển công tác, nhà trường quyết định lịch nghỉ.',
    mnemonicTrick: 'You to suru là "Đang rướn người chuẩn bị làm"; Koto ni naru là "Bị/Được an bài bởi quy định hoàn cảnh".',
    exampleA: { jp: '電車に乗ろうとしたとき、ドアが閉まった。', vi: 'Đúng lúc tôi vừa định bước lên tàu thì cửa đóng lại.' },
    exampleB: { jp: '来月から大阪へ転勤することになりました。', vi: 'Tôi đã được quyết định chuyển công tác về Osaka từ tháng sau.' },
    commonTrap: 'Phân biệt ことにする (Bản thân tự mình quyết định) và ことになる (Tổ chức/hoàn cảnh quyết định).',
  },
  {
    id: 'nuance-taishite-nituite',
    level: 'N3',
    patternA: '～に対して (Taishite)',
    patternB: '～について (Tsuite)',
    title: 'Đối tượng: ～に対して vs ～について',
    coreDifference: '～について là chủ đề nghiên cứu, thông tin bàn luận ("Về vấn đề gì..."); ～に対して là HƯỚNG TÁC ĐỘNG đối đầu hoặc SO SÁNH TƯƠNG PHẢN giữa 2 vế.',
    whenToUseA: 'Dùng khi thể hiện thái độ đối với ai đó (Tử tế với khách hàng) hoặc so sánh (Anh trai chăm chỉ trái ngược với em trai lười biếng).',
    whenToUseB: 'Dùng khi phát biểu, điều tra, viết văn về một chủ đề (Tôi muốn phát biểu về môi trường).',
    mnemonicTrick: 'Tsuite là "bàn VỀ thông tin"; Taishite là "hướng ĐỐI MẶT tác động hoặc tương phản".',
    exampleA: { jp: 'お客様に対して、失礼な態度をとってはいけない。', vi: 'Không được có thái độ thất lễ đối với khách hàng.' },
    exampleB: { jp: '日本の歴史について調べています。', vi: 'Tôi đang tìm hiểu về lịch sử Nhật Bản.' },
    commonTrap: 'Đối với quan điểm cá nhân ("Đối với tôi...") thì phải dùng ～にとって, không dùng について.',
  },
  {
    id: 'nuance-warini-nishiteva',
    level: 'N3',
    patternA: '～わりに(は)',
    patternB: '～にしては',
    title: 'Mức độ ngoài dự đoán: ～わりに(は) vs ～にしては',
    coreDifference: '～わりに(は) dùng được cho cả từ có cấp độ rộng (tuổi tác, giá tiền, thời gian); ～にしては BẮT BUỘC đi với danh từ CỤ THỂ, cá biệt hoặc con số xác thực (một mốc cụ thể).',
    whenToUseA: 'Dùng với từ mang tính tương đối (Giá rẻ, tuổi trẻ, ăn nhiều: 値段のわりに美味しい).',
    whenToUseB: 'Dùng với danh từ cụ thể xác định (Đã học 3 năm mà nói kém, là trẻ con 5 tuổi mà vẽ đẹp: 3年勉強したにしては).',
    mnemonicTrick: 'Warini đi với khái niệm chung; Nishite wa đi với con số/đối tượng cụ thể!',
    exampleA: { jp: 'この料理は値段のわりに、とても美味しい。', vi: 'Món ăn này ngon bất ngờ so với mức giá của nó.' },
    exampleB: { jp: '彼は日本語を10年勉強したにしては、下手だ。', vi: 'So với việc anh ta đã học tiếng Nhật hẳn 10 NĂM CỤ THỂ, thì nói còn kém.' },
    commonTrap: 'Không nói "値段にしては" vì 値段 không phải con số cụ thể, phải nói "100円にしては" hoặc "値段のわりに".',
  },
];
