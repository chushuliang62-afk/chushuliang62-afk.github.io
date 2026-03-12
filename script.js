document.addEventListener('DOMContentLoaded', () => {

/* ===== Nav ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10));

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Active link
const secs = document.querySelectorAll('[id]');
const navAs = document.querySelectorAll('.nav-links a');
function activeNav() {
    let cur = '';
    secs.forEach(s => { if (scrollY >= s.offsetTop - 200) cur = s.id; });
    navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}
window.addEventListener('scroll', activeNav);

/* ===== Profile Modal ===== */
const logoBtn = document.getElementById('logoBtn');
const profileOverlay = document.getElementById('profileOverlay');
const profileClose = document.getElementById('profileClose');

logoBtn.addEventListener('click', () => profileOverlay.classList.add('active'));
document.querySelector('.hero-profile-link').addEventListener('click', () => profileOverlay.classList.add('active'));
profileClose.addEventListener('click', () => profileOverlay.classList.remove('active'));
profileOverlay.addEventListener('click', (e) => {
    if (e.target === profileOverlay) profileOverlay.classList.remove('active');
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') profileOverlay.classList.remove('active');
});

/* ===== Language Toggle ===== */
let lang = 'zh';
const langToggle = document.getElementById('langToggle');
const marqueeTrack = document.getElementById('marqueeTrack');

langToggle.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    langToggle.textContent = lang === 'zh' ? 'EN' : '中';
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // Update all translatable elements
    document.querySelectorAll('[data-lang-' + lang + ']').forEach(el => {
        // Skip marquee track (handled separately)
        if (el.id === 'marqueeTrack') return;
        // For elements with data-split, update attribute and re-split
        if (el.hasAttribute('data-split')) {
            el.textContent = el.getAttribute('data-lang-' + lang);
            initSplitEl(el);
            return;
        }
        el.textContent = el.getAttribute('data-lang-' + lang);
    });

    // Update marquee
    const marqueeText = marqueeTrack.getAttribute('data-lang-' + lang);
    marqueeTrack.innerHTML = '<span>' + marqueeText + '</span><span>' + marqueeText + '</span>';

    // Re-run scroll lighting
    lightWords();
});

/* ===== Split big-p into words & light on scroll ===== */
function initSplitEl(el) {
    const text = el.textContent.trim();
    el.innerHTML = '';
    const segments = text.match(/[\u4e00-\u9fff]|[a-zA-Z0-9/+\-·.,'()]+|[^\u4e00-\u9fff\sa-zA-Z0-9/+\-·.,'()]+|\s+/g) || [];
    segments.forEach(seg => {
        if (/^\s+$/.test(seg)) {
            el.appendChild(document.createTextNode(' '));
        } else {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = seg;
            el.appendChild(span);
        }
    });
}

document.querySelectorAll('[data-split]').forEach(el => initSplitEl(el));

function lightWords() {
    document.querySelectorAll('[data-split]').forEach(el => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = 1 - (rect.top / (vh * 0.65));
        const words = el.querySelectorAll('.word');
        words.forEach((w, i) => {
            const wordProgress = progress - (i / words.length) * 0.4;
            w.classList.toggle('lit', wordProgress > 0);
        });
    });
}
window.addEventListener('scroll', lightWords);
lightWords();

/* ===== Reveal on scroll ===== */
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('show');
            e.target.querySelectorAll('.dot-bar i').forEach(bar => bar.classList.add('go'));
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ===== Stagger reveal for cards ===== */
document.querySelectorAll('.card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
});
document.querySelectorAll('.skill-col').forEach((col, i) => {
    col.style.transitionDelay = (i * 0.1) + 's';
});
document.querySelectorAll('.exp-block').forEach((bl, i) => {
    bl.style.transitionDelay = (i * 0.12) + 's';
});

/* ===== Card parallax + cursor glow on mouse ===== */
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'translateY(-4px) perspective(1000px) rotateX(' + (-y * 3) + 'deg) rotateY(' + (x * 3) + 'deg)';
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ===== Smooth scroll progress bar ===== */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = 'scaleX(' + (scrollY / h) + ')';
});

/* ===== Blog Post Modal ===== */
const blogOverlay = document.getElementById('blogOverlay');
const blogClose = document.getElementById('blogClose');
const blogModalBody = document.getElementById('blogModalBody');

