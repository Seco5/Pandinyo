// ---- Story Mode data model ----

export type SceneId =
  | 'waiting_room'
  | 'open_office'
  | 'conference'
  | 'email_desk'
  | 'manager_office'
  | 'video_call'
  | 'stage'
  | 'night_office'
  | 'ceo_office'
  | 'dark_room';

export interface StoryQuestion {
  prompt: string;
  options: string[];
  answer: number; // index of the correct option (options are shuffled at runtime)
}

export interface StoryChoice {
  text: string; // English choice sentence
  score: number; // hidden score delta
  result: string; // short Turkish outcome line
}

export interface StoryChapter {
  index: number; // 0-based
  title: string;
  scene: SceneId;
  story: string; // Turkish intro (2-3 sentences)
  challengeIntro: string;
  questions: StoryQuestion[]; // 5
  npc: string; // choice-scene dialogue (English)
  choices: StoryChoice[]; // 2 options [A, B]
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  cover: SceneId;
  free: boolean;
  quarter?: string; // for locked stories
}

export type Ending = 'ceo' | 'director' | 'manager' | 'fired';

// ---- Career chain: three cards. Card 1 is free & always open; Card 2 is free
// but unlocks only after finishing Card 1 with a ★★★ (Yükselen Yıldız) result;
// Card 3 is premium (future update). ----
export type CardResult = 'star3' | 'star2' | 'star1';

export interface CareerCard {
  id: string;
  title: string;
  subtitle: string;
  range: string; // career range, e.g. "Intern → Junior"
  cover: SceneId;
  tier: 'free' | 'conditional' | 'premium';
}

export const careerCards: CareerCard[] = [
  { id: 'career', title: 'İlk Adım', subtitle: 'Genel Yetenek Programı · 10 bölüm', range: 'Intern → Junior', cover: 'open_office', tier: 'free' },
  { id: 'career2', title: 'Yöneticilik Yolu', subtitle: 'Junior → Müdür · 10 bölüm', range: 'Junior → Müdür', cover: 'manager_office', tier: 'conditional' },
  { id: 'career3', title: 'Zirveye Son Adım', subtitle: 'Müdür → CEO · 10 bölüm', range: 'Müdür → CEO', cover: 'ceo_office', tier: 'premium' },
];

// Card 2 opens only when Card 1 is finished as a Rising Star (★★★).
export function card2Unlocked(card1Result: CardResult | null | undefined): boolean {
  return card1Result === 'star3';
}

export const stories: Story[] = [
  { id: 'career', title: 'İlk Adım', subtitle: 'Genel Yetenek Programı · 10 bölüm', cover: 'open_office', free: true },
];

