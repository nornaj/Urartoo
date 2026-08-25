/**
 * Urartoo — Single Blog Post Dynamic Loader & Interactions
 * (Single Product FAQ design harmonized & full article dataset)
 */

(function () {
  'use strict';

  // Article Database
  // Complete 7 Armenian Field Articles Database
  const BLOG_ARTICLES = {
    'gutanasar-obsidian': {
      id: 'gutanasar-obsidian',
      slug: 'three-days-on-a-volcano-for-one-good-piece-of-glass',
      title: 'Երեք օր հրաբխի վրա՝ մեկ լավ ապակու կտորի համար',
      titleEn: 'Three days on a volcano for one good piece of glass',
      lead: 'Գուտանասարի օբսիդիանը կոտրվում է տասից ինն անգամ սխալ։ Ահա թե ինչ տեսք ունի տասներորդը և ինչ արժեցավ այնտեղ հասնելը։',
      leadEn: 'Obsidian is everywhere on Gutanasar and almost none of it is usable. What separates a piece worth carrying down from the thousand pieces left behind is a thing you learn with your hands, not your eyes.',
      date: 'Սեպտեմբեր 2025',
      dateEn: 'September 2025',
      location: 'Գուտանասար',
      locationEn: 'Gutanasar',
      readTime: '9 րոպե',
      readTimeEn: '9 min read',
      topic: 'Քարահավաք',
      featured: true,
      heroImg: 'Images/author.webp',
      heroCaption: 'գլխավոր լուսանկար · օբսիդիանի լանջը Գուտանասարի վրա առավոտյան',
      featuredProduct: null,
      blocks: [
        { type: 'h2', id: 's1', text: 'Լանջն է որոշում, ոչ թե դուք' },
        { type: 'p', text: 'Գուտանասարը հրաբխային գմբեթ է Երևանից մեկ ժամ հյուսիս, և նրա ողջ հյուսիսային լանջը ծածկված է սև ապակիով։ Ճանապարհից այն թվում է հսկայական հանք՝ այնպիսի վայր, որտեղ պատկերացնում ես քսան րոպեում պարկը լցնելն ու տուն վերադառնալը։ Բայց իրականում դա այդպես չէ։ Մակերևույթի գրեթե ողջ նյութը անցել է երեսուն ձմռան սառեցման ու հալեցման միջով, և լի է մազանման ճաքերով, որոնք անհնար է տեսնել, քանի դեռ քարը հղկման ակոսում չէ։' },
        { type: 'p', text: 'Այնպես որ առաջին օրը քար հավաքելը չէ։ Դա քայլելն է, բարձրացնելը և գրեթե բոլորը հետ դնելը։ Ես փնտրում եմ կտորներ, որոնք վերջերս են դուրս եկել փլուզումից, որտեղ կոտրվածքի մակերեսները դեռ սուր են, և լսում եմ — առողջ կտորը թեթևակի զանգի պես հնչում է, երբ երկուսը հպում ես իրար, իսկ ճաքածը տալիս է խուլ թխկոց։ Այդ թեստը ողջ ուղևորության էությունն է։' },
        { type: 'figure', img: '', caption: 'լուսանկար · փլուզման քարերը, հյուսիսային լանջ, առավոտյան ստվեր' },
        { type: 'h2', id: 's2', text: 'Ինչպիսին է պիտանի կտորը' },
        { type: 'p', text: 'Այս գմբեթի լավագույն օբսիդիանը խորը չեզոք սև է՝ առանց դարչնագույն երանգի, թափանցիկ բարակ եզրին, երբ այն պահում ես երկնքի ֆոնին։ Եթե եզրը տաք փայլում է, ապա երկաթը շատ է և այն կստանա պղտոր փայլեցում։ Եթե այն հավասարաչափ է փայլում, կտորը առողջ է իր մարմնով — ճաքը ի հայտ է գալիս որպես պայծառ ներքին գիծ այն պահին, երբ լույսն անցնում է դրա միջով։' },
        { type: 'blockquote', text: 'Առողջ կտորը զանգում է հպելիս։ Ճաքածը թխկում է։ Լանջին մեկ օր աշխատելուց հետո ձեռքերդ ավելի շուտ են իմանում, քան աչքերդ։' },
        { type: 'p', text: 'Չափսն ավելի քիչ նշանակություն ունի, քան մարդիկ սպասում են։ Կախազարդին անհրաժեշտ է եղունգի չափով պատրաստի քար, ինչը նշանակում է սկսել բռունցքի չափի կտորից, որովհետև զանգվածի երկու երրորդը հեռանում է առաջին հղկման ժամանակ, իսկ ցանկացած թաքնված թերություն նշանակում է սկսել նորից։' },
        { type: 'h2', id: 's3', text: 'Իջեցնելը լեռից' },
        { type: 'p', text: 'Ամեն ինչ փաթաթվում է առանձին կտորով և տեղափոխվում կտավե պայուսակում, ոչ թե մեջքին սեղմված ուսապարկում։ Օբսիդիանը կոտրվում է օբսիդիանին հպվելիս երկժամյա իջնելու ընթացքում, իսկ սխալ տեղում կոտրվածքը կախազարդի նախապատրաստվածքը վերածում է թափոնի։ Երեք օրվա ավարտին ես ունեի տասնմեկ կտոր, որոնք արժեր տուն տանել՝ հարյուրավոր բարձրացրածներից։' },
        { type: 'h2', id: 's4', text: 'Աշխատանոցի ակոսում' },
        { type: 'p', text: 'Հղկումը կատարվում է թաց և դանդաղ, որովհետև օբսիդիանը վատ է տանում ջերմությունը, իսկ արագ հղկումը կճաքեցնի լանջին կատարյալ քարը։ Տասնմեկից չորսը հասան պատրաստի կաբոշոնի։ Այդ չորսից մեկը դարձավ անհամաչափ կաթիլ, որովհետև թերությունը անցնում էր մեկ կողմով, իսկ այն համաչափ հղկելը կկտրեր լավ ապակին։' },
        { type: 'h2', id: 's5', text: 'Ինչու արժե այնքան, ինչքան արժե' },
        { type: 'p', text: 'Երեք օր քայլք, վառելիքի բաք, տասնմեկ նախապատրաստվածք, չորս փրկված, մեկ պատրաստի զարդ վաճառքի համար։ Այդ թվաբանությունն է պատճառը, որ Urartoo-ի յուրաքանչյուր կախազարդ արտադրական ապրանք չէ և երբեք չի լինի։ Դա նաև նշանակում է, որ ձեր ստացած քարն ունի հասցե՝ այս լանջը, այս սեպտեմբերը, այս պայուսակը։' }
      ],
      faqs: [
        {
          q: 'Կարո՞ղ եմ խնդրել քար որոշակի վայրից։',
          a: 'Այո, և դա ամենահաճախ հանդիպող խնդրանքն է դաշտային նշումը հրապարակելուց հետո։ Ընտրեք տարածաշրջանը և ցանկալի ձևը, ես կփնտրեմ հաջորդ ուղևորության ընթացքում։ Սպասումը կախված է վայրից — Գուտանասարի օբսիդիանը սովորաբար գտնում եմ մեկ ամսվա ընթացքում, Սյունիքի փիրուզը երբեմն պահանջում է ամբողջ սեզոն։'
        },
        {
          q: 'Ինչպե՞ս իմանամ, որ քարը իսկապես այդ վայրից է։',
          a: 'Յուրաքանչյուր զարդ ուղարկվում է հավաստագրով, որտեղ նշված է հովիտը, գտնելու ամիսը և հանքանյութը։ Դաշտային նշումները նույն գրանցման երկար տարբերակն են — եթե զարդը պատրաստվել է ուղևորությունից, որի մասին գրել եմ, հավաստագիրը հղում է կատարում նշմանը։'
        },
        {
          q: 'Արդյո՞ք օբսիդիանը բավականաչափ ամուր է ամենօրյա կրման համար։',
          a: 'Կախազարդերի և ականջօղերի համար՝ այո։ Ամեն օր կրվող մատանիների համար դա սխալ քար է — այն ապակի է, իսկ ապակին կոտրվում է դռան շրջանակին հպվելիս։ Եթե ցանկանում եք ամենօրյա մատանի, ես խորհուրդ կտամ նռնաքար, հասպիս կամ ագաթ։'
        }
      ]
    },
    'garnet-river': {
      id: 'garnet-river',
      slug: 'why-river-garnet-cuts-differently-than-quarried',
      title: 'Ինչու է գետի նռնաքարը հղկվում այլ կերպ, քան հանքինը',
      titleEn: 'Why River Garnet Cuts Differently Than Quarried',
      lead: 'Գետի ջուրը տասնյակ հազարավոր տարիներ արդեն կատարել է հղկողի աշխատանքը։ Ահա թե ինչու է բնական հոլովված նռնաքարը ավելի մաքուր, քան ժայռից կոտրվածը։',
      leadEn: 'River tumbling destroys every flaw before you ever find the stone. What survives in the gravel beds of Vayots Dzor is pure structural integrity.',
      date: 'Հուլիս 2025',
      dateEn: 'July 2025',
      location: 'Արփա գետ, Վայոց Ձոր',
      locationEn: 'Arpa River, Vayots Dzor',
      readTime: '7 րոպե',
      readTimeEn: '7 min read',
      topic: 'Քարահավաք',
      featured: false,
      heroImg: 'Images/author.webp',
      heroCaption: 'լուսանկար · Արփայի գետաքարերի շերտը և ալյուվիալ նռնաքարի բյուրեղները',
      featuredProduct: null,
      blocks: [
        { type: 'h2', id: 's1', text: 'Բնական ջրային ընտրություն' },
        { type: 'p', text: 'Երբ նռնաքարը դուրս է պրծնում մայր ապարից և ընկնում Արփայի հունը, գետի հոսանքը և գլաքարերի հարվածները կոտրում են յուրաքանչյուր թույլ կետ, յուրաքանչյուր միկրոճաք։ Այն, ինչ մնում է գետի խորշերում հազարավոր տարիներ անց, քարի ամենախիտ, ամենաառողջ միջուկն է։' },
        { type: 'p', text: 'Հանքից հանված նռնաքարը հաճախ պարունակում է ներքին լարվածություն պայթեցումներից կամ մուրճի հարվածներից։ Իսկ գետի նռնաքարը հանգիստ է։ Դուք վերցնում եք մի կտոր, որն արդեն դիմացել է բնության ամենադաժան թեստին։' },
        { type: 'figure', img: '', caption: 'լուսանկար · նռնաքարերի ողողումը ավանդական թասով Արփայի ափին' },
        { type: 'h2', id: 's2', text: 'Հղկման յուրահատկությունը' },
        { type: 'p', text: 'Գետի նռնաքարերը սովորաբար ավելի փոքր են, բայց նրանց գույնը զարմանալիորեն խորն է՝ մուգ կարմիրից մինչև նռան հատիկի թափանցիկություն։ Քանի որ ձևն արդեն կլորավուն է, ես հաճախ պահպանում եմ բնական ասիմետրիան՝ ստեղծելով ազատ ձևի (freeform) կաբոշոններ։' },
        { type: 'blockquote', text: 'Գետը չի ստեղծում երկրաչափական կատարելություն, այն ստեղծում է ամրության կատարելություն։' },
        { type: 'h2', id: 's3', text: 'Վայոց Ձորի արծաթյա շրջանակը' },
        { type: 'p', text: 'Այս քարերը պահանջում են նուրբ, բայց ամուր ագուցում։ Արծաթյա եզրաշերտը պետք է կրկնի գետի ջրերի ձևավորած յուրաքանչյուր ծալք, որպեսզի քարը շնչի և բռնի լույսը։' }
      ],
      faqs: [
        {
          q: 'Ինչո՞վ է տարբերվում հայկական նռնաքարը արտասահմանյանից։',
          a: 'Հայկական ալմանդին-նռնաքարերը ունեն յուրահատուկ թավշյա մուգ կարմիր երանգ՝ բարձր երկաթային պարունակությամբ, ինչը նրանց հաղորդում է խորը, ազնիվ փայլ։'
        },
        {
          q: 'Արդյո՞ք նռնաքարը հարմար է առօրյա զարդերի համար։',
          a: 'Այո, նռնաքարի կարծրությունը ըստ Մոոսի սանդղակի 7-7.5 է, ինչը այն դարձնում է չափազանց դիմացկուն մատանիների և ապարանջանների համար։'
        },
        {
          q: 'Ինչպե՞ս եք գտնում նռնաքարերը գետի հունում։',
          a: 'Օգտագործվում է ավանդական ողողման թաս (gravity pan)՝ առանձնացնելով ծանր միներալային ավազը գետի նստվածքներից։'
        }
      ]
    },
    'turquoise-copper': {
      id: 'turquoise-copper',
      slug: 'turquoise-from-old-copper-mines',
      title: 'Փիրուզ և խրիզոկոլլա հին պղնձի հանքախորշերից',
      titleEn: 'Turquoise and Chrysocolla from Ancient Copper Veins',
      lead: 'Հարավային Հայաստանի հին պղնձահանքերի մոտակայքում ջուրն ու հանքանյութերը դարեր շարունակ ստեղծել են անկրկնելի երկնագույն և փիրուզագույն շերտեր։',
      leadEn: 'In the ancient copper regions of Syunik, water and copper minerals have spent centuries forming vivid turquoise and chrysocolla crusts in metamorphic veins.',
      date: 'Հունիս 2025',
      dateEn: 'June 2025',
      location: 'Սյունիքի լեռներ, Կապան',
      locationEn: 'Syunik Mountains, Kapan',
      readTime: '8 րոպե',
      readTimeEn: '8 min read',
      topic: 'Քարահավաք',
      featured: false,
      heroImg: 'Images/author.webp',
      heroCaption: 'լուսանկար · պղնձի օքսիդացված երակները և փիրուզագույն կեղևը լեռնալանջին',
      featuredProduct: null,
      blocks: [
        { type: 'h2', id: 's1', text: 'Պղնձի կապույտ ժառանգությունը' },
        { type: 'p', text: 'Սյունիքի հանքային շրջանը հայտնի է իր հարուստ պղնձային ապարներով։ Բայց ոսկերչի համար ամենահետաքրքիրը ոչ թե արդյունաբերական հանքաքարն է, այլ մակերեսային օքսիդացման գոտիները, որտեղ պղնձի լուծույթները հանդիպել են ֆոսֆատներին և սիլիցիումին։' },
        { type: 'p', text: 'Արդյունքը՝ խրիզոկոլլայի, մալաքիտի և բնական փիրուզի նուրբ երակներն են, որոնք հաճախ միահյուսված են քվարցի և երկաթի շագանակագույն մատրիցային։ Այս քարերը կենդանի քարտեզ են՝ լի հրաբխային ու հանքային պատմությամբ։' },
        { type: 'figure', img: '', caption: 'լուսանկար · բնական չկայունացված փիրուզի հում կտորները աշխատանոցում' },
        { type: 'h2', id: 's2', text: 'Փխրունության հետ աշխատելը' },
        { type: 'p', text: 'Բնական հայկական փիրուզը չի ենթարկվում քիմիական կայունացման (stabilization) կամ ներկման, ինչպես շուկայում տարածված զանգվածային նյութերը։ Այն մշակվում է հում վիճակում՝ չափազանց զգույշ ալմաստե սկավառակներով։' },
        { type: 'blockquote', text: 'Չկայունացված փիրուզի հետ աշխատելը նշանակում է ընդունել նրա բնույթը՝ յուրաքանչյուր շունչ և ծակոտի հարգելով։' },
        { type: 'h2', id: 's3', text: 'Լեռնային գույնի պահպանումը' },
        { type: 'p', text: 'Արծաթի փայլատ սպիտակությունը ընդգծում է Սյունիքի փիրուզի կապտականաչ երանգները։ Յուրաքանչյուր զարդ ունենում է իր չկրկնվող մատրիցային նախշը։' }
      ],
      faqs: [
        {
          q: 'Արդյո՞ք Urartoo-ի փիրուզը մշակված կամ ներկված է։',
          a: 'Ոչ, մենք օգտագործում ենք բացառապես 100% բնական, չկայունացված և չներկված հայկական փիրուզ և խրիզոկոլլա։'
        },
        {
          q: 'Ինչպե՞ս խնամել բնական փիրուզով զարդերը։',
          a: 'Խուսափեք քիմիական նյութերից, օծանելիքից և ջրից։ Փիրուզը ծակոտկեն քար է և սիրում է չոր, բնական պահպանում։'
        },
        {
          q: 'Որտե՞ղ են գտնվում հիմնական հանքավայրերը։',
          a: 'Սյունիքի լեռնաշղթայի հին երակներում՝ Կապանի և Մեղրու պատմական հանքային գոտիներում։'
        }
      ]
    },
    'aragats-banded-agate': {
      id: 'aragats-banded-agate',
      slug: 'searching-for-banded-agate-in-alpine-zone',
      title: 'Շերտավոր ագաթի և քաղկեդոնի որոնումները ալպյան գոտում',
      titleEn: 'Searching for Banded Agate in the Alpine Zone',
      lead: 'Արագածի բարձրադիր լանջերին հրաբխային գազային պղպջակները վերածվել են բյուրեղյա գաղտնիքների։ Ինչպես են հավաքվում և բացվում ագաթային ժեոդները։',
      leadEn: 'At 3200m on Mount Aragats, ancient gas pockets in volcanic basalt have filled with microscopic quartz rings over millions of cold alpine winters.',
      date: 'Օգոստոս 2025',
      dateEn: 'August 2025',
      location: 'Արագած լեռ, 3200մ',
      locationEn: 'Mount Aragats, 3200m',
      readTime: '6 րոպե',
      readTimeEn: '6 min read',
      topic: 'Գեմոլոգիա',
      featured: false,
      heroImg: 'Images/author.webp',
      heroCaption: 'լուսանկար · Արագածի հրաբխային տուֆերը և ագաթային նոդուլները քարաթափերում',
      featuredProduct: null,
      blocks: [
        { type: 'h2', id: 's1', text: '3200 մետր բարձրության վրա' },
        { type: 'p', text: 'Արագածի ալպյան գոտում քարահավաքը պահանջում է հատուկ տոկունություն։ Քարաթափերի և բազալտային հոսքերի մեջ թաքնված են հրաբխային գնդաձև գոյացություններ՝ նոդուլներ։ Դրսից դրանք անհրապույր, գորշ քարեր են, բայց ներսում պարունակում են միլիոնավոր տարիների շերտավորումներ։' },
        { type: 'p', text: 'Երբ սիլիցիումով հարուստ ջերմային լուծույթները դանդաղ սառել են հրաբխային խոռոչներում, յուրաքանչյուր դարաշրջան թողել է իր միկրոշերտը՝ կաթնագույնից մինչև մոխրագույն, մեղրագույն և մանուշակագույն քաղկեդոն։' },
        { type: 'figure', img: '', caption: 'լուսանկար · ագաթային նոդուլի լայնական կտրվածքը ալմաստե սղոցով' },
        { type: 'h2', id: 's2', text: 'Շերտերի գաղտնիքը' },
        { type: 'p', text: 'Ագաթը բացելիս առաջին մարդն ես, ով տեսնում է այդ նախշը միլիոնավոր տարիների մթությունից հետո։ Որոշ ժեոդների կենտրոնում պահպանված են մանր լեռնային բյուրեղապակու (ամեթիստ կամ քվարց) գագաթներ։' },
        { type: 'blockquote', text: 'Ագաթը բացելիս առաջին մարդն ես, ով տեսնում է այդ նախշը միլիոնավոր տարիների մթությունից հետո։' },
        { type: 'h2', id: 's3', text: 'Հղկման երկրաչափությունը' },
        { type: 'p', text: 'Ագաթը չափազանց կարծր է (Մոոսի սանդղակով 6.5-7), ինչը թույլ է տալիս հասնել հայելային փայլի։ Այս քարերը կատարյալ են մատանիների և կախազարդերի համար, որոնք կրվելու են սերնդեսերունդ։' }
      ],
      faqs: [
        {
          q: 'Ի՞նչ է ագաթային նոդուլը կամ ժեոդը։',
          a: 'Դա հրաբխային ապարի մեջ փակ խոռոչ է, որտեղ դարերի ընթացքում բյուրեղացել են քվարցի և քաղկեդոնի շերտեր։'
        },
        {
          q: 'Արդյո՞ք ագաթը դիմացկուն է հարվածներին։',
          a: 'Այո, ագաթը միկրոբյուրեղային քվարց է և համարվում է ոսկերչության մեջ ամենադիմացկուն բնական քարերից մեկը։'
        },
        {
          q: 'Ինչպե՞ս եք ընտրում կտրվածքի ուղղությունը։',
          a: 'Կտրվածքը կատարվում է շերտերին ուղղահայաց՝ նախշի առավելագույն կոնտրաստը և խորությունը բացահայտելու համար։'
        }
      ]
    },
    'lori-moss-agate': {
      id: 'lori-moss-agate',
      slug: 'moss-agate-and-jasper-in-river-canyons',
      title: 'Մամռապատ ագաթ և հասպիս կիրճի գետաքարերի մեջ',
      titleEn: 'Moss Agate and Jasper in River Canyons',
      lead: 'Լոռվա խոնավ կիրճերում երկաթն ու մանգանը ստեղծել են անտառային տեսարաններ քարի մեջ։ Ինչպես են տարբերակվում մամռապատ ագաթը և հասպիսը։',
      leadEn: 'Deep in Lori gorges, groundwater rich in iron and manganese has grown dendritic green foliage trapped forever in transparent chalcedony.',
      date: 'Մայիս 2025',
      dateEn: 'May 2025',
      location: 'Ձորագետի կիրճ, Լոռի',
      locationEn: 'Dzoraget Canyon, Lori',
      readTime: '7 րոպե',
      readTimeEn: '7 min read',
      topic: 'Քարահավաք',
      featured: false,
      heroImg: 'Images/author.webp',
      heroCaption: 'լուսանկար · Ձորագետի խոնավ կիրճը և մամռանման դենդրիտային կանաչ ագաթները',
      featuredProduct: null,
      blocks: [
        { type: 'h2', id: 's1', text: 'Կիրճի խոնավությունն ու կանաչ քարերը' },
        { type: 'p', text: 'Ձորագետի կիրճը Հայաստանի ամենախորհրդավոր վայրերից է։ Այստեղ ջրի և հարակից հրաբխային շերտերի փոխազդեցությունից առաջացել են մամռապատ ագաթներ (Moss Agate) և խիտ կարմրա-կանաչ հասպիսներ (Jasper)։' },
        { type: 'p', text: 'Մամռապատ ագաթի մեջ իրական մամուռ չկա. դրանք քլորիտի, երկաթի և մանգանի ճյուղավորված միներալային ներառումներ են, որոնք թափանցիկ քաղկեդոնի մեջ թողնում են անտառի կամ ջրիմուռների տպավորություն։' },
        { type: 'figure', img: '', caption: 'լուսանկար · կանաչ մամռապատ ագաթի նախապատրաստվածքը լույսի տակ' },
        { type: 'h2', id: 's2', text: 'Բնության մանրանկարչությունը' },
        { type: 'p', text: 'Յուրաքանչյուր մամռապատ ագաթ փոքրիկ բնապատկեր է՝ սառեցված քարե ապակու մեջ։ Լոռվա նմուշներն առանձնանում են իրենց խորը փշատերև կանաչ երանգով և բարձր թափանցիկությամբ։' },
        { type: 'blockquote', text: 'Յուրաքանչյուր մամռապատ ագաթ փոքրիկ բնապատկեր է՝ սառեցված քարե ապակու մեջ։' },
        { type: 'h2', id: 's3', text: 'Կաբոշոնի ընտրությունը' },
        { type: 'p', text: 'Այս քարերը հղկելիս գլխավոր խնդիրն է գտնել այն հարթությունը, որտեղ ներքին «անտառը» ամենապարզն է երևում։ Մենք ձգտում ենք քարի մակերեսը դարձնել ոսպնյակ, որը մեծացնում է ներքին գեղեցկությունը։' }
      ],
      faqs: [
        {
          q: 'Արդյո՞ք մամռապատ ագաթը պարունակում է օրգանական նյութ։',
          a: 'Ոչ, դրանք զուտ միներալային (անօրգանական) դենդրիտային ներառումներ են, որոնք տեսողականորեն նման են բույսերի։'
        },
        {
          q: 'Ի՞նչ գույների են հանդիպում Լոռվա հասպիսները։',
          a: 'Հիմնականում հանդիպում են մուգ կարմիր, աղյուսագույն, խոտածածկ կանաչ և դեղնավուն շերտերով։'
        },
        {
          q: 'Ինչպե՞ս է քարը պահպանում իր փայլը։',
          a: 'Հասպիսը և ագաթը հիանալի փայլեցվում են ալմաստային մածուկներով և չեն կորցնում իրենց փայլը տարիների ընթացքում։'
        }
      ]
    },
    'asymmetrical-bezel-setting': {
      id: 'asymmetrical-bezel-setting',
      slug: 'setting-stones-that-refuse-symmetry',
      title: 'Անհամաչափ բնական քարի ագուցումը մաքուր արծաթի մեջ',
      titleEn: 'Setting Stones that Refuse Symmetry',
      lead: 'Երբ քարը չունի կատարյալ օվալ կամ կլոր ձև, ոսկերիչը պետք է հրաժարվի կաղապարներից։ Ինչպես է յուրաքանչյուր զարդ ստեղծվում զրոյից մեկ քարի համար։',
      leadEn: 'Standard factory cast mountings demand calibrated stones. Working with raw Armenian finds means crafting a unique custom bezel around every irregular contour.',
      date: 'Ապրիլ 2025',
      dateEn: 'April 2025',
      location: 'Urartoo Աշխատանոց, Երևան',
      locationEn: 'Urartoo Workshop, Yerevan',
      readTime: '8 րոպե',
      readTimeEn: '8 min read',
      topic: 'Աշխատանոց',
      featured: false,
      heroImg: 'Images/author.webp',
      heroCaption: 'լուսանկար · արծաթյա եզրաշերտի (bezel) ճշգրտումը ասիմետրիկ կաբոշոնի շուրջ',
      featuredProduct: null,
      blocks: [
        { type: 'h2', id: 's1', text: 'Հրաժարվելով ստանդարտներից' },
        { type: 'p', text: 'Արտադրական ոսկերչությունը պահանջում է կատարյալ կալիբրացված քարեր՝ 8x10 մմ, 10x12 մմ։ Բայց երբ քարը գտնված է լեռներում և հղկված է ձեռքով, այն թելադրում է իր ուրույն ուրվագիծը։ Այն կարող է լինել անհամաչափ կաթիլ, եռանկյուն կամ ազատ բնական ալիք։' },
        { type: 'p', text: 'Մենք չենք օգտագործում նախապես ձուլված շրջանակներ։ 925 հարգի արծաթյա ժապավենը ձեռքով փաթաթվում է հենց այդ կոնկրետ քարի շուրջ, զոդվում է արծաթյա հատուկ զոդանյութով, ապա ճշգրտվում հարյուրերորդական միլիմետրերի ճշգրտությամբ։' },
        { type: 'figure', img: '', caption: 'լուսանկար · արծաթյա շրջանակի զոդումը ոսկերչական այրիչով' },
        { type: 'h2', id: 's2', text: 'Արծաթյա բեզելի (Bezel) կառուցումը' },
        { type: 'p', text: 'Մենք մետաղը հարմարեցնում ենք քարին, այլ ոչ թե քարն ենք տաշում մետաղի կաղապարի մեջ տեղավորելու համար։ Սա աշխատատար է, բայց միակ ճանապարհն է՝ պահպանելու քարի անհատական բնավորությունը։' },
        { type: 'blockquote', text: 'Մենք մետաղը հարմարեցնում ենք քարին, այլ ոչ թե քարն ենք տաշում մետաղի կաղապարի մեջ տեղավորելու համար։' },
        { type: 'h2', id: 's3', text: 'Վերջնական ամրացում և հյուսվածք' },
        { type: 'p', text: 'Քարը տեղադրվում է առանց սոսնձի՝ բացառապես մետաղի մեխանիկական ճնշմամբ։ Արծաթի եզրը գլորվում է քարի վրա փայտե և պողպատե գործիքներով, որից հետո մակերեսը ստանում է թավշյա կամ փայլուն հյուսվածք։' }
      ],
      faqs: [
        {
          q: 'Արդյո՞ք քարերը ամրացվում են սոսնձով։',
          a: 'Երբեք։ Ողջ ամրացումը կատարվում է ավանդական ոսկերչական bezel մեթոդով՝ արծաթի եզրաշերտի ճշգրիտ ծալմամբ։'
        },
        {
          q: 'Ի՞նչ հարգի արծաթ է օգտագործվում։',
          a: 'Օգտագործվում է բացառապես 925 հարգի բարձրորակ ստերլինգ արծաթ։'
        },
        {
          q: 'Կարո՞ղ եմ բերել իմ սեփական գտած քարը ագուցման համար։',
          a: 'Այո, մենք հաճախ ենք պատրաստում անհատական զարդեր մեր հաճախորդների կողմից Հայաստանի լեռներում գտնված քարերով։'
        }
      ]
    },
    'tavush-dendritic-agate': {
      id: 'tavush-dendritic-agate',
      slug: 'dendritic-agate-and-petrified-wood',
      title: 'Ծառանման ագաթ և քարացած փայտի գաղտնիքները',
      titleEn: 'Dendritic Agate and Petrified Wood in Northern Forests',
      lead: 'Տավուշի անտառային գոտում միլիոնավոր տարիներ առաջ ծառերը վերածվել են քարի։ Քարացած փայտի և դենդրիտային ագաթի յուրահատուկ ջերմությունը։',
      leadEn: 'In northern Tavush forests, ancient fallen trunks were covered in volcanic ash, slowly replacing cellular wood with banded quartz over epochs.',
      date: 'Մարտ 2025',
      dateEn: 'March 2025',
      location: 'Իջևանի լեռնաշղթա, Տավուշ',
      locationEn: 'Ijevan Range, Tavush',
      readTime: '7 րոպե',
      readTimeEn: '7 min read',
      topic: 'Ստուդիա',
      featured: false,
      heroImg: 'Images/author.webp',
      heroCaption: 'լուսանկար · Իջևանի անտառներում գտնված քարացած ծառաբների միկրոկառուցվածքը',
      featuredProduct: null,
      blocks: [
        { type: 'h2', id: 's1', text: 'Երբ ծառը դառնում է քար' },
        { type: 'p', text: 'Հյուսիսարևելյան Հայաստանում հնագույն անտառները ծածկվել են հրաբխային մոխրով։ Դարերի ընթացքում օրգանական բջիջները մեկ առ մեկ փոխարինվել են խալցեդոնով և քվարցով՝ պահպանելով ծառի տարեկան օղակները, կեղևի նախշերը և բջջային կառուցվածքը։' },
        { type: 'p', text: 'Իջևանի դենդրիտային ագաթները հայտնի են իրենց տաք, կոնյակագույն, ոսկեգույն և սև ճյուղավորումներով։ Դրանք նման են աշնանային տերևաթափի կամ ձմեռային ծառերի ուրվագծերի։' },
        { type: 'figure', img: '', caption: 'լուսանկար · քարացած փայտի կաբոշոնի տարեկան օղակները խոշոր պլանով' },
        { type: 'h2', id: 's2', text: 'Տաք երանգներ և դենդրիտներ' },
        { type: 'p', text: 'Քարացած փայտը պահպանում է ծառի հիշողությունը՝ հաղորդելով նրան քարի հավերժությունը։ Այս նյութն ունի փայտի տեսողական ջերմությունը, բայց քվարցի սառը կարծրությունը։' },
        { type: 'blockquote', text: 'Քարացած փայտը պահպանում է ծառի հիշողությունը՝ հաղորդելով նրան քարի հավերժությունը։' },
        { type: 'h2', id: 's3', text: 'Ոսկերչական մոտեցումը' },
        { type: 'p', text: 'Այս քարերը կրում են անսովոր տաք էներգիա։ Մենք դրանք համադրում ենք ինչպես մաքուր արծաթի, այնպես էլ տաք մետաղական շեշտադրումների հետ՝ ստեղծելով հողային, բնական շունչ ունեցող զարդեր։' }
      ],
      faqs: [
        {
          q: 'Ինչպե՞ս է ծառը վերածվում քարի (պետրիֆիկացիա)։',
          a: 'Դա տեղի է ունենում առանց թթվածնի միջավայրում, երբ հանքային ջրերը միկրոն առ միկրոն փոխարինում են բջջանյութը սիլիցիումի դիօքսիդով։'
        },
        {
          q: 'Արդյո՞ք քարացած փայտը ծանր է սովորական փայտից։',
          a: 'Այո, այն ամբողջությամբ քվարց է և ունի սովորական քարի խտություն ու ծանրություն։'
        },
        {
          q: 'Որտե՞ղ կարելի է տեսնել այս քարերով պատրաստված զարդերը։',
          a: 'Urartoo-ի հավաքածուներում և Երևանի մեր արվեստանոցում՝ ըստ նախնական գրանցման։'
        }
      ]
    }
  };

  // Default current article ID
  let currentArticle = BLOG_ARTICLES['gutanasar-obsidian'];

  // Initialize Page
  function initPage() {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id') || params.get('slug');

    let allPosts = [];
    if (window.NovaSanity && typeof window.NovaSanity.getJournalPosts === 'function') {
      allPosts = window.NovaSanity.getJournalPosts();
    }

    if (articleId) {
      const foundInSanity = allPosts.find(p => String(p.id) === String(articleId) || String(p.slug) === String(articleId) || String(p._sanityId) === String(articleId));
      if (foundInSanity) {
        currentArticle = foundInSanity;
      } else if (BLOG_ARTICLES[articleId]) {
        currentArticle = BLOG_ARTICLES[articleId];
      } else {
        const foundBySlug = Object.values(BLOG_ARTICLES).find(p => String(p.slug) === String(articleId));
        if (foundBySlug) currentArticle = foundBySlug;
      }
    } else if (allPosts.length > 0) {
      currentArticle = allPosts.find(p => p.featured) || allPosts[0];
    }

    renderArticleMeta();
    renderArticleBody();
    renderTableOfContents();
    // POST RELATED PRODUCT — disabled (uncomment to reactivate)
    // renderFeaturedProduct();
    renderRelatedNotes(allPosts);
    renderFaqAccordion();

    setupShareEvents();
    setupTocScrollObserver();
  }

  // Render Header Meta, Title, Lead & Hero
  function renderArticleMeta() {
    const postBcTitle = document.getElementById('post-bc-title');
    const postDate = document.getElementById('post-date');
    const postLocation = document.getElementById('post-location');
    const postReadTime = document.getElementById('post-readtime');
    const postTitle = document.getElementById('post-title');
    const postLead = document.getElementById('post-lead');
    const postHeroImg = document.getElementById('post-hero-img');
    const postHeroPlaceholder = document.getElementById('post-hero-placeholder');

    if (postBcTitle) postBcTitle.textContent = currentArticle.title;
    if (postDate) postDate.textContent = currentArticle.date;
    if (postLocation) postLocation.textContent = currentArticle.location;
    if (postReadTime) postReadTime.textContent = currentArticle.readTime;
    if (postTitle) postTitle.textContent = currentArticle.title;
    const heroSrc = currentArticle.heroImg || currentArticle.image || 'Images/author.webp';
    if (postHeroImg) {
      postHeroImg.src = heroSrc;
      postHeroImg.alt = currentArticle.title || 'Urartoo';
      postHeroImg.style.display = 'block';
      if (postHeroPlaceholder) postHeroPlaceholder.style.display = 'none';
    }
  }

  // Render Body Content Blocks / Rich HTML
  function renderArticleBody() {
    const postBody = document.getElementById('post-body');
    if (!postBody) return;

    let html = '';

    if (currentArticle.contentHtml) {
      // Direct rich HTML from ACF editor: Parse and assign IDs to H2 headings
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = currentArticle.contentHtml;
      const h2s = tempDiv.querySelectorAll('h2');
      h2s.forEach((h, idx) => {
        if (!h.id) h.id = `section-${idx + 1}`;
      });
      html = tempDiv.innerHTML;
    } else if (Array.isArray(currentArticle.blocks) && currentArticle.blocks.length > 0) {
      currentArticle.blocks.forEach(block => {
        if (block.type === 'h2') {
          html += `<div class="journal-post-block"><h2 id="${block.id}">${escapeHtml(block.text)}</h2></div>`;
        } else if (block.type === 'p') {
          html += `<div class="journal-post-block"><p>${escapeHtml(block.text)}</p></div>`;
        } else if (block.type === 'blockquote') {
          html += `<div class="journal-post-block"><blockquote><span>${escapeHtml(block.text)}</span></blockquote></div>`;
        } else if (block.type === 'figure') {
          html += `
            <div class="journal-post-block">
              <figure>
                <div class="journal-post-figure-img">
                  ${block.img ? `<img src="${block.img}" alt="${escapeHtml(block.caption || '')}" loading="lazy">` : `<span class="journal-post-hero-placeholder">${escapeHtml(block.text || '')}</span>`}
                </div>
                ${block.caption ? `<figcaption class="journal-post-figure-caption">${escapeHtml(block.caption)}</figcaption>` : ''}
              </figure>
            </div>
          `;
        }
      });
    } else if (currentArticle.content) {
      html = `<div class="journal-post-block"><p>${escapeHtml(currentArticle.content)}</p></div>`;
    }

    // Author Bench Box
    html += `
      <div class="bench-author-box">
        <div class="bench-author-avatar">U</div>
        <div>
          <div class="bench-author-title">Գրված է աշխատանոցում</div>
          <div class="bench-author-desc">Դաշտային նշումներ վարպետից, ով հավաքում, հղկում և տեղադրում է Urartoo-ի յուրաքանչյուր քար։ Երևան, Հայաստան։</div>
        </div>
      </div>
    `;

    postBody.innerHTML = html;
  }

  // Render Table of Contents Links
  function renderTableOfContents() {
    const tocNav = document.getElementById('post-toc-nav');
    if (!tocNav) return;

    const headings = document.querySelectorAll('#post-body h2');
    let html = '';
    headings.forEach((h, idx) => {
      const activeClass = idx === 0 ? 'active' : '';
      const text = h.textContent.trim();
      const hId = h.id || `section-${idx + 1}`;
      h.id = hId;

      html += `
        <a href="#${hId}" class="journal-toc-link ${activeClass}" data-toc-id="${hId}">
          <span class="journal-toc-mark"></span>
          <span>${escapeHtml(text)}</span>
        </a>
      `;
    });

    if (!html) {
      const sidebarBox = tocNav.closest('.journal-sidebar-box');
      if (sidebarBox) sidebarBox.style.display = 'none';
      return;
    } else {
      const sidebarBox = tocNav.closest('.journal-sidebar-box');
      if (sidebarBox) sidebarBox.style.display = 'block';
    }

    tocNav.innerHTML = html;
  }

  /* ═══ POST RELATED PRODUCT — disabled (uncomment to reactivate) ═══
  // Render Featured Product Card
  function renderFeaturedProduct() {
    const featCard = document.getElementById('post-featured-card');
    const feat = currentArticle.featuredProduct;
    if (!feat || !feat.title) {
      if (featCard) featCard.style.display = 'none';
      return;
    }

    if (featCard) featCard.style.display = 'block';

    const postFeaturedTitle = document.getElementById('post-featured-title');
    const postFeaturedPrice = document.getElementById('post-featured-price');
    const postFeaturedImg = document.getElementById('post-featured-img');
    const postFeaturedLink = document.getElementById('post-featured-link');

    if (postFeaturedTitle) postFeaturedTitle.textContent = feat.title;
    if (postFeaturedPrice) postFeaturedPrice.textContent = feat.price;
    if (postFeaturedImg && feat.img) postFeaturedImg.src = feat.img;
    if (postFeaturedLink) postFeaturedLink.href = feat.link || 'shop.html';
  }
  ═══ END POST RELATED PRODUCT ═══ */

  // Render Related Notes Grid (matches home page .note-card style)
  function renderRelatedNotes(allPosts = []) {
    const grid = document.getElementById('post-related-grid');
    if (!grid) return;

    // Build the list: prefer NovaSanity global posts, fallback to article's related array
    let relatedList = [];

    // Get all available posts from NovaSanity or passed allPosts
    let globalPosts = allPosts;
    if ((!globalPosts || globalPosts.length === 0) && window.NovaSanity) {
      globalPosts = window.NovaSanity.getJournalPosts() || [];
    }

    if (Array.isArray(globalPosts) && globalPosts.length > 0) {
      // Filter out current article, take latest 3
      relatedList = globalPosts
        .filter(p => String(p.id) !== String(currentArticle.id) && String(p.slug) !== String(currentArticle.slug))
        .slice(0, 3)
        .map(p => ({
          id: p.slug || p.id,
          meta: `${p.date || ''} · ${p.location || ''}`,
          title: p.title,
          img: p.heroImg || ''
        }));
    }

    // Fallback to article's own related array
    if (relatedList.length === 0 && Array.isArray(currentArticle.related)) {
      relatedList = currentArticle.related.slice(0, 3).map(r => ({
        id: r.id,
        meta: r.meta,
        title: r.title,
        img: r.shot || r.img || ''
      }));
    }

    // Render using exact home page .note-card markup
    let html = '';
    relatedList.forEach(rel => {
      html += '<a href="journal-post.html?id=' + (rel.id || '') + '" class="note-card">' +
        '<div class="note-img">' +
          '<div class="note-img-inner">' +
            (rel.img
              ? '<img src="' + rel.img + '" alt="' + escapeHtml(rel.title) + '" loading="lazy">'
              : '<span class="placeholder-text" style="font-family:var(--mono);font-size:9.5px;line-height:1.8;color:rgba(12,14,13,0.26);max-width:180px;text-align:center;">' + escapeHtml(rel.meta) + '</span>'
            ) +
          '</div>' +
        '</div>' +
        '<div class="note-meta">' + escapeHtml(rel.meta) + '</div>' +
        '<div class="note-title">' + escapeHtml(rel.title) + '</div>' +
      '</a>';
    });

    grid.innerHTML = html;

    // Also listen for journal updates to re-render when NovaSanity loads
    if (!grid._journalListenerBound) {
      grid._journalListenerBound = true;
      window.addEventListener('urartoo:journal-updated', function () {
        renderRelatedNotes([]);
      });
    }
  }

  // Render Single Product FAQ Accordion (Single Product Design System Harmonized)
  function renderFaqAccordion() {
    const accordion = document.getElementById('post-faq-accordion');
    if (!accordion) return;

    let html = '';
    currentArticle.faqs.forEach((faq, idx) => {
      const isOpen = idx === 0;
      html += `
        <div class="pdp-detail-block" data-faq>
          <button class="pdp-faq-summary" aria-expanded="${isOpen ? 'true' : 'false'}">
            ${escapeHtml(faq.q)}
            <span class="pdp-faq-icon"></span>
          </button>
          <div class="pdp-faq-body ${isOpen ? 'open' : ''}" style="${isOpen ? 'max-height: 300px;' : ''}">
            <div class="pdp-faq-body-inner">
              <p>${escapeHtml(faq.a)}</p>
            </div>
          </div>
        </div>
      `;
    });

    accordion.innerHTML = html;
    bindFaqEvents(accordion);
  }

  // Bind Single Product FAQ Accordion Events
  function bindFaqEvents(container) {
    const blocks = container.querySelectorAll('[data-faq]');
    blocks.forEach(block => {
      const summaryBtn = block.querySelector('.pdp-faq-summary');
      const bodyEl = block.querySelector('.pdp-faq-body');

      if (summaryBtn && bodyEl) {
        summaryBtn.addEventListener('click', () => {
          const isExpanded = summaryBtn.getAttribute('aria-expanded') === 'true';

          // Close all sibling FAQs
          blocks.forEach(b => {
            const btn = b.querySelector('.pdp-faq-summary');
            const bd = b.querySelector('.pdp-faq-body');
            if (btn && bd) {
              btn.setAttribute('aria-expanded', 'false');
              bd.classList.remove('open');
              bd.style.maxHeight = '0px';
            }
          });

          // Toggle clicked FAQ
          if (!isExpanded) {
            summaryBtn.setAttribute('aria-expanded', 'true');
            bodyEl.classList.add('open');
            bodyEl.style.maxHeight = bodyEl.scrollHeight + 40 + 'px';
          }
        });
      }
    });
  }

  // Setup Share Buttons Event Handlers
  function setupShareEvents() {
    const statusEl = document.getElementById('journal-share-status');
    const shareBtns = document.querySelectorAll('[data-share]');

    shareBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-share');
        if (type === 'copy') {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href).then(() => {
              showStatus('Հղումը պատճենված է։');
            }).catch(() => {
              showStatus('Հղումը պատճենված է։');
            });
          } else {
            showStatus('Հղումը պատճենված է։');
          }
        } else if (type === 'x') {
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(currentArticle.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
        } else if (type === 'fb') {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
        } else if (type === 'pin') {
          window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${encodeURIComponent(currentArticle.title)}`, '_blank');
        }
      });
    });

    function showStatus(msg) {
      if (statusEl) {
        statusEl.textContent = msg;
        setTimeout(() => {
          statusEl.textContent = '';
        }, 2600);
      }
    }
  }

  // Setup IntersectionObserver for Table of Contents Scroll Highlight
  function setupTocScrollObserver() {
    const headings = document.querySelectorAll('.journal-post-body h2');
    const tocLinks = document.querySelectorAll('.journal-toc-link');

    if (!headings.length || !tocLinks.length || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocLinks.forEach(link => {
            if (link.getAttribute('data-toc-id') === id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-100px 0px -50% 0px',
      threshold: 0.1
    });

    headings.forEach(h => observer.observe(h));
  }

  // Utility to escape HTML strings
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // DOM Content Loaded Handler
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }

})();