const blogPosts = {
    re4: {
        title_zh: '《生化危机 4 重制版》专业向评测优化稿',
        title_en: 'Resident Evil 4 Remake — Professional Review',
        sections_zh: [
            { type: 'intro', text: '《生化危机 4 重制版》是生存恐怖品类里，把惊悚内核与动作玩法融合得最到位的标杆级重制作品，跳出了传统纯生存恐怖的框架，也不靠低成本的感官冲击堆砌体验。' },
            { type: 'section', heading: '氛围营造', text: '本作摒弃了泛滥的 Jump Scare（贴脸惊吓），转而走精细化的心理惊悚路线：靠环境叙事留白、道具里的碎片化文本、藏在场景里的细节和细思极恐的世界观彩蛋，引导玩家通过自身想象放大心理压迫感，形成持续、非即时性的惊悚张力，而非一次性的感官刺激。' },
            { type: 'section', heading: '技术层面', text: '本作依托卡普空专属 RE 引擎完成次世代视听升级：PBR 物理渲染、全局动态光照、体积雾效与高精度材质建模，大幅提升了场景的真实质感与沉浸度；搭配高精度面部与动作捕捉、敌人肢体破坏的物理反馈，让角色演出和战斗交互的质感，达到了系列重制作品的新高度。' },
            { type: 'section', heading: '关卡设计', text: '本作把原版的线性流程重构为半开放箱庭式结构，打通了原本隔断的关卡区域，大幅提升了区域连通性与探索自由度。除主线流程外，新增的多组商人悬赏支线、隐藏收集要素与可探索的非主线区域，有效拉高了流程内容密度，也通过支线奖励驱动玩家主动探索地图边界；我个人全收集、全区域探索的首通时长约 20 小时，内容体量与重复游玩价值充足。' },
            { type: 'section', heading: '叙事层面', text: '重制版对原版剧情做了精细化打磨：通过新增的过场演出、对话细节与角色互动桥段，补全了里昂、阿什莉、路易斯等核心角色的人物弧光，修正了原版部分略显突兀的角色行为，让角色的动机与决策更符合人设与情境逻辑，在完整保留原版经典名场面的同时，实现了叙事质感与合理性的双重升级。' },
            { type: 'section', heading: '战斗系统', text: '战斗系统是本作的核心升级项，完成了从传统生存恐怖到动作化射击的根本性迭代：对比《生化危机 2 重制版》站桩射击、强规避拉扯的僵硬战斗循环，本作实现了全方向移动射击，新增了小刀格挡/弹反、体术连携、处决补刀的立体化近战机制，搭起了"射击打硬直-体术控场-近战补伤/格挡"的高自由度战斗循环。枪械系统同步完成了深度优化，全流程可解锁、可改造的枪械超过 20 款，每款都拥有独立的弹道、后坐力、射速、音效反馈与配件适配体系，手感差异明确，可适配不同玩家的战斗风格。同时在资源管理逻辑上，本作与《生化危机 2 重制版》形成了清晰的设计分野：放宽了弹药、恢复道具的投放，弱化了高压式的资源管控，核心体验偏向动作爽感的释放，鼓励玩家主动发起对抗，而非单纯依靠逃跑、闪避规避战斗。' },
            { type: 'section', heading: '总结', text: '整体来看，《生化危机 4 重制版》以动作冒险为核心基底，以心理惊悚为氛围调味，通过技术、关卡、叙事、战斗的全维度升级，打破了传统生存恐怖的品类边界，成了兼顾老玩家情怀需求与新玩家操作习惯的重制标杆。' },
            { type: 'divider' },
            { type: 'subtitle', text: '个人向专业吐槽与设计争议点' },
            { type: 'section', heading: '1. 经典内容的情怀取舍失衡，核心名场面删减严重', text: '重制版为了优化流程节奏，砍掉了原版大量标志性特色内容：萨拉扎城堡的雕像追逐战、湖上鳄鱼 BOSS 战、U3 主线 BOSS 战等经典桥段被直接移除或移入付费 DLC，教堂彩色玻璃解谜、部分机关互动也被大幅简化。对老玩家来说，这些内容是情怀的核心载体，过度删减让重制的"复刻属性"大打折扣，部分取舍显得过于功利。' },
            { type: 'section', heading: '2. 动作化迭代稀释了生存恐怖的核心张力', text: '原版"坦克式移动+举枪锁定移动"的设计，本质是通过操作限制放大玩家的心理压力，让每一次射击、每一次走位都具备极高的决策成本，这也是原版生存恐怖感的核心来源。而重制版的移动射击、流畅格挡弹反，虽然爽感拉满，却直接消解了这种操作限制带来的压迫感——高难度的挑战更多来自敌人数值膨胀，而非原版的风险决策压力，一定程度上稀释了生存恐怖的品类底色。' },
            { type: 'section', heading: '3. 武器平衡与改造系统的设计缺陷明显', text: '尽管枪械库体量充足，但武器强度梯度严重失衡：多数手枪、冲锋枪的泛用性与改造性价比极低，后期完全被高伤害的霰弹枪、狙击枪、马格南左轮替代，很难形成差异化的配装玩法；同时实用瞄具配件的获取门槛过高，基础瞄具视野差、稳定性不足，红点镜、高倍镜等核心配件大多要到游戏中后期才能解锁，前期射击体验的顺滑度不足。此外，武器改造仅停留在数值提升，没有更多个性化的改造分支，玩法深度有限。' },
            { type: 'section', heading: '4. 半开放箱庭设计的探索回报不足，支线同质化严重', text: '半沙盘式的地图设计并未完全发挥潜力：绝大多数支线任务都是同质化的"击杀特定敌人""收集特定道具"，没有专属剧情、隐藏名场面或独特奖励，探索回报大多是基础的金币、弹药，长期探索很容易产生倦怠感。同时部分区域的地图引导不足，关键路径标识过于隐蔽，很容易出现无效绕路，打乱主线流程节奏。' },
            { type: 'section', heading: '5. 敌人 AI 与战斗循环的同质化问题突出', text: '除少数精英怪与 BOSS 外，绝大多数杂兵的 AI 逻辑高度单一，仅有无脑冲脸的基础攻击模式，后期敌人仅提升数值，攻击逻辑与应对方式没有本质变化，很容易形成固定的"射击硬直-体术处决-格挡补刀"循环，长时间游玩极易产生审美疲劳。同时部分经典 BOSS 战被大幅简化，比如村长门德斯、城主萨拉扎的战斗，原版的多阶段形态变化、场景互动机制被压缩，战斗的层次感与策略深度远不如原版。' }
        ],
        sections_en: [
            { type: 'intro', text: 'Resident Evil 4 Remake is the benchmark remake in the survival horror genre that best fuses horror essence with action gameplay, breaking free from the traditional pure survival horror framework without relying on cheap sensory shocks.' },
            { type: 'section', heading: 'Atmosphere', text: 'The game abandons overused jump scares in favor of refined psychological horror: environmental storytelling, fragmented texts in items, hidden scene details, and unsettling lore easter eggs guide players to amplify psychological tension through their own imagination, creating sustained, non-immediate horror rather than one-time sensory stimulation.' },
            { type: 'section', heading: 'Technical Aspects', text: 'Built on Capcom\'s proprietary RE Engine, the game delivers a next-gen audiovisual upgrade: PBR rendering, global dynamic lighting, volumetric fog, and high-precision material modeling greatly enhance scene realism and immersion. Combined with high-fidelity facial and motion capture, plus physics-based enemy dismemberment feedback, character performance and combat interaction quality reach new heights for the remake series.' },
            { type: 'section', heading: 'Level Design', text: 'The original\'s linear progression is restructured into a semi-open sandbox design, connecting previously segmented level areas and greatly improving area connectivity and exploration freedom. Beyond the main story, new merchant bounty side quests, hidden collectibles, and explorable non-mainline areas effectively increase content density. My personal full-collection, full-exploration first playthrough took about 20 hours, with sufficient content volume and replay value.' },
            { type: 'section', heading: 'Narrative', text: 'The remake refines the original storyline: through new cutscenes, dialogue details, and character interaction segments, it completes the character arcs of Leon, Ashley, Luis, and other core characters, corrects some abrupt character behaviors from the original, and makes character motivations and decisions more consistent with their personalities and situational logic.' },
            { type: 'section', heading: 'Combat System', text: 'The combat system is the core upgrade, completing a fundamental iteration from traditional survival horror to action-oriented shooting. Compared to RE2 Remake\'s stationary shooting and evasion-heavy rigid combat loop, this game achieves full-directional movement shooting, adds knife parry/deflect, melee combos, and execution finishers, building a high-freedom combat loop of "shoot to stagger — melee to control — close-combat to finish/parry." The firearms system features 20+ unlockable and upgradeable weapons, each with unique ballistics, recoil, fire rate, sound feedback, and attachment systems.' },
            { type: 'section', heading: 'Summary', text: 'Overall, Resident Evil 4 Remake uses action-adventure as its core foundation and psychological horror as its atmospheric seasoning. Through comprehensive upgrades in technology, level design, narrative, and combat, it breaks the boundaries of traditional survival horror and becomes a remake benchmark that satisfies both veteran nostalgia and newcomer play habits.' },
            { type: 'divider' },
            { type: 'subtitle', text: 'Personal Critiques & Design Controversies' },
            { type: 'section', heading: '1. Imbalanced Nostalgia Tradeoffs — Key Iconic Scenes Cut', text: 'To optimize pacing, the remake cut numerous iconic elements: Salazar\'s statue chase, the lake crocodile boss fight, and the U3 boss fight were either removed or moved to paid DLC. The church stained-glass puzzle and some mechanism interactions were greatly simplified. For veteran players, these represent the core of nostalgic value.' },
            { type: 'section', heading: '2. Action Iteration Dilutes Survival Horror Tension', text: 'The original\'s "tank controls + aim-locked movement" design fundamentally amplified player psychological pressure through control limitations, making every shot and every move carry high decision costs. The remake\'s fluid movement shooting and smooth parrying, while satisfying, directly dissolve this pressure — higher difficulty comes from enemy stat inflation rather than the original\'s risk-decision pressure.' },
            { type: 'section', heading: '3. Weapon Balance & Upgrade System Flaws', text: 'Despite a substantial arsenal, weapon power tiers are severely imbalanced: most pistols and SMGs have extremely low versatility and upgrade cost-efficiency, completely replaced by high-damage shotguns, sniper rifles, and Magnums in late game. Practical optic attachments are gated too late, with basic sights offering poor field of view and stability. Weapon upgrades are limited to stat boosts with no personalized upgrade branches.' },
            { type: 'section', heading: '4. Insufficient Exploration Rewards in Semi-Open Design', text: 'The semi-sandbox map design doesn\'t fully realize its potential: most side quests are homogenized "kill specific enemies" or "collect specific items" with no unique storylines, hidden scenes, or special rewards. Exploration rewards are mostly basic coins and ammo, easily causing fatigue. Some areas lack adequate map guidance, with key paths too hidden, leading to ineffective detours.' },
            { type: 'section', heading: '5. Enemy AI & Combat Loop Homogeneity', text: 'Except for a few elite enemies and bosses, most regular enemy AI is highly simplistic with only basic rush-attack patterns. Late-game enemies only increase stats without changing attack logic, easily forming a fixed "shoot to stagger — melee execute — parry" loop. Some classic boss fights are greatly simplified, such as Village Chief Mendez and Castellan Salazar, with the original\'s multi-phase transformations and scene interaction mechanics compressed.' }
        ]
    },
    clip: {
        title_zh: 'CLIP 模型论文研读',
        title_en: 'CLIP Paper Study — Learning Transferable Visual Models From Natural Language',
        sections_zh: [
            { type: 'intro', text: 'Learning Transferable Visual Models From Natural Language Supervision — 通过自然语言监督学习可迁移的视觉模型。' },
            { type: 'link', url: 'https://arxiv.org/abs/2103.00020', text: '论文地址：https://arxiv.org/abs/2103.00020' },
            { type: 'section', heading: '论文的背景', text: '传统视觉模型受限于预定义的封闭类别，新增识别目标必须依赖标注数据重训练，落地成本高。此前已有研究尝试从海量图文数据中学习通用视觉能力，但效果始终不佳，如 Li 等人 2017 年在 ImageNet 上的零样本准确率仅 11.5%，完全达不到可用标准，而 CLIP 是首个将这条技术路径走通的工作。' },
            { type: 'section', heading: '核心方法', text: 'CLIP 的核心逻辑可拆解为三步：一是联合训练图像与文本编码器，基于对比学习学习图文匹配关系，作者将原本低效的生成式训练目标，简化为图文匹配判断，训练效率直接提升 12 倍，这个取舍我读的时候很有启发，简化问题反而拿到了更优的效果；二是用"A photo of a {object}."模板生成类别文本特征；三是推理时通过图文特征相似度完成分类。' },
            { type: 'section', heading: '实验结果', text: '作者用自行构建的 4 亿对图文数据集预训练，在 30 余个视觉数据集上完成测试，零样本 CLIP 在 ImageNet 上准确率达 76.2%，与全监督训练的 ResNet-50 持平。有意思的是，CLIP 在 ImageNet 微调后，域内准确率涨了近 9 个点，但分布外数据集的泛化能力反而明显下降。' },
            { type: 'section', heading: '亮点与不足', text: '这篇论文我觉得最大的优点是方法极其简洁，核心代码只有不到 20 行伪代码（Figure3），但效果却改变了整个领域。另外作者在第七章对社会影响的讨论比较诚恳，专门分析了偏见和监控风险，在当时的 AI 论文里不太常见。不足的话，我注意到零样本 CLIP 在一些看似简单的任务上反而表现不好，在 MNIST 等分布差异大的简单任务上表现拉胯，零样本准确率仅 88%；性能对提示词设计高度敏感，本质仍是模式匹配而非深度语义理解；预训练的算力与数据成本极高，普通团队难以复现。' },
            { type: 'section', heading: '个人的感触', text: '读完这篇论文，我最大的感受是「语言是打开视觉世界的钥匙」。以前视觉模型被困在固定的标签体系里，CLIP 可以说是把视觉识别从固定类别的"选择题"变成了可灵活拓展的"语言描述匹配"，彻底打破了类别边界，是后续多模态大模型、图像生成技术的重要基石。但同时我也觉得：CLIP 的效果突破靠的是超大规模数据与算力的贡献，方法本身并不复杂。这让我想到一个问题：如果没有这么多数据和算力，同样的思路还能走多远？' }
        ],
        sections_en: [
            { type: 'intro', text: 'Learning Transferable Visual Models From Natural Language Supervision.' },
            { type: 'link', url: 'https://arxiv.org/abs/2103.00020', text: 'Paper: https://arxiv.org/abs/2103.00020' },
            { type: 'section', heading: 'Background', text: 'Traditional vision models are limited to predefined closed categories — adding new recognition targets requires labeled data and retraining, with high deployment costs. Prior research attempted to learn general visual capabilities from massive image-text data but results were poor; e.g., Li et al. (2017) achieved only 11.5% zero-shot accuracy on ImageNet, far from practical use. CLIP was the first work to make this technical path viable.' },
            { type: 'section', heading: 'Core Method', text: 'CLIP\'s core logic breaks down into three steps: (1) jointly training image and text encoders via contrastive learning for image-text matching — the authors simplified the original inefficient generative training objective to an image-text matching judgment, boosting training efficiency by 12x (this tradeoff was very inspiring to me — simplifying the problem actually yielded better results); (2) using "A photo of a {object}." templates to generate category text features; (3) performing classification via image-text feature similarity at inference time.' },
            { type: 'section', heading: 'Experimental Results', text: 'The authors pre-trained on a self-constructed dataset of 400 million image-text pairs and tested across 30+ vision datasets. Zero-shot CLIP achieved 76.2% accuracy on ImageNet, matching fully supervised ResNet-50. Interestingly, after fine-tuning on ImageNet, in-domain accuracy increased by nearly 9 points, but generalization on out-of-distribution datasets actually declined significantly.' },
            { type: 'section', heading: 'Strengths & Weaknesses', text: 'The paper\'s greatest strength is its extremely simple method — the core code is under 20 lines of pseudocode (Figure 3) — yet it changed the entire field. The authors\' discussion of social impact in Chapter 7 is notably sincere, specifically analyzing bias and surveillance risks, which was uncommon in AI papers at the time. As for weaknesses: zero-shot CLIP performs poorly on seemingly simple tasks like MNIST (only 88% accuracy); performance is highly sensitive to prompt design, essentially still pattern matching rather than deep semantic understanding; and the compute and data costs for pre-training are extremely high, making reproduction difficult for ordinary teams.' },
            { type: 'section', heading: 'Personal Reflections', text: 'After reading this paper, my biggest takeaway is that "language is the key to unlocking the visual world." Previously, vision models were trapped in fixed label systems. CLIP transformed visual recognition from a fixed-category "multiple choice" problem into flexibly extensible "language description matching," completely breaking category boundaries and becoming a crucial foundation for subsequent multimodal large models and image generation technologies. But I also feel that CLIP\'s breakthrough relies on the contribution of ultra-large-scale data and compute — the method itself is not complex. This makes me wonder: without so much data and compute, how far could the same approach go?' }
        ]
    },
    steveeye: {
        title_zh: 'Steve-Eye 论文研读',
        title_en: 'Steve-Eye Paper Study — Equipping LLM-based Embodied Agents with Visual Perception',
        sections_zh: [
            { type: 'intro', text: 'Steve-Eye：Equipping LLM-based Embodied Agents with Visual Perception in Open Worlds — 为开放世界具身智能体配备视觉感知。' },
            { type: 'link', url: 'https://arxiv.org/abs/2310.13255', text: '论文地址：https://arxiv.org/abs/2310.13255' },
            { type: 'section', heading: '论文的背景', text: '这篇 ICLR 2024 的论文，我觉得精准戳中了具身智能体研究的核心痛点：当下基于 LLM 的开放世界智能体，几乎都在"蒙眼玩文字游戏"。引言里"a blindfolded text-based game"的比喻，我反复品了品，实在贴切。像 Voyager、GITM 这些之前很火的工作，虽说用 LLM 做规划效果亮眼，却把 Minecraft 丰富的视觉画面全转成了文本描述，这中间的信息损耗大到难以忽视。' },
            { type: 'section', heading: '核心方法', text: 'Steve-Eye 的核心思路，是把视觉编码器和 LLM 做端到端联合训练，搭出一套多模态输入输出的大模型。读到第三章架构图时，我注意到一个关键细节：他们用 VQ-GAN 做视觉 tokenizer，把图像编码成离散 token 后映射到文本 embedding 同源空间，再合并视觉 codebook 与语言词表，让模型既能"看"图，也能"生成"图。训练用了类 LLaVA 的两阶段策略，先冻结主干做特征对齐，再解冻 LLM 做全量指令微调。数据上用 ChatGPT 半自动生成了 85 万条覆盖三大维度的指令数据，这套数据体系，我觉得是这篇工作里极易被忽略的核心贡献。' },
            { type: 'section', heading: '实验结果', text: '我最关注的是第四章的几组对照。环境视觉描述任务里，CLIP 大幅超越了 Minecraft 专属预训练的 MineCLIP，物品栏识别准确率高出近 49 个百分点，作者归因于 MineCLIP 预训练缺失细粒度对齐。基础知识问答环节，13B 的 Steve-Eye 得分居然超过了 gpt-turbo-3.5，这点真的出乎我的意料。技能规划实验里，模型也在 24 个 Minecraft 任务上全面优于现有基线。' },
            { type: 'section', heading: '亮点与不足', text: '这篇工作最值得借鉴的，是问题定义极其清晰，把具身智能体视觉缺失的核心矛盾讲得很透，给出的方案覆盖感知、知识、规划全链路，不是单点突破而是系统性解法。短板也很明确：自驱动模式下，长时程复杂任务性能下滑明显，连续帧细粒度推理能力不足；所有验证都局限在 Minecraft 环境，向真实物理场景的泛化还有很大距离。' },
            { type: 'section', heading: '个人的感触', text: '读完最强烈的感受是，多模态绝非具身智能的锦上添花，而是核心刚需。之前惊叹于纯文本驱动智能体的能力，Steve-Eye 却让我意识到，缺失视觉的智能体本质是"残缺"的。同时我也一直在想，这套高成本的数据构建流水线，在没有完善 API 与 Wiki 支撑的环境里，还能顺利跑通吗？' }
        ],
        sections_en: [
            { type: 'intro', text: 'Steve-Eye: Equipping LLM-based Embodied Agents with Visual Perception in Open Worlds.' },
            { type: 'link', url: 'https://arxiv.org/abs/2310.13255', text: 'Paper: https://arxiv.org/abs/2310.13255' },
            { type: 'section', heading: 'Background', text: 'This ICLR 2024 paper precisely targets the core pain point of embodied agent research: current LLM-based open-world agents are essentially "playing a blindfolded text-based game." The metaphor in the introduction is remarkably apt. Prior popular works like Voyager and GITM, while impressive in using LLMs for planning, converted all of Minecraft\'s rich visual content into text descriptions — the information loss in this process is too significant to ignore.' },
            { type: 'section', heading: 'Core Method', text: 'Steve-Eye\'s core approach is end-to-end joint training of a visual encoder and LLM, building a multimodal input-output large model. Reading the architecture diagram in Chapter 3, I noticed a key detail: they use VQ-GAN as a visual tokenizer, encoding images into discrete tokens mapped to the same embedding space as text, then merging the visual codebook with the language vocabulary so the model can both "see" and "generate" images. Training uses a LLaVA-like two-stage strategy: first freezing the backbone for feature alignment, then unfreezing the LLM for full instruction fine-tuning. They semi-automatically generated 850K instruction data entries covering three dimensions using ChatGPT — this data system is, in my view, an easily overlooked core contribution of this work.' },
            { type: 'section', heading: 'Experimental Results', text: 'I focused most on the comparison groups in Chapter 4. In environment visual description tasks, CLIP significantly outperformed Minecraft-specific pretrained MineCLIP, with inventory recognition accuracy nearly 49 percentage points higher — the authors attribute this to MineCLIP\'s lack of fine-grained alignment in pretraining. In basic knowledge QA, the 13B Steve-Eye actually scored higher than gpt-turbo-3.5, which genuinely surprised me. In skill planning experiments, the model also comprehensively outperformed existing baselines across 24 Minecraft tasks.' },
            { type: 'section', heading: 'Strengths & Weaknesses', text: 'The most valuable aspect of this work is its extremely clear problem definition — it thoroughly articulates the core contradiction of visual absence in embodied agents, with a solution covering the full pipeline of perception, knowledge, and planning — a systematic solution rather than a single-point breakthrough. The shortcomings are also clear: in self-driven mode, performance on long-horizon complex tasks degrades significantly, with insufficient fine-grained reasoning on consecutive frames; all validation is limited to the Minecraft environment, with considerable distance remaining for generalization to real physical scenarios.' },
            { type: 'section', heading: 'Personal Reflections', text: 'My strongest takeaway is that multimodality is not a nice-to-have for embodied intelligence — it\'s a core necessity. I was previously amazed by the capabilities of purely text-driven agents, but Steve-Eye made me realize that agents without vision are fundamentally "incomplete." At the same time, I keep wondering: could this high-cost data construction pipeline still work smoothly in environments without well-developed APIs and Wiki support?' }
        ]
    },
    gato: {
        title_zh: 'Gato：通用智能体论文研读',
        title_en: 'Gato: A Generalist Agent — Paper Study',
        sections_zh: [
            { type: 'intro', text: 'A Generalist Agent — Gato：通用智能体。' },
            { type: 'link', url: 'https://arxiv.org/abs/2205.06175', text: '论文地址：https://arxiv.org/abs/2205.06175' },
            { type: 'section', heading: '背景', text: '传统 AI 模型普遍是单任务专精设计，下棋、对话、机械臂控制各有专属模型，切换任务就需要重训一套独立参数。这篇论文的核心目标，是训练一套用同一套权重的模型，同时胜任 Atari 游戏、自然语言对话、真实机器人操控等完全不同的任务，他们将这个"通用智能体"命名为 Gato。这个思路在当时颇具前瞻性，因为这些任务的输入输出模态差异极大，从游戏像素、按键指令到机器人关节力矩、文本序列，原生格式几乎没有共通性。' },
            { type: 'section', heading: '核心方法', text: 'Gato 的核心逻辑非常清晰：将所有模态的输入输出全部转化为 token 序列，统一用语言模型范式训练。文本用 SentencePiece 编码，图像切分为 16×16 的 patch，连续的关节角度经 mu-law 编码后离散化为 1024 个区间。这个设计看似暴力实则巧妙——无论什么模态，最终都转化为整数序列，用 1.2B 参数的 decoder-only Transformer 就能统一处理。训练时仅对文本和动作计算损失，图像观测不参与预测，大幅降低了训练开销，部署时通过自回归采样逐 token 输出动作。' },
            { type: 'section', heading: '实验结果', text: 'Gato 在 604 个任务上完成训练，覆盖游戏、机器人操控、对话等多个领域，其中 450 个任务达到专家水平的 50% 以上，23 个 Atari 游戏超过人类水平，真实机器人堆积木任务也与单任务 baseline 持平。但分布外迁移实验更值得关注：在 boxing 这款 Atari 游戏上，预训练的 Gato 表现反而不如从头训练的小模型，作者也承认是因为该游戏画面与训练数据差异过大，印证了 Gato 的"通用能力"仍有明确边界。' },
            { type: 'section', heading: '亮点与不足', text: '这篇论文最有意思的点，是与神经科学的类比——大脑皮层不同区域的神经元基础处理机制高度相似，Gato 某种程度上验证了这个假说：统一的网络结构确实能处理截然不同的任务。但它的短板也很明显：对话能力远弱于同期专用语言模型，生成内容常出错或过于肤浅；为满足机器人实时控制需求，模型规模被限制在 1.2B，导致单任务性能普遍弱于专精模型，更偏向"样样通但样样松"的状态。' },
            { type: 'section', heading: '个人的感触', text: '读完这篇论文，我一直在思考："一个模型覆盖所有任务"与"每个任务对应专精模型"，哪条路径更有实际价值？Gato 证明了前者的可行性，但在几乎所有单任务上都无法超越同期专用模型。不过换个角度看，Gato 是 2022 年的工作，参数量仅 1.2B，若放到现在的大模型规模下，或许会有完全不同的结论。在我看来，这篇论文的核心价值从来不是 Gato 本身的性能，而是它指明了一个方向：不同模态、任务之间的边界，或许远没有我们此前认为的那么难以打破。' }
        ],
        sections_en: [
            { type: 'intro', text: 'A Generalist Agent — Gato.' },
            { type: 'link', url: 'https://arxiv.org/abs/2205.06175', text: 'Paper: https://arxiv.org/abs/2205.06175' },
            { type: 'section', heading: 'Background', text: 'Traditional AI models are universally designed for single-task specialization — chess, dialogue, and robotic arm control each have dedicated models, and switching tasks requires retraining a separate set of parameters. This paper\'s core goal is to train a single model with one set of weights that can simultaneously handle Atari games, natural language dialogue, real robot manipulation, and other completely different tasks, naming this "generalist agent" Gato. This approach was quite forward-looking at the time, as these tasks have vastly different input/output modalities — from game pixels and button commands to robot joint torques and text sequences, with almost no commonality in native formats.' },
            { type: 'section', heading: 'Core Method', text: 'Gato\'s core logic is very clear: convert all modality inputs and outputs into token sequences and train uniformly using a language model paradigm. Text is encoded with SentencePiece, images are split into 16×16 patches, and continuous joint angles are discretized into 1024 bins via mu-law encoding. This design seems brute-force but is actually clever — regardless of modality, everything is ultimately converted to integer sequences, processable by a 1.2B parameter decoder-only Transformer. During training, loss is computed only on text and actions (image observations don\'t participate in prediction), greatly reducing training costs. At deployment, actions are output token by token via autoregressive sampling.' },
            { type: 'section', heading: 'Experimental Results', text: 'Gato completed training on 604 tasks covering games, robot manipulation, dialogue, and other domains. 450 tasks reached above 50% of expert level, 23 Atari games exceeded human performance, and the real robot block stacking task matched single-task baselines. But the out-of-distribution transfer experiments are more noteworthy: on the Atari game Boxing, pre-trained Gato actually performed worse than a small model trained from scratch. The authors acknowledged this was because the game\'s visuals differed too much from training data, confirming that Gato\'s "general capabilities" still have clear boundaries.' },
            { type: 'section', heading: 'Strengths & Weaknesses', text: 'The most interesting aspect of this paper is the neuroscience analogy — the basic processing mechanisms of neurons across different cortical regions are highly similar, and Gato to some extent validates this hypothesis: a unified network structure can indeed handle vastly different tasks. But its shortcomings are also obvious: dialogue ability is far weaker than contemporary specialized language models, with generated content often erroneous or superficial; to meet real-time robot control requirements, model size was limited to 1.2B, causing single-task performance to generally lag behind specialized models — more of a "jack of all trades, master of none" state.' },
            { type: 'section', heading: 'Personal Reflections', text: 'After reading this paper, I keep thinking: which path has more practical value — "one model covering all tasks" or "a specialized model for each task"? Gato proved the former\'s feasibility but couldn\'t surpass contemporary specialized models on virtually any single task. However, from another perspective, Gato was a 2022 work with only 1.2B parameters; at today\'s large model scales, the conclusions might be completely different. In my view, this paper\'s core value was never Gato\'s performance itself, but rather the direction it pointed: the boundaries between different modalities and tasks may be far less insurmountable than we previously thought.' }
        ]
    }
};