export const careerChapters: StoryChapter[] = [
  {
    index: 0,
    title: 'İlk Gün',
    scene: 'open_office',
    story: 'Genel Yetenek Programı\'nın ilk günü. Yeni mezun olarak şirkete adım attın; oryantasyon ve ekiple tanışma var. İlk izlenim her şeydir.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — kendini tanıtma ve küçük konuşma.',
    questions: [
      {
        prompt: 'İlk günün. Bir ekip arkadaşın gülümseyerek soruyor: "Welcome! How\'s your first day going?"',
        options: [
          'It is the first day of my employment at this organization today.',
          'I would be most grateful to report that everything proceeds agreeably.',
          'Thanks! A bit nervous, but everyone\'s been really welcoming.',
          'Fine.',
        ],
        answer: 2,
      },
      {
        prompt: 'Ekip mutfağa kahve almaya gidiyor: "We\'re grabbing coffee — want to come?"',
        options: [
          'Sure, I\'d love to.',
          'I would be truly delighted to accompany you for a hot beverage at this moment.',
          'I have quite a lot of things to settle today so possibly, I am not sure yet.',
          'No.',
        ],
        answer: 0,
      },
      {
        prompt: 'Yöneticin "Let me know if you need anything, okay?" dedi. En doğal yanıt?',
        options: [
          'I shall most certainly inform you should any requirement arise.',
          'Okay, I will tell you later if there is something that I happen to need from you.',
          'Probably not.',
          'Will do — thanks!',
        ],
        answer: 3,
      },
      {
        prompt: 'Biri geçmişini soruyor: "So, what\'s your background?" Burada biraz açman beklenir.',
        options: [
          'Stuff, mostly.',
          'I studied marketing and spent two years running digital campaigns before this.',
          'My academic formation resides within the domain of marketing sciences.',
          'University.',
        ],
        answer: 1,
      },
      {
        prompt: 'Ekibe kendini tek cümleyle tanıt.',
        options: [
          'Greetings, I am most honoured to make your distinguished acquaintance.',
          'I am the new person who just started working here in this team today.',
          'Hi, I\'m Alex — glad to be on the team!',
          'Hey.',
        ],
        answer: 2,
      },
    ],
    npc: 'We have a team lunch today. Want to join us?',
    choices: [
      { text: 'Maybe next time — I should settle in first.', score: -15, result: 'Daveti geçiştirdin. Ekiple kaynaşma fırsatını kaçırdın.' },
      { text: 'I\'d love to, thanks.', score: 25, result: 'Daveti kabul ettin. Ekip seni hemen benimsedi.' },
    ],
  },
  {
    index: 1,
    title: 'Takım Toplantısı',
    scene: 'conference',
    story: 'Pazarlama ekibinin haftalık toplantısındasın. Yeni biri olarak fikir paylaşmak istiyorsun ama doğru anı ve doğru dili bulmalısın.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — toplantıda fikir paylaşma.',
    questions: [
      {
        prompt: 'Pazarlama toplantısındasın ve söze girmek istiyorsun. En doğal giriş?',
        options: [
          'If I may be permitted to interject a brief observation at this juncture...',
          'Can I add something here?',
          'Listen to me now please everyone.',
          'I have an idea that I would like to share with all of you if that is fine.',
        ],
        answer: 1,
      },
      {
        prompt: 'Bir arkadaşının fikrini beğendin, üstüne eklemek istiyorsun: "Building on that idea..."',
        options: [
          'Same as Sara, basically.',
          'I wholeheartedly endorse the aforementioned and most excellent proposal.',
          'We could test Sara\'s idea with a small group first.',
          'Yes, good.',
        ],
        answer: 2,
      },
      {
        prompt: 'Bir noktada başkasının fikrine katılmıyorsun. Nazikçe nasıl belirtirsin?',
        options: [
          'You\'re wrong.',
          'I must respectfully and most categorically dissent from that view.',
          'I see it a bit differently.',
          'I don\'t really agree with what you just said about that thing.',
        ],
        answer: 2,
      },
      {
        prompt: 'Fikrin soruldu ama emin değilsin. En profesyonel yanıt?',
        options: [
          'No idea.',
          'I\'d like to think it over and get back to you this afternoon.',
          'I shall require a considerable period of further deliberation on this.',
          'Um, I am not sure, maybe, I don\'t know really, let me see.',
        ],
        answer: 1,
      },
      {
        prompt: 'Toplantı bitti, notları sen göndereceksin: "Who\'ll send the recap?"',
        options: [
          'I\'ll send the notes after this.',
          'The minutes shall be duly dispatched to all attendees forthwith.',
          'Notes are going to be sent out by me to everybody a bit later today.',
          'Ok.',
        ],
        answer: 0,
      },
    ],
    npc: 'Would you like to present this idea to the team next week?',
    choices: [
      { text: 'I\'m not sure I\'m ready for that.', score: -15, result: 'Fırsattan çekindin. Görünürlük şansını kaçırdın.' },
      { text: 'Yes — I\'ll prepare it well.', score: 25, result: 'Sorumluluğu üstlendin. Ekipte gözün var artık.' },
    ],
  },
  {
    index: 2,
    title: 'Müşteri E-postası',
    scene: 'email_desk',
    story: 'Müşteri İlişkileri\'ne rotasyondasın. Bir müşteriye yazılı yanıt vermen gerekiyor; tonu doğru ayarlamak işin püf noktası.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — yazılı iletişim ve ton.',
    questions: [
      {
        prompt: 'Bir müşteri yaşadığı sorun için kızgın bir e-posta attı. Yanıtına nasıl başlarsın?',
        options: [
          'Sorry for the problem.',
          'Thank you for flagging this — I\'m sorry for the trouble it caused.',
          'We hereby acknowledge receipt of your grievance and regret any disturbance.',
          'Hey, got your message about the issue you had with us.',
        ],
        answer: 1,
      },
      {
        prompt: 'Müşteri kısa bir durum güncellemesi bekliyor: "Any update?"',
        options: [
          'I am writing to formally inform you that the matter has now been duly resolved as requested.',
          'The thing you asked about is something we are still kind of looking into right now.',
          'Quick update: it\'s fixed and live now.',
          'Done.',
        ],
        answer: 2,
      },
      {
        prompt: 'Sorunu telafi etmek için bir çözüm sunacaksın.',
        options: [
          'We will do something for you.',
          'To make up for it, I\'d like to offer you a free month.',
          'As humble recompense, kindly accept this modest gesture of our sincere goodwill.',
          'Maybe we can give you something to make things a little better somehow.',
        ],
        answer: 1,
      },
      {
        prompt: 'E-postaya bir konu (subject) satırı yazacaksın.',
        options: [
          'Re: Your order — fixed',
          'A Sincere Apology Regarding the Recent Unfortunate Incident You Experienced',
          'Problem',
          'About the thing that you wrote to us about earlier',
        ],
        answer: 0,
      },
      {
        prompt: 'E-postayı kapatıyorsun. En doğal kapanış?',
        options: [
          'Please do not remain upset with us.',
          'I remain your most humble and obedient servant in this matter.',
          'Thanks for your patience — I\'m here if you need anything.',
          'Bye.',
        ],
        answer: 2,
      },
    ],
    npc: 'Thanks for the reply. Can we hop on a call tomorrow?',
    choices: [
      { text: 'Tomorrow\'s packed — maybe next week?', score: -15, result: 'Müşteriyi beklettin. İlgisiz göründün.' },
      { text: 'Of course — just tell me a time.', score: 25, result: 'Hızlı ve esnek davrandın. Güveni geri kazandın.' },
    ],
  },
  {
    index: 3,
    title: 'Hafta Sonu Daveti',
    scene: 'open_office',
    story: 'Ekip arkadaşların hafta sonu için sosyal bir plan yapıyor. Nazik olmak ile sınır koymak arasında doğru dengeyi bulmalısın.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — sosyal sınırlar, nazik kabul/red.',
    questions: [
      {
        prompt: 'Ekip arkadaşların cuma akşamı dışarı çıkıyor: "We\'re going out Friday — you in?"',
        options: [
          'I would be most delighted to attend your kind social gathering.',
          'Sounds fun — count me in!',
          'Maybe I will come along if nothing else ends up happening that evening.',
          'No.',
        ],
        answer: 1,
      },
      {
        prompt: 'Bu sefer gelemiyorsun ama kırıcı olmak istemiyorsun. Nazik red?',
        options: [
          'I\'m busy.',
          'Regrettably, I find myself compelled to decline your kind invitation herewith.',
          'I can\'t make it this time, but thanks for asking!',
          'I don\'t really want to go to that thing on Friday night honestly.',
        ],
        answer: 2,
      },
      {
        prompt: 'Biraz ısrar ediyorlar. Kapıyı kapatmadan nasıl yanıtlarsın?',
        options: [
          'Next time for sure!',
          'Perhaps on some future occasion it may conceivably become possible for me.',
          'I already told you that I am not able to come to this, please.',
          'Stop asking.',
        ],
        answer: 0,
      },
      {
        prompt: 'Yarın önemli bir sunumun var, arkadaşların geç saate kadar kalmanı istiyor. En olgun karar?',
        options: [
          'I\'ll stay out — it\'ll be fine.',
          'I shall partake but briefly and thereafter retire to my preparations.',
          'I\'ll join for an hour, then head home to prep.',
          'I can\'t, I have very important work matters to attend to.',
        ],
        answer: 2,
      },
      {
        prompt: 'Seni düşündükleri için teşekkür et.',
        options: [
          'Your kind consideration is most graciously and deeply appreciated by me.',
          'Thanks for thinking of me!',
          'It is really nice that you thought about inviting me to this thing.',
          'Ok thanks.',
        ],
        answer: 1,
      },
    ],
    npc: 'Come on — stay out late with us tonight!',
    choices: [
      { text: 'Sure, why not.', score: -15, result: 'Geç saate kaldın; ertesi gün sunumda yorgundun.' },
      { text: 'I\'ll head home — big day tomorrow.', score: 25, result: 'Sağlıklı bir sınır koydun. Sunuma hazır geldin.' },
    ],
  },
  {
    index: 4,
    title: 'Proje Gecikmesi',
    scene: 'manager_office',
    story: 'Operasyon ekibindesin ve bir proje gecikti. Kötü haberi yöneticine nasıl ve ne zaman vereceğin, güveni belirleyecek.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — kötü haber verme, sorumluluk alma.',
    questions: [
      {
        prompt: 'Proje birkaç gün gecikecek. Yöneticine durumu nasıl iletirsin?',
        options: [
          'There might be a tiny little delay, maybe, possibly.',
          'I want to flag that the project will be a few days late.',
          'It is with the deepest regret that I must convey most unfortunate tidings.',
          'The thing won\'t be ready on the day we said it would be ready.',
        ],
        answer: 1,
      },
      {
        prompt: 'Yöneticin "Why didn\'t this get done?" diyor. Sorumluluğu nasıl alırsın?',
        options: [
          'It wasn\'t really my fault, to be honest.',
          'I hereby accept full and complete responsibility for this grievous lapse.',
          'That\'s on me — here\'s my plan to fix it.',
          'A lot of different things went wrong and it got complicated to handle.',
        ],
        answer: 2,
      },
      {
        prompt: 'Toparlanma planını anlatıyorsun.',
        options: [
          'I\'ll try to finish soon.',
          'I\'ll have it ready by Thursday and send daily updates.',
          'Rest assured the matter shall be expedited with the utmost posthaste.',
          'I am going to work on it and get it all done at some point soon.',
        ],
        answer: 1,
      },
      {
        prompt: 'Yöneticin "Will this happen again?" diye soruyor.',
        options: [
          'No — I\'ve already fixed the cause.',
          'I shall earnestly endeavour to ensure no such recurrence whatsoever.',
          'Probably not, but honestly who really knows for sure.',
          'I certainly do hope that it will not happen again.',
        ],
        answer: 0,
      },
      {
        prompt: 'Özür dileyeceksin ama ezik görünmek istemiyorsun.',
        options: [
          'I am so, so sorry, please forgive me, it was all terrible of me.',
          'My most profound apologies for this truly lamentable lapse of mine.',
          'Sorry for the delay — it won\'t slip again.',
          'The delay happened and now I am telling you all about it.',
        ],
        answer: 2,
      },
    ],
    npc: 'When were you planning to tell me about the delay?',
    choices: [
      { text: 'I wanted to fix it first, then tell you.', score: -15, result: 'Gecikmeyi sakladın; güven biraz sarsıldı.' },
      { text: 'Right away — that\'s why I\'m here.', score: 25, result: 'Dürüst ve hızlı davrandın. Güvenin arttı.' },
    ],
  },
  {
    index: 5,
    title: 'Performans Görüşmesi',
    scene: 'manager_office',
    story: 'İK ile ilk performans görüşmen. Geri bildirim alacak, gerektiğinde kendini sakin ve net biçimde savunacaksın.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — geri bildirim alma, kendini savunma.',
    questions: [
      {
        prompt: 'İK ile performans görüşmesi. Olumlu bir geri bildirim aldın. En doğal yanıt?',
        options: [
          'I am most deeply grateful for your invaluable and generous critique.',
          'Thanks — that\'s good to hear.',
          'Okay, I will think about everything that you have just told me now.',
          'I disagree.',
        ],
        answer: 1,
      },
      {
        prompt: 'Sana göre haksız bir eleştiri geldi. Sessiz kalmak yerine ne yaparsın?',
        options: [
          'Okay, you\'re right.',
          'I shall accept this judgement in respectful silence as is proper.',
          'I see it differently — can I share my side?',
          'That is just not true at all and you are being unfair to me.',
        ],
        answer: 2,
      },
      {
        prompt: 'Gerçek bir gelişim alanın soruldu: "What\'s a weakness you\'re working on?"',
        options: [
          'I have no weaknesses.',
          'I\'m working on delegating more.',
          'My sole shortcoming is, regrettably, an excess of diligence.',
          'I think I am honestly pretty good at most of the things actually.',
        ],
        answer: 1,
      },
      {
        prompt: 'Bu yılki başarıların soruldu. Bağlama uygun yanıt?',
        options: [
          'I did a lot of stuff.',
          'I led the client onboarding and cut setup time in half.',
          'My contributions throughout the year have been manifold and considerable.',
          'I worked really hard on a lot of different things this past year.',
        ],
        answer: 1,
      },
      {
        prompt: 'Görüşmeyi olumlu kapat.',
        options: [
          'So, did I pass or not?',
          'I shall implement your esteemed counsel forthwith and without delay.',
          'Thanks — I\'ll act on this.',
          'Okay, well, I guess that we are done with this meeting now then.',
        ],
        answer: 2,
      },
    ],
    npc: 'Honestly, I felt your communication was weak this year.',
    choices: [
      { text: 'You\'re right, I\'ll accept that.', score: -10, result: 'Haksız eleştiriyi sessizce kabul ettin. Değerin görülmedi.' },
      { text: 'I hear you — but I sent weekly updates to the whole team. Can we look at them?', score: 25, result: 'Kendini saygılı ama net savundun. İK fikrini değiştirdi.' },
    ],
  },
  {
    index: 6,
    title: 'Ekip Çatışması',
    scene: 'open_office',
    story: 'Pazarlama ekibinde iki arkadaşın anlaşmazlığa düştü ve sana danışıyorlar. Diplomasi ve arabuluculuk zamanı.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — arabuluculuk, diplomasi.',
    questions: [
      {
        prompt: 'İki ekip arkadaşın tartışıyor ve senden taraf seçmeni istiyorlar: "Whose side are you on?"',
        options: [
          'Tom\'s right, obviously.',
          'Let\'s hear both sides first.',
          'I shall impartially adjudicate this dispute between the two of you.',
          'I really don\'t want to get involved in this argument of yours at all.',
        ],
        answer: 1,
      },
      {
        prompt: 'Gerginliği yumuşatmak istiyorsun.',
        options: [
          'Just stop arguing.',
          'We all want the same outcome — let\'s focus on that.',
          'Pray, cease this most unseemly and regrettable quarrel at once.',
          'Can you both please just be quiet and calm down right now please.',
        ],
        answer: 1,
      },
      {
        prompt: 'Biri sana içini döküyor. Empati göster.',
        options: [
          'You\'re overreacting.',
          'Your evident vexation is wholly comprehensible to me indeed.',
          'I get why you\'re frustrated.',
          'Okay, well, that is just kind of how things are sometimes, you know.',
        ],
        answer: 2,
      },
      {
        prompt: 'Bir çözüm yolu öner.',
        options: [
          'Figure it out yourselves.',
          'How about we sit down together and sort it out?',
          'I propose the immediate initiation of a formal mediation procedure.',
          'Maybe you two should probably just talk about it together or something.',
        ],
        answer: 1,
      },
      {
        prompt: 'Konuyu aranızda tutmak istiyorsun.',
        options: [
          'Let\'s keep this between us.',
          'This conversation shall henceforth remain strictly and entirely confidential.',
          'I won\'t go and say anything to anyone about this whole thing, okay.',
          'I\'ll tell the manager everything.',
        ],
        answer: 0,
      },
    ],
    npc: 'So... whose side are you on, really?',
    choices: [
      { text: 'I\'d rather hear you both out first.', score: 25, result: 'Tarafsız kaldın. İkisi de sana güvendi.' },
      { text: 'Honestly, I think Tom\'s right.', score: -15, result: 'Hemen taraf tuttun. Diğer arkadaşının güvenini kaybettin.' },
    ],
  },
  {
    index: 7,
    title: 'İlk Sunum',
    scene: 'stage',
    story: 'İlk kez küçük bir sunum yapıyorsun. Net konuşmak ve gelen soruları sakince yanıtlamak önemli.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — kısa sunum, soru cevaplama.',
    questions: [
      {
        prompt: 'İlk sunumuna başlıyorsun. En doğal açılış?',
        options: [
          'Um, hi, so, yeah, okay.',
          'Thanks for coming — let\'s get started.',
          'I bid you all a most warm welcome to this auspicious presentation of mine.',
          'Hello everyone, I am going to start my presentation now, okay, here we go.',
        ],
        answer: 1,
      },
      {
        prompt: 'Ana mesajını net ver: "What\'s the takeaway?"',
        options: [
          'Things are good overall.',
          'The key point is simple: faster replies keep clients happy.',
          'The fundamental crux of the matter herein presented is as follows, namely.',
          'So basically what I sort of want to say is some stuff about our clients.',
        ],
        answer: 1,
      },
      {
        prompt: 'Bir soruya cevabı bilmiyorsun. En profesyonel yanıt?',
        options: [
          'I don\'t know.',
          'Good question — let me check and follow up.',
          'I am presently unable to furnish that particular piece of information.',
          'Hmm, I am honestly not really very sure about that one, to be honest.',
        ],
        answer: 1,
      },
      {
        prompt: 'Zor bir soru geldi, sakin kal.',
        options: [
          'That\'s not important.',
          'Your query is duly noted and shall in due course be addressed.',
          'That\'s fair — here\'s how we\'d handle that.',
          'Well, that is kind of a pretty difficult thing for me to answer now.',
        ],
        answer: 2,
      },
      {
        prompt: 'Sunumu kapat.',
        options: [
          'That\'s it, bye.',
          'I hereby formally bring my address before you to its conclusion.',
          'Thanks — happy to take questions.',
          'Okay, so, that is basically everything that I had to say today, thanks.',
        ],
        answer: 2,
      },
    ],
    npc: 'Great job. Could you present this to the executives next month?',
    choices: [
      { text: 'I\'m not sure I\'m ready for that.', score: -10, result: 'Geri çekildin. Büyük sahneyi bir başkası aldı.' },
      { text: 'I\'d be glad to — I\'ll prepare thoroughly.', score: 25, result: 'Fırsatı kaptın. Görünürlüğün arttı.' },
    ],
  },
  {
    index: 8,
    title: 'Fazla Mesai Talebi',
    scene: 'night_office',
    story: 'Zaten yoğun bir hafta geçirdin ve patron yine fazla mesai istiyor. Fedakârlık ile sağlıklı sınır arasında seçim yapmalısın.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — sınır koyma vs. fedakârlık.',
    questions: [
      {
        prompt: 'Zaten yoğun bir hafta geçirdin, patron yine hafta sonu çalışmanı istiyor. En olgun yanıt?',
        options: [
          'Sure, no problem!',
          'I\'ve hit my limit this week — can we find another way?',
          'I regret that I am wholly and entirely indisposed to comply with this.',
          'I really, really do not want to work this weekend at all, honestly.',
        ],
        answer: 1,
      },
      {
        prompt: 'Bir alternatif sun.',
        options: [
          'I can finish it first thing Monday.',
          'The task shall be duly attended to at my very earliest convenience.',
          'I think it can probably just wait until next week sometime, maybe.',
          'Maybe someone else can do it instead of me this time.',
        ],
        answer: 0,
      },
      {
        prompt: 'Suçluluk hissetmeden net bir şekilde reddet.',
        options: [
          'I am terribly sorry but I simply cannot possibly manage to do it.',
          'Not this weekend, sorry.',
          'I would honestly rather not work this weekend if that is okay with you.',
          'No.',
        ],
        answer: 1,
      },
      {
        prompt: 'Dinlenmenin neden önemli olduğunu profesyonelce açıkla.',
        options: [
          'I\'m tired.',
          'I\'ll do better work if I get some rest first.',
          'Adequate repose is wholly essential to my optimal professional functioning.',
          'If I don\'t rest then my work is probably going to be worse than usual.',
        ],
        answer: 1,
      },
      {
        prompt: 'İlişkiyi sıcak tut.',
        options: [
          'You always do this to me.',
          'Your gracious magnanimity in this matter is deeply appreciated by me.',
          'Thanks for understanding.',
          'Okay, well, thank you for letting me not work then, I guess.',
        ],
        answer: 2,
      },
    ],
    npc: 'Can you work this weekend? We\'re behind.',
    choices: [
      { text: 'Sure, I\'ll be there.', score: -15, result: 'Yine evet dedin. Tükenmişlik birikiyor.' },
      { text: 'I\'ve maxed out this week — I can start fresh Monday.', score: 25, result: 'Sağlıklı bir sınır koydun. Olgunluğun fark edildi.' },
    ],
  },
  {
    index: 9,
    title: 'Yıl Sonu Değerlendirmesi',
    scene: 'manager_office',
    story: 'İlk yılının sonundasın. Başarılarını özetleyecek ve gelecek hedeflerini savunacaksın. Zam isteme anı da gelmiş olabilir — ama doğru zaman mı?',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — özet ve gelecek hedeflerini savunma.',
    questions: [
      {
        prompt: 'Yöneticin "Sum up your year for me." diyor. Bağlama uygun yanıt?',
        options: [
          'I worked hard.',
          'I took on three departments and beat my targets this year.',
          'My annum has been one of truly considerable and notable accomplishment.',
          'I did a lot of different things across a lot of areas this whole year.',
        ],
        answer: 1,
      },
      {
        prompt: 'Gelecek yıl için net bir hedef söyle.',
        options: [
          'I hope things go well.',
          'Next year I want to lead a small team.',
          'I aspire to ascend the managerial hierarchy in due and proper course.',
          'I would like to maybe do something a bit bigger next year, possibly.',
        ],
        answer: 1,
      },
      {
        prompt: 'Bu yıl gerçekten hak ettin — zammı nasıl istersin?',
        options: [
          'I want a lot more money now.',
          'Given my results, I\'d like to discuss a raise.',
          'Pay me double or I walk.',
          'Maybe, if it\'s okay, possibly a small raise, if you wouldn\'t mind at all?',
        ],
        answer: 1,
      },
      {
        prompt: 'Yöneticin "Budget is tight right now." diyor. En olgun yanıt?',
        options: [
          'Then I\'ll quit.',
          'I understand — can we revisit in three months?',
          'That is, frankly, a most disappointing thing for me to hear indeed.',
          'Okay, well, that is not really very fair to me though, is it.',
        ],
        answer: 1,
      },
      {
        prompt: 'Görüşmeyi kendinden emin kapat.',
        options: [
          'So, what\'s my number?',
          'I eagerly and most keenly anticipate the forthcoming annum ahead.',
          'Thanks — excited for next year.',
          'Okay, I guess that is the end of our meeting then, thanks.',
        ],
        answer: 2,
      },
    ],
    npc: 'Anything else before we wrap up the year?',
    choices: [
      { text: 'Yes — given my results, I\'d like to discuss a raise.', score: 25, result: 'Hak ettiğin için somut örneklerle istedin. Saygı gördü.' },
      { text: 'No, I\'ll just wait and see.', score: -10, result: 'Hakkını istemekten çekindin. Fırsat geçip gitti.' },
    ],
  },
];

