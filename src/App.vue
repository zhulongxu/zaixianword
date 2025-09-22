<template>
    <div id="app">
        <div class="tabs">

            <div class="tabs-inner">
                    <img class="logo-img" src="/favicon.svg" title="ZaixianWord" />
                <div class="tabs-right">
                    <div
                         v-for="tab in tabs"
                         :key="tab.name"
                         :class="['tab', { active: tab.name === activeTab }]"
                         @click="changeTab(tab)"
                         :title="lang === 'zh' ? tab.label : tab.label_en">
                        <span class="tab-icon" v-html="lang === 'zh' ? tab.icon : tab.icon_en"></span>
                        <span class="tab-label">{{ lang === 'zh' ? tab.label : tab.label_en }}</span>
                    </div>

                    <!-- 中英文切换 -->
                    <div class="lang-toggle" role="region" aria-label="language toggle">
                        <button
                                class="theme-toggle"
                                :aria-pressed="isDark"
                                :title="isDark ? (lang === 'zh' ? '切换到浅色' : 'Switch to light') : (lang === 'zh' ? '切换到深色' : 'Switch to dark')"
                                @click="toggleTheme">
                            <span class="theme-icon" aria-hidden="true">
                                <svg v-if="!isDark" viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">

                                    <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />

                                    <circle cx="12" cy="12" r="4" fill="currentColor" />

                                </svg>
                                <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">

                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />

                                </svg>
                            </span>
                        </button>

                        <button
                                class="lang-btn"
                                @click="changeLang"
                                :title="lang === 'zh' ? '切换到英文' : 'Switch to Chinese'">
                            <span class="lang-icon" v-html="lang === 'zh' ? '🇨🇳' : '🇺🇸'"></span>
                            <span class="lang-text">{{ lang === 'zh' ? '切换到英文' : 'Switch to Chinese' }}</span>
                        </button>
                    </div>
                </div>
            </div>


        </div>
        <div class="tab-content">
            <Tinymce v-model="content" :height="1200" v-if="activeTab === 'rich'" />
            <div v-else-if="activeTab === 'markdown'" class="markdown-box">
                <MarkdownEditor />
            </div>
            <div v-else-if="activeTab === 'ocr'" class="ocr-box">
                <h2>{{ lang === 'zh' ? 'OCR识别' : 'OCR Recognition' }}</h2>
            </div>
        </div>
        <AppFooter />
    </div>
</template>

<script>
import Tinymce from './components/Tinymce/index.vue'
import MarkdownEditor from './components/MarkDown.vue'
import AppFooter from './components/footer/index.vue'
/**
 * 开发任务
 * 1. OCR 识别功能
 * 2. 支持本地保存和加载
 * 3. 支持多种导出格式（PDF、Word、HTML等）
 * 4. 支持主题切换（浅色、深色模式）
 * 5. 支持更多语言（法语、德语、西班牙语等  【语言切换还有问题】
 * 
 */