function renderBlogPost(postId) {
    const post = blogPosts[postId];
    if (!post) return;
    const sections = lang === 'en' ? post.sections_en : post.sections_zh;
    const title = lang === 'en' ? post.title_en : post.title_zh;

    let html = '<h1 class="blog-article-title">' + title + '</h1>';
    sections.forEach(s => {
        if (s.type === 'intro') {
            html += '<div class="blog-article-intro">' + s.text + '</div>';
        } else if (s.type === 'link') {
            html += '<a class="blog-article-link" href="' + s.url + '" target="_blank">' + s.text + ' ↗</a>';
        } else if (s.type === 'divider') {
            html += '<hr class="blog-article-divider">';
        } else if (s.type === 'subtitle') {
            html += '<h2 class="blog-article-subtitle">' + s.text + '</h2>';
        } else if (s.type === 'section') {
            html += '<div class="blog-article-section"><h2>' + s.heading + '</h2><p>' + s.text + '</p></div>';
        } else if (s.type === 'pdf') {
            const label = lang === 'en' ? s.text_en : s.text_zh;
            html += '<a class="blog-article-pdf" href="' + encodeURI(s.filename) + '" target="_blank">' + label + ' ↗</a>';
        }
    });
    blogModalBody.innerHTML = html;
}

window.openBlogPost = function(postId) {
    renderBlogPost(postId);
    blogModalBody.scrollTop = 0;
    blogOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

function closeBlogModal() {
    blogOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

blogClose.addEventListener('click', closeBlogModal);
blogOverlay.addEventListener('click', (e) => {
    if (e.target === blogOverlay) closeBlogModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && blogOverlay.classList.contains('active')) closeBlogModal();
});

/* ===== Merge localStorage custom posts ===== */
const STORAGE_KEY = 'portfolio_custom_posts';
function getCustomPosts() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch(e) { return {}; }
}
function saveCustomPosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// Merge into blogPosts
const customPosts = getCustomPosts();
Object.assign(blogPosts, customPosts);