export function chaptersFor(storyId: string): StoryChapter[] {
  return storyId === 'career' ? careerChapters : [];
}

export interface EndingInfo {
  id: Ending;
  title: string;
  text: string;
  details?: string[];
  scene: SceneId;
}

export function endingFor(score: number): EndingInfo {
  if (score >= 280)
    return {
      id: 'ceo',
      title: 'Zirveye ulaştın.',
      text: '3 yıl önce bekleme odasındaydın. Şimdi en üst katta oturuyorsun. İngilizce sadece bir dil değildi — geleceğinin anahtarıydı.',
      details: ['🏰 Villa', '🚗 Lüks araba', '👑 CEO ünvanı'],
      scene: 'ceo_office',
    };
  if (score >= 180)
    return {
      id: 'director',
      title: 'Güçlü bir kariyer inşa ettin.',
      text: 'Direktör oldun. Harika bir yaşam, güçlü bir kariyer. Biraz daha cesur olsaydın belki zirvedeydin — ama bu da küçük bir başarı değil.',
      scene: 'manager_office',
    };
  if (score >= 80)
    return {
      id: 'manager',
      title: 'İyi bir çalışan oldun.',
      text: 'Müdür oldun. Stabil bir hayat, düzenli maaş. Ama fırsatlar önüne geldiğinde bir adım geri attın. Bir dahaki sefere?',
      scene: 'open_office',
    };
  return {
    id: 'fired',
    title: 'Bu sefer olmadı.',
    text: 'Bazen yanlış kelimeler yanlış kapıları kapatır. İngilizce öğrenmek bir yatırımdır — ve bu yatırımı yapmak için hâlâ zamanın var.',
    scene: 'dark_room',
  };
}

