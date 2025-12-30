import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* =======================
   Types
======================= */
type LangMode = "both" | "zh" | "en";
type PoolMode = "all" | "scripture" | "blessing";
type ItemKind = "scripture" | "blessing";
type Item = { kind: ItemKind; zh: string; en: string };

/* =======================
   UI (bilingual)
======================= */
const UI = {
  title: "🎁 经文刮刮乐 / Scripture Scratch Card",
  subtitle: "输入姓名后刮开查看 / Enter a name, then scratch to reveal",
  namePlaceholder: "请输入姓名 / Enter a name",
  generate: "生成 / Generate",
  reset: "重新开始 / Reset",
  copy: "复制内容 / Copy",
  share: "分享 / Share",
  copied: "已复制 / Copied",
  alertName: "请输入姓名 / Please enter a name",
  poolAll: "全部 / All",
  poolScripture: "经文 / Scripture",
  poolBlessing: "祝福 / Blessings",
  langBoth: "双语 / Bilingual",
  langZh: "中文 / Chinese",
  langEn: "English / 英文",
  scratchHint: "刮开查看 / Scratch",
  sharePrefix: "送你一张祝福刮刮卡 / Here is a blessing scratch card",
};

const ITEMS: Item[] = /* embedded below */
[
  {
    "kind": "scripture",
    "zh": "诗篇 65:11\n你以恩典为年岁的冠冕，你的路径都滴下脂油。",
    "en": "诗篇 65:11\nYou crown the year with your bounty, and your carts overflow with abundance."
  },
  {
    "kind": "scripture",
    "zh": "中：在你一切所行的事上都要认定他，他必指引你的路。\n英：In all your ways acknowledge him, and he will make your paths straight.\n哥林多后书 5:17",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "中：若有人在基督里，他就是新造的人，旧事已过，都变成新的了。\n英：Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "以赛亚书 43:19\n看哪，我要做一件新事，如今要发现，你们岂不知道吗？我必在旷野开道路，在沙漠开江河。",
    "en": "以赛亚书 43:19\nSee, I am doing a new thing! Now it springs up; do you not perceive it? I am making a way in the wilderness and streams in the wasteland."
  },
  {
    "kind": "scripture",
    "zh": "民数记 6:24-26\n愿耶和华赐福给你，保护你。愿耶和华使他的脸光照你，赐恩给你。愿耶和华向你仰脸，赐你平安。",
    "en": "民数记 6:24-26\nThe Lord bless you and keep you; the Lord make his face shine on you and be gracious to you; the Lord turn his face toward you and give you peace."
  },
  {
    "kind": "scripture",
    "zh": "诗篇 37:4\n又要以耶和华为乐，他就将你心里所求的赐给你。",
    "en": "诗篇 37:4\nTake delight in the Lord, and he will give you the desires of your heart."
  },
  {
    "kind": "scripture",
    "zh": "中：但那等候耶和华的，必从新得力。他们必如鹰展翅上腾，他们奔跑却不困倦，行走却不疲乏。\n英：But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.\n耶利米书 29:11",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "中：耶和华说：我知道我向你们所怀的意念是赐平安的意念，不是降灾祸的意念，要叫你们末后有指引。\n英：For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.\n诗篇 27:14",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "中：要等候耶和华！当壮胆，坚固你的心。我再说：要等候耶和华！\n英：Wait for the Lord; be strong and take heart and wait for the Lord.\n传道书 3:11",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "中：神造万物，各按其时成为美好。\n英：He has made everything beautiful in its time.\n箴言 19:14",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "中：房屋钱财是祖宗所遗留的，唯有贤慧的妻是耶和华所赐的。\n英：Houses and wealth are inherited from parents, but a prudent wife is from the Lord.\n创世记 2:18",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "中：耶和华神说：“那人独居不好，我要为他造一个配偶帮助他。”\n英：The Lord God said, “It is not good for the man to be alone. I will make a helper suitable for him.”\n罗马书 8:28",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "中：我们晓得万事都互相效力，叫爱神的人得益处。\n英：And we know that in all things God works for the good of those who love him.\n诗篇 16:11",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "中：你必将生命的道路指示我。在你面前有满足的喜乐，在你右手中有永远的福乐。\n英：You make known to me the path of life; you will fill me with joy in your presence, with eternal pleasures at your right hand.\n腓立比书 4:6-7",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "中：应当一无挂虑，只要凡事借着祷告、祈求和感谢，将你们所要的告诉神。神所赐出人意外的平安，必在基督耶稣里保守你们的心怀意念。\n英：Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "中：你们祈求，就给你们；寻找，就寻见；叩门，就给你们开门。\n英：Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.\n约翰福音 14:27",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "中：我留下平安给你们，我将我的平安赐给你们。我所赐的不像世人所赐的，你们心里不要忧愁，也不要胆怯。\n英：Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.\n约翰福音 8:12",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "中：耶稣又对众人说：“我是世上的光。跟从我的，就不在黑暗里走，必要得着生命的光。”\n英：When Jesus spoke again to the people, he said, “I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life.”\n诗篇 34:8",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "中：你们要尝尝主恩的滋味，便知道他是美善，投靠他的人有福了！\n英：Taste and see that the Lord is good; blessed is the one who takes refuge in him.\n启示录 3:20",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "中：看哪，我站在门外叩门，若有听见我声音就开门的，我要进到他那里去，我与他，他与我一同坐席。\n英：Here I am! I stand at the door and knock. If anyone hears my voice and opens the door, I will come in and eat with that person, and they with me.",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "帖前 5:16-18: 要常常喜乐，不住地祷告，凡事谢恩。(Rejoice always, pray continually, give thanks in all circumstances.)\n",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "尼希米记 8:10: 因靠耶和华而得的喜乐是你们的力量。(The joy of the Lord is your strength.)\n",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "诗篇 28:7: 耶和华是我的力量，是我的盾牌。(The Lord is my strength and my shield.)\n",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "约翰福音 10:10: 我来了，是要叫羊得生命，并且得的更丰盛。(I have come that they may have life, and have it to the full.)\n",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "哥林多后书 9:8: 神能将各样的恩惠多落地加给你们。(And God is able to bless you abundantly.)\n",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "诗篇 23:1: 耶和华是我的牧者，我必不至缺乏。(The Lord is my shepherd, I lack nothing.)\n",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "哥林多前书 13:13: 如今常存的有信，有望，有爱这三样，其中最大的是爱。(And now these three remain: faith, hope and love. But the greatest of these is love.)\n",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "约翰一书 4:19: 我们爱，因为神先爱我们。(We love because he first loved us.)\n",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "箴言 4:23: 你要保守你心，胜过保守一切，因为一生的果效是由心发出。(Above all else, guard your heart, for everything you do flows from it.)\n",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "雅各书 1:5: 你们中间若有缺少智慧的，应当求那厚赐与众人、也不斥责人的神。(If any of you lacks wisdom, you should ask God.)\n",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "申命记 11:12: 从岁首到年终，耶和华你神的眼目时常看顾那地。(The eyes of the Lord your God are continually on it from the beginning of the year to its end.)\n",
    "en": ""
  },
  {
    "kind": "scripture",
    "zh": "诗篇 121:8: 你出你入，耶和华要保护你，从今时直到永远。(The Lord will watch over your coming and going both now and forevermore.)\n",
    "en": ""
  },
  {
    "kind": "blessing",
    "zh": "新的一年，愿你不被年龄催促，只被内心引导。",
    "en": "May the new year guide you by your heart, not by your age."
  },
  {
    "kind": "blessing",
    "zh": "你的人生，不需要赶进别人的时间表。",
    "en": "Your life does not need to follow someone else’s timeline."
  },
  {
    "kind": "blessing",
    "zh": "愿你在等待中，依然活得丰盛。",
    "en": "May your life remain full, even while you wait."
  },
  {
    "kind": "blessing",
    "zh": "一个人的时光，也值得被认真对待。",
    "en": "A season of singleness is still worth honoring."
  },
  {
    "kind": "blessing",
    "zh": "愿你知道，你的价值从未打折。",
    "en": "May you know your worth has never diminished."
  },
  {
    "kind": "blessing",
    "zh": "不是慢，只是走在属于你的节奏里。",
    "en": "You are not late—you are moving at your own pace."
  },
  {
    "kind": "blessing",
    "zh": "愿你不因比较而焦虑。",
    "en": "May you be free from the weight of comparison."
  },
  {
    "kind": "blessing",
    "zh": "你的人生，正在被温柔展开。",
    "en": "Your life is unfolding with quiet grace."
  },
  {
    "kind": "blessing",
    "zh": "愿你在独处中，越来越笃定。",
    "en": "May solitude make you more grounded."
  },
  {
    "kind": "blessing",
    "zh": "有些美好，只会在成熟的季节出现。",
    "en": "Some good things only arrive in seasons of maturity."
  },
  {
    "kind": "blessing",
    "zh": "愿你在新的一年，心里有安稳，生活有节奏。",
    "en": "May the new year bring steadiness to your heart and rhythm to your life."
  },
  {
    "kind": "blessing",
    "zh": "你不需要证明自己，生活会替你说话。",
    "en": "You do not need to prove yourself—life will speak for you."
  },
  {
    "kind": "blessing",
    "zh": "愿你被善意对待，也善待自己。",
    "en": "May you be treated with kindness and show kindness to yourself."
  },
  {
    "kind": "blessing",
    "zh": "人生不急，重要的不会错过。",
    "en": "Life is not rushed; what matters will not miss you."
  },
  {
    "kind": "blessing",
    "zh": "愿你对未来保持温柔的期待。",
    "en": "May you hold gentle expectations for the future."
  },
  {
    "kind": "blessing",
    "zh": "你已经走得很远了。",
    "en": "You have already come a long way."
  },
  {
    "kind": "blessing",
    "zh": "愿你允许自己慢下来。",
    "en": "May you allow yourself to slow down."
  },
  {
    "kind": "blessing",
    "zh": "生活正在回应你的坚持。",
    "en": "Life is responding to your perseverance."
  },
  {
    "kind": "blessing",
    "zh": "愿你不因孤单而否定价值。",
    "en": "May loneliness never make you question your worth."
  },
  {
    "kind": "blessing",
    "zh": "人生每一步，都不白走。",
    "en": "No step in life is ever wasted."
  },
  {
    "kind": "blessing",
    "zh": "愿你在新的一年，心里有安稳，生活有节奏。",
    "en": "May the new year bring steadiness to your heart and rhythm to your life."
  },
  {
    "kind": "blessing",
    "zh": "你不需要证明自己，生活会替你说话。",
    "en": "You do not need to prove yourself—life will speak for you."
  },
  {
    "kind": "blessing",
    "zh": "愿你被善意对待，也善待自己。",
    "en": "May you be treated with kindness and show kindness to yourself."
  },
  {
    "kind": "blessing",
    "zh": "人生不急，重要的不会错过。",
    "en": "Life is not rushed; what matters will not miss you."
  },
  {
    "kind": "blessing",
    "zh": "愿你对未来保持温柔的期待。",
    "en": "May you hold gentle expectations for the future."
  },
  {
    "kind": "blessing",
    "zh": "你已经走得很远了。",
    "en": "You have already come a long way."
  },
  {
    "kind": "blessing",
    "zh": "愿你允许自己慢下来。",
    "en": "May you allow yourself to slow down."
  },
  {
    "kind": "blessing",
    "zh": "生活正在回应你的坚持。",
    "en": "Life is responding to your perseverance."
  },
  {
    "kind": "blessing",
    "zh": "愿你不因孤单而否定价值。",
    "en": "May loneliness never make you question your worth."
  },
  {
    "kind": "blessing",
    "zh": "人生每一步，都不白走。",
    "en": "No step in life is ever wasted."
  },
  {
    "kind": "blessing",
    "zh": "愿你在新的一年，心里有安稳，生活有节奏。",
    "en": "May the new year bring steadiness to your heart and rhythm to your life."
  },
  {
    "kind": "blessing",
    "zh": "你不需要证明自己，生活会替你说话。",
    "en": "You do not need to prove yourself—life will speak for you."
  },
  {
    "kind": "blessing",
    "zh": "愿你被善意对待，也善待自己。",
    "en": "May you be treated with kindness and show kindness to yourself."
  },
  {
    "kind": "blessing",
    "zh": "人生不急，重要的不会错过。",
    "en": "Life is not rushed; what matters will not miss you."
  },
  {
    "kind": "blessing",
    "zh": "愿你对未来保持温柔的期待。",
    "en": "May you hold gentle expectations for the future."
  },
  {
    "kind": "blessing",
    "zh": "你已经走得很远了。",
    "en": "You have already come a long way."
  },
  {
    "kind": "blessing",
    "zh": "愿你允许自己慢下来。",
    "en": "May you allow yourself to slow down."
  },
  {
    "kind": "blessing",
    "zh": "生活正在回应你的坚持。",
    "en": "Life is responding to your perseverance."
  },
  {
    "kind": "blessing",
    "zh": "愿你不因孤单而否定价值。",
    "en": "May loneliness never make you question your worth."
  },
  {
    "kind": "blessing",
    "zh": "人生每一步，都不白走。",
    "en": "No step in life is ever wasted."
  },
  {
    "kind": "blessing",
    "zh": "愿你在新的一年，心里有安稳，生活有节奏。",
    "en": "May the new year bring steadiness to your heart and rhythm to your life."
  },
  {
    "kind": "blessing",
    "zh": "你不需要证明自己，生活会替你说话。",
    "en": "You do not need to prove yourself—life will speak for you."
  },
  {
    "kind": "blessing",
    "zh": "愿你被善意对待，也善待自己。",
    "en": "May you be treated with kindness and show kindness to yourself."
  },
  {
    "kind": "blessing",
    "zh": "人生不急，重要的不会错过。",
    "en": "Life is not rushed; what matters will not miss you."
  },
  {
    "kind": "blessing",
    "zh": "愿你对未来保持温柔的期待。",
    "en": "May you hold gentle expectations for the future."
  },
  {
    "kind": "blessing",
    "zh": "你已经走得很远了。",
    "en": "You have already come a long way."
  },
  {
    "kind": "blessing",
    "zh": "愿你允许自己慢下来。",
    "en": "May you allow yourself to slow down."
  },
  {
    "kind": "blessing",
    "zh": "生活正在回应你的坚持。",
    "en": "Life is responding to your perseverance."
  },
  {
    "kind": "blessing",
    "zh": "愿你不因孤单而否定价值。",
    "en": "May loneliness never make you question your worth."
  },
  {
    "kind": "blessing",
    "zh": "人生每一步，都不白走。",
    "en": "No step in life is ever wasted."
  },
  {
    "kind": "blessing",
    "zh": "愿你在新的一年，心里有安稳，生活有节奏。",
    "en": "May the new year bring steadiness to your heart and rhythm to your life."
  },
  {
    "kind": "blessing",
    "zh": "你不需要证明自己，生活会替你说话。",
    "en": "You do not need to prove yourself—life will speak for you."
  },
  {
    "kind": "blessing",
    "zh": "愿你被善意对待，也善待自己。",
    "en": "May you be treated with kindness and show kindness to yourself."
  },
  {
    "kind": "blessing",
    "zh": "人生不急，重要的不会错过。",
    "en": "Life is not rushed; what matters will not miss you."
  },
  {
    "kind": "blessing",
    "zh": "愿你对未来保持温柔的期待。",
    "en": "May you hold gentle expectations for the future."
  },
  {
    "kind": "blessing",
    "zh": "你已经走得很远了。",
    "en": "You have already come a long way."
  },
  {
    "kind": "blessing",
    "zh": "愿你允许自己慢下来。",
    "en": "May you allow yourself to slow down."
  },
  {
    "kind": "blessing",
    "zh": "生活正在回应你的坚持。",
    "en": "Life is responding to your perseverance."
  },
  {
    "kind": "blessing",
    "zh": "愿你不因孤单而否定价值。",
    "en": "May loneliness never make you question your worth."
  },
  {
    "kind": "blessing",
    "zh": "人生每一步，都不白走。",
    "en": "No step in life is ever wasted."
  },
  {
    "kind": "blessing",
    "zh": "愿你在新的一年，心里有安稳，生活有节奏。",
    "en": "May the new year bring steadiness to your heart and rhythm to your life."
  },
  {
    "kind": "blessing",
    "zh": "你不需要证明自己，生活会替你说话。",
    "en": "You do not need to prove yourself—life will speak for you."
  },
  {
    "kind": "blessing",
    "zh": "愿你被善意对待，也善待自己。",
    "en": "May you be treated with kindness and show kindness to yourself."
  },
  {
    "kind": "blessing",
    "zh": "人生不急，重要的不会错过。",
    "en": "Life is not rushed; what matters will not miss you."
  },
  {
    "kind": "blessing",
    "zh": "愿你对未来保持温柔的期待。",
    "en": "May you hold gentle expectations for the future."
  },
  {
    "kind": "blessing",
    "zh": "你已经走得很远了。",
    "en": "You have already come a long way."
  },
  {
    "kind": "blessing",
    "zh": "愿你允许自己慢下来。",
    "en": "May you allow yourself to slow down."
  },
  {
    "kind": "blessing",
    "zh": "生活正在回应你的坚持。",
    "en": "Life is responding to your perseverance."
  },
  {
    "kind": "blessing",
    "zh": "愿你不因孤单而否定价值。",
    "en": "May loneliness never make you question your worth."
  },
  {
    "kind": "blessing",
    "zh": "人生每一步，都不白走。",
    "en": "No step in life is ever wasted."
  },
  {
    "kind": "blessing",
    "zh": "愿你在新的一年，心里有安稳，生活有节奏。",
    "en": "May the new year bring steadiness to your heart and rhythm to your life."
  },
  {
    "kind": "blessing",
    "zh": "你不需要证明自己，生活会替你说话。",
    "en": "You do not need to prove yourself—life will speak for you."
  },
  {
    "kind": "blessing",
    "zh": "愿你被善意对待，也善待自己。",
    "en": "May you be treated with kindness and show kindness to yourself."
  },
  {
    "kind": "blessing",
    "zh": "人生不急，重要的不会错过。",
    "en": "Life is not rushed; what matters will not miss you."
  },
  {
    "kind": "blessing",
    "zh": "愿你对未来保持温柔的期待。",
    "en": "May you hold gentle expectations for the future."
  },
  {
    "kind": "blessing",
    "zh": "你已经走得很远了。",
    "en": "You have already come a long way."
  },
  {
    "kind": "blessing",
    "zh": "愿你允许自己慢下来。",
    "en": "May you allow yourself to slow down."
  },
  {
    "kind": "blessing",
    "zh": "生活正在回应你的坚持。",
    "en": "Life is responding to your perseverance."
  },
  {
    "kind": "blessing",
    "zh": "愿你不因孤单而否定价值。",
    "en": "May loneliness never make you question your worth."
  },
  {
    "kind": "blessing",
    "zh": "人生每一步，都不白走。",
    "en": "No step in life is ever wasted."
  },
  {
    "kind": "blessing",
    "zh": "愿你在新的一年，心里有安稳，生活有节奏。",
    "en": "May the new year bring steadiness to your heart and rhythm to your life."
  },
  {
    "kind": "blessing",
    "zh": "你不需要证明自己，生活会替你说话。",
    "en": "You do not need to prove yourself—life will speak for you."
  },
  {
    "kind": "blessing",
    "zh": "愿你被善意对待，也善待自己。",
    "en": "May you be treated with kindness and show kindness to yourself."
  },
  {
    "kind": "blessing",
    "zh": "人生不急，重要的不会错过。",
    "en": "Life is not rushed; what matters will not miss you."
  },
  {
    "kind": "blessing",
    "zh": "愿你对未来保持温柔的期待。",
    "en": "May you hold gentle expectations for the future."
  },
  {
    "kind": "blessing",
    "zh": "你已经走得很远了。",
    "en": "You have already come a long way."
  },
  {
    "kind": "blessing",
    "zh": "愿你允许自己慢下来。",
    "en": "May you allow yourself to slow down."
  },
  {
    "kind": "blessing",
    "zh": "生活正在回应你的坚持。",
    "en": "Life is responding to your perseverance."
  },
  {
    "kind": "blessing",
    "zh": "愿你不因孤单而否定价值。",
    "en": "May loneliness never make you question your worth."
  },
  {
    "kind": "blessing",
    "zh": "人生每一步，都不白走。",
    "en": "No step in life is ever wasted."
  },
  {
    "kind": "blessing",
    "zh": "愿你在新的一年，心里有安稳，生活有节奏。",
    "en": "May the new year bring steadiness to your heart and rhythm to your life."
  },
  {
    "kind": "blessing",
    "zh": "你不需要证明自己，生活会替你说话。",
    "en": "You do not need to prove yourself—life will speak for you."
  },
  {
    "kind": "blessing",
    "zh": "愿你被善意对待，也善待自己。",
    "en": "May you be treated with kindness and show kindness to yourself."
  },
  {
    "kind": "blessing",
    "zh": "人生不急，重要的不会错过。",
    "en": "Life is not rushed; what matters will not miss you."
  },
  {
    "kind": "blessing",
    "zh": "愿你对未来保持温柔的期待。",
    "en": "May you hold gentle expectations for the future."
  },
  {
    "kind": "blessing",
    "zh": "你已经走得很远了。",
    "en": "You have already come a long way."
  },
  {
    "kind": "blessing",
    "zh": "愿你允许自己慢下来。",
    "en": "May you allow yourself to slow down."
  },
  {
    "kind": "blessing",
    "zh": "生活正在回应你的坚持。",
    "en": "Life is responding to your perseverance."
  },
  {
    "kind": "blessing",
    "zh": "愿你不因孤单而否定价值。",
    "en": "May loneliness never make you question your worth."
  },
  {
    "kind": "blessing",
    "zh": "人生每一步，都不白走。",
    "en": "No step in life is ever wasted."
  }
];