// Inject dynamic blog cards for custom posts
const hardcodedIds = ['re4', 'clip', 'gato', 'steveeye'];
function injectCustomBlogCards() {
    const container = document.getElementById('customBlogCards');
    if (!container) return;
    container.innerHTML = '';
    const cp = getCustomPosts();
    Object.keys(cp).forEach(id => {
        if (hardcodedIds.includes(id)) return;
        const post = cp[id];
        const card = document.createElement('a');
        card.href = 'javascript:void(0)';
        card.className = 'blog-card';
        card.onclick = () => openBlogPost(id);
        card.innerHTML = '<div class="blog-card-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>'
            + '<h3 data-lang-zh="' + (post.card_zh || post.title_zh) + '" data-lang-en="' + (post.card_en || post.title_en) + '">' + (lang === 'en' ? (post.card_en || post.title_en) : (post.card_zh || post.title_zh)) + '</h3>'
            + '<p data-lang-zh="' + (post.desc_zh || '') + '" data-lang-en="' + (post.desc_en || '') + '">' + (lang === 'en' ? (post.desc_en || '') : (post.desc_zh || '')) + '</p>'
            + '<span class="blog-card-cta" data-lang-zh="阅读全文 →" data-lang-en="Read More →">' + (lang === 'en' ? 'Read More →' : '阅读全文 →') + '</span>';
        container.appendChild(card);
    });
}
injectCustomBlogCards();

