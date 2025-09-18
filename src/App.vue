<template>
    <div id="app">
        <div class="tabs">
            <div
                 v-for="tab in tabs"
                 :key="tab.name"
                 :class="['tab', { active: tab.name === activeTab }]"
                 @click="activeTab = tab.name"
                 :title="lang === 'zh' ? tab.label : tab.label_en">
                <span class="tab-icon" v-html="lang === 'zh' ? tab.icon : tab.icon_en"></span>
                <span class="tab-label">{{ lang === 'zh' ? tab.label : tab.label_en }}</span>
            </div>
        </div>
        <div class="tab-content">
            <Tinymce v-model="content" :height="1200" v-if="activeTab === 'rich'" />
            <div v-else-if="activeTab === 'markdown'" class="markdown-box">
                <MarkdownEditor />
                <!-- 这里可以放你的Markdown组件 -->
            </div>
            <div v-else-if="activeTab === 'ocr'" class="ocr-box">
                <h2>{{ lang === 'zh' ? 'OCR识别' : 'OCR Recognition' }}</h2>
                <!-- 这里可以放你的OCR组件 -->
            </div>
        </div>

        <!-- 中英文切换 -->
        <div class="lang-toggle" role="region" aria-label="language toggle">
            <button
                    class="lang-btn"
                    @click="lang = lang === 'zh' ? 'en' : 'zh'"
                    :title="lang === 'zh' ? '切换到英文' : 'Switch to Chinese'">
                <span class="lang-icon" v-html="lang === 'zh' ? '🇨🇳' : '🇺🇸'"></span>
                <span class="lang-text">{{ lang === 'zh' ? '切换到英文' : 'Switch to Chinese' }}</span>
            </button>
        </div>
    </div>
</template>

<script>
import Tinymce from './components/Tinymce/index.vue'
import MarkdownEditor from './components/MarkDown.vue'

export default {
    name: 'App',
    components: { Tinymce, MarkdownEditor },
    data() {
        return {
            lang: 'zh',
            activeTab: 'rich',
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
                {
                    name: 'ocr',
                    label: 'OCR识别',
                    label_en: 'OCR Recognition',
                    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18v12H3z" fill="none"/><path d="M5 8h14v8H5zM7 10h2v2H7zM11 10h6v2h-6z"/></svg>`,
                    icon_en: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18v12H3z" fill="none"/><path d="M5 8h14v8H5zM7 10h2v2H7zM11 10h6v2h-6z"/></svg>`
                }
            ],
            content: '<p>欢迎使用富文本编辑器！</p>'
        };
    },
    created() {
        let lang = (navigator.language || navigator.userLanguage).toLowerCase()
        if (lang === 'zh-cn' || lang === 'zh') {
            this.lang = 'zh'
            this.content = '<h1>欢迎使用富文本编辑器！</h1>'
        } else {
            this.lang = 'en'
            this.content = '<h1>Welcome to use the rich text editor!</h1>'
        }

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
       
    }
};
</script>

<style scoped>
#app {
    min-height: 70vh;
    background: #f7f8fa;
}
.tabs {
    display: flex;
    justify-content: center;
    background: #f9f9f9;
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
    color: #556;
    font-weight: 500;
    transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease, color 180ms ease;
    border-bottom: 2px solid transparent;
    user-select: none;
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

/* keep existing tab-content styles */
.tab-content {
    padding: 2vh 20vw;
    min-height: 70vh;
    background: #f9f9f9;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.markdown-box,
.json-box {
    text-align: center;
    color: #888;
}

.lang-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 2000;
}

.lang-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 999px;
    background: linear-gradient(135deg, #fbfdff 0%, #0b68d8 100%);
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

</style>