<template>
    <div>
        <div class="tinyMCE-toolbar">
            <div class="title-nav">
                富文本编辑器
            </div>

            <div>
                <span>
                    {{ lang.startsWith('zh') ? '在线模板:' : 'Online Template:' }}
                </span>

                <button class="zhen" @click="setdefineContent('离职证明')">
                    离职证明
                </button>
                <button class="zhen" @click="setdefineContent('离职申请')">
                    离职申请
                </button>
                <button class="zhen" @click="setdefineContent('面试简历')">
                    面试简历
                </button>
                <button class="zhen" @click="setdefineContent('活动通知')">
                    活动通知
                </button>
                <button class="zhen" @click="setdefineContent('多级标题')">
                    多级标题
                </button>
            </div>
        </div>
        <div :class="{ fullscreen: fullscreen }" class="tinymce-container" :style="{ width: containerWidth }">
            <textarea :id="tinymceId" class="tinymce-textarea" />
            <div class="editor-custom-btn-container">
                <!-- <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" /> -->
                <img class="tool-img" @click="SaveData" src="/save.svg" alt="11" srcset="">
            </div>
        </div>
        <br />
        <br />
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
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from './components/EditorImage.vue'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
/**
 * 开发任务
 * 1. 支持新建多个tab页开发 使用 indexDB 持久化
 * 2. 支持导出 为 word/pdf/html/png
 * 3. 支持在线搜索图片资源
 * 4. 支持顶部动态显示 文档的 title 和字数
 */

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
    name: 'Tinymce',
    components: { editorImage },
    props: {
        id: {
            type: String,
            default: function () {
                return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
            }
        },
        value: {
            type: String,
            default: ''
        },
        toolbar: {
            type: Array,
            required: false,
            default() {
                return []
            }
        },
        menubar: {
            type: String,
            default: 'file edit insert view format table'
        },
        height: {
            type: [Number, String],
            required: false,
            default: 360
        },
        width: {
            type: [Number, String],
            required: false,
            default: 'auto'
        }
    },
    data() {
        return {
            lang: (navigator.language || navigator.userLanguage).toLowerCase(),
            hasChange: false,
            hasInit: false,
            tinymceId: this.id,
            fullscreen: false,
            languageTypeList: {
                'en': 'en',
                'zh': 'zh_CN',
                'es': 'es_MX',
                'ja': 'ja'
            },
            openIndex: -1,
            faqList: [
                {
                    title: '什么是 富文本，为什么要使用 富文本？',
                    title_en: 'What is Rich Text and why use it?',
                    icon: `<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5L12 2z" /></svg>`,
                    content: `<p>富文本是一种可以包含多种格式的文本，使用简洁的语法书写，便于阅读与版本控制，适合写文档、博客与报告。
                        ZaixianWord 提供在线富文本、Markdown ，支持导出 PDF/HTML/Word、模板。快速创建与导出专业文档。在线MarkDown编辑器、在线Word编辑、专业富文本编辑器、专业MarkDown编辑器
                        </p>
                    <ul><li>易读易写</li><li>可导出为 HTML、PDF 等</li><li>与 git 等工具友好</li></ul>`,
                    content_en: `<p>Rich Text is a type of text that can contain various formats, written with a simple syntax, making it easy to read and version control, suitable for writing documents, blogs, and reports.</p>
                      <ul><li>Readable and writable</li><li>Exportable to HTML/PDF</li><li>Works well with version control</li></ul>`
                },
                {
                    title: '适用人群？适用场景？',
                    title_en: 'Who should use Rich Text? Use Cases?',
                    icon: `<svg viewBox="0 0 24 24"><path d="M3 6h18v2H3zM3 10h18v8H3z"/></svg>`,
                    content: `<p>适合需要编写和发布内容的个人和团队，如开发者、写作者、学生、教师、研究人员等。</p>
                    <ul><li>写作与博客</li><li>技术文档</li><li>项目报告</li><li>笔记与知识库</li><li>快速办公、打印</li></ul>`,
                    content_en: `<p>Suitable for individuals and teams who need to create and publish content, such as developers, writers, students, teachers, and researchers.</p>
                    <ul><li>Writing and blogging</li><li>Technical documentation</li><li>Project reports</li><li>Notes and knowledge bases</li><li>Quick office and printing</li></ul>`
                },
                {
                    title: '如何使用 富文本？',
                    title_en: 'How to use Rich Text?',
                    icon: `<svg viewBox="0 0 24 24"><path d="M3 6h18v2H3zM3 10h18v8H3z"/></svg>`,
                    content: `<p>在编辑区直接输入富文本语法，实时预览区会显示渲染后的结果。常用编辑器支持快捷键（如 <kbd>Ctrl</kbd>+<kbd>B</kbd> 粗体）。</p>`,
                    content_en: `<p>Type Rich Text in the editor and preview shows the rendered output. Editors usually support shortcuts (e.g. <kbd>Ctrl</kbd>+<kbd>B</kbd> for bold).</p>`
                },
                {
                    title: '这个 富文本 是否免费？',
                    title_en: 'Is this Rich Text editor free?',
                    icon: `<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/></svg>`,
                    content: `<p>本编辑器基于开源组件构建，完全免费</p>`,
                    content_en: `<p>The editor is built on open-source components and core features are free. Free All</p>`
                },
            ],
        }
    },
    computed: {
        containerWidth() {
            const width = this.width
            if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
                return `${width}px`
            }
            return width
        }
    },
    watch: {
        value(val) {
            if (!this.hasChange && this.hasInit) {
                this.$nextTick(() =>
                    window.tinymce.get(this.tinymceId).setContent(val || ''))
            }
        }
    },
    mounted() {
        this.init()
    },
    activated() {
        if (window.tinymce) {
            this.initTinymce()
        }
    },
    deactivated() {
        this.destroyTinymce()
    },
    destroyed() {
        this.destroyTinymce()
    },
    methods: {
        setdefineContent(val) {
            switch (val) {
                case '离职证明':
                    this.setContent(`
                    <div style="margin: 0; padding: 140px; font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;">
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
                    `)
                    break;
                case '离职申请':
                    this.setContent(`
                   <div style="margin:0; padding:140px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;">
        <!-- 头部 -->
        <div style="text-align:center; margin-bottom:50px;">
            <h1 style="margin:0; font-size:36px; letter-spacing:3px; ">离职申请</h1>
          
        </div>

        <!-- 称呼 -->
        <div style="margin-bottom:30px; font-size:16px;">
            <p>尊敬的 <strong style="">公司领导</strong>：</p>
        </div>

        <!-- 正文 -->
        <div style="line-height:1.9; font-size:16px; text-align:justify;">
            <p>本人 <strong style="color:#764ba2;">张三</strong>（工号：<strong style="color:#764ba2;">EMP2021001</strong>），于 <strong style="color:#764ba2;">2019年7月1日</strong> 入职至今，现任 <strong style="color:#764ba2;">前端开发工程师</strong> 一职。因 <strong style="color:#e74c3c;">个人职业规划调整</strong>，经过慎重考虑，特向您提出 <strong style="color:#e74c3c;">离职申请</strong>，拟最后工作日期为 <strong style="color:#e74c3c;">2024年8月15日</strong>，请予批准。</p>
            <p>在公司工作的五年里，我收获颇丰，感谢公司提供的发展平台与培养，也感谢领导及同事给予的帮助与支持。后续将严格按照公司流程完成交接，确保工作平稳过渡。</p>
            <p>恳请领导批准为盼！</p>
        </div>

        <!-- 落款 -->
        <div style="margin-top:60px; text-align:right;">
            <div style="font-size:16px; font-weight:600; margin-bottom:8px;">申请人：张三</div>
            <div style="font-size:14px; color:#666;">2024年7月5日</div>
        </div>

        <!-- 手写签名区 -->
        <div style="margin-top:40px; text-align:right;">
            <div style="display:inline-block; width:120px; height:80px; border-bottom:2px solid #ddd; position:relative;">
                <span style="position:absolute; bottom:4px; right:0; font-size:12px; color:#999;">手写签名</span>
            </div>
        </div>

        <!-- 底部提示 -->
        <div style="margin-top:70px; font-size:12px; color:#999; text-align:center; border-top:1px solid #eee; padding-top:20px;">
            本申请自提交之日起生效，最终解释权归公司人力资源部所有。
        </div>
</div>
                    `)
                    break;
                case '面试简历':
                    this.setContent(`
                    <body style="margin:0; padding:40px; background-color:#fff; font-family:'微软雅黑',sans-serif; color:#000;">
    <div style="max-width:800px; margin:0 auto; background-color:#fff; padding:40px 50px;">

        <!-- 个人信息 -->
        <h1 style="font-size:32px; margin:0 0 10px;">张三</h1>
        <p style="margin:0 0 20px; line-height:1.6;">
            电话：138-0000-0000 | 邮箱：zhangsan@example.com |  GitHub：https://github.com/zhangsan<br>
            求职意向：前端开发工程师 | 工作年限：5年 | 居住地：北京
        </p>

        <!-- 教育背景 -->
        <h2 style="border-bottom:1px solid #000; margin:30px 0 10px; padding-bottom:4px;">教育背景</h2>
        <p style="margin:0 0 6px;"><strong>北京邮电大学</strong>　计算机科学与技术　本科　2015.09 - 2019.06</p>

        <!-- 专业技能 -->
        <h2 style="border-bottom:1px solid #000; margin:30px 0 10px; padding-bottom:4px;">专业技能</h2>
        <ul style="margin:0; padding-left:20px;">
            <li>精通 HTML5 / CSS3 / JavaScript(ES6+) 及 TypeScript</li>
            <li>熟练 React、Vue3 全家桶，掌握 Hooks、Composition API 设计模式</li>
            <li>了解 Webpack / Vite 构建配置，重视性能优化与代码分割</li>
            <li>熟悉 RESTful 与 GraphQL，能配合 Node.js 编写 BFF 接口</li>
            <li>掌握 Git Flow、Code Review 及单元测试（Jest / Vitest）</li>
        </ul>

        <!-- 工作经历 -->
        <h2 style="border-bottom:1px solid #000; margin:30px 0 10px; padding-bottom:4px;">工作经历</h2>

        <div style="margin-bottom:20px;">
            <p style="margin:0;"><strong>XX科技有限公司</strong>　前端开发工程师　2019.07 - 至今</p>
            <ul style="margin:4px 0 0; padding-left:20px;">
                <li>负责企业级中后台产品前端架构，组件库覆盖 5 条业务线，代码复用率提升 40%</li>
                <li>推动微前端落地，将 3 个老旧 AngularJS 应用无缝迁移至 Vue3 子应用</li>
                <li>建立性能监控体系，首屏加载时间从 2.8s 降至 1.2s</li>
            </ul>
        </div>

        <div style="margin-bottom:20px;">
            <p style="margin:0;"><strong>YY互联网公司</strong>　前端开发实习生　2018.06 - 2018.09</p>
            <ul style="margin:4px 0 0; padding-left:20px;">
                <li>参与电商活动页搭建，使用 Vue + SASS 实现响应式布局，兼容主流移动端</li>
                <li>编写自动化脚本，将静态资源压缩率提升 25%</li>
            </ul>
        </div>

        <!-- 项目经验 -->
        <h2 style="border-bottom:1px solid #000; margin:30px 0 10px; padding-bottom:4px;">项目经验</h2>

        <div style="margin-bottom:18px;">
            <p style="margin:0;"><strong>企业级低代码平台</strong>　2022.01 - 2023.06</p>
            <ul style="margin:4px 0 0; padding-left:20px;">
                <li>技术栈：React + TypeScript + Vite + Ant Design + Monaco Editor</li>
                <li>负责页面可视化拖拽引擎核心开发，支持 50+ 业务组件，服务 10+ 内部系统</li>
                <li>实现 JSON Schema 驱动渲染与实时预览，页面发布效率提升 60%</li>
            </ul>
        </div>

        <!-- 自我评价 -->
        <h2 style="border-bottom:1px solid #000; margin:30px 0 10px; padding-bottom:4px;">自我评价</h2>
        <p style="margin:0; line-height:1.8;">
            具备扎实的前端基础与良好的编码习惯，注重代码可读性与可维护性；善于跨团队沟通，能够主动推动项目进度；对新技术保持敏感，乐于分享，多次组织内部技术沙龙。
        </p>

    </div>
</body>
                  `)
                    break;
                case '活动通知':
                    this.setContent(`
                   <div style="max-width:700px; margin:0 auto; background-color:#fff;  padding:40px 50px;">

        <!-- 标题 -->
        <h1 style="text-align:center; font-size:32px; margin:0 0 30px;">活动通知</h1>

        <!-- 正文 -->
        <p style="margin:0 0 20px; line-height:1.8;">
            为丰富员工业余生活，增强团队凝聚力，公司定于<strong>2024年7月20日（周六）</strong>举行<strong>“夏日健步走”</strong>活动，现将具体事项通知如下：
        </p>

        <p><strong>一、活动时间</strong><br>
        2024年7月20日 08:00—11:30</p>

        <p><strong>二、集合地点</strong><br>
        公司大楼正门广场</p>

        <p><strong>三、参与人员</strong><br>
        全体在职员工（可自愿携带家属）</p>

        <p><strong>四、活动路线</strong><br>
        公司广场→滨江公园绿道→折返点→公司广场，全程约6公里。</p>

        <p><strong>五、注意事项</strong></p>
        <ol style="margin:0; padding-left:20px;">
            <li>请于07:45前完成签到并领取统一遮阳帽；</li>
            <li>穿着舒适运动装、运动鞋，自备防晒用品及饮用水；</li>
            <li>活动设休息点与医疗站，如有身体不适请及时联系工作人员；</li>
            <li>因天气等原因需调整安排，将提前一天通过企业微信公告。</li>
        </ol>

        <p style="margin-top:20px;">请各部门于<strong>7月15日17:00前</strong>将参加名单报至行政部，以便统一购买保险及准备物资。</p>

        <!-- 落款 -->
        <div style="text-align:right; margin-top:40px;">
            <div style="font-size:16px; font-weight:600;">行政部</div>
            <div style="font-size:14px; margin-top:6px;">2024年7月5日</div>
        </div>

    </div>
                    `)
                    break;
                case '多级标题':
                    this.setContent(`
                    <div style="margin:0; padding:40px; background-color:#fff; font-family:'微软雅黑',sans-serif; color:#000;">

    <h1 style="font-size:32px; margin:30px 0;">第一章 绪论</h1>
    <p style="line-height:1.8; margin:10px 0;">
        人工智能是研究、开发用于模拟、延伸和扩展人的智能的理论、方法、技术及应用系统的一门新的技术科学。人工智能是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器，该领域的研究包括机器人、语言识别、图像识别、自然语言处理和专家系统等。
    </p>

    <h2 style="font-size:24px; margin:30px 0 15px;">1.1 研究背景</h2>
    <p style="line-height:1.8; margin:10px 0;">
        随着互联网、大数据、云计算和物联网等技术不断发展，人类社会的数据呈现爆炸式增长，传统数据处理方法已难以满足需求。人工智能技术的出现，为海量数据的分析和处理提供了新的思路和手段，使得从数据中提取有价值信息成为可能。
    </p>

    <h3 style="font-size:18px; margin:20px 0 10px;">1.1.1 数据爆炸时代</h3>
    <p style="line-height:1.8; margin:10px 0;">
        据统计，全球每天产生的数据量达到数十亿GB，这些数据来自社交媒体、传感器、商业交易等各个领域。数据量的激增对存储、传输和处理能力提出了更高要求，传统的数据处理方法已难以应对。
    </p>

    <h3 style="font-size:18px; margin:20px 0 10px;">1.1.2 计算能力提升</h3>
    <p style="line-height:1.8; margin:10px 0;">
        随着计算机硬件技术的飞速发展，CPU、GPU等计算设备的性能大幅提升，为复杂的人工智能算法提供了强大的计算支持。特别是GPU并行计算能力的发现，使得深度学习等计算密集型任务得以高效运行。
    </p>

    <h2 style="font-size:24px; margin:30px 0 15px;">1.2 研究意义</h2>
    <p style="line-height:1.8; margin:10px 0;">
        人工智能技术的发展，不仅能够提高生产效率，降低人力成本，还能在医疗、教育、交通等领域提供更加智能化的服务。例如，在医疗领域，人工智能可以辅助医生进行疾病诊断，提高诊断的准确性和效率；在教育领域，可以根据学生的学习情况提供个性化的教学方案。
    </p>

    <h1 style="font-size:32px; margin:30px 0;">第二章 相关技术综述</h1>
    <p style="line-height:1.8; margin:10px 0;">
        机器学习是人工智能的核心，它使计算机能够从数据中学习并做出决策或预测。机器学习算法可以分为监督学习、无监督学习和强化学习等类型。监督学习使用标记数据训练模型，无监督学习从未标记数据中发现模式，强化学习则通过与环境交互来学习最优行为策略。
    </p>

    <h2 style="font-size:24px; margin:30px 0 15px;">2.1 机器学习基础</h2>
    <p style="line-height:1.8; margin:10px 0;">
        监督学习是机器学习中最常见的方法之一，它通过训练数据集学习输入与输出之间的映射关系。训练数据集包含输入特征和对应的标签，模型学习的目标是预测新输入数据的标签。常见的监督学习算法包括线性回归、逻辑回归、决策树和支持向量机等。
    </p>

    <h3 style="font-size:18px; margin:20px 0 10px;">2.1.1 线性回归</h3>
    <p style="line-height:1.8; margin:10px 0;">
        线性回归是一种用于建立输入特征与连续输出变量之间关系的统计方法。它假设输入特征与输出变量之间存在线性关系，通过最小化预测值与实际值之间的平方误差来求解模型参数。线性回归简单、易于理解，是许多复杂算法的基础。
    </p>

    <h3 style="font-size:18px; margin:20px 0 10px;">2.1.2 决策树</h3>
    <p style="line-height:1.8; margin:10px 0;">
        决策树是一种树状结构的分类和回归方法，它通过一系列的问题将数据划分为不同的子集。每个内部节点代表一个特征上的测试，每个分支代表测试的一个结果，每个叶节点代表一个类别或数值。决策树易于理解和解释，可以处理数值型和类别型数据。
    </p>

    <h2 style="font-size:24px; margin:30px 0 15px;">2.2 深度学习概述</h2>
    <p style="line-height:1.8; margin:10px 0;">
        深度学习是机器学习的一个分支，它基于人工神经网络，特别是深度神经网络。深度学习模型通常包含多个隐藏层，能够自动学习数据的多层次特征表示。深度学习在图像识别、语音识别和自然语言处理等领域取得了显著成果。
    </p>

</div>
                   `)
                    break;
                default:
                    this.setContent('<p>默认内容</p>');
                    break;
            }
            },
            toggleFAQ(idx) {
                this.openIndex = this.openIndex === idx ? -1 : idx
            },
            // 数据持久化
            SaveData(){
                console.log(this.value);
                localStorage.setItem('editorContent', this.value)
            },
            init() {
                // dynamic load tinymce from cdn
                load(tinymceCDN, (err) => {
                    if (err) {
                        this.$message.error(err.message)
                        return
                    }
                    this.initTinymce()
                })
            },
            initTinymce() {
                // 根据 用户浏览器语言 设置 tinymce 语言
                if (this.lang === 'zh-cn' || this.lang === 'zh') {
                    this.lang = 'zh'
                } else {
                    this.lang = 'en'
                }
                const _this = this
                window.tinymce.init({
                    selector: `#${this.tinymceId}`,
                    language: this.languageTypeList[this.lang] || this.languageTypeList['zh'],
                    height: this.height,
                    body_class: 'panel-body ',
                    object_resizing: false,
                    toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
                    menubar: this.menubar,
                    plugins: plugins,
                    end_container_on_empty_block: true,
                    powerpaste_word_import: 'clean',
                    code_dialog_height: 450,
                    code_dialog_width: 1000,
                    advlist_bullet_styles: 'square',
                    advlist_number_styles: 'default',
                    imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
                    default_link_target: '_blank',
                    link_title: false,
                    nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
                    init_instance_callback: editor => {
                        if (_this.value) {
                            editor.setContent(_this.value)
                        }
                        _this.hasInit = true
                        editor.on('NodeChange Change KeyUp SetContent', () => {
                            this.hasChange = true
                            this.$emit('input', editor.getContent())
                        })
                    },
                    setup(editor) {
                        editor.on('FullscreenStateChanged', (e) => {
                            _this.fullscreen = e.state
                        })
                    },
                    convert_urls: false
                })
            },
            destroyTinymce() {
                const tinymce = window.tinymce.get(this.tinymceId)
                if (this.fullscreen) {
                    tinymce.execCommand('mceFullScreen')
                }

                if (tinymce) {
                    tinymce.destroy()
                }
            },
            setContent(value) {
                window.tinymce.get(this.tinymceId).setContent(value)
            },
            getContent() {
                window.tinymce.get(this.tinymceId).getContent()
            },
            imageSuccessCBK(arr) {
                arr.forEach(v => window.tinymce.get(this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`))
            }
        }
    }
</script>

<style>
.tinymce-container {
    position: relative;
    line-height: normal;
}

.tinymce-container {
    ::v-deep {
        .mce-fullscreen {
            z-index: 10000;
        }
    }
}

.zhen {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 6px 10px;
    border-radius: 6px;
    background: rgba(11, 104, 216, 0.06);
    /* 主题色轻微底色 */
    color: #fff;
    /* 主题色文字 */
    border: 1px solid rgba(11, 104, 216, 0.12);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: transform .18s ease, box-shadow .18s ease, background .18s ease, color .18s ease;
    user-select: none;
    margin-left: 10px;
    background-color: var(--primary);
}


/* hover — 渐变 + 抬起 + 阴影，文字变为白色 */
.zhen:hover {
    transform: translateY(-3px);
    background: linear-gradient(135deg, #0b68d8 0%, #2f80ed 100%);
    color: #fff;
    box-shadow: 0 10px 24px rgba(11, 104, 216, 0.14);
    border-color: transparent;
}

/* active / pressed 状态 */
.zhen:active {
    transform: translateY(-1px) scale(0.995);
    box-shadow: 0 6px 14px rgba(11, 104, 216, 0.12);
}

/* 键盘焦点可见性（无障碍） */
.zhen:focus-visible {
    outline: 3px solid rgba(11, 104, 216, 0.18);
    outline-offset: 2px;
}

/* 在偏好减少动画的设备上禁用动效 */
@media (prefers-reduced-motion: reduce) {

    .zhen,
    .zhen:hover,
    .zhen:active {
        transition: none;
        transform: none;
        box-shadow: none;
    }
}

/* 小屏优化 */
@media (max-width: 720px) {
    .zhen {
        padding: 5px 8px;
        font-size: 13px;
        gap: 0.4rem;
    }
}

.tinymce-textarea {
    visibility: hidden;
    z-index: -1;
}

.tool-img {
    width: calc(20/1920 * 100vw);
    vertical-align: text-bottom;
    cursor: pointer;
}

.editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
}

.editor-custom-save-container {
    position: absolute;
    right: 30vw;
    top: 3vh;
}

.editor-upload-btn {
    display: inline-block;
}

.tinyMCE-toolbar {
    width: 45vw;
    height: 4vh;
    line-height: 4vh;
    text-align: left;
    margin: 0 auto;
    background-color: transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;
}


</style>