/* ===== Admin Panel ===== */
const adminOverlay = document.getElementById('adminOverlay');
const adminClose = document.getElementById('adminClose');
const adminBody = document.getElementById('adminBody');
const adminForm = document.getElementById('adminForm');
const adminList = document.getElementById('adminList');
const adminBack = document.getElementById('adminBack');
const adminSave = document.getElementById('adminSave');
const adminDeleteBtn = document.getElementById('adminDelete');
const adminDropZone = document.getElementById('adminDropZone');
const adminFileInput = document.getElementById('adminFileInput');
const adminProgress = document.getElementById('adminProgress');
const adminProgressFill = document.getElementById('adminProgressFill');
const adminProgressText = document.getElementById('adminProgressText');
const adminSections = document.getElementById('adminSections');
const adminAddSection = document.getElementById('adminAddSection');
let editingId = null;
let currentPdfFilename = '';

// PDF.js worker
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// Secret: click footer 5 times
let footerClicks = 0;
let footerTimer = null;
document.querySelector('.footer').addEventListener('click', () => {
    footerClicks++;
    clearTimeout(footerTimer);
    if (footerClicks >= 5) {
        footerClicks = 0;
        openAdmin();
    }
    footerTimer = setTimeout(() => { footerClicks = 0; }, 2000);
});

