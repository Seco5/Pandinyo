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

export const stories: Story[] = [
  { id: 'career', title: 'Sıfırdan Zirveye', subtitle: 'Kariyer hikayesi · 10 bölüm', cover: 'ceo_office', free: true },
  { id: 'relationships', title: 'Bağlantılar ve Hayat', subtitle: 'İlişkiler', cover: 'open_office', free: false, quarter: '2025 Q3' },
  { id: 'abroad', title: 'Yeni Ülke, Yeni Hayat', subtitle: 'Yurt dışı', cover: 'video_call', free: false, quarter: '2025 Q4' },
  { id: 'startup', title: 'Sıfırdan Şirket Kur', subtitle: 'Girişim', cover: 'stage', free: false, quarter: '2026 Q1' },
];

export const careerChapters: StoryChapter[] = [
  {
    index: 0,
    title: 'İlk mülakat',
    scene: 'waiting_room',
    story: 'Hayalindeki şirketten davet aldın. Bekleme odasındasın, kalbin hızlı atıyor. İlk izlenim her şeydir.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — kendini tanıtma.',
    questions: [
      {
        prompt: '"Could you tell me a little about yourself?" sorusuna en uygun başlangıç hangisi?',
        options: [
          'I am a person who likes working.',
          "Sure. I have five years of experience in marketing and I'm passionate about data-driven strategies.",
          'My name is Alex and I am 28 years old.',
          'I want to work here because it is a good company.',
        ],
        answer: 1,
      },
      {
        prompt: '"What is your greatest strength?" sorusuna doğru yanıt:',
        options: [
          'I am very good at everything.',
          'My greatest strength is probably my ability to stay calm under pressure and find solutions quickly.',
          "I don't know, maybe I work hard.",
          'I am a very strong person.',
        ],
        answer: 1,
      },
      {
        prompt: '"Why do you want to work here?" sorusuna en profesyonel yanıt:',
        options: [
          'Because you pay well.',
          'I saw you have good benefits.',
          "I've followed your company's growth and I believe my skills align perfectly with your mission.",
          'My friend told me to apply here.',
        ],
        answer: 2,
      },
      {
        prompt: '"Where do you see yourself in five years?" sorusuna uygun yanıt:',
        options: [
          'I hope to still be working.',
          "I'd like to grow into a leadership role and contribute to the company's long-term strategy.",
          "I don't think about the future.",
          'In five years I want to be very rich.',
        ],
        answer: 1,
      },
      {
        prompt: 'Mülakat sonunda en doğru kapanış ifadesi:',
        options: [
          'OK bye, I hope I get the job.',
          'Thank you for your time. I really enjoyed our conversation and I look forward to hearing from you.',
          'When will you call me?',
          'I think I did well today.',
        ],
        answer: 1,
      },
    ],
    npc: 'We\'d like to offer you the position. The starting salary is $4,500 per month.',
    choices: [
      { text: 'Thank you so much! I accept.', score: -15, result: 'Hemen kabul ettin. Pazarlık yapmadın — belki daha fazlasını alabilirdin.' },
      { text: "Thank you. I'm very excited. Based on my research, I was expecting something closer to $5,500. Is there any flexibility?", score: 25, result: 'Nazikçe pazarlık yaptın. Profesyonel duruşun fark edildi.' },
    ],
  },
  {
    index: 1,
    title: 'İlk gün',
    scene: 'open_office',
    story: 'İşe başladın. Ekibinle tanışıyorsun. İlk izlenim her şeydir.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — telefon ve tanışma.',
    questions: [
      {
        prompt: 'Meslektaşın "Nice to meet you! What did you do before joining us?" dedi. En iyi yanıt:',
        options: [
          'I worked.',
          'Before this, I was a project coordinator at a logistics firm where I managed cross-functional teams.',
          'Nothing special.',
          'I worked at a company.',
        ],
        answer: 1,
      },
      {
        prompt: '"Do you need help finding anything?" sorusuna nazik yanıt:',
        options: [
          'No.',
          "That's very kind of you. Could you point me to the meeting room schedule?",
          'Yes I need many things.',
          'I am fine thank you bye.',
        ],
        answer: 1,
      },
      {
        prompt: 'Ofis telefonu çaldı. Nasıl cevaplarsın?',
        options: [
          'Hello?',
          'Good morning, Alex speaking. How can I help you?',
          'Who is this?',
          'Yes?',
        ],
        answer: 1,
      },
      {
        prompt: 'Toplantı daveti aldın. Kabul mesajı nasıl olmalı?',
        options: [
          'OK I come.',
          "Thank you for the invitation. I'll be there.",
          'Yes ok.',
          'Fine.',
        ],
        answer: 1,
      },
      {
        prompt: 'Müdürün sana bir görev verdi. Anlamadın. Ne dersin?',
        options: [
          'What?',
          "I'm sorry, could you clarify what you mean by the deadline? I want to make sure I get this right.",
          "I don't understand.",
          'OK I will do it.',
        ],
        answer: 1,
      },
    ],
    npc: 'We have a team lunch today. Would you like to join us?',
    choices: [
      { text: "I'm actually quite busy settling in, maybe next time.", score: -15, result: 'Daveti geri çevirdin. Ekiple kaynaşma fırsatını kaçırdın.' },
      { text: "I'd love to. It would be a great opportunity to get to know everyone.", score: 25, result: 'Daveti kabul ettin. Ekip seni hemen benimsedi.' },
    ],
  },
  {
    index: 2,
    title: 'İlk toplantı',
    scene: 'conference',
    story: 'Büyük haftalık toplantı. Müdürün senden fikir bekliyor. Konuşacak mısın?',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — toplantı dili.',
    questions: [
      {
        prompt: 'Toplantıya geç kaldın. Giriş cümlesi:',
        options: [
          'Sorry I am late.',
          'I apologize for being late. There was an issue with the elevator. Please continue.',
          'Traffic was bad.',
          'Late sorry.',
        ],
        answer: 1,
      },
      {
        prompt: 'Fikrini söylemek istiyorsun. Nasıl girersin?',
        options: [
          'I want to say something.',
          "If I may, I'd like to add something to that point.",
          'Me, me!',
          'Stop, I have idea.',
        ],
        answer: 1,
      },
      {
        prompt: 'Birinin fikrini beğendin ve üzerine inşa etmek istiyorsun:',
        options: [
          'Yes good idea.',
          'Building on what Sarah just said, we could also consider expanding that approach to include...',
          'Same as her.',
          'I agree.',
        ],
        answer: 1,
      },
      {
        prompt: 'Anlamadığın bir konu var. Nasıl sorarsın?',
        options: [
          'What does that mean?',
          'Could you elaborate on that point? I want to make sure I fully understand before we move on.',
          "I don't understand.",
          'Explain please.',
        ],
        answer: 1,
      },
      {
        prompt: 'Toplantı sona eriyor. Müdür "Any final thoughts?" dedi:',
        options: [
          'No.',
          "Just to summarize, I think we've aligned on the key priorities. I'll send a follow-up email with the action items.",
          'I am tired.',
          'Nothing.',
        ],
        answer: 1,
      },
    ],
    npc: "Alex, would you like to lead next week's presentation on the Q3 results?",
    choices: [
      { text: "I'm not sure I'm ready for that yet.", score: -15, result: 'Fırsattan kaçındın. Liderlik şansını başkasına bıraktın.' },
      { text: "Absolutely. I'll prepare thoroughly and make sure the team has everything they need.", score: 25, result: 'Sorumluluğu üstlendin. Müdürün gözünde yıldızın parladı.' },
    ],
  },
  {
    index: 3,
    title: 'Müşteri e-postası',
    scene: 'email_desk',
    story: 'Büyük bir müşteri şikayet e-postası gönderdi. Müdürün bu müşteriyi kaybetmemeni söylüyor.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — e-posta yazma.',
    questions: [
      {
        prompt: 'Şikayet e-postasına başlangıç:',
        options: [
          'Dear client, sorry for the problem.',
          'Dear Mr. Johnson, thank you for bringing this to our attention. I sincerely apologize for the inconvenience caused.',
          'Hello, we are sorry.',
          'To whom it may concern, the issue is not our fault.',
        ],
        answer: 1,
      },
      {
        prompt: 'Sorunu açıklama cümlesi:',
        options: [
          'The problem was because of many reasons.',
          'After investigating the matter, we have identified the root cause and have taken immediate steps to resolve it.',
          'We had some issues internally.',
          'Things happen sometimes.',
        ],
        answer: 1,
      },
      {
        prompt: 'Çözüm önerme:',
        options: [
          'We will fix it.',
          'As a gesture of goodwill, I would like to offer you a full refund and priority support for your next three orders.',
          'Maybe we can help.',
          'We hope this is OK.',
        ],
        answer: 1,
      },
      {
        prompt: 'E-postayı kapatma:',
        options: [
          "Please don't be angry.",
          'I am confident this will not happen again and I look forward to continuing our partnership.',
          'Thanks bye.',
          'Hope you are not too upset.',
        ],
        answer: 1,
      },
      {
        prompt: 'Konu satırı nasıl olmalı?',
        options: [
          'Problem',
          'Re: Your recent concern — Resolution and next steps',
          'Sorry email',
          'About the complaint',
        ],
        answer: 1,
      },
    ],
    npc: 'I appreciate your response. Would you be available for a call tomorrow to discuss further?',
    choices: [
      { text: 'Tomorrow is actually quite busy for me. Maybe next week?', score: -15, result: 'Müşteriyi beklettin. İlgisizlik izlenimi bıraktın.' },
      { text: "Of course. I'm available at any time that suits you. Please let me know your preferred slot.", score: 25, result: 'Hızlı ve esnek davrandın. Müşteri güvenini geri kazandın.' },
    ],
  },
  {
    index: 4,
    title: 'Zam talebi',
    scene: 'manager_office',
    story: '6 ay geçti. Performansın mükemmeldi. Zam isteme vakti. Cesaretini topla.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — ücret görüşmesi.',
    questions: [
      {
        prompt: 'Zam talebine nasıl başlanır?',
        options: [
          'I want more money.',
          "I'd like to discuss my compensation. Over the past six months, I've consistently exceeded my targets and taken on additional responsibilities.",
          'Everyone else earns more.',
          'My salary is too low.',
        ],
        answer: 1,
      },
      {
        prompt: 'Müdür "What figure did you have in mind?" dedi:',
        options: [
          'As much as possible.',
          'Based on my research and the value I\'ve delivered, I was thinking of a 20% increase.',
          "I don't know, you decide.",
          'Double.',
        ],
        answer: 1,
      },
      {
        prompt: 'Müdür "That\'s quite high" dedi:',
        options: [
          'OK forget it.',
          "I understand. I'm open to discussing a phased increase — perhaps 15% now with a review in three months.",
          'No it is not high.',
          'OK then I will leave.',
        ],
        answer: 1,
      },
      {
        prompt: 'Müdür başarıların hakkında soru sordu:',
        options: [
          'I worked hard.',
          'In the last quarter, I closed three major accounts and reduced our client response time by 40%.',
          'I did many things.',
          'I am a good worker.',
        ],
        answer: 1,
      },
      {
        prompt: 'Görüşmeyi kapatma:',
        options: [
          'So do I get it or not?',
          "I appreciate you taking the time to discuss this. I'm committed to this company and I'm confident we can reach an agreement that reflects my contributions.",
          'Please say yes.',
          'I need answer now.',
        ],
        answer: 1,
      },
    ],
    npc: 'I can offer you a 12% increase starting next month.',
    choices: [
      { text: "12%? I expected more. I'll need to think about it.", score: 10, result: 'Riskli bir hamle yaptın ama cesaretin saygı gördü.' },
      { text: 'Thank you. I accept and I look forward to continuing to deliver strong results.', score: 25, result: 'Teklifi olgunlukla kabul ettin. İlişkin güçlendi.' },
    ],
  },
  {
    index: 5,
    title: 'Uluslararası müşteri',
    scene: 'video_call',
    story: "Şirketin ilk uluslararası müşterisiyle görüşme. İngilizce bu kez gerçekten önemli.",
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — sunum ve toplantı.',
    questions: [
      {
        prompt: 'Görüşmeye başlama:',
        options: [
          'Hello can you hear me?',
          "Good morning. Thank you for joining today. I'll walk you through our proposal and we'll have time for questions at the end.",
          "Hi, let's start.",
          'Hello hello testing.',
        ],
        answer: 1,
      },
      {
        prompt: 'Müşteri: "Can you explain your pricing model?" dedi:',
        options: [
          'It is in the document.',
          'Of course. Our pricing is based on a monthly subscription with three tiers depending on usage volume. Let me walk you through each one.',
          'Yes the price is on the website.',
          'It depends.',
        ],
        answer: 1,
      },
      {
        prompt: 'Müşteri itiraz etti: "This seems expensive compared to competitors."',
        options: [
          'No it is not expensive.',
          "That's a fair point. However, unlike our competitors, we offer dedicated support and a guaranteed SLA of 99.9% uptime, which significantly reduces your operational risk.",
          'Competitors are bad.',
          'We can lower the price.',
        ],
        answer: 1,
      },
      {
        prompt: 'Teknik bir soruyu anlamadın:',
        options: [
          "I don't understand.",
          'I want to make sure I give you the most accurate answer. Could you rephrase that question?',
          'What?',
          'Ask again.',
        ],
        answer: 1,
      },
      {
        prompt: 'Görüşmeyi kapatma:',
        options: [
          'OK bye, we will send email.',
          "Thank you for your time today. I'll send a detailed proposal by Thursday and I'm available for any follow-up questions.",
          'Thank you goodbye.',
          'We will contact you.',
        ],
        answer: 1,
      },
    ],
    npc: "We're also speaking with two other vendors. What makes you stand out?",
    choices: [
      { text: "I'm not sure what to say. We are a good company.", score: -15, result: 'Net bir cevap veremedin. Müşteri tereddüt etti.' },
      { text: 'What sets us apart is our commitment to long-term partnerships. Our average client retention rate is 94% — and that speaks louder than any pitch.', score: 25, result: 'Güçlü bir argüman sundun. Müşteriyi etkiledin.' },
    ],
  },
  {
    index: 6,
    title: 'Liderlik fırsatı',
    scene: 'stage',
    story: 'Şirketin en büyük konferansında konuşmacı olmak için seçildin. Sahne ışıkları üzerinde.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — sunum yapma.',
    questions: [
      {
        prompt: 'Sahneye çıkış cümlesi:',
        options: [
          'Um, hi everyone.',
          "Good afternoon. It's a privilege to be here today, and I'd like to share something that fundamentally changed the way our team operates.",
          'Hello I am Alex and I will talk now.',
          "So yeah, let's begin.",
        ],
        answer: 1,
      },
      {
        prompt: 'Ana mesajı vurgulama:',
        options: [
          'The point is things are better now.',
          "The core insight is this: the companies that will lead the next decade are not the ones with the most resources — they're the ones that communicate most effectively.",
          'Communication is important.',
          'We did good work.',
        ],
        answer: 1,
      },
      {
        prompt: 'Dinleyicilerle bağlantı kurma:',
        options: [
          'I hope you are listening.',
          "I'd like to ask you something. How many of you have lost a deal not because of your product, but because of how it was presented?",
          'Are you bored?',
          'Please pay attention.',
        ],
        answer: 1,
      },
      {
        prompt: 'Verileri sunma:',
        options: [
          'We have good numbers.',
          'Over the past 18 months, this approach increased our client retention by 34% and cut onboarding time in half.',
          'The data shows improvement.',
          'Numbers are good.',
        ],
        answer: 1,
      },
      {
        prompt: 'Kapanış:',
        options: [
          'OK I am done, thank you.',
          "To close: the most powerful tool in business is not technology or capital — it's clarity. Thank you.",
          'That is all.',
          'Finish, questions?',
        ],
        answer: 1,
      },
    ],
    npc: "Impressive talk. We'd love to have someone like you on our team.",
    choices: [
      { text: 'Oh really? Tell me more about the offer.', score: -10, result: 'Rakip teklife ilgi gösterdin. Sadakatin sorgulandı.' },
      { text: "That's very kind. I'm deeply committed to my current company, but I appreciate the words.", score: 25, result: 'Zarif bir şekilde reddettin. Duruşun takdir topladı.' },
    ],
  },
  {
    index: 7,
    title: 'Kriz anı',
    scene: 'night_office',
    story: 'Büyük müşteri aniden iptal etti. Şirketin en kötü gecesi. Boş ofiste sadece ekran ışığı var. Sen ne yapacaksın?',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — kriz iletişimi.',
    questions: [
      {
        prompt: 'Müdüre durumu bildirme:',
        options: [
          'Bad news, client left.',
          "I need to inform you immediately — GlobalCorp has cancelled their contract. I've already begun drafting a response plan.",
          'We lost a client.',
          'Problem happened.',
        ],
        answer: 1,
      },
      {
        prompt: 'Müşteriyi geri kazanmak için e-posta:',
        options: [
          "Please don't leave us.",
          "I understand your decision, and I respect it. However, I'd welcome the opportunity to address your concerns directly before we part ways.",
          'Why are you leaving?',
          'We want you back.',
        ],
        answer: 1,
      },
      {
        prompt: 'Ekibine kriz anında konuşma:',
        options: [
          "Things are bad, I don't know what to do.",
          "This is a setback, not a defeat. We've faced challenges before and come through stronger. Here's how we're going to respond.",
          'Everyone be calm.',
          "Don't worry.",
        ],
        answer: 1,
      },
      {
        prompt: 'Alternatif çözüm önerme:',
        options: [
          'Maybe we can try something.',
          "I'd like to propose a 30-day pilot at no cost — it gives you the chance to re-evaluate without any financial commitment.",
          'We can lower price.',
          'Please give us chance.',
        ],
        answer: 1,
      },
      {
        prompt: 'Durumu yönetime raporlama:',
        options: [
          'The client left because of problems.',
          "Following the contract cancellation, I've identified three contributing factors and I'm presenting a recovery plan with projected timelines.",
          'We are working on it.',
          'It was not our fault.',
        ],
        answer: 1,
      },
    ],
    npc: "We'll come back only if you personally guarantee the service level.",
    choices: [
      { text: "I'm not sure I can make that promise personally.", score: -15, result: 'Sorumluluktan kaçtın. Müşteri ikna olmadı.' },
      { text: "You have my word. And I'll put it in writing.", score: 25, result: 'Şahsen garanti verdin. Müşteri geri döndü.' },
    ],
  },
  {
    index: 8,
    title: 'Terfi kararı',
    scene: 'ceo_office',
    story: "CEO seni çağırdı. Panoramik şehir manzarası önünde bir terfi teklifi var. Ama büyük bir sorumluluk.",
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — ileri seviye iş İngilizcesi.',
    questions: [
      {
        prompt: 'CEO: "What\'s your vision for the team if you take this role?"',
        options: [
          'I will make things better.',
          'My vision is to build a team that operates with both strategic clarity and executional precision — one that sets industry benchmarks, not follows them.',
          'I want everyone to work hard.',
          'I have many ideas.',
        ],
        answer: 1,
      },
      {
        prompt: 'CEO: "What\'s your biggest weakness as a leader?"',
        options: [
          'I have no weaknesses.',
          "I've historically focused too much on execution at the expense of delegation. I've been actively working on that by mentoring junior team members to take ownership.",
          'I work too hard sometimes.',
          'I am too nice.',
        ],
        answer: 1,
      },
      {
        prompt: 'CEO: "How do you handle underperforming team members?"',
        options: [
          'I fire them.',
          "I start with a private conversation to understand the root cause, set clear expectations, and provide the support they need. If performance doesn't improve, I escalate through proper channels.",
          'I ignore it.',
          'I tell them to do better.',
        ],
        answer: 1,
      },
      {
        prompt: 'CEO: "What would you change about our current strategy?"',
        options: [
          'Everything is fine.',
          "I'd prioritize deeper investment in client success. Our product is strong, but our retention numbers suggest we're leaving value on the table post-sale.",
          'I need more time to think.',
          'Not much, everything is good.',
        ],
        answer: 1,
      },
      {
        prompt: 'CEO: "Why should it be you?"',
        options: [
          'Because I work here long time.',
          "Because I've spent three years understanding not just what this company does, but why it exists — and I'm ready to lead that purpose forward.",
          'I am the best.',
          "I don't know, you decide.",
        ],
        answer: 1,
      },
    ],
    npc: 'The role comes with a significant pay increase but also means relocating to our London office for two years.',
    choices: [
      { text: 'London is quite far. Could I operate remotely instead?', score: -10, result: 'Konfor alanından çıkmak istemedin. CEO biraz tereddüt etti.' },
      { text: "I'm ready for that challenge. A new market exposure will only make me more effective for this company.", score: 25, result: 'Zorluğu kucakladın. CEO\'nun güvenini kazandın.' },
    ],
  },
  {
    index: 9,
    title: 'Son karar',
    scene: 'dark_room',
    story: 'Her şey bu ana geldi. Karanlık, boş bir oda. Sadece bir sandalye ve ışık. Karar verildi.',
    challengeIntro: 'Bu sahneyi açmak için 5 soruyu cevapla — en zor sorular.',
    questions: [
      {
        prompt: 'Yönetim kuruluna sunum: "What is your three-year plan for the company?"',
        options: [
          'Grow the business and make profit.',
          'Over the next three years, I plan to expand into two new markets, build a scalable talent pipeline, and position us as the category leader in our segment.',
          'I have a plan but it is complex.',
          'We will see what happens.',
        ],
        answer: 1,
      },
      {
        prompt: 'Zorlu bir yatırımcı sorusu: "Why should we trust your judgment?"',
        options: [
          'Because I am smart.',
          'Because every decision I\'ve made in this company has been grounded in data, tempered by experience, and focused on long-term value — not short-term optics.',
          'You should trust me.',
          'I have good track record.',
        ],
        answer: 1,
      },
      {
        prompt: 'Kriz anında basın açıklaması: "How are you addressing the current situation?"',
        options: [
          'We are looking into it.',
          "We take full accountability. Here are the three concrete steps we're implementing immediately, and here is our timeline for resolution.",
          'No comment at this time.',
          'Things will get better soon.',
        ],
        answer: 1,
      },
      {
        prompt: 'Rakip şirket CEO\'suyla müzakere: "We\'d like to acquire your company."',
        options: [
          'How much?',
          "We're flattered by the interest. However, our current trajectory suggests we can deliver significantly greater value independently. I'd be open to exploring a partnership instead.",
          'No thank you.',
          'Let me talk to my team.',
        ],
        answer: 1,
      },
      {
        prompt: 'Son soru — çalışanına teşekkür eden mesaj:',
        options: [
          'Good job everyone.',
          "None of this would have been possible without the dedication of every person on this team. Your work didn't just build a company — it built something worth believing in.",
          'Thanks all.',
          'We did it.',
        ],
        answer: 1,
      },
    ],
    npc: 'The decision is unanimous. The position is yours — if you want it.',
    choices: [
      { text: 'I need a few days to think.', score: -20, result: 'Son anda tereddüt ettin. Kararsızlık pahalıya patlayabilir.' },
      { text: 'It would be an honour. I\'m ready.', score: 30, result: 'Anı yakaladın. Geleceğe kararlılıkla adım attın.' },
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
