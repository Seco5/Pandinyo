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
  { id: 'career3', title: 'Zirveye Son Adım', subtitle: 'Müdür → CEO · 10 bölüm', range: 'Müdür → CEO', cover: 'ceo_office', tier: 'conditional' },
  { id: 'global_manager', title: 'Global Manager', subtitle: 'Londra ofisi · premium', range: 'Global ekip yönetimi', cover: 'video_call', tier: 'premium' },
  { id: 'startup_founder', title: 'Startup Founder', subtitle: 'Girişim · premium', range: 'Kurucu yolculuğu', cover: 'stage', tier: 'premium' },
];

// Card 2 opens only when Card 1 is finished as a Rising Star (★★★).
export function card2Unlocked(card1Result: CardResult | null | undefined): boolean {
  return card1Result === 'star3';
}

// Card 3 opens only when Card 2 is finished as a Rising Star (★★★).
export function card3Unlocked(card2Result: CardResult | null | undefined): boolean {
  return card2Result === 'star3';
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

// ===== CARD 2 — Yöneticilik Yolu (Junior → Müdür) =====
// Managerial, higher-stakes track. Decision scenes test whether the player can
// hold up under pressure (cave vs. make the reasoned, sometimes hard call).
export const careerChapters2: StoryChapter[] = [
  {
    index: 0,
    title: 'Terfi ve İlk Ekip',
    scene: 'manager_office',
    story: 'Terfi ettin — artık bir ekibin var, üstelik bazıları eski mesai arkadaşların. İlk gün tonu sen belirleyeceksin.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — ekibe liderlik, ton ve delegasyon.',
    questions: [
      {
        prompt: 'Yönetici olarak ilk ekip toplantını açıyorsun. En doğal giriş?',
        options: [
          "Let's keep doing great work together.",
          'I hereby formally assume my managerial authority over this department.',
          'Okay so I am the boss now and we are going to do some things differently.',
          'Hi.',
        ],
        answer: 0,
      },
      {
        prompt: 'Bir görevi mikro-yönetmeden devretmek istiyorsun: "Can you own the client report?"',
        options: [
          'Just do exactly what I say, step by step.',
          'Can you take the lead on the report? I trust your call.',
          'I would be most obliged if you might possibly consider handling it.',
          'Do the report.',
        ],
        answer: 1,
      },
      {
        prompt: 'Eski bir arkadaşın seni sınıyor: "So, are you really the boss now?"',
        options: [
          'Yep — but we\'re still a team.',
          'Indeed, I now occupy a position of formal authority over you all.',
          'Well, I guess technically I am sort of in charge of things now, yeah.',
          'Obviously.',
        ],
        answer: 0,
      },
      {
        prompt: 'Ekip iyi iş çıkardı; krediyi açıkça ver.',
        options: [
          'Good.',
          'Great work, everyone — Maya\'s idea really carried this.',
          'I am pleased to formally commend the team\'s collective output.',
          'We did okay I guess, not bad, could probably be better next time though.',
        ],
        answer: 1,
      },
      {
        prompt: 'Net bir beklenti koy.',
        options: [
          'Let\'s keep each other updated daily.',
          'It is my express expectation that regular communicative updates shall occur.',
          'Maybe we could try to talk a bit more often or something, if possible.',
          'Update me.',
        ],
        answer: 0,
      },
    ],
    npc: 'Now that you\'re our boss, will things stay chill between us?',
    choices: [
      { text: 'Of course — nothing changes.', score: -15, result: 'Sınır koyamadın. İlerideki zor kararlar daha da zorlaşacak.' },
      { text: 'Our friendship stays — but I\'ll be fair to everyone.', score: 25, result: 'Dostluğu korurken sınır koydun. Saygı kazandın.' },
    ],
  },
  {
    index: 1,
    title: 'Bütçe Daralması',
    scene: 'conference',
    story: 'Satışlar düştü ve bütçe daraldı. Pazarlama daha çok reklam bütçesi istiyor, finans maliyet kısmanı bekliyor. Baskı senin üzerinde.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — strateji ve bütçe dili.',
    questions: [
      {
        prompt: 'Toplantıyı sorunu çerçeveleyerek aç. (Satışlar %15 düştü.)',
        options: [
          'Sales are down 15% — let\'s focus on what we can control.',
          'Our sales have catastrophically and most regrettably collapsed entirely.',
          'So, um, the numbers are kind of not great this quarter, you know.',
          'We\'re doomed.',
        ],
        answer: 0,
      },
      {
        prompt: 'Fikir değil, veri iste.',
        options: [
          'Show me the numbers first.',
          'I should very much like to be presented with the relevant figures.',
          'Maybe somebody could possibly bring some kind of data, perhaps.',
          'Whatever you all think is fine.',
        ],
        answer: 0,
      },
      {
        prompt: 'Gerçekçi olmayan reklam harcamasına itiraz et.',
        options: [
          'Fine, let\'s pour it all into ads.',
          'Before we spend more, let\'s see which channels actually convert.',
          'I am disinclined to sanction such considerable expenditure forthwith.',
          'No.',
        ],
        answer: 1,
      },
      {
        prompt: 'Ekibi yalan söylemeden rahatlat.',
        options: [
          'We\'ve got a plan — and a real shot.',
          'Rest assured, total and complete success is wholly guaranteed.',
          'I mean, things might work out okay, hopefully, we will see I guess.',
          'Don\'t panic.',
        ],
        answer: 0,
      },
      {
        prompt: 'Net adımlarla kapat.',
        options: [
          'Okay, bye.',
          'Let\'s cut low-ROI spend this week and review Friday.',
          'We shall henceforth undertake a comprehensive expenditure review process.',
          'We\'ll do some stuff and then look at it all again later sometime.',
        ],
        answer: 1,
      },
    ],
    npc: 'Sales fell 15%. Marketing wants a bigger ad budget — what\'s your call?',
    choices: [
      { text: 'Pour more into ads — we need revenue now.', score: -15, result: 'Panikle harcadın; bütçe daha da eridi.' },
      { text: 'Protect margin first, then double down on what converts.', score: 25, result: 'Soğukkanlı ve disiplinli davrandın. Baskıyı kaldırdın.' },
    ],
  },
  {
    index: 2,
    title: 'Düşük Performans',
    scene: 'manager_office',
    story: 'Ekip üyelerinden biri son zamanlarda geride kalıyor — üstelik bir arkadaşın. Hem dürüst hem destekleyici olman gerekiyor.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — geri bildirim ve koçluk dili.',
    questions: [
      {
        prompt: 'Konuşmayı destekleyici biçimde başlat.',
        options: [
          'You\'ve been off lately — what\'s going on?',
          'Your performance has been deficient and most unsatisfactory of late.',
          'So, like, things haven\'t really been going great with you, kind of.',
          'You\'re failing.',
        ],
        answer: 0,
      },
      {
        prompt: 'Net bir beklenti koy.',
        options: [
          'I need the reports on time from now on.',
          'It is incumbent upon you to ensure punctual submission henceforth.',
          'Maybe try to get the reports in on time a bit more often if you can.',
          'Do better.',
        ],
        answer: 0,
      },
      {
        prompt: 'Destek öner.',
        options: [
          'How can I help you get there?',
          'In what manner might I be of assistance to your improvement?',
          'I could maybe help you somehow with some of the things, possibly.',
          'Figure it out.',
        ],
        answer: 0,
      },
      {
        prompt: 'Kişiselleştirme; adil kal.',
        options: [
          'Everyone else manages, so should you.',
          'This isn\'t about you personally — it\'s about getting back on track.',
          'I harbour no personal animus; this concerns solely your output metrics.',
          'It\'s nothing.',
        ],
        answer: 1,
      },
      {
        prompt: 'Takip görüşmesi belirle.',
        options: [
          'Let\'s check in again Friday.',
          'Let us reconvene to assess your progress at week\'s end.',
          'We can maybe talk again at some point later this week or next, sure.',
          'We\'ll see.',
        ],
        answer: 0,
      },
    ],
    npc: 'He\'s a friend and he\'s struggling. Do you report it?',
    choices: [
      { text: 'I\'ll quietly cover for him.', score: -15, result: 'Sorunu örttün; ekip içi adalet zedelendi.' },
      { text: 'I\'ll coach him with a clear plan — and be honest.', score: 25, result: 'Dürüst ama destekleyici oldun. Doğru yönetim.' },
    ],
  },
  {
    index: 3,
    title: 'Kaynak Çatışması',
    scene: 'open_office',
    story: 'İki proje aynı kıdemli mühendisi istiyor, ikisi de "biz önceliğiz" diyor. Birini seçmen gerek — herkesi memnun edemezsin.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — önceliklendirme ve "hayır" deme.',
    questions: [
      {
        prompt: 'Kararı neye göre vereceğini net söyle.',
        options: [
          'I\'ll decide by impact, not by who asks loudest.',
          'I shall adjudicate based upon a holistic impact assessment framework.',
          'Um, maybe we can kind of figure out some way to share him, I guess.',
          'I don\'t know yet.',
        ],
        answer: 0,
      },
      {
        prompt: 'Düşük öncelikli ekibe nazikçe hayır de.',
        options: [
          'Not this sprint — here\'s why.',
          'Regrettably, I am unable to accede to your request at this juncture.',
          'Sorry, maybe not right now, perhaps another time could work, I think.',
          'No.',
        ],
        answer: 0,
      },
      {
        prompt: 'Önceliği gerekçeyle açıkla.',
        options: [
          'Project A ships revenue this quarter, so it goes first.',
          'Because.',
          'Project A has been deemed paramount per our strategic imperatives.',
          'A is more important than B for some reasons that matter to us, really.',
        ],
        answer: 0,
      },
      {
        prompt: 'Diğer ekibi motive tut.',
        options: [
          'You\'re next — I\'ve got your back.',
          'Your initiative shall assuredly receive subsequent prioritization.',
          'Don\'t worry, your thing will probably get done at some point too, okay.',
          'Deal with it.',
        ],
        answer: 0,
      },
      {
        prompt: 'Kararı üst yönetime raporla.',
        options: [
          'I prioritized A for Q3 revenue; B starts next sprint.',
          'Decisions were duly made regarding resourcing in line with priorities.',
          'I did some prioritizing of the projects based on what seemed best to me.',
          'It\'s handled.',
        ],
        answer: 0,
      },
    ],
    npc: 'Both teams say they\'re top priority. Who gets the engineer?',
    choices: [
      { text: 'Split him 50/50 to keep everyone happy.', score: -15, result: 'Herkesi memnun etmeye çalıştın; iki proje de aksadı.' },
      { text: 'The higher-impact project gets him — and I\'ll tell the other clearly.', score: 25, result: 'Net ve kararlı seçtin. Liderlik gösterdin.' },
    ],
  },
  {
    index: 4,
    title: 'Kriz Yönetimi',
    scene: 'night_office',
    story: 'En büyük müşteri ayrılma sinyali veriyor. Üst yönetim "ne olursa olsun tut" diyor. Tutamayacağın sözü vermemen gerekiyor.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — kriz iletişimi ve gerçekçi taahhüt.',
    questions: [
      {
        prompt: 'Patronunu hızlıca bilgilendir.',
        options: [
          'GlobalCorp may leave — here\'s my plan.',
          'I regret to convey that a most catastrophic client departure now looms.',
          'So there might be kind of a problem with one of our big clients, maybe.',
          'We have a problem.',
        ],
        answer: 0,
      },
      {
        prompt: 'Müşteriye abartılı söz vermeden yanıt ver.',
        options: [
          'I\'ll fix the root cause — and show you how.',
          'I solemnly pledge to rectify every conceivable issue immediately and fully.',
          'We\'ll try to maybe sort out some of the issues somehow pretty soon.',
          'Just trust us.',
        ],
        answer: 0,
      },
      {
        prompt: 'Patron "ne olursa olsun söz ver" diyor. Çizgiyi koru.',
        options: [
          'Sure, I\'ll promise whatever keeps them.',
          'I\'ll commit only to what we can actually deliver.',
          'I am disinclined to proffer commitments of an unattainable nature.',
          'Okay.',
        ],
        answer: 1,
      },
      {
        prompt: 'Gece yarısı ekibi sakinleştir.',
        options: [
          'It\'s a setback, not the end — here\'s step one.',
          'This constitutes a reversal, yet by no means a definitive defeat.',
          'Okay everyone, things are bad but maybe we can do something, I hope.',
          'We\'re fine.',
        ],
        answer: 0,
      },
      {
        prompt: 'Toparlanma planını yazılı hale getir.',
        options: [
          'I\'ll send a written plan with dates by morning.',
          'A formal remediation document shall be promulgated forthwith.',
          'I\'ll write up some kind of plan thing and send it over soon-ish, okay.',
          'I\'ll email later.',
        ],
        answer: 0,
      },
    ],
    npc: 'Just promise the client anything to keep them!',
    choices: [
      { text: 'Okay — I\'ll guarantee whatever they want.', score: -15, result: 'Baskıya boyun eğdin; tutamayacağın söz verdin.' },
      { text: 'I\'ll commit only to what we can deliver — in writing.', score: 25, result: 'Baskı altında dürüst kaldın. Güven kazandın.' },
    ],
  },
  {
    index: 5,
    title: 'Küçülme Kararı',
    scene: 'manager_office',
    story: 'Bütçeyi %10 kısman gerekiyor. Birini işten çıkarmak mı, herkesin mesaisini azaltmak mı? Zor ve baskılı bir karar.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — zor haber verme ve şeffaflık.',
    questions: [
      {
        prompt: 'Zor haberi ekibe dürüstçe ver.',
        options: [
          'We need to cut 10% — I won\'t sugarcoat it.',
          'Fiscal exigencies necessitate a decremental adjustment of ten percent.',
          'So, um, we kind of have to maybe reduce some things by a bit, sorry.',
          'Bad news.',
        ],
        answer: 0,
      },
      {
        prompt: 'Süreç hakkında şeffaf ol.',
        options: [
          'Here\'s exactly how the decision will be made.',
          'The decisional methodology shall be elucidated in full hereunder.',
          'We\'ll figure out how to decide it somehow and let you all know later.',
          'You\'ll find out.',
        ],
        answer: 0,
      },
      {
        prompt: 'Ekibi koruyabildiğin yerde koru.',
        options: [
          'I\'ll push for shared hour cuts before any layoffs.',
          'I shall advocate proportionate temporal reductions preceding any severance.',
          'Maybe we can cut hours or something instead of letting people go, perhaps.',
          'We\'ll see who goes.',
        ],
        answer: 0,
      },
      {
        prompt: 'Korkmuş bir çalışana yanıt ver.',
        options: [
          'Your job\'s safe — and I\'ll keep you posted.',
          'Your continued tenure is, at present, entirely secure and fully assured.',
          'I think you are probably okay but I can\'t really be totally sure yet, sorry.',
          'Maybe.',
        ],
        answer: 0,
      },
      {
        prompt: 'Sorumluluğu üstlen.',
        options: [
          'This is my call — and I\'ll own the outcome.',
          'Ultimate accountability for this determination resides with my person.',
          'I guess this is sort of on me to decide and deal with, I suppose, yeah.',
          'Not my fault.',
        ],
        answer: 0,
      },
    ],
    npc: 'We must cut 10%. Lay someone off, or cut everyone\'s hours?',
    choices: [
      { text: 'Be transparent: propose shared hour cuts before any layoff.', score: 25, result: 'Şeffaf ve adil davrandın. Ekip arkanda durdu.' },
      { text: 'Quietly let the newest hire go to avoid drama.', score: -15, result: 'Kolay yolu seçtin; ekip güveni sarsıldı.' },
    ],
  },
  {
    index: 6,
    title: 'Üst Yönetime Sunum',
    scene: 'stage',
    story: 'Yönetim kuruluna rakamlarını sunuyorsun ve sert itirazlar geliyor. Baskı altında verini savunmalı ama dürüst kalmalısın.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — kurula sunum ve veri savunma.',
    questions: [
      {
        prompt: 'Kendinden emin bir açılış yap.',
        options: [
          'Here\'s where we are — and where we\'re going.',
          'I shall now expound upon our present circumstances and trajectory.',
          'So, okay, I\'m going to kind of go through some numbers now, I guess.',
          'Slides, please.',
        ],
        answer: 0,
      },
      {
        prompt: 'Kurul "bu tahminler fazla iyimser" diyor. Veriyle savun.',
        options: [
          'You\'re right, I\'ll lower them.',
          'Here\'s the data behind them — and the one risk I\'m watching.',
          'The projections are predicated upon rigorous quantitative substantiation.',
          'Trust me, they\'re fine.',
        ],
        answer: 1,
      },
      {
        prompt: 'Gerçek bir riski dürüstçe kabul et.',
        options: [
          'One risk: if churn rises, we miss Q4.',
          'A singular hazard pertains to potential attrition-induced shortfalls.',
          'There might be some kind of risk thing that could maybe happen, possibly.',
          'No risks at all.',
        ],
        answer: 0,
      },
      {
        prompt: 'İhtiyacını net iste.',
        options: [
          'To hit this, I need two more hires.',
          'Realization of these targets necessitates additional human capital.',
          'It would be nice to maybe get some more people if that\'s possible somehow.',
          'Give me resources.',
        ],
        answer: 0,
      },
      {
        prompt: 'Kararlı kapat.',
        options: [
          'Give me the quarter — I\'ll show you results.',
          'Grant me the fiscal quarter and demonstrable outcomes shall ensue.',
          'So yeah, let\'s just kind of see how the next few months go, okay.',
          'That\'s all.',
        ],
        answer: 0,
      },
    ],
    npc: 'These projections look too optimistic. Revise them?',
    choices: [
      { text: 'You\'re right — I\'ll lower them.', score: -10, result: 'Geri adım attın; otoriten zayıfladı.' },
      { text: 'Here\'s the data — and the one risk I\'m watching.', score: 25, result: 'Veriyle savundun, riski de dürüstçe belirttin.' },
    ],
  },
  {
    index: 7,
    title: 'Ekip Motivasyonu',
    scene: 'open_office',
    story: 'Ekip tükenmiş, teslim tarihi yaklaşıyor. Üst yönetim "daha çok bastır" diyor. Ekibini koruyabilecek misin?',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — motivasyon ve kapsam yönetimi.',
    questions: [
      {
        prompt: 'Tükenmişliği fark et.',
        options: [
          'You all look exhausted — let\'s talk.',
          'I perceive manifestations of considerable collective fatigue herein.',
          'You guys seem kind of tired maybe, I think, a little bit lately, right.',
          'Work harder.',
        ],
        answer: 0,
      },
      {
        prompt: 'Patron "daha çok bastır" diyor. Ekibini koru.',
        options: [
          'Okay team, weekends until it\'s done.',
          'I\'ll renegotiate the scope before I burn out my team.',
          'I shall endeavour to recalibrate deliverables prior to exhaustion.',
          'We\'ll manage somehow.',
        ],
        answer: 1,
      },
      {
        prompt: 'Ekibe gerçek bir kazanç ver.',
        options: [
          'Take Friday off — you earned it.',
          'I hereby grant you a discretionary day of recuperative leave.',
          'Maybe you could take some time off at some point if you want, I guess.',
          'No breaks.',
        ],
        answer: 0,
      },
      {
        prompt: 'Öncelikleri net sıfırla.',
        options: [
          'Drop the nice-to-haves; ship the core.',
          'Non-essential deliverables shall be deprioritized in favour of core scope.',
          'Let\'s maybe focus on the important stuff and drop some other things, perhaps.',
          'Do everything.',
        ],
        answer: 0,
      },
      {
        prompt: 'İçten teşekkür et.',
        options: [
          'I see how hard you\'re working — thank you.',
          'Your considerable diligence is hereby formally acknowledged.',
          'Thanks for, you know, doing all the work stuff and everything, really.',
          'Good job.',
        ],
        answer: 0,
      },
    ],
    npc: 'Push them harder — the deadline won\'t move.',
    choices: [
      { text: 'Okay, we work weekends until it\'s done.', score: -15, result: 'Ekibi tükettin; moral çöktü.' },
      { text: 'I\'ll renegotiate scope and protect the team.', score: 25, result: 'Ekibini korudun, kapsamı yönettin. Olgun liderlik.' },
    ],
  },
  {
    index: 8,
    title: 'Etik İkilem',
    scene: 'night_office',
    story: 'Bir kısayol hedefi tutturmanı sağlayacak ama rakamları çarpıtman gerekiyor. Baskı altında dürüstlükten şaşmamalısın.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — dürüstlük ve etik duruş.',
    questions: [
      {
        prompt: 'Bir meslektaşın raporu "rötuşlamayı" öneriyor. Tepkin?',
        options: [
          'No — we report the real numbers.',
          'I must decline to countenance any falsification of the record whatsoever.',
          'Hmm, I don\'t know, maybe that\'s not really a great idea, probably not.',
          'Okay, just this once.',
        ],
        answer: 0,
      },
      {
        prompt: 'Neden dürüstlüğün önemli olduğunu açıkla.',
        options: [
          'One faked number and we lose all trust.',
          'A solitary fabrication imperils the entirety of stakeholder confidence.',
          'If we change it then people might maybe not trust us as much, perhaps.',
          'It\'s wrong.',
        ],
        answer: 0,
      },
      {
        prompt: 'Dürüst alternatifi öner.',
        options: [
          'Let\'s report the gap and the plan to close it.',
          'I propose disclosure of the shortfall alongside requisite remedial measures.',
          'Maybe we could just tell them about the problem and some kind of plan, no?',
          'We\'ll hide it.',
        ],
        answer: 0,
      },
      {
        prompt: 'Tekrar zorlandığında dik dur.',
        options: [
          'My answer\'s the same — no.',
          'My position remains immutable and entirely unaltered: namely, negative.',
          'I mean, I still kind of think we probably shouldn\'t do that, I guess.',
          'Fine, whatever.',
        ],
        answer: 0,
      },
      {
        prompt: 'Konuyu doğru şekilde üst yönetime taşı.',
        options: [
          'I\'ll flag this to my boss myself, today.',
          'I shall personally escalate this matter to my superior forthwith.',
          'I\'ll maybe mention it to the boss at some point soon, probably, I think.',
          'Someone should tell someone.',
        ],
        answer: 0,
      },
    ],
    npc: 'Just tweak the report — no one will notice, and we hit target.',
    choices: [
      { text: 'Fine — just this once.', score: -20, result: 'Kısa yolu seçtin; bu ileride pahalıya patlayabilir.' },
      { text: 'No — we report the real numbers and the plan.', score: 30, result: 'Baskı altında dürüstlükten şaşmadın. Gerçek liderlik.' },
    ],
  },
  {
    index: 9,
    title: 'Müdürlük Onayı',
    scene: 'ceo_office',
    story: 'CEO seni çağırdı. Müdürlük teklifi masada — ama en zorlu ekiple. Baskıyı kaldırabileceğini kanıtlama zamanı.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — ileri yöneticilik İngilizcesi.',
    questions: [
      {
        prompt: 'CEO: "Sum up your year as a lead."',
        options: [
          'I steadied the team and beat our targets under pressure.',
          'My annum was characterized by considerable leadership accomplishment.',
          'I did a lot of leading stuff and things went okay overall, I think, yeah.',
          'It was fine.',
        ],
        answer: 0,
      },
      {
        prompt: 'CEO: "What was your hardest decision?"',
        options: [
          'Cutting hours instead of cutting people.',
          'The most arduous determination pertained to resource rationalization.',
          'Probably some decision about the budget or the team or something, really.',
          'Lots of them.',
        ],
        answer: 0,
      },
      {
        prompt: 'CEO: "How do you handle pressure?"',
        options: [
          'I slow down, get the facts, then decide.',
          'Under duress I employ a deliberative, evidence-based decisional cadence.',
          'I just kind of try to stay calm and figure things out somehow, usually.',
          'I don\'t feel pressure.',
        ],
        answer: 0,
      },
      {
        prompt: 'CEO: "Why you for manager?"',
        options: [
          'Because I make the hard calls and own them.',
          'By virtue of my decisiveness and full accountability for outcomes thereof.',
          'I think I\'d probably be pretty good at it for various reasons, I guess.',
          'I deserve it.',
        ],
        answer: 0,
      },
      {
        prompt: 'Güçlü kapat.',
        options: [
          'Give me the team — I\'ll lead from the front.',
          'Bestow upon me the team and exemplary leadership shall be demonstrated.',
          'So yeah, I\'d like to maybe get the manager job if that\'s okay, thanks.',
          'That\'s it.',
        ],
        answer: 0,
      },
    ],
    npc: 'The manager role is yours — but it means the toughest team. Ready?',
    choices: [
      { text: 'I\'d prefer an easier team first.', score: -10, result: 'Konfor aradın; CEO biraz tereddüt etti.' },
      { text: 'I\'m ready — that\'s where I prove I lead under pressure.', score: 25, result: 'Zorluğu kucakladın. Müdürlüğü hak ettin.' },
    ],
  },
];

// ===== CARD 3 — Zirveye Son Adım (Müdür → Direktör → CEO) =====
// Executive track. Highest-stakes decisions: investors, acquisition, IPO,
// public crisis, board conflict, culture under scale — all testing judgment
// and integrity under intense pressure.
export const careerChapters3: StoryChapter[] = [
  {
    index: 0,
    title: 'Direktörlük Devri',
    scene: 'manager_office',
    story: 'Bir bölümün başına geçtin. Moral düşük, beklentiler yüksek. Hemen her şeyi mi değiştireceksin, yoksa önce dinleyip mi anlayacaksın?',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — vizyon ve devralma.',
    questions: [
      {
        prompt: 'Bölümü devralıyorsun; vizyonla aç.',
        options: [
          "Here's where we're taking this division.",
          'I shall now articulate my strategic vision for this organizational unit.',
          'So, um, I guess I\'m running this division now and we\'ll see how it goes.',
          'Hi all.',
        ],
        answer: 0,
      },
      {
        prompt: 'Değiştirmeden önce dinle.',
        options: [
          'First, tell me what\'s working and what\'s broken.',
          'I require a comprehensive situational briefing forthwith and in full.',
          'Maybe you could all kind of tell me about stuff that\'s going on, perhaps.',
          'Change is coming.',
        ],
        answer: 0,
      },
      {
        prompt: 'Standardı koy.',
        options: [
          'We aim higher than last year — together.',
          'Our aspirational benchmarks shall exceed prior annual performance.',
          'Let\'s try to maybe do a bit better than before this year if we can, okay.',
          'Do more.',
        ],
        answer: 0,
      },
      {
        prompt: 'Altındaki yöneticiyi güçlendir.',
        options: [
          'You run your team — I\'ll back your calls.',
          'I hereby delegate full operational autonomy unto your good self.',
          'You can kind of make your own decisions about your team, I guess, mostly.',
          'Ask me before anything.',
        ],
        answer: 0,
      },
      {
        prompt: 'Açılışı kapat.',
        options: [
          'Let\'s build something we\'re proud of.',
          'Let us collectively endeavour to construct a source of mutual pride.',
          'So yeah, let\'s just kind of make some good stuff together, okay, thanks.',
          'That\'s all.',
        ],
        answer: 0,
      },
    ],
    npc: 'The division\'s morale is low. Big reorg now, or stabilize first?',
    choices: [
      { text: 'Big reorg immediately to show change.', score: -15, result: 'Aceleci davrandın; belirsizlik morali daha da düşürdü.' },
      { text: 'Stabilize and listen first, then change what matters.', score: 25, result: 'Önce dinledin, sonra değiştirdin. Güven inşa ettin.' },
    ],
  },
  {
    index: 1,
    title: 'Yatırımcı Toplantısı',
    scene: 'conference',
    story: 'Yatırımcılar masada ve daha agresif büyüme istiyorlar. Hırslı ama gerçekçi durmalı, baskıyla abartılı söz vermemelisin.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — yatırımcı sunumu.',
    questions: [
      {
        prompt: 'Sunumu aç.',
        options: [
          'We grew 40% — and we\'re just getting started.',
          'Our enterprise has achieved a quadragesimal percentage of expansion.',
          'So, okay, we did pretty well I think and there\'s more coming, probably.',
          'We\'re great.',
        ],
        answer: 0,
      },
      {
        prompt: 'Yatırımcı: "Why should we invest?"',
        options: [
          'Strong margins, loyal customers, a clear path.',
          'By reason of our robust unit economics and demonstrable retention.',
          'Because we\'re, like, a pretty good company with some good things, I guess.',
          'Just trust me.',
        ],
        answer: 0,
      },
      {
        prompt: 'Agresif söz baskısına gerçekçi kal.',
        options: [
          'Sure, I\'ll promise whatever numbers you want.',
          'I\'ll commit to ambitious targets — and name the risks.',
          'I shall proffer only targets of an empirically defensible nature herein.',
          'We\'ll hit huge numbers, guaranteed.',
        ],
        answer: 1,
      },
      {
        prompt: 'Gerçek bir riski kabul et.',
        options: [
          'Our main risk is hiring fast enough.',
          'Our preeminent vulnerability concerns talent acquisition velocity.',
          'There\'s maybe some kind of risk around hiring people or something, perhaps.',
          'No risks at all.',
        ],
        answer: 0,
      },
      {
        prompt: 'Yatırımı net iste.',
        options: [
          'We\'re raising 5 million to scale sales.',
          'We hereby solicit a capital infusion of five million for expansion.',
          'We\'d kind of like to get some money to grow the sales team, if possible.',
          'Give us money.',
        ],
        answer: 0,
      },
    ],
    npc: 'Investors want faster growth — promise aggressive numbers?',
    choices: [
      { text: 'Yes, I\'ll promise aggressive targets.', score: -15, result: 'Baskıyla abarttın; tutturamayınca güven sarsılır.' },
      { text: 'Ambitious but real targets, with the risks named.', score: 25, result: 'Hırslı ama dürüst kaldın. Yatırımcılar saygı duydu.' },
    ],
  },
  {
    index: 2,
    title: 'Büyük Pivot Kararı',
    scene: 'open_office',
    story: 'Pazar kaydı. Ürünü değiştirmek mi, yoksa yatırdığın için ısrar etmek mi? Batık maliyet tuzağına düşmeden veriyle karar vermelisin.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — strateji ve pivot.',
    questions: [
      {
        prompt: 'Pazar değişimini çerçevele.',
        options: [
          'The market moved — we need to move with it.',
          'The market has undergone a most significant paradigmatic transformation.',
          'So, um, things in the market are kind of changing a bit, you know, lately.',
          'Everything\'s changing.',
        ],
        answer: 0,
      },
      {
        prompt: 'Batık maliyet düşüncesine direnç göster.',
        options: [
          'What we spent is gone — decide on the future.',
          'Antecedent expenditure is irretrievable; prospective value must govern.',
          'We already spent a lot so maybe we should just keep going, I don\'t know.',
          'We can\'t change now.',
        ],
        answer: 0,
      },
      {
        prompt: 'Büyük bahisten önce test öner.',
        options: [
          'Let\'s test the pivot with one segment first.',
          'I propose a delimited pilot within a singular market segment hereof.',
          'Maybe we could try the new thing out with some people first or something.',
          'Just pivot everything now.',
        ],
        answer: 0,
      },
      {
        prompt: 'Değişimde ekibi rahatlat.',
        options: [
          'Change is hard — but we\'ve got this.',
          'Transitional periods, though arduous, remain wholly surmountable indeed.',
          'I mean, change is kind of scary but we\'ll probably be okay, hopefully.',
          'Deal with it.',
        ],
        answer: 0,
      },
      {
        prompt: 'Veriye göre bağlan.',
        options: [
          'The test won — let\'s go all in.',
          'The empirical results being favourable, full commitment is warranted.',
          'The test thing kind of worked so maybe we should do more of it, I guess.',
          'Let\'s just gamble on it.',
        ],
        answer: 0,
      },
    ],
    npc: 'The market shifted. Pivot the product, or double down?',
    choices: [
      { text: 'Double down — we\'ve invested too much to change.', score: -15, result: 'Batık maliyete takıldın; pazar seni geride bıraktı.' },
      { text: 'Run a fast test, then commit based on data.', score: 25, result: 'Veriyle karar verdin. Doğru zamanda döndün.' },
    ],
  },
  {
    index: 3,
    title: 'Satın Alma Teklifi',
    scene: 'video_call',
    story: 'Bir rakip şirketi yüksek primle satın almak istiyor. Parayı hemen almak cazip — ama gerçek değerini ve ekibini düşünmelisin.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — müzakere.',
    questions: [
      {
        prompt: 'Teklifi profesyonelce karşıla.',
        options: [
          'Thanks for the offer — we\'ll weigh it seriously.',
          'We acknowledge your overture with all due gravity and consideration.',
          'Oh wow, okay, that\'s a lot of money, let me kind of think about it, I guess.',
          'How much exactly?',
        ],
        answer: 0,
      },
      {
        prompt: 'Elini açık etme.',
        options: [
          'I\'d need to see the full terms first.',
          'Disclosure of the comprehensive terms would be an absolute prerequisite.',
          'Maybe you could tell me more about all the details and stuff, perhaps.',
          'Yes, let\'s do it!',
        ],
        answer: 0,
      },
      {
        prompt: 'Değerini ortaya koy.',
        options: [
          'We\'re growing fast — that changes the math.',
          'Our accelerating trajectory materially alters the valuation calculus.',
          'We\'re doing pretty well so we\'re probably worth kind of a lot, I think.',
          'We\'re priceless.',
        ],
        answer: 0,
      },
      {
        prompt: 'Köprüleri yakmadan karşı çık.',
        options: [
          'Not at this price — but let\'s keep talking.',
          'The proposed valuation is inadequate, yet dialogue may nonetheless persist.',
          'I don\'t really think that price is good but maybe we can talk more, sure.',
          'No way, forget it.',
        ],
        answer: 0,
      },
      {
        prompt: 'Her anlaşmada ekibini koru.',
        options: [
          'Any deal has to protect my team.',
          'Any transaction must incorporate robust safeguards for my personnel.',
          'I\'d want to make sure my people are kind of okay in any deal thing, I guess.',
          'Whatever works for them.',
        ],
        answer: 0,
      },
    ],
    npc: 'A rival offers to acquire you for a big premium. Sell?',
    choices: [
      { text: 'Take the money — sell now.', score: -10, result: 'Hemen sattın; belki çok daha fazlasını bırakıp gittin.' },
      { text: 'We\'re worth more independently — let\'s explore a partnership.', score: 25, result: 'Değerini bildin, kapıyı da kapatmadın. Olgun müzakere.' },
    ],
  },
  {
    index: 4,
    title: 'Üst Düzey İşe Alım',
    scene: 'manager_office',
    story: 'Parlak ama zehirli bir üst düzey aday var. Sonuç odaklı baskı seni "yine de al" demeye itiyor — ama bir lider kültürü bozabilir.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — yönetici mülakatı.',
    questions: [
      {
        prompt: 'Yönetici mülakatını aç.',
        options: [
          'Tell me how you lead under pressure.',
          'Kindly elucidate your leadership methodology amid conditions of adversity.',
          'So, like, how do you kind of handle things when it gets hard, you know?',
          'Impress me.',
        ],
        answer: 0,
      },
      {
        prompt: 'Övünüp başkalarını küçümsüyor; kültürü yokla.',
        options: [
          'How do you handle disagreement with your team?',
          'In what manner do you adjudicate intra-team dissension and discord?',
          'Do you, like, get along with people and stuff when they disagree, usually?',
          'Are you nice to people?',
        ],
        answer: 0,
      },
      {
        prompt: 'Endişeyi net söyle.',
        options: [
          'Brilliant work — but culture matters here.',
          'Your acumen is notable; however, cultural alignment remains imperative.',
          'You\'re really smart but, um, we also kind of care about how people act, so.',
          'You\'re arrogant.',
        ],
        answer: 0,
      },
      {
        prompt: 'İlkeyle karar ver.',
        options: [
          'I won\'t trade culture for talent.',
          'I decline to sacrifice cultural integrity upon the altar of mere talent.',
          'I think maybe culture is kind of more important than just talent, probably.',
          'Results are all that matter.',
        ],
        answer: 0,
      },
      {
        prompt: 'Saygıyla reddet.',
        options: [
          'It\'s not the right fit — I wish you well.',
          'Regrettably the alignment is suboptimal; I extend my sincerest best wishes.',
          'Yeah it\'s maybe not really going to work out but good luck and stuff, okay.',
          'No.',
        ],
        answer: 0,
      },
    ],
    npc: 'This star hire is brilliant but toxic. Hire them anyway?',
    choices: [
      { text: 'Hire them — results matter most.', score: -15, result: 'Sonuç için kültürü riske attın; ekip zarar görebilir.' },
      { text: 'No — one toxic leader can break the whole culture.', score: 25, result: 'Kültürü korudun. Uzun vadeli düşündün.' },
    ],
  },
  {
    index: 5,
    title: 'Halka Arz Kararı',
    scene: 'conference',
    story: 'Yönetim kurulu gelecek yıl halka arz (IPO) istiyor. Pencere açık ama temellerin hazır değilse acele etmek tehlikeli.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — büyüme ve halka arz.',
    questions: [
      {
        prompt: 'Hazır olmayı çerçevele.',
        options: [
          'An IPO only works if our fundamentals are solid.',
          'A public offering presupposes the soundness of our core fundamentals.',
          'So, um, going public is maybe okay if our stuff is kind of ready, I guess.',
          'Let\'s just IPO.',
        ],
        answer: 0,
      },
      {
        prompt: 'Acele etmeye diren.',
        options: [
          'I won\'t rush the window — I\'ll get it right.',
          'I shall not be precipitated by the market window prematurely whatsoever.',
          'Maybe we shouldn\'t kind of rush it too much, probably, if that\'s okay.',
          'Let\'s hurry up.',
        ],
        answer: 0,
      },
      {
        prompt: 'Bedeli açıkla.',
        options: [
          'Going public means scrutiny — we must be ready.',
          'Public status entails heightened scrutiny necessitating full preparedness.',
          'If we go public then people will kind of watch us a lot more, you know.',
          'It\'s totally fine.',
        ],
        answer: 0,
      },
      {
        prompt: 'Bir koşul koy.',
        options: [
          'Two strong quarters first, then we go.',
          'Subsequent to two robust quarters, we shall proceed accordingly thereafter.',
          'Maybe after a couple of good quarters or so we could think about it, I guess.',
          'Now or never.',
        ],
        answer: 0,
      },
      {
        prompt: 'Kurulu hizala.',
        options: [
          'Let\'s agree on the milestones before the date.',
          'Let us achieve consensus upon milestones antecedent to any scheduling.',
          'We should maybe kind of agree on some goals before picking a date, perhaps.',
          'Just trust me on timing.',
        ],
        answer: 0,
      },
    ],
    npc: 'The board wants to IPO next year. Push for it?',
    choices: [
      { text: 'Yes, IPO fast — the window\'s open.', score: -10, result: 'Pencereye kapıldın; hazır olmadan riske girdin.' },
      { text: 'Only if our fundamentals are ready — I won\'t rush it.', score: 25, result: 'Disiplinli kaldın. Doğru zamanı bekledin.' },
    ],
  },
  {
    index: 6,
    title: 'Kamuoyu Krizi',
    scene: 'stage',
    story: 'Şirketi sarsan bir kriz patladı, basın karşında. Hisseyi korumak için inkâr baskısı var — ama hesap verebilirlik tek doğru yol.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — kriz iletişimi.',
    questions: [
      {
        prompt: 'Basın açıklamasını aç.',
        options: [
          'We made a mistake, and we own it.',
          'An error has transpired for which we accept full and unreserved culpability.',
          'So, um, something kind of went wrong and we\'re, like, sorry about it, I guess.',
          'No comment.',
        ],
        answer: 0,
      },
      {
        prompt: 'Çözümü somut söyle.',
        options: [
          'Here are the three steps we\'re taking now.',
          'The following triumvirate of remedial measures is herewith duly enacted.',
          'We\'re going to do some things to fix it and stuff, you\'ll see, probably soon.',
          'We\'ll handle it.',
        ],
        answer: 0,
      },
      {
        prompt: 'Muhabir baskı yapıyor: hisseyi korumak için inkâr et?',
        options: [
          'We\'ll just deny it and move on.',
          'I won\'t deny the truth to protect the price.',
          'I decline to dissemble for the preservation of equity valuation herein.',
          'No comment at this time.',
        ],
        answer: 1,
      },
      {
        prompt: 'Etkilenenlere empati göster.',
        options: [
          'To those we let down: I\'m sorry.',
          'I extend my sincerest contrition to all parties adversely impacted hereby.',
          'I feel kind of bad for the people who were maybe affected by this, really.',
          'Mistakes happen.',
        ],
        answer: 0,
      },
      {
        prompt: 'Takibe söz ver.',
        options: [
          'We\'ll report our progress publicly every week.',
          'Hebdomadal public disclosures of our progress shall be duly effectuated.',
          'We\'ll maybe tell everyone how it\'s going every now and then, I think, sure.',
          'Just trust us.',
        ],
        answer: 0,
      },
    ],
    npc: 'Deny everything to protect the stock?',
    choices: [
      { text: 'Deny it — protect the price.', score: -20, result: 'Gerçeği örttün; ortaya çıkınca güven çöker.' },
      { text: 'We take accountability and fix it publicly.', score: 30, result: 'Baskı altında dürüst kaldın. İtibar uzun vadede kazanır.' },
    ],
  },
  {
    index: 7,
    title: 'Yönetim Kurulu Çatışması',
    scene: 'conference',
    story: 'Kurul, kısa vadeli kârı artırmak için Ar-Ge bütçesini kesmek istiyor. Baskıya rağmen şirketin geleceğini savunman gerekiyor.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — kurulla müzakere.',
    questions: [
      {
        prompt: 'Önce kurulun kaygısını kabul et.',
        options: [
          'I hear the pressure on short-term profit.',
          'I duly register the exigency pertaining to proximate profitability concerns.',
          'So, um, I get that you all kind of want more profit soon, you know, sure.',
          'You\'re all wrong.',
        ],
        answer: 0,
      },
      {
        prompt: 'Ar-Ge\'yi savun.',
        options: [
          'Cutting R&D buys this year and loses the next five.',
          'Curtailment of R&D mortgages quinquennial prospects for annual gain.',
          'If we cut the research stuff it might kind of hurt us later on, probably.',
          'Don\'t cut it.',
        ],
        answer: 0,
      },
      {
        prompt: 'Orta yol öner.',
        options: [
          'Let\'s trim 10%, not gut it.',
          'I propose a measured decremental adjustment rather than wholesale removal.',
          'Maybe we could cut it a little bit instead of all of it or something, perhaps.',
          'Cut nothing at all.',
        ],
        answer: 0,
      },
      {
        prompt: 'Saygıyla dik dur.',
        options: [
          'I\'ll be accountable for this call.',
          'I shall assume full and complete accountability for this determination herein.',
          'I guess I\'ll kind of take responsibility for deciding this, I suppose, okay.',
          'You all decide then.',
        ],
        answer: 0,
      },
      {
        prompt: 'Hizalanmayla kapat.',
        options: [
          'Give me two quarters to prove the ROI.',
          'Grant me two quarters to evince the return on said investment fully.',
          'Maybe give me a little time to show it works out okay or something, please.',
          'You\'ll see eventually.',
        ],
        answer: 0,
      },
    ],
    npc: 'The board wants to cut R&D to boost short-term profit.',
    choices: [
      { text: 'Okay, cut R&D to please them.', score: -15, result: 'Baskıya boyun eğdin; geleceği bugüne sattın.' },
      { text: 'I\'ll make the case for R&D — it\'s our future.', score: 25, result: 'Geleceği savundun. Liderlik cesaret ister.' },
    ],
  },
  {
    index: 8,
    title: 'Kültür ve Değerler',
    scene: 'open_office',
    story: 'Hızlı büyüme kültürü zorluyor. "Daha hızlı gitmek için değerleri gevşetelim" baskısı var — ama sizi siz yapan tam da bu değerler.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — kültür ve liderlik.',
    questions: [
      {
        prompt: 'Kültürün zorlandığını adlandır.',
        options: [
          'We\'re growing fast — let\'s protect what makes us us.',
          'Rapid scaling imperils our foundational cultural distinctiveness profoundly.',
          'So, um, we\'re getting big and the culture stuff is kind of changing, I guess.',
          'Culture\'s fine.',
        ],
        answer: 0,
      },
      {
        prompt: 'Biri "değerler bizi yavaşlatıyor" diyor.',
        options: [
          'Our values are why customers trust us.',
          'Our axiological commitments wholly underpin customer confidence herein.',
          'I think our values are kind of important for people trusting us, probably.',
          'Maybe we drop them.',
        ],
        answer: 0,
      },
      {
        prompt: 'Değerleri somutlaştır.',
        options: [
          'Let\'s reward the behavior we actually want.',
          'Let us incentivize the precise conduct we ostensibly espouse and value.',
          'We should maybe kind of reward good behavior or something, if we can, sure.',
          'Just state them.',
        ],
        answer: 0,
      },
      {
        prompt: 'Örnek ol.',
        options: [
          'I\'ll hold myself to them first.',
          'I shall subject myself to said standards in the very first instance.',
          'I guess I should kind of follow the values myself too, probably, I suppose.',
          'Rules are for the team.',
        ],
        answer: 0,
      },
      {
        prompt: 'Kapat.',
        options: [
          'Speed matters — but never at the cost of trust.',
          'Celerity is valued, yet never at the expense of fiduciary trust whatsoever.',
          'Going fast is good but we shouldn\'t lose trust and stuff, you know, I think.',
          'Just move fast.',
        ],
        answer: 0,
      },
    ],
    npc: 'Growth is fast — relax the values to move quicker?',
    choices: [
      { text: 'Hold the values — they\'re why we win.', score: 25, result: 'Değerlerden şaşmadın. Uzun vadede kazandıran bu.' },
      { text: 'Loosen them temporarily to hit growth.', score: -15, result: 'Değerleri esnettin; güven aşınmaya başladı.' },
    ],
  },
  {
    index: 9,
    title: 'CEO Koltuğu',
    scene: 'ceo_office',
    story: 'Her şey bu ana geldi. CEO koltuğu masada — ama şirket zorlu bir dönemde. Liderliğin asıl sınavı tam da bu an.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — CEO seviyesi.',
    questions: [
      {
        prompt: 'Kurul: "What\'s your vision as CEO?"',
        options: [
          'A company that wins by doing right, at scale.',
          'An enterprise predicated upon ethical preeminence at considerable scale.',
          'I want us to be, like, big and good and successful and stuff, you know.',
          'Make money.',
        ],
        answer: 0,
      },
      {
        prompt: 'Kurul: "Your biggest lesson?"',
        options: [
          'Under pressure, do the right thing.',
          'Adversity counsels unwavering adherence to rectitude above all else.',
          'I learned a lot of things about, like, leading and pressure and stuff, I guess.',
          'Just win.',
        ],
        answer: 0,
      },
      {
        prompt: 'Kurul: "First move as CEO?"',
        options: [
          'Listen to the whole company before I change anything.',
          'I shall solicit comprehensive organizational input antecedent to all reform.',
          'I\'d maybe kind of talk to people first before doing stuff, probably, I think.',
          'Shake everything up.',
        ],
        answer: 0,
      },
      {
        prompt: 'Kurul: "Why you?"',
        options: [
          'Because I lead best when it\'s hardest.',
          'By virtue of my demonstrated efficacy amid maximal difficulty conditions.',
          'I think I\'d be pretty good at it for a bunch of reasons, probably, I guess.',
          'I earned it.',
        ],
        answer: 0,
      },
      {
        prompt: 'Koltuğu kabul et.',
        options: [
          'I\'m ready. Let\'s get to work.',
          'I accept; let us forthwith commence our collective endeavours together.',
          'Okay yeah I\'ll take the job and we\'ll kind of get started soon, thanks, cool.',
          'Finally.',
        ],
        answer: 0,
      },
    ],
    npc: 'The CEO seat is yours — but the company\'s in a tough spot. Take it?',
    choices: [
      { text: 'I\'d rather wait for calmer times.', score: -10, result: 'Fırtınada dümeni bırakmak istedin; kurul tereddüt etti.' },
      { text: 'Now is exactly when leadership matters — I\'m in.', score: 25, result: 'Zor zamanda sorumluluğu aldın. Koltuk senin.' },
    ],
  },
];

// ===== PREMIUM — Global Manager (Londra ofisi, çok kültürlü global ekip) =====
// Cross-cultural leadership: time zones, remote teams, international clients,
// language barriers, cultural sensitivity. Decisions test global judgment and
// inclusion under pressure.
export const careerChaptersGlobal: StoryChapter[] = [
  {
    index: 0,
    title: 'Londra\'ya Taşınma',
    scene: 'open_office',
    story: 'Londra genel merkezine geldin; karşında farklı ülkelerden bir ekip var. Yabancı bir yönetici olarak ilk izlenim çok şey belirler.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — çok kültürlü tanışma.',
    questions: [
      {
        prompt: 'Londra merkezde ilk gün; çeşitli bir ekibe kendini tanıt.',
        options: [
          'Hi everyone — excited to work with you all.',
          'I hereby present myself as your newly appointed global manager herein.',
          'So, um, I\'m the new manager I guess, from abroad, nice to meet you, hi.',
          'Hello.',
        ],
        answer: 0,
      },
      {
        prompt: 'Yerel yöntemlere alçakgönüllü yaklaş.',
        options: [
          'I\'m new here — teach me how things work.',
          'I shall require instruction regarding your established local protocols.',
          'Maybe you could kind of show me how you do things around here, perhaps.',
          'I\'ll change things.',
        ],
        answer: 0,
      },
      {
        prompt: 'Bir meslektaş yardım öneriyor.',
        options: [
          'That\'d be great — thank you.',
          'Your kind offer of assistance is most graciously received indeed.',
          'Oh, um, yeah, sure, that would be kind of helpful I think, thanks a lot.',
          'No need.',
        ],
        answer: 0,
      },
      {
        prompt: 'Ekibin güçlü yanlarını sor.',
        options: [
          'What\'s this team really good at?',
          'In what domains does this team demonstrate particular proficiency?',
          'So like what kind of stuff is the team good at doing, usually, I wonder?',
          'Tell me everything.',
        ],
        answer: 0,
      },
      {
        prompt: 'Sıcak bir kapanış yap.',
        options: [
          'Looking forward to building this together.',
          'I anticipate our collaborative endeavours with considerable enthusiasm.',
          'So yeah, let\'s kind of work on stuff together and stuff, that\'d be good, okay.',
          'Bye.',
        ],
        answer: 0,
      },
    ],
    npc: 'The local team seems wary of the new boss from abroad.',
    choices: [
      { text: 'I\'ll prove I\'m in charge from day one.', score: -15, result: 'Hemen otorite kurmaya çalıştın; mesafe arttı.' },
      { text: 'I\'ll listen and learn how they work first.', score: 25, result: 'Önce dinledin; yerel ekip seni benimsedi.' },
    ],
  },
  {
    index: 1,
    title: 'Farklı Saat Dilimleri',
    scene: 'email_desk',
    story: 'Ekibin üç ayrı saat diliminde. Herkesi aynı saate zorlamak kolay ama adil değil. Async ve adil çalışmayı kurman gerekiyor.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — saat dilimleri ve async iletişim.',
    questions: [
      {
        prompt: 'Async dostu çalışmayı öner.',
        options: [
          'Let\'s write things down so no one\'s left out.',
          'Documentation shall ensure universal informational inclusion herein.',
          'Maybe we could kind of write stuff down so people don\'t miss things, perhaps.',
          'Just be online.',
        ],
        answer: 0,
      },
      {
        prompt: 'Başka saat dilimindeki bir kişiye e-posta at.',
        options: [
          'No rush — reply when your day starts.',
          'Kindly respond at such time as your working day commences accordingly.',
          'You can reply whenever your day starts or something, no big rush really, okay.',
          'Reply now.',
        ],
        answer: 0,
      },
      {
        prompt: 'Adil planla.',
        options: [
          'Let\'s rotate the meeting time so it\'s fair.',
          'A rotational scheduling paradigm shall ensure equitable temporal distribution.',
          'Maybe we could kind of move the meeting time around so it\'s fair, I guess.',
          '9am London, always.',
        ],
        answer: 0,
      },
      {
        prompt: 'Birinin mesai dışı saatine saygı göster.',
        options: [
          'It\'s late for you — let\'s talk tomorrow.',
          'Given the lateness of your hour, deferral to tomorrow is advisable.',
          'It\'s kind of late where you are so maybe we talk tomorrow or something, sure.',
          'Stay on the call.',
        ],
        answer: 0,
      },
      {
        prompt: 'Katılamayanlar için özetle.',
        options: [
          'I\'ll send a recap for anyone who missed it.',
          'A comprehensive recapitulation shall be disseminated to all absentees.',
          'I\'ll write up some notes for the people who weren\'t there, probably, later on.',
          'Ask someone.',
        ],
        answer: 0,
      },
    ],
    npc: 'Your team spans three time zones. One fixed meeting time, or rotate?',
    choices: [
      { text: 'One fixed time — everyone adapts to HQ.', score: -15, result: 'HQ\'yu merkez aldın; bazıları hep gece kaldı.' },
      { text: 'Rotate times so no one\'s always up at 3am.', score: 25, result: 'Adil davrandın; herkes kendini görülmüş hissetti.' },
    ],
  },
  {
    index: 2,
    title: 'Kültürel Farklar',
    scene: 'video_call',
    story: 'Bir ekip üyen toplantılarda hep sessiz. Bunu ilgisizlik sanmak kolay — ama belki de farklı bir iletişim kültürü söz konusu.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — kültürel duyarlılık.',
    questions: [
      {
        prompt: 'Sessiz bir kişiye varsayımda bulunmadan yaklaş.',
        options: [
          'Want to share your thoughts in writing instead?',
          'Might you prefer to articulate your cogitations in written form herein?',
          'Do you maybe want to write your ideas down instead or something, perhaps?',
          'Why so quiet?',
        ],
        answer: 0,
      },
      {
        prompt: 'Nezakete önem veren bir bağlamda geri bildirimi yumuşat.',
        options: [
          'Strong start — here\'s one thing to refine.',
          'Your initial effort is commendable; one refinement is hereby respectfully suggested.',
          'It\'s pretty good but there\'s kind of one thing you could maybe fix, I think.',
          'This is wrong.',
        ],
        answer: 0,
      },
      {
        prompt: 'Dil farkına rağmen anladığını teyit et.',
        options: [
          'Just to confirm — you mean X, right?',
          'I should like to verify my comprehension of your intended meaning herein.',
          'So, um, I just want to make sure I got what you meant, like, kind of, right?',
          'Whatever you said.',
        ],
        answer: 0,
      },
      {
        prompt: 'Farklı bir bayramı/geleneği kabul et.',
        options: [
          'Enjoy your holiday — we\'ll cover for you.',
          'I extend felicitations upon your culturally significant observance herein.',
          'Oh, it\'s your holiday thing, okay, that\'s nice, we\'ll handle stuff, I guess.',
          'We have deadlines.',
        ],
        answer: 0,
      },
      {
        prompt: 'Daha sessiz sesleri davet et.',
        options: [
          'I\'d love to hear from everyone.',
          'I should be gratified to receive input from all present parties herein.',
          'Maybe it\'d be nice if, like, everyone kind of said something, if they want, okay.',
          'Speak up or stay quiet.',
        ],
        answer: 0,
      },
    ],
    npc: 'A teammate is silent in every meeting. Is it disengagement?',
    choices: [
      { text: 'I\'ll call them out for not contributing.', score: -15, result: 'Yanlış varsaydın; kişiyi daha da geri çektin.' },
      { text: 'Maybe they prefer written input — I\'ll make space.', score: 25, result: 'Kültürel farkı anladın; katkıları açığa çıktı.' },
    ],
  },
  {
    index: 3,
    title: 'Uzaktan Ekip Yönetimi',
    scene: 'video_call',
    story: 'Ekibinin çoğu uzaktan çalışıyor. Sürekli kontrol etmek mi, güven verip net hedef koymak mı? Mesafe güveni zorluyor.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — uzaktan liderlik.',
    questions: [
      {
        prompt: 'Gözetim değil, net hedef koy.',
        options: [
          'Here\'s the goal — how you get there is yours.',
          'The objective is delineated; the methodology remains entirely at your discretion.',
          'So here\'s kind of the goal and you can do it however you want, I guess, sure.',
          'I\'ll watch your screen.',
        ],
        answer: 0,
      },
      {
        prompt: 'Uzaktaki bir üye yalnız hissediyor.',
        options: [
          'Let\'s grab a virtual coffee this week.',
          'A virtual coffee engagement is hereby proposed for this current week.',
          'Maybe we could kind of do a video coffee thing sometime this week or so, okay.',
          'Just focus on work.',
        ],
        answer: 0,
      },
      {
        prompt: 'Mikro yönetim yerine güven.',
        options: [
          'I trust you — ping me if you\'re stuck.',
          'My confidence in you is established; do escalate any impediments thereof.',
          'I kind of trust you so just tell me if you get stuck on stuff, I guess, okay.',
          'Report every hour.',
        ],
        answer: 0,
      },
      {
        prompt: 'Uzaktan emeği açıkça takdir et.',
        options: [
          'Great work this week — and from three time zones!',
          'Commendable output was achieved across tripartite temporal zones herein.',
          'You all did pretty good work this week from different places and stuff, nice.',
          'Fine work.',
        ],
        answer: 0,
      },
      {
        prompt: 'Async\'i net tut.',
        options: [
          'I\'ll write decisions down so nothing\'s lost.',
          'Decisional records shall be maintained to preclude informational loss herein.',
          'I\'ll kind of write down the decisions so people don\'t miss them, probably, okay.',
          'You\'ll remember.',
        ],
        answer: 0,
      },
    ],
    npc: 'A remote member is struggling. Micromanage or trust?',
    choices: [
      { text: 'I\'ll check their work every hour.', score: -15, result: 'Mikro yönettin; güven ve moral düştü.' },
      { text: 'Clear goals and a weekly check-in.', score: 25, result: 'Güven verdin, net hedef koydun. Performans arttı.' },
    ],
  },
  {
    index: 4,
    title: 'Uluslararası Müşteri',
    scene: 'conference',
    story: 'Başka bir ülkeden, daha resmi bir iletişim bekleyen bir müşteriyle görüşüyorsun. Kendi tarzında ısrar mı, onların normuna saygı mı?',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — kültürlerarası müşteri.',
    questions: [
      {
        prompt: 'Onların resmiyetine saygıyla aç.',
        options: [
          'Thank you for your time — it\'s a pleasure to meet you.',
          'I am profoundly honoured by the bestowal of your most esteemed time.',
          'Hey, thanks for, you know, meeting with us and stuff, it\'s cool, really.',
          'Let\'s start.',
        ],
        answer: 0,
      },
      {
        prompt: 'İletişim tarzlarına uyum sağla.',
        options: [
          'I\'ll keep it clear and detailed for you.',
          'I shall endeavour to maintain lucidity and comprehensive detail throughout herein.',
          'I\'ll try to kind of explain things clearly with details and stuff, I guess, okay.',
          'You\'ll figure it out.',
        ],
        answer: 0,
      },
      {
        prompt: 'Kültürel yanlış anlaşılmayı zarifçe yönet.',
        options: [
          'I may have misread that — please correct me.',
          'It is conceivable that I have misapprehended; pray, do correct me herein.',
          'Maybe I kind of got that wrong, sorry, you can correct me if I did, I guess.',
          'You\'re confusing me.',
        ],
        answer: 0,
      },
      {
        prompt: 'Sonraki adımları net teyit et.',
        options: [
          'I\'ll send a summary by tomorrow.',
          'A summary document shall be duly transmitted by the morrow without fail.',
          'I\'ll send some kind of summary thing tomorrow or maybe the day after, okay.',
          'We\'ll be in touch.',
        ],
        answer: 0,
      },
      {
        prompt: 'Saygıyla kapat.',
        options: [
          'Thank you — I value this partnership.',
          'My profound gratitude; I esteem this collaborative partnership most greatly.',
          'Thanks a lot, this partnership thing is, like, really good for us, you know.',
          'Bye.',
        ],
        answer: 0,
      },
    ],
    npc: 'The client expects a more formal style than yours. Adapt?',
    choices: [
      { text: 'We do business our own way.', score: -15, result: 'Esnemedin; müşteri mesafeli kaldı.' },
      { text: 'I\'ll adapt our style to respect their norms.', score: 25, result: 'Saygı gösterdin; müşteri güven duydu.' },
    ],
  },
  {
    index: 5,
    title: 'Yerel Pazara Giriş',
    scene: 'conference',
    story: 'Yeni bir bölge pazarına giriyorsun. Ana pazardaki başarılı planı kopyalamak cazip — ama burada işe yaramayabilir.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — pazar yerelleştirme.',
    questions: [
      {
        prompt: 'Kopyala-yapıştır stratejiye diren.',
        options: [
          'What works at home won\'t just work here.',
          'Strategies efficacious domestically lack guaranteed transferability herein.',
          'The stuff that works at home might not really work here, probably, I think, so.',
          'Copy the playbook.',
        ],
        answer: 0,
      },
      {
        prompt: 'Yerellerden içgörü iste.',
        options: [
          'Let\'s ask the local team what fits.',
          'Consultation with indigenous personnel regarding suitability is warranted.',
          'Maybe we should kind of ask the local people what works here or something, okay.',
          'We know best.',
        ],
        answer: 0,
      },
      {
        prompt: 'Kültürel alçakgönüllülük göster.',
        options: [
          'We\'re guests in this market — let\'s learn.',
          'We are, in this market, mere guests, and learning is therefore incumbent.',
          'We\'re kind of new to this market so we should probably learn stuff, I guess.',
          'We\'ll dominate.',
        ],
        answer: 0,
      },
      {
        prompt: 'Mesajı yerelleştir.',
        options: [
          'Let\'s translate the meaning, not just the words.',
          'We shall render the semantic essence, not merely the lexical equivalents.',
          'We should kind of translate what it means and not just the words, I think, okay.',
          'Just translate it.',
        ],
        answer: 0,
      },
      {
        prompt: 'Gerçekçi beklenti koy.',
        options: [
          'Growth here will be slower at first — that\'s fine.',
          'Initial expansion velocity shall be attenuated, which is wholly acceptable.',
          'It\'ll probably grow kind of slowly here at first but that\'s okay I guess, sure.',
          'We\'ll grow fast.',
        ],
        answer: 0,
      },
    ],
    npc: 'New market: copy the home playbook, or localize?',
    choices: [
      { text: 'Copy what already works.', score: -15, result: 'Kopyaladın; yerel pazara uymadı.' },
      { text: 'Localize — home tactics won\'t fit here.', score: 25, result: 'Yerelleştirdin; pazar seni benimsedi.' },
    ],
  },
  {
    index: 6,
    title: 'Çok Kültürlü Çatışma',
    scene: 'open_office',
    story: 'İki ekip üyen "kaba" geri bildirim tarzı yüzünden çatışıyor. Aslında bu bir kültürel iletişim farkı — birini haksız çıkarmak yanlış olur.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — kültürlerarası arabuluculuk.',
    questions: [
      {
        prompt: 'İki kişi geri bildirim tarzı yüzünden çatışıyor.',
        options: [
          'This looks like a culture-style difference, not a fight.',
          'This appears to constitute a cultural-stylistic divergence, not genuine conflict.',
          'I think this is maybe just kind of a culture difference thing, not a real fight.',
          'One of you is rude.',
        ],
        answer: 0,
      },
      {
        prompt: 'İkisini de doğrula.',
        options: [
          'Both styles are valid — let\'s find common ground.',
          'Both modalities possess validity; consensus must therefore be sought herein.',
          'You both kind of have a point so let\'s maybe find some middle thing, I guess.',
          'Just get along.',
        ],
        answer: 0,
      },
      {
        prompt: 'Direkt olana nazikçe koçluk yap.',
        options: [
          'Your point\'s great — soften how it lands.',
          'Your observation is sound; modulate merely its delivery thereof henceforth.',
          'Your idea is good but maybe say it a bit more softly or something, I think, okay.',
          'Stop being harsh.',
        ],
        answer: 0,
      },
      {
        prompt: 'Dolaylı olana da koçluk yap.',
        options: [
          'Don\'t be afraid to be a bit more direct.',
          'Pray, do not eschew a measure of augmented directness henceforth herein.',
          'Maybe you could try to be kind of a little more direct sometimes or so, okay.',
          'Speak up already.',
        ],
        answer: 0,
      },
      {
        prompt: 'Ortak bir norm belirle.',
        options: [
          'Let\'s agree how we give feedback as a team.',
          'Let us codify our collective feedback-provision conventions herewith herein.',
          'We should maybe kind of agree on how we do feedback together or something, sure.',
          'Figure it out.',
        ],
        answer: 0,
      },
    ],
    npc: 'Two teammates clash — one calls the other rude. Whose side?',
    choices: [
      { text: 'Neither — it\'s a cultural style difference. I\'ll help both see it.', score: 25, result: 'Kültürel farkı çözdün; iki taraf da rahatladı.' },
      { text: 'The blunt one is wrong — I\'ll tell them.', score: -15, result: 'Taraf tuttun; kültürel farkı çatışmaya çevirdin.' },
    ],
  },
  {
    index: 7,
    title: 'Global Sunum',
    scene: 'stage',
    story: 'Dünyanın dört bir yanından bağlanan bir kitleye sunum yapıyorsun. Çoğu ana dili İngilizce değil; net ve kapsayıcı olmalısın.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — global sunum.',
    questions: [
      {
        prompt: 'Global bir kitleye aç.',
        options: [
          'Thanks for joining from around the world.',
          'I express my gratitude for your global attendance herein assembled today.',
          'Hey everyone from all the different places, thanks for, you know, coming, cool.',
          'Let\'s begin.',
        ],
        answer: 0,
      },
      {
        prompt: 'Ana dili İngilizce olmayanlar için dili sade tut.',
        options: [
          'I\'ll keep it clear — no jargon, no slang.',
          'I shall eschew jargon and colloquialism entirely in favour of pure lucidity.',
          'I\'ll try to kind of keep things clear without too much slang and stuff, I guess.',
          'You\'ll keep up.',
        ],
        answer: 0,
      },
      {
        prompt: 'Global katkı davet et.',
        options: [
          'I\'d love perspectives from each region.',
          'Regional perspectives would be most welcome and gratefully received herein.',
          'It\'d be cool if people from different regions kind of shared stuff, maybe, okay.',
          'Any questions? No? Good.',
        ],
        answer: 0,
      },
      {
        prompt: 'Tam yanıtlayamadığın bir soruyu yönet.',
        options: [
          'Good question — I\'ll follow up with your region.',
          'An excellent query; regional follow-up shall duly be effectuated herein.',
          'That\'s a good one, I\'ll kind of get back to you about it later or something, okay.',
          'I don\'t know.',
        ],
        answer: 0,
      },
      {
        prompt: 'Kapsayıcı kapat.',
        options: [
          'Thank you — we win as one team.',
          'My gratitude; our collective triumph is predicated upon unity herein.',
          'Thanks everyone, we\'re like one big team and stuff, that\'s nice, you know, bye.',
          'That\'s all.',
        ],
        answer: 0,
      },
    ],
    npc: 'Use lots of local slang and jokes to seem relatable?',
    choices: [
      { text: 'Yes, throw in idioms and jokes.', score: -15, result: 'Çok argo kullandın; native olmayanlar koptu.' },
      { text: 'Keep it clear — many aren\'t native speakers.', score: 25, result: 'Herkesin anlayacağı dilde konuştun. Kapsayıcı oldun.' },
    ],
  },
  {
    index: 8,
    title: 'Dil ve Nezaket Engeli',
    scene: 'email_desk',
    story: 'Bir ekip üyenin İngilizcesi zayıf ama fikirleri çok güçlü. Dili öne çıkarmak yerine fikre değer vermen, kapsayıcı liderliğin sınavı.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — dil engeli ve kapsayıcılık.',
    questions: [
      {
        prompt: 'İngilizcesi zayıf ama fikirleri güçlü bir üye.',
        options: [
          'Your idea is excellent — tell me more.',
          'Your conception possesses considerable merit; elaborate further, I pray.',
          'Your idea is, like, really good, can you maybe tell me more about it, I guess?',
          'Fix your English first.',
        ],
        answer: 0,
      },
      {
        prompt: 'Onları asla aceleye getirme.',
        options: [
          'Take your time — I\'m listening.',
          'Pray, proceed at your leisure; I attend most fully to your every word.',
          'You can kind of take your time and stuff, I\'m listening, no rush really, okay.',
          'Hurry up.',
        ],
        answer: 0,
      },
      {
        prompt: 'Anlamı nazikçe teyit et.',
        options: [
          'Let me make sure I understood you.',
          'Permit me to ascertain the accuracy of my comprehension thereof herein.',
          'Let me just kind of check that I got what you meant or something, I think, okay.',
          'What?',
        ],
        answer: 0,
      },
      {
        prompt: 'Toplantıları kapsayıcı yap.',
        options: [
          'Let\'s share the agenda ahead so everyone can prep.',
          'The agenda shall be circulated in advance to facilitate due preparation.',
          'Maybe we could send the agenda before so people can kind of get ready, I guess.',
          'Just show up.',
        ],
        answer: 0,
      },
      {
        prompt: 'Cesaretlendir.',
        options: [
          'Your English is better than you think.',
          'Your linguistic competence exceeds your own modest estimation thereof herein.',
          'Your English is, like, actually pretty good, better than you think, probably, okay.',
          'Keep practicing.',
        ],
        answer: 0,
      },
    ],
    npc: 'A teammate\'s English is shaky but their ideas are great. What do you do?',
    choices: [
      { text: 'Suggest they improve their English first.', score: -15, result: 'Fikri değil dili öne çıkardın; kişi sustu.' },
      { text: 'Make space for their ideas and never rush them.', score: 25, result: 'Fikre değer verdin; en iyi fikirler ortaya çıktı.' },
    ],
  },
  {
    index: 9,
    title: 'Bölge Direktörlüğü',
    scene: 'ceo_office',
    story: 'Bölge direktörlüğü masada — ama sürekli seyahat ve baskı demek. Sınırların ötesinde liderliğin gerçek sınavı bu an.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — global liderlik.',
    questions: [
      {
        prompt: 'CEO: "Sum up your time leading globally."',
        options: [
          'I built one team across many cultures and time zones.',
          'I forged a unified team transcending myriad cultures and temporal zones herein.',
          'I kind of led a bunch of people from different places and it went okay, I think.',
          'It went fine.',
        ],
        answer: 0,
      },
      {
        prompt: 'CEO: "Hardest part of global leadership?"',
        options: [
          'Earning trust across very different cultures.',
          'The cultivation of trust amid pronounced cultural heterogeneity herein.',
          'Probably the trust thing with all the different cultures and stuff, I guess, yeah.',
          'Time zones.',
        ],
        answer: 0,
      },
      {
        prompt: 'CEO: "How do you lead people you rarely see?"',
        options: [
          'Clear goals, real trust, and constant communication.',
          'Via lucid objectives, authentic trust, and incessant communication thereof.',
          'I kind of give them goals and trust them and talk a lot, usually, I guess, okay.',
          'I don\'t really.',
        ],
        answer: 0,
      },
      {
        prompt: 'CEO: "Why you for regional director?"',
        options: [
          'Because I bring people together across borders.',
          'By virtue of my capacity to unify personnel across national boundaries herein.',
          'I think I\'m pretty good at getting people together from different places, I guess.',
          'I earned it.',
        ],
        answer: 0,
      },
      {
        prompt: 'Rolü kabul et.',
        options: [
          'I\'m ready to lead across the region.',
          'I stand prepared to assume leadership throughout the entire region herein.',
          'Yeah okay I\'ll take the regional job and lead people and stuff, sounds good, cool.',
          'Finally.',
        ],
        answer: 0,
      },
    ],
    npc: 'The regional director role is yours — constant travel and pressure. Ready?',
    choices: [
      { text: 'I\'d prefer to stay local.', score: -10, result: 'Konfor alanını seçtin; global fırsat ertelendi.' },
      { text: 'I\'m ready to lead across borders.', score: 25, result: 'Sınırların ötesinde liderliği üstlendin. Bölge senin.' },
    ],
  },
];

export function chaptersFor(storyId: string): StoryChapter[] {
  if (storyId === 'career') return careerChapters;
  if (storyId === 'career2') return careerChapters2;
  if (storyId === 'career3') return careerChapters3;
  if (storyId === 'global_manager') return careerChaptersGlobal;
  return [];
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
  nextLabel: string; // label for the "go to next card" button on a ★★★ result
}

export function card1Ending(score: number): CardEndingInfo {
  const r = card1Stars(score);
  if (r === 'star3')
    return {
      result: 'star3', stars: 3, kicker: 'YÜKSELEN YILDIZ', title: 'Yükselen Yıldız oldun!',
      text: 'İlk yılını parlak geçirdin. Ekip lideri olarak sözün geçiyor artık. Sıradaki durak: Yöneticilik.',
      badge: '⭐', badgeColor: '#FFC83D', unlocksCard2: true, nextLabel: "Kart 2'ye Geç — Yöneticilik Yolu",
    };
  if (r === 'star2')
    return {
      result: 'star2', stars: 2, kicker: 'UZMAN', title: 'Güçlü bir Uzman oldun.',
      text: 'Yılı başarıyla tamamladın. Şirkette saygın bir uzman olarak yerini aldın. Yöneticilik için biraz daha cesur kararlar gerekebilir.',
      badge: '🥈', badgeColor: '#C0C0C0', unlocksCard2: false, nextLabel: '',
    };
  return {
    result: 'star1', stars: 1, kicker: 'SEBAT', title: 'Bu yıl zorlu geçti.',
    text: 'Bazı kararlar seni geride bıraktı. Ama her büyük kariyer zorluklarla başlar. Tekrar dene — bu sefer farklı seçimler seni nereye götürür?',
    badge: '🥉', badgeColor: '#CD7F32', unlocksCard2: false, nextLabel: '',
  };
}

// Card 2 (Yöneticilik Yolu) endings — manager track, framed around handling pressure.
export function card2Ending(score: number): CardEndingInfo {
  const r = card1Stars(score);
  if (r === 'star3')
    return {
      result: 'star3', stars: 3, kicker: 'MÜDÜR', title: 'Müdür oldun!',
      text: 'Baskı altında doğru kararları verdin; ekibin sana güveniyor, üst yönetim seni fark etti. Sıradaki durak: Zirve.',
      badge: '⭐', badgeColor: '#FFC83D', unlocksCard2: true, nextLabel: "Kart 3'e Geç — Zirveye Son Adım",
    };
  if (r === 'star2')
    return {
      result: 'star2', stars: 2, kicker: 'TAKIM LİDERİ', title: 'Sağlam bir Takım Lideri oldun.',
      text: 'Yılı başarıyla götürdün. Ama bazı zor kararlarda baskı seni biraz geriletti. Müdürlük için biraz daha net ve kararlı ol.',
      badge: '🥈', badgeColor: '#C0C0C0', unlocksCard2: false, nextLabel: '',
    };
  return {
    result: 'star1', stars: 1, kicker: 'DENEYİM', title: 'Zorlu bir yıldı.',
    text: 'Baskı bazı kararları zorlaştırdı ve geri adım attın. Ama her lider bu sınavlardan geçer. Tekrar dene — bu sefer baskıya teslim olma.',
    badge: '🥉', badgeColor: '#CD7F32', unlocksCard2: false, nextLabel: '',
  };
}

// Card 3 (Zirveye Son Adım) endings — executive track, the summit.
export function card3Ending(score: number): CardEndingInfo {
  const r = card1Stars(score);
  if (r === 'star3')
    return {
      result: 'star3', stars: 3, kicker: 'CEO', title: 'CEO oldun! 👑',
      text: 'Stajyerlikten zirveye... Baskı altında verdiğin her doğru karar seni buraya taşıdı. İngilizce sadece bir dil değildi — geleceğinin anahtarıydı.',
      badge: '👑', badgeColor: '#FFC83D', unlocksCard2: false, nextLabel: '',
    };
  if (r === 'star2')
    return {
      result: 'star2', stars: 2, kicker: 'DİREKTÖR', title: 'Direktör oldun.',
      text: 'Güçlü bir kariyer inşa ettin. Zirve çok yakındı; birkaç cesur karar daha seni tahta oturturdu. Yine de büyük bir başarı.',
      badge: '🥈', badgeColor: '#C0C0C0', unlocksCard2: false, nextLabel: '',
    };
  return {
    result: 'star1', stars: 1, kicker: 'DENEYİM', title: 'Zirve bu sefer uzak kaldı.',
    text: 'Bazı kararlarda baskı ağır bastı. Ama buraya kadar gelmek bile büyük iş. Tekrar dene — zirve seni bekliyor.',
    badge: '🥉', badgeColor: '#CD7F32', unlocksCard2: false, nextLabel: '',
  };
}

// Global Manager (premium) endings — leading across cultures and time zones.
export function cardGlobalEnding(score: number): CardEndingInfo {
  const r = card1Stars(score);
  if (r === 'star3')
    return {
      result: 'star3', stars: 3, kicker: 'GLOBAL DİREKTÖR', title: 'Global Direktör oldun! 🌍',
      text: 'Farklı kültürleri ve saat dilimlerini tek bir ekipte birleştirdin. Sınırların ötesinde liderlik artık senin işin.',
      badge: '🌍', badgeColor: '#FFC83D', unlocksCard2: false, nextLabel: '',
    };
  if (r === 'star2')
    return {
      result: 'star2', stars: 2, kicker: 'BÖLGE LİDERİ', title: 'Güçlü bir Bölge Lideri oldun.',
      text: 'Global ekibi başarıyla yönettin. Direktörlük için kültürel sezgini biraz daha derinleştir.',
      badge: '🥈', badgeColor: '#C0C0C0', unlocksCard2: false, nextLabel: '',
    };
  return {
    result: 'star1', stars: 1, kicker: 'DENEYİM', title: 'Global sahne zorluydu.',
    text: 'Kültürel farklar bazı kararları zorlaştırdı. Ama dünya çapında liderlik öğrenilir. Tekrar dene.',
    badge: '🥉', badgeColor: '#CD7F32', unlocksCard2: false, nextLabel: '',
  };
}

export function cardEnding(storyId: string, score: number): CardEndingInfo {
  if (storyId === 'career2') return card2Ending(score);
  if (storyId === 'career3') return card3Ending(score);
  if (storyId === 'global_manager') return cardGlobalEnding(score);
  return card1Ending(score);
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