function openAdmin() {
    editingId = null;
    showAdminList();
    adminOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAdmin() {
    adminOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

adminClose.addEventListener('click', closeAdmin);
adminOverlay.addEventListener('click', (e) => { if (e.target === adminOverlay) closeAdmin(); });
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') { e.preventDefault(); openAdmin(); }
});

function showAdminList() {
    adminForm.style.display = 'none';
    adminBody.style.display = '';
    adminProgress.style.display = 'none';
    const cp = getCustomPosts();
    const ids = Object.keys(cp);
    if (ids.length === 0) {
        adminList.innerHTML = '<p class="admin-empty">还没有文章，拖入 PDF 即可自动创建</p>';
    } else {
        adminList.innerHTML = ids.map(id => {
            const p = cp[id];
            return '<div class="admin-list-item"><div><strong>' + p.title_zh + '</strong><br><small>' + (p.desc_zh || '') + '</small></div><div class="admin-list-actions"><button onclick="editAdminPost(\'' + id + '\')">编辑</button><button onclick="deleteAdminPost(\'' + id + '\')" style="color:#ef4444;border-color:#fca5a5">删除</button></div></div>';
        }).join('');
    }
}

/* ===== PDF Drag & Drop ===== */
adminDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    adminDropZone.classList.add('drag-over');
});
adminDropZone.addEventListener('dragleave', () => {
    adminDropZone.classList.remove('drag-over');
});
adminDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    adminDropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
        handlePdfFile(file);
    } else {
        alert('请拖入 PDF 文件');
    }
});
adminFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handlePdfFile(file);
    adminFileInput.value = '';
});
adminDropZone.addEventListener('click', (e) => {
    if (e.target.tagName !== 'INPUT') adminFileInput.click();
});

