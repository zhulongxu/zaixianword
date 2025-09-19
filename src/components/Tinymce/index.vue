<template>
    <div>
        <div class="tinyMCE-toolbar">
            <div>
                富文本编辑器
            </div>

            <div>
                <span >
                 {{ lang.startsWith('zh') ? '在线模板:' : 'Online Template:' }}
                </span>
                <select v-model="selectedKey" name="" id="" @change="selectChange" @click="selectClick">
                    <option disabled value="">{{ lang.startsWith('zh') ? '请选择证明模板' : 'Select a proof template' }}</option>
                    <option value="txzm">通用证明</option>
                    <option value="lzzm">离职证明</option>
                    <option disabled value="">{{ lang.startsWith('zh') ? '请选择申请模板' : 'Select a application template' }}</option>
                    <option value="qjt">请假条</option>
                    <option value="lzsq">离职申请</option>
                    <option disabled value="">{{ lang.startsWith('zh') ? '请选择通知模板' : 'Select a notice template' }}</option>
                    <option value="hytz">会议通知</option>
                    <option value="fjtz">放假通知</option>
                    <option value="mstz">面试通知</option>
                    <option value="hdtz">活动通知</option>
                    <option value="zbtz">中标通知</option>
                    <option disabled value="">{{ lang.startsWith('zh') ? '请选择其他模板' : 'Select a other template' }}</option>
                    <option value="msjl">面试简历</option>
                    <option value="djbt">多级标题</option>
                    <option value="jhg">讲话稿</option>
                    <option value="hyjy">会议纪要</option>
                </select>
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
            selectedKey: '',      // 当前 select v-model
            lastSelectedKey: null, // 用来判断重复点击
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
                    content: `<p>富文本是一种可以包含多种格式的文本，使用简洁的语法书写，便于阅读与版本控制，适合写文档、博客与报告。</p>
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
            selectedTemplate: {
                // 证明类
                'txzm': '<h2 style="text-align: center;">证明</h2><p>兹有<span style="text-decoration: underline; color: rgb(0, 0, 0);">张三</span>，身份证号码<span style="text-decoration: underline; color: rgb(0, 0, 0);">123456789012345678</span>，现任职于我公司，职位为<span style="text-decoration: underline; color: rgb(0, 0, 0);">软件工程师</span>，工作表现良好。特此证明。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                
                'lzzm': '<h2 style="text-align: center;">离职证明</h2><p>兹有<span style="text-decoration: underline; color: rgb(0, 0, 0);">赵六</span>，身份证号码<span style="text-decoration: underline; color: rgb(0, 0, 0);">556677889900112233</span>，自<span style="text-decoration: underline; color: rgb(0, 0, 0);">2018年3月1日</span>起在我公司工作，担任<span style="text-decoration: underline; color: rgb(0, 0, 0);">销售主管</span>职位。因个人原因，于<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年9月30日</span>离职，工作表现良好。特此证明。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
             
                // 申请类
              
                'qjt': '<h2 style="text-align: center;">请假条</h2><p>尊敬的领导：</p><p>我叫<span style="text-decoration: underline; color: rgb(0, 0, 0);">周九</span>，身份证号码<span style="text-decoration: underline; color: rgb(0, 0, 0);">889   900112233445566</span>，现任职于我公司，职位为<span style="text-decoration: underline; color: rgb(0, 0, 0);">客服专员</span>。因个人原因，特向公司提出请假申请，请假时间为<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年10月10日至2023年10月15日</span>，共计5天。望予批准。</p><p style="text-align: right;">请假人：<br>日期：2023年10月1日</p>',
                'lzsq': '<h2 style="text-align: center;">离职申请</h2><p>尊敬的领导：</p><p>我叫<span style="text-decoration: underline; color: rgb(0, 0, 0);">吴十</span>，身份证号码<span style="text-decoration: underline; color: rgb(0, 0, 0);">990011223344556677</span>，现任职于我公司，职位为<span style="text-decoration: underline; color: rgb(0, 0, 0);">技术支持</span>。因个人原因，特向公司提出离职申请，离职时间为<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年10月31日</span>。望予批准。</p><p style="text-align: right;">申请人：<br>日期：2023年10月1日</p>',
                // 通知类
               
                'hytz': '<h2 style="text-align: center;">会议通知</h2><p>各位同事：</p><p>我公司定于<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年10月20日</span>召开部门会议，地点为公司会议室，时间为下午2:00。请各位准时参加。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                'fjtz': '<h2 style="text-align: center;">放假通知</h2><p>各位同事：</p><p>根据国家法定节假日安排，我公司定于<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年10月1日至2023年10月7日</span>放假，共计7天。请各位提前做好工作安排，节后正常上班。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                'mstz': '<h2 style="text-align: center;">面试通知</h2><p>尊敬的<span style="text-decoration: underline; color: rgb(0, 0, 0);">张三</span>：</p><p>感谢您对我公司的关注与支持。我公司诚邀您参加面试，面试时间为<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年10月10日</span>，地点为公司总部，联系人为<span style="text-decoration: underline; color: rgb(0, 0, 0);">李四</span>，联系电话为<span style="text-decoration: underline; color: rgb(0, 0, 0);">123-45678901</span>。请携带相关资料准时参加。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                'hdtz': '<h2 style="text-align: center;">活动通知</h2><p>各位同事：</p><p>我公司定于<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年10月25日</span>举办团队建设活动，地点为市郊拓展基地，时间为上午9:00至下午5:00。请各位积极参与，增强团队凝聚力。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
               
                'zbtz': '<h2 style="text-align: center;">中标通知</h2><p>尊敬的<span style="text-decoration: underline; color: rgb(0, 0, 0);">王五</span>：</p><p>感谢您对我公司的支持与信任。我公司很高兴地通知您，您所投标的项目已中标，项目名称为<span style="text-decoration: underline; color: rgb(0, 0, 0);">智慧城市建设</span>，合同金额为人民币<span style="text-decoration: underline; color: rgb(0, 0, 0);">500万元</span>。请尽快与我公司联系，办理相关手续。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                // 其余模板
                'msjl': '<h2 style="text-align: center;">面试简历</h2><p><strong>个人信息</strong></p><ul><li>姓名：<span style="text-decoration: underline; color: rgb(0, 0, 0);">张三</span></li><li>联系方式：<span style="text-decoration: underline; color: rgb(0, 0, 0);">123-45678901</span></li><li>电子邮箱：<span style="text-decoration: underline; color: rgb(0, 0, 0);">zhangsan@example.com</span></li></ul><p><strong>教育背景</strong></p><ul><li>某某大学，计算机科学与技术专业，学士学位</li></ul><p><strong>工作经历</strong></p><ul><li>某某公司，软件工程师，负责项目开发与维护</li></ul>',

                'djbt': '<h2 style="text-align: center;">多级标题示例</h2><h1>一级标题</h1><p>这是一级标题下的内容。</p><h2>二级标题</h2><p>这是二级标题下的内容。</p><h3>三级标题</h3><p>这是三级标题下的内容。</p><h4>四级标题</h4><p>这是四级标题下的内容。</p><h5>五级标题</h5><p>这是五级标题下的内容。</p><h6>六级标题</h6><p>这是六级标题下的内容。</p>',
                'jhg': '<h2 style="text-align: center;">讲话稿 - 自我介绍</h2><p>尊敬的各位领导、同事们：</p><p>大家好！我叫<span style="text-decoration: underline; color: rgb(0, 0, 0);">张三</span>，很荣幸能够加入这个大家庭。今天，我想借此机会向大家做一个简单的自我介绍。</p><p>我毕业于<span style="text-decoration: underline; color: rgb(0, 0, 0);">某某大学</span>，专业是<span style="text-decoration: underline; color: rgb(0, 0, 0);">计算机科学与技术</span>。在校期间，我积极参与各种社团活动，并担任过<span style="text-decoration: underline; color: rgb(0, 0, 0);">学生会主席</span>，锻炼了我的组织协调能力和团队合作精神。</p><p>毕业后，我曾在<span style="text-decoration: underline; color: rgb(0, 0, 0);">某某公司</span>工作，担任<span style="text-decoration: underline; color: rgb(0, 0, 0);">软件工程师</span>职位。在那里，我积累了丰富的项目经验，熟悉了软件开发的各个环节，并且提升了我的技术能力。</p><p>我非常期待在新的工作环境中，能够与大家共同学习、成长。我相信，通过我们的共同努力，一定能够实现公司的目标，并且创造更加辉煌的业绩。</p><p>最后，再次感谢大家的热情欢迎！希望在未来的工作中，能够得到大家的支持与帮助。谢谢大家！</p>',
                'hyjy': '<h2 style="text-align: center;">会议纪要</h2><p>会议时间：2023年10月1日<br>会议地点：公司会议室<br>主持人：张三<br>记录人：李四</p><h3>会议议题</h3><ul><li>项目进展汇报</li><li>市场营销策略讨论</li><li>员工培训计划制定</li></ul><h3>会议内容</h3><p>1. 项目进展汇报：各项目负责人分别汇报了当前项目的进展情况，遇到的问题以及下一步的计划。</p><p>2. 市场营销策略讨论：市场部提出了新的营销策略，大家进行了热烈的讨论，并提出了宝贵的建议。</p><p>3. 员工培训计划制定：人力资源部介绍了即将开展的员工培训计划，大家一致认为培训内容丰富，形式多样，有助于提升员工的综合素质。</p><h3>会议决议</h3><ul><li>各项目负责人需在下周一前提交详细的项目计划。</li><li>市场部需根据讨论结果调整营销策略，并在下次会议中汇报。</li><li>人力资源部需尽快落实培训计划的具体安排。</li></ul><p>会议结束时间：2023年10月1日 11:30<br>会议记录人：李四</p>'
            }, // 选择的模板
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
        toggleFAQ(idx) {
            this.openIndex = this.openIndex === idx ? -1 : idx
        },
        // 当 value 改变时触发（正常情况）
        selectChange(e) {
            const val = e && e.target ? e.target.value : this.selectedKey
            if (!val) return
            this.lastSelectedKey = val
            // 继续原有逻辑：根据 key 设置模板内容
            if (!this.selectedTemplate[val]) {
                return alert('该模板正在完善中，敬请期待！')
            }
            this.setContent(this.selectedTemplate[val])
        },

        // 当用户点击下拉（包含选中已选项时），如果与上次相同则手动触发 selectChange
        selectClick() {
            // 如果已经有选中项且用户再次点击同一项（没有变化），手动调用处理逻辑
            if (this.selectedKey && this.selectedKey === this.lastSelectedKey) {
                // 手动调用，保证行为一致
                this.selectChange({ target: { value: this.selectedKey } })
            }
        },
        // 数据持久化
        SaveData(){
            console.log(this.value);
            localStorage.setItem('editorContent',this.value)
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

<style >
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
.tinyMCE-toolbar select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: inline-block;
    min-width: 170px;
    padding: 9px 44px 9px 14px;
    /* room for text + chevron */
    font-size: 14px;
    line-height: 1;
    color: #0b0b0b;
    background: linear-gradient(180deg, #f3f7fa 0%, #f3f7fa 100%);
    border: 1px solid rgba(11, 104, 216, 0.12);
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(11, 104, 216, 0.04);
    cursor: pointer;
    transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease, background .16s ease;
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 18px;
    margin-left: 10px;
    border: 1px solid #0b68d8;
}

/* hide native IE/Edge dropdown arrow */
.tinyMCE-toolbar select::-ms-expand {
    display: none;
}

/* hover / elevated look */
.tinyMCE-toolbar select:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(11, 104, 216, 0.10);
    border-color: rgba(11, 104, 216, 0.18);
    background: linear-gradient(180deg, #ffffff 0%, #eef6ff 100%);
}

/* focus for accessibility */
.tinyMCE-toolbar select:focus {
    outline: none;
    box-shadow: 0 0 0 6px rgba(11, 104, 216, 0.08);
    border-color: #0b68d8;
}

/* disabled */
.tinyMCE-toolbar select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Option styling - limited by browser, but keep sane defaults */
.tinyMCE-toolbar select option {
    padding: 8px;
    background: #fff;
    color: #0b0b0b;
}

/* responsive: reduce width & padding on small screens */
@media (max-width: 720px) {
    .tinyMCE-toolbar select {
        min-width: 140px;
        padding: 8px 38px 8px 10px;
        font-size: 13px;
    }
}

/* Optional: provide a fully styled "fake" dropdown hook if you need custom markup later */
.tinyMCE-toolbar .custom-select {
    position: relative;
    display: inline-block;
}

.tinyMCE-toolbar .custom-select__button {
    /* reuse select visual style */
}

.zhen {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 6px 10px;
    border-radius: 6px;
    background: rgba(11, 104, 216, 0.06);
    /* 主题色轻微底色 */
    color: #0b68d8;
    /* 主题色文字 */
    border: 1px solid rgba(11, 104, 216, 0.12);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: transform .18s ease, box-shadow .18s ease, background .18s ease, color .18s ease;
    user-select: none;
    margin-left: 10px;
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
    width: 60vw;
    height:4vh;
    line-height: 4vh;
    text-align: left;
    margin: 0 auto;
    background-color: transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
