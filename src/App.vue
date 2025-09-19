<template>
    <div id="app">
        <div class="tabs">
            <div class="tabs-inner">
                <img class="logo-img" src="/favicon.svg" title="ZaixianWord" />
                <div style="margin-right: 10vw;">
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

export default {
    name: 'App',
    components: { Tinymce, MarkdownEditor, AppFooter },
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
                // {
                //     name: 'ocr',
                //     label: 'OCR识别',
                //     label_en: 'OCR Recognition',
                //     icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18v12H3z" fill="none"/><path d="M5 8h14v8H5zM7 10h2v2H7zM11 10h6v2h-6z"/></svg>`,
                //     icon_en: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18v12H3z" fill="none"/><path d="M5 8h14v8H5zM7 10h2v2H7zM11 10h6v2h-6z"/></svg>`
                // }
            ],
            content: localStorage.getItem('editorContent') || `
<h1 style="margin-bottom:8px;">美国主要城市概览</h1>
<p><strong>简介：</strong>以下为若干代表性城市的简要介绍与旅行/工作建议，便于快速了解每个城市的亮点与出行提示。</p>

<hr/>

<h2>纽约（New York City）</h2>
<p>美国最大城市，金融、文化与艺术中心。推荐景点：<strong>曼哈顿时代广场</strong>、<strong>中央公园</strong>、<strong>大都会艺术博物馆</strong>。</p>
<ul>
  <li>亮点：多元文化、世界级博物馆与剧院。</li>
  <li>提示：地铁方便但高峰拥挤，住宿预算较高。</li>
</ul>
<p><img src="https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=1200&q=60" alt="New York" style="max-width:100%;height:auto;border-radius:6px;margin-top:8px;" /></p>

<h2>洛杉矶（Los Angeles）</h2>
<p>影视娱乐业中心，适合自驾与海滨游。推荐景点：<strong>好莱坞星光大道</strong>、<strong>格里菲斯天文台</strong>、<strong>圣塔莫尼卡海滩</strong>。</p>
<ul>
  <li>亮点：阳光、沙滩与创意产业。</li>
  <li>提示：交通以开车为主，市区较为分散。</li>
</ul>

<h2>芝加哥（Chicago）</h2>
<p>中西部重要城市，以建筑与音乐闻名。推荐景点：<strong>密歇根湖滨</strong>、<strong>云门（The Bean）</strong>、<strong>芝加哥艺术学院</strong>。</p>
<ul>
  <li>亮点：独特摩天大楼与爵士/蓝调文化。</li>
  <li>提示：冬季寒冷，夏季湖畔风景优美。</li>
</ul>

<h2>旧金山（San Francisco）</h2>
<p>科技与创意聚集地，地形起伏。推荐景点：<strong>金门大桥</strong>、<strong>渔人码头</strong>、<strong>九曲花街</strong>。</p>
<ul>
  <li>亮点：硅谷近邻、咖啡与创意氛围浓厚。</li>
  <li>提示：早晚温差大，常有雾，注意备衣。</li>
</ul>

<h2>华盛顿特区（Washington, D.C.）</h2>
<p>美国政治中心，历史与博物馆资源丰富。推荐：<strong>国家广场</strong>、<strong>史密森学会博物馆群</strong>、<strong>国会山</strong>。</p>
<ul>
  <li>亮点：博物馆多为免费，文化资源集中。</li>
  <li>提示：政府活动可能影响交通与出入。</li>
</ul>

<h2>西雅图（Seattle）</h2>
<p>西北部科技与咖啡文化重镇。推荐：<strong>派克市场</strong>、<strong>太空针塔</strong>、周边自然徒步路线。</p>

<h2>迈阿密（Miami）</h2>
<p>热带海滩与拉美文化融合，适合度假与夜生活。推荐：<strong>南海滩</strong>、<strong>小哈瓦那</strong>。</p>

<hr/>

<h3>旅行小贴士</h3>
<ol>
  <li>季节选择：北方城市春秋最佳，南部冬季气候温暖。</li>
  <li>交通建议：大城市优先使用公共交通或网约车；若计划跨城游，多考虑航班或长途巴士。</li>
  <li>安全与预算：大城市人流密集，注意保管随身物品；提前预订可节省住宿成本。</li>
</ol>

<p style="margin-top:12px;color:#666;font-size:13px;">本文为简要概览，图片为示例，请根据实际行程与偏好做详细规划。</p>
`
        };
    },
    created() {
        let lang = (navigator.language || navigator.userLanguage).toLowerCase()

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

.tabs {
    /* display: flex;
    justify-content: center; */
    background: #f3f7fa;
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

.tabs-inner {
    width: 60vw;
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

/* keep existing tab-content styles */
.tab-content {
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
    position: absolute;
    top: 10px;
    right: 20vw;
    z-index: 2;
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
</style>