/* ===== Parse PDF with pdf.js ===== */
async function handlePdfFile(file) {
    currentPdfFilename = file.name;
    adminProgress.style.display = '';
    adminProgressFill.style.width = '10%';
    adminProgressText.textContent = '正在读取 PDF...';

    try {
        const arrayBuffer = await file.arrayBuffer();
        adminProgressFill.style.width = '30%';
        adminProgressText.textContent = '正在解析页面...';

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;
        let fullText = '';

        for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join('');
            fullText += pageText + '\n\n';
            adminProgressFill.style.width = (30 + 50 * (i / totalPages)) + '%';
            adminProgressText.textContent = '正在解析第 ' + i + '/' + totalPages + ' 页...';
        }

        adminProgressFill.style.width = '90%';
        adminProgressText.textContent = '正在识别文章结构...';

        const parsed = parsePdfText(fullText, file.name);

        adminProgressFill.style.width = '100%';
        adminProgressText.textContent = '解析完成！';

        setTimeout(() => {
            showEditForm(parsed, false);
        }, 400);
    } catch (err) {
        console.error('PDF parse error:', err);
        adminProgress.style.display = 'none';
        alert('PDF 解析失败: ' + err.message);
    }
}

/* ===== Smart text parsing ===== */
function parsePdfText(text, filename) {
    // Clean up text
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // Try to extract title from first meaningful line
    let title = '';
    let startIdx = 0;

    // Skip very short lines at the beginning (header noise, page numbers)
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
        const line = lines[i];
        // Title is usually the first substantial line
        if (line.length >= 2 && line.length <= 100) {
            title = line;
            startIdx = i + 1;
            break;
        }
    }

    if (!title) {
        // Fallback: use filename without extension
        title = filename.replace(/\.pdf$/i, '');
    }

    // Parse sections: look for heading patterns
    const sections = [];
    let currentHeading = '';
    let currentContent = [];

    const isHeading = (line) => {
        // Common heading patterns in Chinese academic PDFs:
        // 1. Numbered: "一、", "1.", "1、", "第一章"
        // 2. Keywords: "背景", "方法", "结论", "摘要", etc.
        // 3. Short lines followed by longer content
        if (line.length > 60) return false;
        if (line.length < 2) return false;
        // Numbered patterns
        if (/^[一二三四五六七八九十]+[、.．]/.test(line)) return true;
        if (/^\d+[、.\s．]/.test(line)) return true;
        if (/^第[一二三四五六七八九十\d]+[章节部分]/.test(line)) return true;
        // Common section keywords (only if line is short enough to be a heading)
        if (line.length <= 20) {
            const headingKeywords = ['摘要', '背景', '引言', '简介', '方法', '核心方法', '核心思路', '实验', '结果', '结论', '总结', '讨论', '参考', '附录', '亮点', '不足', '感触', '个人', 'Abstract', 'Introduction', 'Background', 'Method', 'Results', 'Conclusion', 'Summary', 'Discussion'];
            if (headingKeywords.some(kw => line.includes(kw))) return true;
        }
        return false;
    };

    // First pass: group into intro + sections
    const contentLines = lines.slice(startIdx);
    let introText = '';

    for (let i = 0; i < contentLines.length; i++) {
        const line = contentLines[i];

        if (isHeading(line)) {
            // Save previous section
            if (currentHeading && currentContent.length > 0) {
                sections.push({ type: 'section', heading: currentHeading, text: currentContent.join('') });
            } else if (!currentHeading && currentContent.length > 0) {
                introText = currentContent.join('');
            }
            currentHeading = line.replace(/^[一二三四五六七八九十\d]+[、.\s．]+/, '').replace(/^第[一二三四五六七八九十\d]+[章节部分][、.\s．]*/, '');
            if (!currentHeading) currentHeading = line;
            currentContent = [];
        } else {
            currentContent.push(line);
        }
    }

    // Last section
    if (currentHeading && currentContent.length > 0) {
        sections.push({ type: 'section', heading: currentHeading, text: currentContent.join('') });
    } else if (currentContent.length > 0) {
        if (!introText) {
            introText = currentContent.join('');
        } else {
            sections.push({ type: 'section', heading: '正文', text: currentContent.join('') });
        }
    }

    // If no sections found, treat entire text as one block
    if (sections.length === 0 && !introText) {
        introText = contentLines.join('\n');
    }

    // Generate an ID from title
    let id = title
        .replace(/[\u4e00-\u9fff]/g, '') // remove Chinese chars
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .slice(0, 30);
    if (!id) {
        id = 'post-' + Date.now().toString(36);
    }

    // Generate description from intro or first section
    let desc = introText || (sections[0] ? sections[0].text : '');
    if (desc.length > 50) desc = desc.slice(0, 47) + '...';

    return {
        id: id,
        title_zh: title,
        title_en: '',
        desc_zh: desc,
        desc_en: '',
        pdf: filename,
        intro: introText,
        sections: sections
    };
}

/* ===== Show edit form ===== */
function showEditForm(data, isEdit) {
    editingId = isEdit ? data.id : null;
    adminBody.style.display = 'none';
    adminForm.style.display = '';
    adminProgress.style.display = 'none';

    document.getElementById('adminFormTitle').textContent = isEdit ? '编辑文章' : '确认文章内容';
    document.getElementById('af_id').value = data.id || '';
    document.getElementById('af_id').disabled = isEdit;
    document.getElementById('af_pdf').value = data.pdf || '';
    document.getElementById('af_title_zh').value = data.title_zh || '';
    document.getElementById('af_title_en').value = data.title_en || '';
    document.getElementById('af_desc_zh').value = data.desc_zh || '';
    document.getElementById('af_desc_en').value = data.desc_en || '';
    adminDeleteBtn.style.display = isEdit ? '' : 'none';

    // Render sections
    adminSections.innerHTML = '';

    // Add intro if exists
    if (data.intro) {
        addSectionBlock('intro', '引言', data.intro);
    }

    // Add content sections
    if (data.sections) {
        data.sections.forEach(s => {
            addSectionBlock(s.type || 'section', s.heading || '', s.text || '');
        });
    }
}

