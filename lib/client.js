window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-salted-fish-pet",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		react = __toESM(react, 1);
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region \0dsh-css:/Users/tboss/Documents/dsh/deepseek-harness/packages/client/ui-salted-fish-pet/src/client/SaltedFishPet.module.css.mjs
		const css$1 = "._3pwEOq_recallInline{z-index:10000;color:#111827;cursor:pointer;background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:4px 10px;font-family:inherit;font-size:12px;position:fixed;box-shadow:0 2px 6px #0000001a}._3pwEOq_recallInline:hover{color:#fff;background:#3964fe}._3pwEOq_pet{z-index:9999;pointer-events:auto;user-select:none;cursor:grab;flex-direction:column;align-items:flex-end;gap:8px;transition:right 50ms linear,bottom 50ms linear;display:flex;position:fixed;bottom:20px;right:20px}._3pwEOq_pet._3pwEOq_dragging{cursor:grabbing;transition:none}._3pwEOq_fishAnchor{flex-direction:column;justify-content:flex-end;align-items:flex-end;width:140px;height:150px;display:flex;position:relative}._3pwEOq_bubble{color:#111827;z-index:10;background:#fff;border:1px solid #e5e7eb;border-radius:12px;max-width:200px;padding:8px 12px;animation:.3s ease-out _3pwEOq_bubbleIn;position:absolute;bottom:calc(100% + 8px);right:0;box-shadow:0 4px 16px #0000001f}._3pwEOq_bubbleMood{color:#3964fe;margin-bottom:2px;font-size:10px;font-weight:600;line-height:14px}._3pwEOq_bubbleText{white-space:pre-wrap;font-size:12px;line-height:1.4}._3pwEOq_hungerBar{background:var(--dsw-alias-border-l2,#e5e7eb);border-radius:3px;width:60px;height:6px;overflow:hidden}._3pwEOq_hungerFill{background:linear-gradient(90deg,#f59e0b,#22c55e);border-radius:3px;height:100%;transition:width .3s}._3pwEOq_fishWrap{cursor:pointer;transition:transform .15s;position:relative}._3pwEOq_fishWrap:hover{transform:rotate(-12deg)scale(1.08)}._3pwEOq_fishWrap._3pwEOq_active{animation:.4s _3pwEOq_bounce}._3pwEOq_fish{filter:drop-shadow(0 4px 8px #0003);font-size:120px;line-height:1;animation:3s ease-in-out infinite _3pwEOq_float;display:block}._3pwEOq_shadow{background:#00000014;border-radius:50%;width:60px;height:10px;animation:3s ease-in-out infinite _3pwEOq_shadowPulse;position:absolute;bottom:-8px;left:50%;transform:translate(-50%)}@keyframes _3pwEOq_bubbleIn{0%{opacity:0;transform:translate(8px)scale(.9)}to{opacity:1;transform:translate(0)scale(1)}}@keyframes _3pwEOq_float{0%,to{transform:translateY(0)rotate(0)}25%{transform:translateY(-10px)rotate(4deg)}50%{transform:translateY(0)rotate(0)}75%{transform:translateY(-5px)rotate(-3deg)}}@keyframes _3pwEOq_bounce{0%{transform:scale(1)}30%{transform:scale(1.15)rotate(-8deg)}50%{transform:scale(.92)rotate(4deg)}70%{transform:scale(1.05)}to{transform:scale(1)}}@keyframes _3pwEOq_shadowPulse{0%,to{opacity:.08;transform:translate(-50%)scale(1)}50%{opacity:.04;transform:translate(-50%)scale(.7)}}._3pwEOq_recall{z-index:10000;background:var(--dsw-alias-bg-elevated,#fff);border:1px solid var(--dsw-alias-border-l2,#e5e7eb);color:var(--dsw-alias-label-primary,#111827);cursor:pointer;border-radius:8px;padding:6px 12px;font-family:inherit;font-size:12px;animation:.3s ease-out _3pwEOq_bubbleIn;position:fixed;top:20px;right:20px;box-shadow:0 2px 8px #0000001a}._3pwEOq_recall:hover{background:var(--dsw-alias-brand-primary,#3964fe);color:#fff}._3pwEOq_bgOverlay{z-index:-1;pointer-events:none;background:radial-gradient(ellipse 80% 60% at 20% 20%, var(--dsw-alias-brand-primary,#3964fe) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, var(--dsw-alias-brand-secondary,#0ea5e9) 0%, transparent 55%), var(--dsw-alias-bg-base,#f9fafb);opacity:.06;position:fixed;inset:0}";
		const tagId$1 = "@deepseek-ai/dsh-client-ui-salted-fish-pet/SaltedFishPet.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-salted-fish-pet";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var SaltedFishPet_module_css_default = {
			"fishAnchor": "_3pwEOq_fishAnchor",
			"bounce": "_3pwEOq_bounce",
			"recallInline": "_3pwEOq_recallInline",
			"shadowPulse": "_3pwEOq_shadowPulse",
			"fish": "_3pwEOq_fish",
			"shadow": "_3pwEOq_shadow",
			"bubbleText": "_3pwEOq_bubbleText",
			"bubble": "_3pwEOq_bubble",
			"pet": "_3pwEOq_pet",
			"active": "_3pwEOq_active",
			"bgOverlay": "_3pwEOq_bgOverlay",
			"bubbleIn": "_3pwEOq_bubbleIn",
			"hungerFill": "_3pwEOq_hungerFill",
			"float": "_3pwEOq_float",
			"hungerBar": "_3pwEOq_hungerBar",
			"dragging": "_3pwEOq_dragging",
			"bubbleMood": "_3pwEOq_bubbleMood",
			"recall": "_3pwEOq_recall",
			"fishWrap": "_3pwEOq_fishWrap"
		};
		//#endregion
		//#region src/client/SaltedFishPet.tsx
		/**
		* Salted fish pet overlay — a floating "QQ pet"-style mascot for the web UI.
		* Pure presentational; no framework hooks, no plugin context.
		* Interactivity: drag to move (clamped to viewport), click to react (random mood +
		* speech + feed), hover to wiggle, idle timer to drift to random thoughts.
		*/
		const MOODS = {
			happy: {
				emoji: "🐟",
				tag: "开心"
			},
			dizzy: {
				emoji: "🐡",
				tag: "晕乎乎"
			},
			fire: {
				emoji: "🔥",
				tag: "燃烧"
			},
			sleep: {
				emoji: "😴",
				tag: "睡着"
			},
			bug: {
				emoji: "🐛",
				tag: "有 Bug"
			},
			coffee: {
				emoji: "☕",
				tag: "续命"
			},
			rocket: {
				emoji: "🚀",
				tag: "起飞"
			},
			angry: {
				emoji: "😡",
				tag: "摔桌"
			}
		};
		const SPEECH = {
			happy: [
				"主人今天真帅！",
				"咸鱼也有梦想！",
				"代码一气呵成 ✨",
				"今天适合摸鱼 🍵",
				"笑话：为什么程序员总是分不清圣诞节和万圣节？因为 OCT 31 == DEC 25！",
				"提示：写代码前先把需求拆成最小任务，效率指数提升 2 倍！"
			],
			dizzy: [
				"咦？我的头在哪？",
				"世界在旋转…",
				"谁动了我的指针？",
				"Ω 数组越界了？",
				"笑话：有一天数组去看心理医生，医生说：你太零散了！",
				"提示：使用 map/reduce 能让代码更函数式，别忘了！"
			],
			fire: [
				"🔥 燃烧我的卡路里！",
				"996 是福报！(确信)",
				"需求又改了，第 17 次…",
				"Bug 越修越多",
				"笑话：程序员的爱情观：先写单元测试，再谈恋爱。",
				"提示：CI/CD 自动化能省掉 80% 手动部署时间，快去开通吧！"
			],
			sleep: [
				"💤 让我再睡 5 分钟…",
				"已经梦见周公了",
				"会议太催眠了",
				"产品说 \"就改一点点\"",
				"笑话：程序员的睡眠质量：只能在 debug 模式下入睡。",
				"提示：每工作 90 分钟休息 10 分钟，脑子更清晰。"
			],
			bug: [
				"🐛 这里有个 Bug！",
				"真不是我写的",
				"git blame 一下",
				"是环境问题",
				"笑话：Bug 打不过 bug，只有 bug 能打败 bug。",
				"提示：写好单元测试，Bug 只能藏在你不写测试的地方。"
			],
			coffee: [
				"☕ 咖啡因 +1",
				"已经是第 5 杯了",
				"美式不加糖，谢谢",
				"续命中…",
				"笑话：咖啡因和我一样，都是 24 小时在线的。",
				"提示：咖啡喝太多会焦虑，适量即可，提高专注度。"
			],
			rocket: [
				"🚀 准备发布！",
				"上线！上线！",
				"别回滚别回滚…",
				"监控告警三连",
				"笑话：发布前的最后一次检查：代码还有没有隐藏的彩蛋？",
				"提示：灰度发布能降低全段宕机风险，先放到 5% 用户试水。"
			],
			angry: [
				"(╯°□°)╯︵ ┻━┻",
				"需求又双叒叕改了",
				"产品你过来一下",
				"这个 Bug 我不修",
				"笑话：怒气值满了，自动切换到 “深夜模式”。",
				"提示：面对不可控需求，先写下最小可行方案，再沟通。"
			]
		};
		const MARGIN = 20;
		const PET_W = 140;
		const PET_H = 150;
		function pick(arr) {
			return arr[Math.floor(Math.random() * arr.length)];
		}
		function clamp(v, min, max) {
			if (v < min) return min;
			if (v > max) return max;
			return v;
		}
		function SaltedFishPet({ onRecallRequested }) {
			const [pos, setPos] = (0, react.useState)(null);
			const [mood, setMood] = (0, react.useState)("happy");
			const [speech, setSpeech] = (0, react.useState)(() => pick(SPEECH.happy));
			const [showBubble, setShowBubble] = (0, react.useState)(false);
			const [isDragging, setIsDragging] = (0, react.useState)(false);
			const [hunger, setHunger] = (0, react.useState)(60);
			const [hidden, setHidden] = (0, react.useState)(false);
			const [vw, setVw] = (0, react.useState)(0);
			const [vh, setVh] = (0, react.useState)(0);
			const dragRef = (0, react.useRef)(null);
			const dragMoved = (0, react.useRef)(false);
			const petRef = (0, react.useRef)(null);
			const recallBtnRef = (0, react.useRef)(null);
			const bubbleTimer = (0, react.useRef)(void 0);
			const idleTimer = (0, react.useRef)(void 0);
			(0, react.useEffect)(() => {
				const updatePos = () => {
					const btn = recallBtnRef.current;
					if (!btn) return;
					const target = Array.from(document.querySelectorAll("button")).find((el) => el.textContent?.includes("Session log"));
					if (!target) {
						btn.style.display = "none";
						return;
					}
					btn.style.display = "";
					const rect = target.getBoundingClientRect();
					btn.style.top = `${rect.top + (rect.height - btn.offsetHeight) / 2}px`;
					btn.style.left = `${rect.left - btn.offsetWidth - 8}px`;
				};
				updatePos();
				const id = setInterval(updatePos, 1500);
				window.addEventListener("resize", updatePos);
				return () => {
					clearInterval(id);
					window.removeEventListener("resize", updatePos);
				};
			}, []);
			const react$1 = (next = pick(Object.keys(MOODS))) => {
				setMood(next);
				setSpeech(pick(SPEECH[next]));
				setShowBubble(true);
				if (bubbleTimer.current !== void 0) window.clearTimeout(bubbleTimer.current);
				bubbleTimer.current = window.setTimeout(() => setShowBubble(false), 3e3);
			};
			(0, react.useEffect)(() => {
				react$1("happy");
				const schedule = () => {
					idleTimer.current = window.setTimeout(() => {
						react$1();
						schedule();
					}, 8e3 + Math.random() * 7e3);
				};
				schedule();
				return () => {
					if (bubbleTimer.current !== void 0) window.clearTimeout(bubbleTimer.current);
					if (idleTimer.current !== void 0) window.clearTimeout(idleTimer.current);
				};
			}, []);
			(0, react.useEffect)(() => {
				const t = window.setInterval(() => {
					setHunger((h) => Math.max(0, h - 1));
				}, 3e4);
				return () => window.clearInterval(t);
			}, []);
			(0, react.useEffect)(() => {
				const update = () => {
					setVw(window.innerWidth);
					setVh(window.innerHeight);
				};
				update();
				window.addEventListener("resize", update);
				return () => window.removeEventListener("resize", update);
			}, []);
			(0, react.useEffect)(() => {
				if (pos === null || vw === 0) return;
				const maxX = vw - PET_W - MARGIN;
				const maxY = vh - PET_H - MARGIN;
				if (pos.x > maxX || pos.y > maxY) setPos({
					x: clamp(pos.x, MARGIN, maxX),
					y: clamp(pos.y, MARGIN, maxY)
				});
			}, [
				vw,
				vh,
				pos
			]);
			const onMouseDown = (e) => {
				setIsDragging(true);
				dragMoved.current = false;
				const rect = petRef.current?.getBoundingClientRect();
				const baseX = rect !== void 0 ? rect.left : pos?.x ?? vw - PET_W - MARGIN;
				const baseY = rect !== void 0 ? rect.top : pos?.y ?? vh - PET_H - MARGIN;
				dragRef.current = {
					startX: e.clientX,
					startY: e.clientY,
					baseX,
					baseY
				};
				setPos({
					x: baseX,
					y: baseY
				});
				e.preventDefault();
			};
			(0, react.useEffect)(() => {
				if (!isDragging) return;
				const onMove = (e) => {
					const d = dragRef.current;
					if (!d) return;
					dragMoved.current = true;
					const maxX = vw - PET_W - MARGIN;
					const maxY = vh - PET_H - MARGIN;
					setPos({
						x: clamp(d.baseX + (e.clientX - d.startX), MARGIN, Math.max(MARGIN, maxX)),
						y: clamp(d.baseY + (e.clientY - d.startY), MARGIN, Math.max(MARGIN, maxY))
					});
				};
				const onUp = () => setIsDragging(false);
				window.addEventListener("mousemove", onMove);
				window.addEventListener("mouseup", onUp);
				return () => {
					window.removeEventListener("mousemove", onMove);
					window.removeEventListener("mouseup", onUp);
				};
			}, [
				isDragging,
				vw,
				vh
			]);
			const onClick = (e) => {
				if (dragMoved.current) {
					e.stopPropagation();
					dragMoved.current = false;
					return;
				}
				setHunger((h) => Math.min(100, h + 25));
				react$1("happy");
			};
			const moodInfo = MOODS[mood];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				ref: recallBtnRef,
				className: SaltedFishPet_module_css_default.recallInline,
				onClick: () => setHidden((h) => !h),
				title: hidden ? "显示咸鱼" : "隐藏咸鱼",
				children: hidden ? "显示咸鱼" : "隐藏咸鱼"
			}), !hidden && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				ref: petRef,
				className: `${SaltedFishPet_module_css_default.pet} ${isDragging ? SaltedFishPet_module_css_default.dragging : ""}`,
				style: pos === null ? void 0 : {
					left: `${pos.x}px`,
					top: `${pos.y}px`,
					right: "auto",
					bottom: "auto"
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: SaltedFishPet_module_css_default.fishAnchor,
					children: [
						showBubble && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: SaltedFishPet_module_css_default.bubble,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: SaltedFishPet_module_css_default.bubbleMood,
								children: moodInfo.tag
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: SaltedFishPet_module_css_default.bubbleText,
								children: speech || "🐟 咸鱼发呆中…"
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: SaltedFishPet_module_css_default.hungerBar,
							title: `饱腹度 ${hunger}/100`,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: SaltedFishPet_module_css_default.hungerFill,
								style: { width: `${hunger}%` }
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: `${SaltedFishPet_module_css_default.fishWrap} ${showBubble ? SaltedFishPet_module_css_default.active : ""}`,
							onMouseDown,
							onClick,
							role: "button",
							tabIndex: 0,
							title: "点我喂食 / 拖我移动",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: SaltedFishPet_module_css_default.fish,
								children: moodInfo.emoji
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: SaltedFishPet_module_css_default.shadow })]
						})
					]
				})
			})] });
		}
		//#endregion
		//#region \0dsh-css:/Users/tboss/Documents/dsh/deepseek-harness/packages/client/ui-salted-fish-pet/src/client/Background.module.css.mjs
		const css = ".n9DvrG_background{z-index:-2;pointer-events:auto;background:radial-gradient(80% 60% at 20% 20%,#3964fe0f,#0000 60%),radial-gradient(60% 50% at 80% 80%,#0ea5e90d,#0000 55%),radial-gradient(100% 100%,#0f172a66,#0f172a 80%),#0f172a;position:fixed;inset:0;overflow:hidden}.n9DvrG_light{pointer-events:none;will-change:background;transition:background .15s ease-out;position:absolute;inset:0}.n9DvrG_grid{pointer-events:none;background-image:linear-gradient(#3964fe05 1px,#0000 1px),linear-gradient(90deg,#3964fe05 1px,#0000 1px);background-size:60px 60px;animation:20s linear infinite n9DvrG_gridMove;position:absolute;inset:0}@keyframes n9DvrG_gridMove{0%{background-position:0 0}to{background-position:60px 60px}}.n9DvrG_scanline{pointer-events:none;background:linear-gradient(90deg,#0000,#3964fe0f,#0000);height:2px;animation:8s ease-in-out infinite n9DvrG_scanMove;position:absolute;left:0;right:0}@keyframes n9DvrG_scanMove{0%,to{opacity:0;top:0%}5%{opacity:1}45%{opacity:1;top:95%}50%{opacity:0}}.n9DvrG_symbolLayer{pointer-events:none;color:#3964fee6;text-shadow:0 0 8px #3964fe66;user-select:none;font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;position:absolute;inset:0}.n9DvrG_symbol{will-change:transform;transition:transform .1s linear;position:absolute}.n9DvrG_rippleLayer{pointer-events:none;position:absolute;inset:0}.n9DvrG_ripple{will-change:transform, opacity;background:0 0;border:2px solid #3964fe80;border-radius:50%;animation:1.5s ease-out forwards n9DvrG_rippleExpand;position:absolute}@keyframes n9DvrG_rippleExpand{0%{opacity:.6;transform:scale(0)}to{opacity:0;transform:scale(2)}}.n9DvrG_cornerTL,.n9DvrG_cornerBR{pointer-events:none;opacity:.5;border-style:solid;border-color:#3964fe26;width:60px;height:60px;position:absolute}.n9DvrG_cornerTL{border-width:2px 2px 0 0;border-radius:8px 0 0;top:30px;left:30px}.n9DvrG_cornerBR{border-width:0 0 2px 2px;border-radius:0 0 0 8px;bottom:30px;right:30px}@media (prefers-reduced-motion:reduce){.n9DvrG_grid,.n9DvrG_scanline,.n9DvrG_symbol,.n9DvrG_ripple{transition:none!important;animation:none!important}}";
		const tagId = "@deepseek-ai/dsh-client-ui-salted-fish-pet/Background.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-salted-fish-pet";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var Background_module_css_default = {
			"scanline": "n9DvrG_scanline",
			"cornerTL": "n9DvrG_cornerTL",
			"ripple": "n9DvrG_ripple",
			"gridMove": "n9DvrG_gridMove",
			"rippleExpand": "n9DvrG_rippleExpand",
			"background": "n9DvrG_background",
			"symbolLayer": "n9DvrG_symbolLayer",
			"symbol": "n9DvrG_symbol",
			"grid": "n9DvrG_grid",
			"light": "n9DvrG_light",
			"cornerBR": "n9DvrG_cornerBR",
			"scanMove": "n9DvrG_scanMove",
			"rippleLayer": "n9DvrG_rippleLayer"
		};
		//#endregion
		//#region src/client/Background.tsx
		/**
		* Interactive "senior full-stack engineer" background overlay.
		* Renders a fixed full-viewport layer with:
		* - Mouse-following radial light gradient
		* - Click ripple particles
		* - Floating code symbols that drift
		* - Subtle grid + scan-line texture
		* - Glass-morphism depth layers
		*
		* Pure presentational; all interactivity via pointer events and timers.
		*/
		const CODE_SYMBOLS = [
			"{ }",
			"< />",
			"[ ]",
			"=>",
			"::",
			"&&",
			"||",
			"//",
			";;",
			"$",
			"@",
			"#",
			"fn()",
			"let",
			"pub",
			"mod",
			"impl",
			"async",
			"await",
			"return",
			"import",
			"export",
			"class",
			"type",
			"enum",
			"match",
			"select",
			"from",
			"where",
			"join",
			"null",
			"void",
			"true",
			"false",
			"i32",
			"f64",
			"bool",
			"str",
			"map",
			"set",
			"vec",
			"opt",
			"res",
			"ok",
			"err"
		];
		let nextId = 0;
		function createSymbol() {
			const vw = window.innerWidth;
			const vh = window.innerHeight;
			return {
				id: nextId++,
				symbol: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
				x: Math.random() * vw,
				y: Math.random() * vh,
				size: 12 + Math.random() * 16,
				opacity: .04 + Math.random() * .08,
				drift: (Math.random() - .5) * .3,
				speed: .2 + Math.random() * .4
			};
		}
		function EngineerBackground() {
			const [mouse, setMouse] = (0, react.useState)({
				x: .5,
				y: .5
			});
			const [ripples, setRipples] = (0, react.useState)([]);
			const [symbols, setSymbols] = (0, react.useState)(() => Array.from({ length: 30 }, createSymbol));
			const frameRef = (0, react.useRef)(void 0);
			const rippleTimer = (0, react.useRef)(void 0);
			const onMouseMove = (0, react.useCallback)((e) => {
				setMouse({
					x: e.clientX / window.innerWidth,
					y: e.clientY / window.innerHeight
				});
			}, []);
			const onClick = (0, react.useCallback)((e) => {
				setRipples((prev) => [...prev.slice(-4), {
					id: nextId++,
					x: e.clientX,
					y: e.clientY,
					size: 0,
					opacity: .5
				}]);
			}, []);
			(0, react.useEffect)(() => {
				const tick = () => {
					setSymbols((prev) => prev.map((s) => {
						let y = s.y - s.speed;
						let x = s.x + s.drift;
						if (y < -40) y = window.innerHeight + 40;
						if (x < -40) x = window.innerWidth + 40;
						if (x > window.innerWidth + 40) x = -40;
						return {
							...s,
							x,
							y
						};
					}));
					frameRef.current = requestAnimationFrame(tick);
				};
				frameRef.current = requestAnimationFrame(tick);
				return () => {
					if (frameRef.current !== void 0) cancelAnimationFrame(frameRef.current);
				};
			}, []);
			(0, react.useEffect)(() => {
				rippleTimer.current = window.setInterval(() => {
					setRipples((prev) => prev.map((r) => ({
						...r,
						size: r.size + 30,
						opacity: r.opacity - .02
					})).filter((r) => r.opacity > 0));
				}, 50);
				return () => {
					if (rippleTimer.current !== void 0) clearInterval(rippleTimer.current);
				};
			}, []);
			const lightX = mouse.x * 100;
			const lightY = mouse.y * 100;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: Background_module_css_default.background,
				onMouseMove,
				onClick,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: Background_module_css_default.light,
						style: { background: `radial-gradient(ellipse 600px 600px at ${lightX}% ${lightY}%, rgba(57,100,254,0.08), transparent 70%)` }
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: Background_module_css_default.grid }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: Background_module_css_default.scanline }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: Background_module_css_default.symbolLayer,
						children: symbols.map((s) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: Background_module_css_default.symbol,
							style: {
								left: s.x,
								top: s.y,
								fontSize: s.size,
								opacity: s.opacity
							},
							children: s.symbol
						}, s.id))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: Background_module_css_default.rippleLayer,
						children: ripples.map((r) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: Background_module_css_default.ripple,
							style: {
								left: r.x,
								top: r.y,
								width: r.size,
								height: r.size,
								opacity: r.opacity,
								marginLeft: -r.size / 2,
								marginTop: -r.size / 2
							}
						}, r.id))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: Background_module_css_default.cornerTL }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: Background_module_css_default.cornerBR })
				]
			});
		}
		//#endregion
		//#region src/client/index.ts
		const name = "@deepseek-ai/dsh-client-ui-salted-fish-pet";
		/** Required service: the slot registry (cordis fiber inject). */
		const inject = ["slots"];
		function apply(ctx) {
			ctx.inject(["slots"], (scope) => {
				const disposeBg = scope.slots.inject("shell.overlay", () => scope.slots.register({
					name: "shell.overlay",
					id: "engineerBackground"
				}, EngineerBackground));
				const disposePet = scope.slots.inject("shell.overlay", () => scope.slots.register({
					name: "shell.overlay",
					id: "saltedFish"
				}, SaltedFishPet));
				return () => {
					disposeBg();
					disposePet();
				};
			});
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		exports.name = name;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map