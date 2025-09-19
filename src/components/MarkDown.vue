<template>
    <div class="components-container">
        <div class="markdown-toolbar">
            MarkDown 编辑器
        </div>
        <div class="editor-container">
            <markdown-editor ref="markdownEditor" v-model="content1" height="1200px" :language="language" />
        </div>

        <!-- <button style="margin-top:80px;" type="primary" icon="icon-document" @click="getHtml">
            Get HTML
        </button> -->
        <!-- <div v-html="html" /> -->

        <div class="seo-container">
            <div class="faq-accordion" role="tablist" aria-label="Markdown 使用说明">
                <div
                     class="faq-card"
                     v-for="(item, idx) in faqList"
                     :key="idx"
                     :aria-expanded="openIndex === idx">
                    <button
                            class="faq-header"
                            :id="'faq-header-' + idx"
                            :aria-controls="'faq-panel-' + idx"
                            :aria-expanded="openIndex === idx"
                            @click="toggleFAQ(idx)">
                        <div class="faq-title">
                            <span class="faq-icon" v-html="item.icon"></span>
                            <span class="faq-text">{{ lang === 'zh' ? item.title : item.title_en }}</span>
                        </div>
                        <span class="chev" :class="{ open: openIndex === idx }" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                    </button>

                    <transition name="faq-collapse">
                        <div
                             v-show="openIndex === idx"
                             class="faq-panel"
                             :id="'faq-panel-' + idx"
                             role="region"
                             :aria-labelledby="'faq-header-' + idx">
                            <div class="faq-body" v-html="lang === 'zh' ? item.content : item.content_en"></div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MarkdownEditor from './MarkdownEditor/index.vue'

const content = `
# 南京景区概览报告

**作者：** 张三  
**日期：** 2025-09-19

---

## 一、摘要

南京（Nanjing）是江苏省省会，历史文化名城，本报告概述若干代表性景区，包含景点特色、推荐路线与注意事项，便于旅游策划或学术参考。

> 地点概览：<span style="color:#0b68d8;">紫金山、钟山、秦淮河、玄武湖、总统府</span> 等。

---

## 二、主要景区（按推荐顺序）

### 1. 紫金山 / 中山陵（Purple Mountain）
- 特色：山林与纪念建筑融合，登山观景与人文纪念双重体验。
- 推荐游玩：中山陵 → 灵谷寺 → 紫金山天文台（半天）
- 图片：
  ![中山陵（示例）](https://th.bing.com/th/id/R.393ebaa0ad5081580d6edb39d25d382d?rik=X9O3bH0U0OsdHw&riu=http%3a%2f%2fn.sinaimg.cn%2fsinacn%2fw1500h997%2f20180201%2fad3d-fyrcsrw6488504.jpg&ehk=aC%2bpTmONn7MkT7doDubW3EEDxKbgGLJfLC3FS%2bmsegs%3d&risl=&pid=ImgRaw&r=0)

### 2. 夫子庙 / 秦淮河（Qinhuai River & Confucius Temple）
- 特色：古城文化、夜景与美食集中区。
- 建议：
  - 日间：游览夫子庙、老门东步行街
  - 夜间：秦淮河画舫夜游（体验灯光与民俗表演）
- 小贴士：节假日人流大，优先预约画舫与餐饮。

### 3. 南京城墙（明城墙）
- 亮点：世界上保存较完整的古代城墙之一，适合骑行/徒步。
- 推荐路段：中华门段（保存良好），赏城墙与古炮台。

### 4. 玄武湖（Xuanwu Lake）
- 特色：市中心大型湖泊公园，适合晨跑与家庭游。
- 活动：划船、环湖漫步、摄影。

### 5. 总统府（Presidential Palace）
- 特色：近代史与政治史展示，建筑群典雅。
- 建议时长：1.5 - 2 小时（含展厅参观）

---

## 三、推荐两日线路（示例）
1. 第一天：中山陵（上午） → 紫金山下茶馆（午休） → 夫子庙夜游（晚间美食）  
2. 第二天：明城墙骑行（上午） → 总统府（午后） → 玄武湖散步（傍晚）

---

## 四、景区对比（简表）

| 景区 | 看点 | 建议游玩时长 |
|---|---:|---:|
| 紫金山 / 中山陵 | 人文纪念 + 自然 | 3-4 小时 |
| 夫子庙 / 秦淮 | 夜景、美食 | 2-3 小时 |
| 明城墙 | 古迹与骑行 | 2 小时 |
| 玄武湖 | 市内休闲 | 1-2 小时 |
| 总统府 | 近代史展览 | 1.5-2 小时 |

---

## 五、视感与样式示例（演示彩色文本与背景）
- 强调（红色）：<span style="color:#e74c3c;">重要提示：节假日请提前购票。</span>  
- 背景提示（黄色背景）：<span style="background-color:#fff3cd;padding:2px 6px;border-radius:4px;">温馨提示：部分景点早晚温差大，备好外套。</span>

---

## 六、附加内容示例（代码、引用、图片）
### 代码示例（行程时间计算）
\`\`\`js
function estimateDuration(spots) {
  // spots: [{name, hours}]
  return spots.reduce((sum, s) => sum + (s.hours||1), 0);
}
\`\`\`

### 推荐摄影点
- 紫金山顶观日出
- 秦淮河岸夜景（灯影倒映）
- 明城墙局部纹理与城门拱洞

---

## 七、结论
南京兼具自然与人文资源，适合短途文化游与慢旅行。建议根据季节（春秋为最佳）与出行人群（老人/儿童）调整节奏。

---

*此模板可直接作为 Markdown 报告起点，图片与数据请替换为实拍与调研结果。*
`

