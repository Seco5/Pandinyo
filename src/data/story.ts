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

export function chaptersFor(storyId: string): StoryChapter[] {
  if (storyId === 'career') return careerChapters;
  if (storyId === 'career2') return careerChapters2;
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

export function cardEnding(storyId: string, score: number): CardEndingInfo {
  return storyId === 'career2' ? card2Ending(score) : card1Ending(score);
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