/* =======================
   Utils
======================= */
function stableHashIndex(input: string, mod: number) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0; // 32-bit
  }
  return Math.abs(hash) % mod;
}

function formatText(item: Item, lang: LangMode) {
  if (lang === "zh") return item.zh;
  if (lang === "en") return item.en;
  return `${item.zh}\n\n${item.en}`;
}

export default function ScratchCard() {
  const [name, setName] = useState("");
  const [generated, setGenerated] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [lang, setLang] = useState<LangMode>("both");
  const [pool, setPool] = useState<PoolMode>("all");
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const isScratchingRef = useRef(false);
  const lastCheckRef = useRef(0);

  const poolItems = useMemo(() => {
    const base = ITEMS.length ? ITEMS : [];
    if (pool === "all") return base;
    return base.filter((i) => i.kind === pool);
  }, [pool]);

  const item = useMemo(() => {
    if (!generated) return null;
    const n = name.trim();
    if (!n || poolItems.length === 0) return null;
    const idx = stableHashIndex(n, poolItems.length);
    return poolItems[idx];
  }, [generated, name, poolItems]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const host = containerRef.current;
    if (!canvas || !host) return;

    const rect = host.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // reset + scale for DPR
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // cover layer
    ctx.globalCompositeOperation = "source-over";
    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    g.addColorStop(0, "#bdbdbd");
    g.addColorStop(0.5, "#e6e6e6");
    g.addColorStop(1, "#bdbdbd");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // texture
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    for (let i = 0; i < 80; i++) {
      ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 2, 2);
    }

    // hint text
    ctx.fillStyle = "#666";
    ctx.font = "bold 20px system-ui, -apple-system, Segoe UI, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(UI.scratchHint, rect.width / 2, rect.height / 2);

    // switch to eraser mode
    ctx.globalCompositeOperation = "destination-out";
    ctxRef.current = ctx;

    setRevealed(false);
    isScratchingRef.current = false;
  }, []);

  useEffect(() => {
    if (!generated) return;
    const id = requestAnimationFrame(() => initCanvas());
    return () => cancelAnimationFrame(id);
  }, [generated, initCanvas, lang, pool, item]);

  const checkRevealed = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const now = performance.now();
    if (now - lastCheckRef.current < 160) return;
    lastCheckRef.current = now;

    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = img.data;

    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) transparent++;
    }

    const ratio = transparent / (data.length / 4);
    if (ratio >= 0.55) setRevealed(true);
  }, []);

  const scratchAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    checkRevealed();
  }, [checkRevealed]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.cancelable) e.preventDefault();
    isScratchingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratchingRef.current) return;
    if (e.cancelable) e.preventDefault();
    scratchAt(e.clientX, e.clientY);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.cancelable) e.preventDefault();
    isScratchingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const copyText = useCallback(async () => {
    if (!item) return;
    const text = formatText(item, lang);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Copy failed / 复制失败");
    }
  }, [item, lang]);

  const shareText = useCallback(async () => {
    if (!item) return;
    const payload = `${UI.sharePrefix}\n\n${name.trim()}\n\n${formatText(item, "both")}`;

    // Web Share API
    const navAny = navigator as unknown as { share?: (p: { title?: string; text?: string }) => Promise<void> };
    if (navAny.share) {
      try {
        await navAny.share({ title: UI.title, text: payload });
        return;
      } catch {
        return; // user cancelled
      }
    }

    // fallback copy
    try {
      await navigator.clipboard.writeText(payload);
      alert(UI.copied);
    } catch {
      alert("Share/Copy failed / 分享或复制失败");
    }
  }, [item, name]);

  const reset = () => {
    setGenerated(false);
    setRevealed(false);
    setCopied(false);
    isScratchingRef.current = false;
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 20, fontFamily: "system-ui, -apple-system" }}>
      <h2 style={{ marginBottom: 6 }}>{UI.title}</h2>
      <p style={{ color: "#666", marginTop: 0 }}>{UI.subtitle}</p>

      {!generated && (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={UI.namePlaceholder}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 12,
              borderRadius: 10,
              border: "1px solid #ddd",
              outline: "none",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!name.trim()) return alert(UI.alertName);
                setGenerated(true);
              }
            }}
          />

          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <select value={pool} onChange={(e) => setPool(e.target.value as PoolMode)} style={{ padding: 10, borderRadius: 10 }}>
              <option value="all">{UI.poolAll}</option>
              <option value="scripture">{UI.poolScripture}</option>
              <option value="blessing">{UI.poolBlessing}</option>
            </select>

            <select value={lang} onChange={(e) => setLang(e.target.value as LangMode)} style={{ padding: 10, borderRadius: 10 }}>
              <option value="both">{UI.langBoth}</option>
              <option value="zh">{UI.langZh}</option>
              <option value="en">{UI.langEn}</option>
            </select>
          </div>

          <button
            onClick={() => {
              if (!name.trim()) return alert(UI.alertName);
              setGenerated(true);
            }}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "none",
              background: "#6d28d9",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
            }}
          >
            {UI.generate}
          </button>
        </>
      )}

      {generated && item && (
        <>
          <div style={{ position: "relative", marginTop: 18 }}>
            <div
              ref={containerRef}
              style={{
                padding: 16,
                background: "#fff7ed",
                borderRadius: 14,
                minHeight: 180,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
                whiteSpace: "pre-wrap",
                lineHeight: 1.55,
                fontSize: 16,
              }}
            >
              {lang !== "en" && item.zh}
              {lang === "both" && "\n\n"}
              {lang !== "zh" && item.en}
            </div>

            {!revealed && (
              <canvas
                ref={canvasRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 14,
                  touchAction: "none",
                  cursor: "pointer",
                }}
              />
            )}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <button
              onClick={copyText}
              style={{
                flex: 1,
                minWidth: 140,
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {copied ? UI.copied : UI.copy}
            </button>

            <button
              onClick={shareText}
              style={{
                flex: 1,
                minWidth: 140,
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {UI.share}
            </button>

            <button
              onClick={reset}
              style={{
                flex: 1,
                minWidth: 140,
                padding: "12px 14px",
                borderRadius: 12,
                border: "none",
                background: "#111827",
                color: "white",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {UI.reset}
            </button>
          </div>

          <p style={{ color: "#6b7280", marginTop: 10, fontSize: 12 }}>
            * 同一个名字会稳定对应同一条内容 / Same name maps to the same message.
          </p>
        </>
      )}
    </div>
  );
}