export default {
    name: 'MarkdownDemo',
    components: { MarkdownEditor },
    data() {
        return {
            lang: '',
            content1: content,
            html: '',
            languageTypeList: {
                'en': 'en_US',
                'zh': 'zh_CN',
                'es': 'es_ES'
            },
            openIndex: -1,
            faqList: [
                {
                    title: '什么是 Markdown，为什么要使用 Markdown？',
                    title_en: 'What is Markdown and why use it?',
                    icon: `<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5L12 2z" /></svg>`,
                    content: `<p>Markdown 是一种轻量级标记语言，使用简洁的语法书写富文本内容，便于阅读与版本控制，适合写文档、博客与报告。</p>
                    <ul><li>易读易写</li><li>可导出为 HTML、PDF 等</li><li>与 git 等工具友好</li></ul>`,
                    content_en: `<p>Markdown is a lightweight markup language for creating formatted text using a plain-text editor. It's easy to read and write, ideal for docs and blogs.</p>
                      <ul><li>Readable and writable</li><li>Exportable to HTML/PDF</li><li>Works well with version control</li></ul>`
                },
                {
                    title: '如何使用 Markdown？',
                    title_en: 'How to use Markdown?',
                    icon: `<svg viewBox="0 0 24 24"><path d="M3 6h18v2H3zM3 10h18v8H3z"/></svg>`,
                    content: `<p>在编辑区直接输入 Markdown 语法，实时预览区会显示渲染后的结果。常用编辑器支持快捷键（如 <kbd>Ctrl</kbd>+<kbd>B</kbd> 粗体）。</p>`,
                    content_en: `<p>Type Markdown in the editor and preview shows the rendered output. Editors usually support shortcuts (e.g. <kbd>Ctrl</kbd>+<kbd>B</kbd> for bold).</p>`
                },
                {
                    title: '这个 Markdown 是否免费？',
                    title_en: 'Is this Markdown editor free?',
                    icon: `<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/></svg>`,
                    content: `<p>本编辑器基于开源组件构建，核心功能免费使用。部分高级导出或云服务可能需要额外配置或第三方付费服务。</p>`,
                    content_en: `<p>The editor is built on open-source components and core features are free. Some export/cloud services may require additional setup or paid services.</p>`
                },
                {
                    title: 'Markdown 使用教程（常用命令）',
                    title_en: 'Markdown quick guide (common commands)',
                    icon: `<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
                    content: `<h4>常用语法</h4>
                    <ul>
                      <li><strong>一级标题</strong>: <code># 标题</code></li>
                      <li><strong>二级标题</strong>: <code>## 标题</code></li>
                      <li><strong>加粗</strong>: <code>**加粗文本**</code></li>
                      <li><strong>斜体</strong>: <code>*斜体文本*</code></li>
                      <li><strong>无序列表</strong>: <code>- 项目</code></li>
                      <li><strong>有序列表</strong>: <code>1. 第一项</code></li>
                      <li><strong>引用</strong>: <code>> 引用文本</code></li>
                      <li><strong>代码块</strong>: <code>js</code></li>
                      <li><strong>图片</strong>: <code>![替代文本](图片链接)</code></li>
                      <li><strong>链接</strong>: <code>[文本](https://example.com)</code></li>
                    </ul>
                    <p>示例：<code>![中山陵](https://example.com/zhongshan.jpg)</code></p>`,
                    content_en: `<h4>Common syntax</h4>
                      <ul>
                        <li><code># Heading 1</code></li>
                        <li><code>## Heading 2</code></li>
                        <li><code>**bold**</code></li>
                        <li><code>*italic*</code></li>
                        <li><code>- list item</code></li>
                        <li><code>1. numbered item</code></li>
                        <li><code>> blockquote</code></li>
                        <li><code>js</code></li>
                        <li><code>![alt](https://...)</code></li>
                        <li><code>[text](https://...)</code></li>
                      </ul>`
                }
            ]
        }
    },
    computed: {
        language() {
            return this.languageTypeList[this.lang] || 'en_US'
        }
    },
    created() {
        let lang = (navigator.language || navigator.userLanguage).toLowerCase()
        if (lang === 'zh-cn' || lang === 'zh') {
            this.lang = 'zh'
        } else {
            this.lang = 'en'
        }
    },
    methods: {
        getHtml() {
            this.html = this.$refs.markdownEditor.getHtml()
            console.log(this.html)
        },
        toggleFAQ(idx) {
            this.openIndex = this.openIndex === idx ? -1 : idx
        }
    }
}
</script>

<style scoped>
.editor-container {
    margin-bottom: 30px;
}
.markdown-toolbar {
    height: 4vh;
    line-height: 4vh;
    text-align: left;
    margin: 0 auto;
    margin-bottom: 10px;
    background-color: transparent;
}
.tag-title {
    margin-bottom: 5px;
}
/* seo / faq */
.seo-container {
    padding: 8px 16px 40px;
    display: flex;
    justify-content: center;
}

.faq-accordion {
    width: 100%;
    max-width: 60vw;
    display: grid;
    gap: 12px;
}

.faq-card {
    background: #f3f7fa;
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
    overflow: hidden;
    border: 1px solid rgba(15, 23, 42, 0.04);
}

.faq-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background: linear-gradient(180deg, rgba(250, 250, 252, 1), rgba(245, 247, 250, 1));
    border: none;
    cursor: pointer;
    text-align: left;
    font-weight: 600;
    color: #0b0b0b;
    width: 100%;
}

.faq-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
}

.faq-icon svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
    color: #0b68d8;
    opacity: 0.95;
}

.chev {
    display: inline-flex;
    width: 22px;
    height: 22px;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    transition: transform .22s ease;
}

.chev.open {
    transform: rotate(180deg);
    color: #0b68d8;
}

.faq-panel {
    padding: 14px 18px;
    background: linear-gradient(180deg, #ffffff, #fbfdff);
    color: #333;
    line-height: 1.6;
    border-top: 1px solid rgba(15, 23, 42, 0.03);
}

.faq-body pre {
    background: #0f1724;
    color: #e6eef8;
    padding: 12px;
    border-radius: 6px;
    overflow: auto;
}

.faq-collapse-enter-active,
.faq-collapse-leave-active {
    transition: all .28s cubic-bezier(.2, .9, .2, 1);
}

.faq-collapse-enter,
.faq-collapse-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

/* responsive */
@media (max-width: 720px) {
    .faq-accordion {
        padding: 8px;
        gap: 8px;
    }

    .faq-header {
        padding: 12px;
    }
}
</style>