export default {
    name: 'App',
    components: { Tinymce, MarkdownEditor, AppFooter },
    data() {
        return {
            lang: 'zh',
            activeTab: 'rich',
            isDark: localStorage.getItem('zaixian_theme') === 'dark',
            tabs: [
                {
                    name: 'rich',
                    label: '富文本编辑器',
                    label_en: 'Rich Text Editor',
                    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 4h14v2H5zM5 8h9v2H5zM5 12h14v6H5z"/></svg>`,
                    icon_en: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 4h14v2H5zM5 8h9v2H5zM5 12h14v6H5z"/></svg>`
                },
                {
                    name: 'markdown',
                    label: 'Markdown编辑器',
                    label_en: 'Markdown Editor',
                    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 4v16h14V4H5zm2 4h2l2 4 2-4h2v8h-2v-4l-2 4-2-4v4H7V8z"/></svg>`,
                    icon_en: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 4v16h14V4H5zm2 4h2l2 4 2-4h2v8h-2v-4l-2 4-2-4v4H7V8z"/></svg>`
                },
            ],
            content: localStorage.getItem('editorContent') || `
            <div style="margin: 0; padding: 140px; font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;">

        <!-- 头部 -->
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px; color: #2c3e50;">离职证明</h1>
        </div>

        <!-- 正文 -->
        <div style="line-height: 1.8; font-size: 16px; text-align: justify;">
            <p>兹证明 <strong style="color: #667eea;">张三</strong>（身份证号：110101199001011234）自 <strong style="color: #667eea;">2019年7月1日</strong> 起在我公司 <strong style="color: #667eea;">XX科技有限公司</strong> 任职，担任 <strong style="color: #667eea;">前端开发工程师</strong> 岗位。</p>
            <p>因个人职业发展规划，已于 <strong style="color: #667eea;">2024年6月30日</strong> 正式办理完离职手续，与我公司解除劳动关系。在职期间表现良好，无不良记录，并完成所有工作交接。</p>
            <p>特此证明。</p>
        </div>

        <!-- 落款 -->
        <div style="margin-top: 60px; text-align: right;">
            <div style="font-size: 16px; font-weight: 600;">XX科技有限公司</div>
            <div style="font-size: 14px; color: #666; margin-top: 8px;">2024年7月5日</div>
        </div>

        <!-- 印章区域 -->
        <div style="margin-top: 40px; text-align: right;">
            <div style="display: inline-block; width: 100px; height: 100px; border: 3px solid #e74c3c; border-radius: 50%; text-align: center; line-height: 100px; font-size: 14px; color: #e74c3c; letter-spacing: 1px; user-select: none;">电子印章</div>
        </div>

        <!-- 底部提示 -->
        <div style="margin-top: 60px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
            本证明一式两份，员工与公司各执一份，具有同等法律效力。
        </div>
</div>
`
        };
    },
    created() {
        let lang = (navigator.language || navigator.userLanguage).toLowerCase()
        this.applyTheme(this.isDark)
        // 查看用户 IP 地址
        // fetch('https://api.ipify.org?format=json')
        //     .then(response => response.json())
        //     .then(data => {
        //         // 判断 IP 归属地
        //         fetch(`https://ipapi.co/${data.ip}/json/`)
        //             .then(response => response.json())
        //             .then(locationData => {
        //                 console.log('User Location:', locationData);
        //             })
        //             .catch(error => {
        //                 console.error('Error fetching location data:', error);
        //             });
        //         console.log('User IP Address:', data.ip);
        //     })
        //     .catch(error => {
        //         console.error('Error fetching IP address:', error);
        //     });
    },
    methods: {
        changeTab(tab) {
            if (tab.name === 'markdown') {
                // 切换到 markdown 编辑器时，滚动到顶部
                setTimeout(() => {
                    window.scrollTo(0, 0);
                },0)
            }
            this.activeTab = tab.name
        },
        changeLang() {
            // 根据 浏览器语言 动态设置 title 标题
            if (this.lang === 'zh-cn' || this.lang === 'zh') {
                document.title = 'ZaixianWord — Online Rich Text and Markdown Editor'
            } else {
                document.title = 'ZaixianWord — 在线富文本与 Markdown 编辑器'
            }
            this.lang = this.lang === 'zh' ? 'en' : 'zh';
        },
        toggleTheme() {
            this.isDark = !this.isDark
            localStorage.setItem('zaixian_theme', this.isDark ? 'dark' : 'light')
            this.applyTheme(this.isDark)
        },
        applyTheme(dark) {
            const root = document.documentElement
            if (dark) {
                root.setAttribute('data-theme', 'dark')
            } else {
                root.setAttribute('data-theme', 'light')
            }
        }
    }
};
</script>

<style scoped>
#app {
    min-height: 70vh;
    background: #f7f8fa;
}

.logo-img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(30/1920 * 100vw);
    height: calc(30/1920 * 100vw);
    margin-left: 2vw;
    background: transparent;
    border-radius: 8px;
    -webkit-tap-highlight-color: transparent;
}

/* tab */
.tabs {
    /* display: flex;
    justify-content: center; */
    background: var(--bg-color);
    border-bottom: 1px solid #cdcdcd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    gap: 12px;
    padding: 10px 16px;
}