function addSectionBlock(type, heading, text) {
    const block = document.createElement('div');
    block.className = 'admin-section-block';
    block.innerHTML =
        '<div class="admin-section-type">' +
            '<button data-type="intro"' + (type === 'intro' ? ' class="active"' : '') + '>引言</button>' +
            '<button data-type="section"' + (type === 'section' ? ' class="active"' : '') + '>章节</button>' +
            '<button data-type="divider"' + (type === 'divider' ? ' class="active"' : '') + '>分割线</button>' +
        '</div>' +
        '<button class="admin-section-remove">&times;</button>' +
        (type !== 'divider' ?
            (type === 'section' ? '<input type="text" class="section-heading" placeholder="章节标题" value="' + (heading || '').replace(/"/g, '&quot;') + '" style="margin-bottom:8px">' : '') +
            '<textarea class="section-text" rows="4" placeholder="内容...">' + (text || '') + '</textarea>'
            : '');

    // Type switching
    block.querySelectorAll('.admin-section-type button').forEach(btn => {
        btn.addEventListener('click', () => {
            block.querySelectorAll('.admin-section-type button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const newType = btn.dataset.type;
            // Re-render content area
            const existingHeading = block.querySelector('.section-heading');
            const existingText = block.querySelector('.section-text');
            const headingVal = existingHeading ? existingHeading.value : '';
            const textVal = existingText ? existingText.value : '';
            // Remove old inputs
            if (existingHeading) existingHeading.remove();
            if (existingText) existingText.remove();
            if (newType === 'divider') return;
            const removeBtn = block.querySelector('.admin-section-remove');
            if (newType === 'section') {
                const inp = document.createElement('input');
                inp.type = 'text';
                inp.className = 'section-heading';
                inp.placeholder = '章节标题';
                inp.value = headingVal;
                inp.style.marginBottom = '8px';
                removeBtn.after(inp);
                const ta = document.createElement('textarea');
                ta.className = 'section-text';
                ta.rows = 4;
                ta.placeholder = '内容...';
                ta.value = textVal;
                inp.after(ta);
            } else {
                const ta = document.createElement('textarea');
                ta.className = 'section-text';
                ta.rows = 4;
                ta.placeholder = '引言内容...';
                ta.value = textVal;
                removeBtn.after(ta);
            }
        });
    });

    // Remove button
    block.querySelector('.admin-section-remove').addEventListener('click', () => {
        block.remove();
    });

    adminSections.appendChild(block);
}

adminAddSection.addEventListener('click', () => {
    addSectionBlock('section', '', '');
});

/* ===== Edit existing post ===== */
window.editAdminPost = function(id) {
    const cp = getCustomPosts();
    const p = cp[id];
    if (!p) return;

    // Reconstruct data for the form
    const introSection = (p.sections_zh || []).find(s => s.type === 'intro');
    const pdfSection = (p.sections_zh || []).find(s => s.type === 'pdf');
    const contentSections = (p.sections_zh || []).filter(s => s.type !== 'intro' && s.type !== 'pdf');

    showEditForm({
        id: id,
        title_zh: p.title_zh || '',
        title_en: p.title_en || '',
        desc_zh: p.desc_zh || '',
        desc_en: p.desc_en || '',
        pdf: pdfSection ? pdfSection.filename : (p.pdfFilename || ''),
        intro: introSection ? introSection.text : '',
        sections: contentSections
    }, true);
};

/* ===== Delete post ===== */
window.deleteAdminPost = function(id) {
    if (!confirm('确定删除 "' + id + '" ？')) return;
    const cp = getCustomPosts();
    delete cp[id];
    saveCustomPosts(cp);
    delete blogPosts[id];
    injectCustomBlogCards();
    showAdminList();
};

adminBack.addEventListener('click', () => {
    showAdminList();
});

/* ===== Save post ===== */
adminSave.addEventListener('click', () => {
    const id = (editingId || document.getElementById('af_id').value).trim().toLowerCase().replace(/\s+/g, '-');
    if (!id) { alert('请填写文章 ID'); return; }
    const titleZh = document.getElementById('af_title_zh').value.trim();
    if (!titleZh) { alert('请填写中文标题'); return; }
    const titleEn = document.getElementById('af_title_en').value.trim();
    const descZh = document.getElementById('af_desc_zh').value.trim();
    const descEn = document.getElementById('af_desc_en').value.trim();
    const pdf = document.getElementById('af_pdf').value.trim();

    // Collect sections from the editor
    const sectionsZh = [];
    const sectionsEn = [];
    const blocks = adminSections.querySelectorAll('.admin-section-block');

    blocks.forEach(block => {
        const activeType = block.querySelector('.admin-section-type button.active');
        const type = activeType ? activeType.dataset.type : 'section';
        const headingEl = block.querySelector('.section-heading');
        const textEl = block.querySelector('.section-text');
        const heading = headingEl ? headingEl.value.trim() : '';
        const text = textEl ? textEl.value.trim() : '';

        if (type === 'divider') {
            sectionsZh.push({ type: 'divider' });
            sectionsEn.push({ type: 'divider' });
        } else if (type === 'intro') {
            if (text) {
                sectionsZh.push({ type: 'intro', text: text });
                sectionsEn.push({ type: 'intro', text: text });
            }
        } else if (type === 'section') {
            if (text) {
                sectionsZh.push({ type: 'section', heading: heading || '正文', text: text });
                sectionsEn.push({ type: 'section', heading: heading || 'Content', text: text });
            }
        }
    });

    // Add PDF link at the end
    if (pdf) {
        sectionsZh.push({ type: 'pdf', filename: pdf, text_zh: '查看完整 PDF', text_en: 'View Full PDF' });
        sectionsEn.push({ type: 'pdf', filename: pdf, text_zh: '查看完整 PDF', text_en: 'View Full PDF' });
    }

    const post = {
        title_zh: titleZh,
        title_en: titleEn || titleZh,
        card_zh: titleZh,
        card_en: titleEn || titleZh,
        desc_zh: descZh,
        desc_en: descEn || descZh,
        pdfFilename: pdf,
        sections_zh: sectionsZh,
        sections_en: sectionsEn
    };

    const cp = getCustomPosts();
    cp[id] = post;
    saveCustomPosts(cp);
    blogPosts[id] = post;
    injectCustomBlogCards();
    showAdminList();
    alert('文章已保存！');
});

adminDeleteBtn.addEventListener('click', () => {
    if (!editingId) return;
    if (!confirm('确定删除 "' + editingId + '" ？')) return;
    const cp = getCustomPosts();
    delete cp[editingId];
    saveCustomPosts(cp);
    delete blogPosts[editingId];
    injectCustomBlogCards();
    editingId = null;
    showAdminList();
});

}); // DOMContentLoaded
