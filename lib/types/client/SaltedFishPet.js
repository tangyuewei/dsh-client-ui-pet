import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Salted fish pet overlay — a floating "QQ pet"-style mascot for the web UI.
 * Pure presentational; no framework hooks, no plugin context.
 * Interactivity: drag to move (clamped to viewport), click to react (random mood +
 * speech + feed), hover to wiggle, idle timer to drift to random thoughts.
 */
import { useEffect, useRef, useState } from 'react';
import css from './SaltedFishPet.module.css';
const MOODS = {
    happy: { emoji: '🐟', tag: '开心' },
    dizzy: { emoji: '🐡', tag: '晕乎乎' },
    fire: { emoji: '🔥', tag: '燃烧' },
    sleep: { emoji: '😴', tag: '睡着' },
    bug: { emoji: '🐛', tag: '有 Bug' },
    coffee: { emoji: '☕', tag: '续命' },
    rocket: { emoji: '🚀', tag: '起飞' },
    angry: { emoji: '😡', tag: '摔桌' },
};
const SPEECH = {
    happy: [
        '主人今天真帅！',
        '咸鱼也有梦想！',
        '代码一气呵成 ✨',
        '今天适合摸鱼 🍵',
        '笑话：为什么程序员总是分不清圣诞节和万圣节？因为 OCT 31 == DEC 25！',
        '提示：写代码前先把需求拆成最小任务，效率指数提升 2 倍！',
    ],
    dizzy: [
        '咦？我的头在哪？',
        '世界在旋转…',
        '谁动了我的指针？',
        'Ω 数组越界了？',
        '笑话：有一天数组去看心理医生，医生说：你太零散了！',
        '提示：使用 map/reduce 能让代码更函数式，别忘了！',
    ],
    fire: [
        '🔥 燃烧我的卡路里！',
        '996 是福报！(确信)',
        '需求又改了，第 17 次…',
        'Bug 越修越多',
        '笑话：程序员的爱情观：先写单元测试，再谈恋爱。',
        '提示：CI/CD 自动化能省掉 80% 手动部署时间，快去开通吧！',
    ],
    sleep: [
        '💤 让我再睡 5 分钟…',
        '已经梦见周公了',
        '会议太催眠了',
        '产品说 "就改一点点"',
        '笑话：程序员的睡眠质量：只能在 debug 模式下入睡。',
        '提示：每工作 90 分钟休息 10 分钟，脑子更清晰。',
    ],
    bug: [
        '🐛 这里有个 Bug！',
        '真不是我写的',
        'git blame 一下',
        '是环境问题',
        '笑话：Bug 打不过 bug，只有 bug 能打败 bug。',
        '提示：写好单元测试，Bug 只能藏在你不写测试的地方。',
    ],
    coffee: [
        '☕ 咖啡因 +1',
        '已经是第 5 杯了',
        '美式不加糖，谢谢',
        '续命中…',
        '笑话：咖啡因和我一样，都是 24 小时在线的。',
        '提示：咖啡喝太多会焦虑，适量即可，提高专注度。',
    ],
    rocket: [
        '🚀 准备发布！',
        '上线！上线！',
        '别回滚别回滚…',
        '监控告警三连',
        '笑话：发布前的最后一次检查：代码还有没有隐藏的彩蛋？',
        '提示：灰度发布能降低全段宕机风险，先放到 5% 用户试水。',
    ],
    angry: [
        '(╯°□°)╯︵ ┻━┻',
        '需求又双叒叕改了',
        '产品你过来一下',
        '这个 Bug 我不修',
        '笑话：怒气值满了，自动切换到 “深夜模式”。',
        '提示：面对不可控需求，先写下最小可行方案，再沟通。',
    ],
};
const MARGIN = 20;
const PET_W = 140;
const PET_H = 150;
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function clamp(v, min, max) {
    if (v < min)
        return min;
    if (v > max)
        return max;
    return v;
}
export function SaltedFishPet({ onRecallRequested }) {
    const [pos, setPos] = useState(null); // null = anchored bottom-right
    const [mood, setMood] = useState('happy');
    const [speech, setSpeech] = useState(() => pick(SPEECH.happy));
    const [showBubble, setShowBubble] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [hunger, setHunger] = useState(60);
    const [hidden, setHidden] = useState(false);
    const [vw, setVw] = useState(0);
    const [vh, setVh] = useState(0);
    const dragRef = useRef(null);
    const dragMoved = useRef(false);
    const petRef = useRef(null);
    const recallBtnRef = useRef(null);
    const bubbleTimer = useRef(undefined);
    const idleTimer = useRef(undefined);
    // Position the recall button left of the Session log button (header utilities area).
    useEffect(() => {
        const updatePos = () => {
            const btn = recallBtnRef.current;
            if (!btn)
                return;
            const target = Array.from(document.querySelectorAll('button')).find(el => el.textContent?.includes('Session log'));
            if (!target) {
                btn.style.display = 'none';
                return;
            }
            btn.style.display = '';
            const rect = target.getBoundingClientRect();
            btn.style.top = `${rect.top + (rect.height - btn.offsetHeight) / 2}px`;
            btn.style.left = `${rect.left - btn.offsetWidth - 8}px`;
        };
        updatePos();
        const id = setInterval(updatePos, 1500);
        window.addEventListener('resize', updatePos);
        return () => {
            clearInterval(id);
            window.removeEventListener('resize', updatePos);
        };
    }, []);
    const react = (next = pick(Object.keys(MOODS))) => {
        setMood(next);
        setSpeech(pick(SPEECH[next]));
        setShowBubble(true);
        if (bubbleTimer.current !== undefined)
            window.clearTimeout(bubbleTimer.current);
        bubbleTimer.current = window.setTimeout(() => setShowBubble(false), 3000);
    };
    useEffect(() => {
        react('happy');
        const schedule = () => {
            idleTimer.current = window.setTimeout(() => {
                react();
                schedule();
            }, 8000 + Math.random() * 7000);
        };
        schedule();
        return () => {
            if (bubbleTimer.current !== undefined)
                window.clearTimeout(bubbleTimer.current);
            if (idleTimer.current !== undefined)
                window.clearTimeout(idleTimer.current);
        };
    }, []);
    useEffect(() => {
        const t = window.setInterval(() => {
            setHunger(h => Math.max(0, h - 1));
        }, 30000);
        return () => window.clearInterval(t);
    }, []);
    // Track viewport size so we can clamp position to visible bounds.
    useEffect(() => {
        const update = () => {
            setVw(window.innerWidth);
            setVh(window.innerHeight);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);
    // If the saved position is now off-screen (e.g. window resized), re-anchor.
    useEffect(() => {
        if (pos === null || vw === 0)
            return;
        const maxX = vw - PET_W - MARGIN;
        const maxY = vh - PET_H - MARGIN;
        if (pos.x > maxX || pos.y > maxY) {
            setPos({ x: clamp(pos.x, MARGIN, maxX), y: clamp(pos.y, MARGIN, maxY) });
        }
    }, [vw, vh, pos]);
    const onMouseDown = (e) => {
        setIsDragging(true);
        dragMoved.current = false;
        // Read actual DOM position so there's no jump on first drag frame.
        const rect = petRef.current?.getBoundingClientRect();
        const baseX = rect !== undefined ? rect.left : (pos?.x ?? vw - PET_W - MARGIN);
        const baseY = rect !== undefined ? rect.top : (pos?.y ?? vh - PET_H - MARGIN);
        dragRef.current = { startX: e.clientX, startY: e.clientY, baseX, baseY };
        // Immediately switch to explicit left/top to avoid the CSS right/bottom → left/top jump.
        setPos({ x: baseX, y: baseY });
        e.preventDefault();
    };
    useEffect(() => {
        if (!isDragging)
            return;
        const onMove = (e) => {
            const d = dragRef.current;
            if (!d)
                return;
            dragMoved.current = true;
            const maxX = vw - PET_W - MARGIN;
            const maxY = vh - PET_H - MARGIN;
            const nx = clamp(d.baseX + (e.clientX - d.startX), MARGIN, Math.max(MARGIN, maxX));
            const ny = clamp(d.baseY + (e.clientY - d.startY), MARGIN, Math.max(MARGIN, maxY));
            setPos({ x: nx, y: ny });
        };
        const onUp = () => setIsDragging(false);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [isDragging, vw, vh]);
    const onClick = (e) => {
        if (dragMoved.current) {
            // suppress click after a drag
            e.stopPropagation();
            dragMoved.current = false;
            return;
        }
        setHunger(h => Math.min(100, h + 25));
        react('happy');
    };
    const moodInfo = MOODS[mood];
    return (_jsxs(_Fragment, { children: [_jsx("button", { ref: recallBtnRef, className: css.recallInline, onClick: () => setHidden(h => !h), title: hidden ? '显示咸鱼' : '隐藏咸鱼', children: hidden ? '显示咸鱼' : '隐藏咸鱼' }), !hidden && (_jsx("div", { ref: petRef, className: `${css.pet} ${isDragging ? css.dragging : ''}`, style: pos === null
                    ? undefined
                    : { left: `${pos.x}px`, top: `${pos.y}px`, right: 'auto', bottom: 'auto' }, children: _jsxs("div", { className: css.fishAnchor, children: [showBubble && (_jsxs("div", { className: css.bubble, children: [_jsx("div", { className: css.bubbleMood, children: moodInfo.tag }), _jsx("div", { className: css.bubbleText, children: speech || '🐟 咸鱼发呆中…' })] })), _jsx("div", { className: css.hungerBar, title: `饱腹度 ${hunger}/100`, children: _jsx("div", { className: css.hungerFill, style: { width: `${hunger}%` } }) }), _jsxs("div", { className: `${css.fishWrap} ${showBubble ? css.active : ''}`, onMouseDown: onMouseDown, onClick: onClick, role: "button", tabIndex: 0, title: "\u70B9\u6211\u5582\u98DF / \u62D6\u6211\u79FB\u52A8", children: [_jsx("span", { className: css.fish, children: moodInfo.emoji }), _jsx("span", { className: css.shadow })] })] }) }))] }));
}
//# sourceMappingURL=SaltedFishPet.js.map