/* tab item */
.tab {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 18px;
    border-radius: 10px;
    cursor: pointer;
    color: var(--text-color);
    font-weight: 500;
    transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease, color 180ms ease;
    border-bottom: 2px solid transparent;
    user-select: none;
}

.tabs-inner {
    width: 45vw;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
}

/* small neumorphism-like hover */
.tab:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 18px rgba(64, 158, 255, 0.12);
    color: #2f80ed;
    background: linear-gradient(180deg, rgba(47, 128, 237, 0.06), rgba(255, 255, 255, 0.02));
}

/* active tab style */
.tab.active {
    color: #0b68d8;
    background: linear-gradient(180deg, #f0f7ff, #ffffff);
    box-shadow: 0 6px 18px rgba(11, 104, 216, 0.12);
    border-bottom: 3px solid #0b68d8;
}

/* icon */
.tab-icon {
    display: inline-flex;
    width: 18px;
    height: 18px;
    color: inherit;
    /* use current color for svg */
}

.tab-icon svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    opacity: 0.95;
    transition: transform 180ms ease;
}

/* subtle icon pop on hover/active */
.tab:hover .tab-icon svg,
.tab.active .tab-icon svg {
    transform: scale(1.06);
}

/* label */
.tab-label {
    white-space: nowrap;
    font-size: 14px;
}

/* responsive: wrap tabs on small screens */
@media (max-width: 720px) {
    .tabs {
        flex-wrap: wrap;
        gap: 8px;
        padding: 8px;
    }

    .tab {
        padding: 8px 12px;
        font-size: 13px;
    }
}

.markdown-box,
.json-box {
    text-align: center;
    color: #888;
}

.tabs-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.lang-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-left: 2vw;
    
}

.lang-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 999px;
    background: linear-gradient(135deg, #2a5699 0%, #4879d9 100%);
    color: #fff;
    border: none;
    box-shadow: 0 6px 20px rgba(15, 123, 255, 0.18);
    cursor: pointer;
    transition: transform .18s ease, box-shadow .18s ease, opacity .12s ease;
    font-weight: 600;
    font-size: 14px;
    backdrop-filter: blur(4px);
}

.lang-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(15, 123, 255, 0.22);
    opacity: 0.98;
}

.lang-btn:active {
    transform: translateY(-2px) scale(0.995);
}

.lang-icon {
    display: inline-flex;
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.14);
    font-size: 12px;
    line-height: 1;
}

/* hide text on very small screens to save space */
@media (max-width: 420px) {
    .lang-text {
        display: none;
    }

    .lang-btn {
        padding: 9px 10px;
        gap: 6px;
    }
}

/* 主题切换 */
.theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 32px;
    margin-right: 12px;
    border-radius: 20px;
    border: 1px solid rgba(11, 104, 216, 0.12);
    background: linear-gradient(180deg, #ffffff, #f3f7ff);
    color: #0b0b0b;
    cursor: pointer;
    transition: background .18s ease, transform .12s ease, box-shadow .18s ease, color .18s ease;
    padding: 4px;
}

.theme-toggle:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(11, 104, 216, 0.10);
}

.theme-toggle .theme-icon svg {
    display: block;
    color: #0b68d8;
}

/* 当为暗色主题时，切换按钮变为深色底 + 白色图标 */
[data-theme="dark"] .theme-toggle {
    background: linear-gradient(180deg, #2b2b2b, #151515);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.06);
}

[data-theme="dark"] .theme-toggle .theme-icon svg {
    color: #ffd66b;
}

/* 微交互：切换时图标平滑切换 */
.theme-toggle .theme-icon svg {
    transition: opacity .18s ease, transform .2s ease;
}

.theme-toggle .theme-icon svg[v-cloak] {
    opacity: 0;
}

/* 可访问性 focus */
.theme-toggle:focus-visible {
    outline: 3px solid rgba(11, 104, 216, 0.14);
    outline-offset: 2px;
}

/* 如果希望页面其他元素根据 data-theme 变色，可在全局样式继续扩展，例如： */
:root[data-theme='dark'] {
    --bg: #0f1720;
    --text: #e6eef8;
}

/* 注意：documentElement 上设置 data-theme（applyTheme 方法）用于全站样式控制 */
</style>