// ---- Card 1 result: three star tiers from the hidden score (max ~280). ----
export const CARD1_STAR3_MIN = 210; // Yükselen Yıldız → Card 2 unlocks
export const CARD1_STAR2_MIN = 120; // Uzman (yatay son)

export function card1Stars(score: number): CardResult {
  if (score >= CARD1_STAR3_MIN) return 'star3';
  if (score >= CARD1_STAR2_MIN) return 'star2';
  return 'star1';
}

export interface CardEndingInfo {
  result: CardResult;
  stars: number;
  kicker: string;
  title: string;
  text: string;
  badge: string; // emoji badge
  badgeColor: string;
  unlocksCard2: boolean;
}

export function card1Ending(score: number): CardEndingInfo {
  const r = card1Stars(score);
  if (r === 'star3')
    return {
      result: 'star3', stars: 3, kicker: 'YÜKSELEN YILDIZ', title: 'Yükselen Yıldız oldun!',
      text: 'İlk yılını parlak geçirdin. Ekip lideri olarak sözün geçiyor artık. Sıradaki durak: Yöneticilik.',
      badge: '⭐', badgeColor: '#FFC83D', unlocksCard2: true,
    };
  if (r === 'star2')
    return {
      result: 'star2', stars: 2, kicker: 'UZMAN', title: 'Güçlü bir Uzman oldun.',
      text: 'Yılı başarıyla tamamladın. Şirkette saygın bir uzman olarak yerini aldın. Yöneticilik için biraz daha cesur kararlar gerekebilir.',
      badge: '🥈', badgeColor: '#C0C0C0', unlocksCard2: false,
    };
  return {
    result: 'star1', stars: 1, kicker: 'SEBAT', title: 'Bu yıl zorlu geçti.',
    text: 'Bazı kararlar seni geride bıraktı. Ama her büyük kariyer zorluklarla başlar. Tekrar dene — bu sefer farklı seçimler seni nereye götürür?',
    badge: '🥉', badgeColor: '#CD7F32', unlocksCard2: false,
  };
}

// Hidden challenge score by number of correct answers (out of 5).
export function challengePoints(correct: number): number {
  if (correct >= 5) return 30;
  if (correct === 4) return 20;
  if (correct === 3) return 10;
  return 0;
}

// Penalty for retrying a challenge (2nd attempt: -10, 3rd+: -20 each).
export function retryPenalty(attemptNumber: number): number {
  if (attemptNumber <= 1) return 0;
  if (attemptNumber === 2) return -10;
  return -20;
}

export const CHALLENGE_PASS_THRESHOLD = 3;
