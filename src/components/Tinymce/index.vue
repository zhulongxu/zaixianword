<template>
    <div>
        <div class="tinyMCE-toolbar">
            <div>
                富文本编辑器
            </div>

            <div>
                <span style="margin-right: 20px; font-weight: 600;">
                    在线模板:
                </span>
                <select name="" id="" @change="selectChange">
                    <option value="txzm">通用证明</option>
                    <option value="gzzm">工作证明</option>
                    <option value="srzm">收入证明</option>
                    <option value="lzzm">离职证明</option>
                    <option value="jzzm">居住证明</option>
                </select>

                <select name="" id="" @change="selectChange">
                    <option value="txsq">通用申请</option>
                    <option value="qjt">请假条</option>
                    <option value="lzsq">离职申请</option>
                </select>

                <select name="" id="" @change="selectChange">
                    <option value="txtz">通用通知</option>
                    <option value="hytz">会议通知</option>
                    <option value="fjtz">放假通知</option>
                    <option value="mstz">面试通知</option>
                    <option value="hdtz">活动通知</option>
                    <option value="rmtz">任免通知</option>
                    <option value="zbtz">中标通知</option>
                    <option value="srtz">入职通知</option>
                </select>

                <select name="" id="" @change="selectChange">
                    <option value="djbt">多级标题</option>
                    <option value="jhg">讲话稿-自我介绍</option>
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
            selectedTemplate: {
                // 证明类
                'txzm': '<h2 style="text-align: center;">证明</h2><p>兹有<span style="text-decoration: underline; color: rgb(0, 0, 0);">张三</span>，身份证号码<span style="text-decoration: underline; color: rgb(0, 0, 0);">123456789012345678</span>，现任职于我公司，职位为<span style="text-decoration: underline; color: rgb(0, 0, 0);">软件工程师</span>，工作表现良好。特此证明。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                'gzzm': '<h2 style="text-align: center;">工作证明</h2><p>兹有<span style="text-decoration: underline; color: rgb(0, 0, 0);">李四</span>，身份证号码<span style="text-decoration: underline; color: rgb(0, 0, 0);">987654321098765432</span>，自<span style="text-decoration: underline; color: rgb(0, 0, 0);">2020年1月1日</span>起在我公司担任<span style="text-decoration: underline; color: rgb(0, 0, 0);">项目经理</span>职位，工作认真负责，表现优异。特此证明。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                'srzm': '<h2 style="text-align: center;">收入证明</h2><p>兹有<span style="text-decoration: underline; color: rgb(0, 0, 0);">王五</span>，身份证号码<span style="text-decoration: underline; color: rgb(0, 0, 0);">112233445566778899</span>，自<span style="text-decoration: underline; color: rgb(0, 0, 0);">2019年6月1日</span>起在我公司工作，月收入为人民币<span style="text-decoration: underline; color: rgb(0, 0, 0);">8000元</span>，税后收入为人民币<span style="text-decoration: underline; color: rgb(0, 0, 0);">6500元</span>。特此证明。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                'lzzm': '<h2 style="text-align: center;">离职证明</h2><p>兹有<span style="text-decoration: underline; color: rgb(0, 0, 0);">赵六</span>，身份证号码<span style="text-decoration: underline; color: rgb(0, 0, 0);">556677889900112233</span>，自<span style="text-decoration: underline; color: rgb(0, 0, 0);">2018年3月1日</span>起在我公司工作，担任<span style="text-decoration: underline; color: rgb(0, 0, 0);">销售主管</span>职位。因个人原因，于<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年9月30日</span>离职，工作表现良好。特此证明。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                'jzzm': '<h2 style="text-align: center;">居住证明</h2><p>兹有<span style="text-decoration: underline; color: rgb(0, 0, 0);">钱七</span>，身份证号码<span style="text-decoration: underline; color: rgb(0, 0, 0);">667788990011223344</span>，现居住于我公司提供的宿舍，地址为<span style="text-decoration: underline; color: rgb(0, 0, 0);">北京市朝阳区幸福路100号</span>。特此证明。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                // 申请类
                'txsq': '<h2 style="text-align: center;">申请书</h2><p>尊敬的领导：</p><p>我叫<span style="text-decoration: underline; color: rgb(0, 0, 0);">孙八</span>，身份证号码<span style="text-decoration: underline; color: rgb(0, 0, 0);">778899001122334455</span>，现任职于我公司，职位为<span style="text-decoration: underline; color: rgb(0, 0, 0);">市场专员</span>。因个人原因，特向公司提出申请，望予批准。</p><p style="text-align: right;">申请人：<br>日期：2023年10月1日</p>',
                'qjt': '<h2 style="text-align: center;">请假条</h2><p>尊敬的领导：</p><p>我叫<span style="text-decoration: underline; color: rgb(0, 0, 0);">周九</span>，身份证号码<span style="text-decoration: underline; color: rgb(0, 0, 0);">889   900112233445566</span>，现任职于我公司，职位为<span style="text-decoration: underline; color: rgb(0, 0, 0);">客服专员</span>。因个人原因，特向公司提出请假申请，请假时间为<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年10月10日至2023年10月15日</span>，共计5天。望予批准。</p><p style="text-align: right;">请假人：<br>日期：2023年10月1日</p>',
                'lzsq': '<h2 style="text-align: center;">离职申请</h2><p>尊敬的领导：</p><p>我叫<span style="text-decoration: underline; color: rgb(0, 0, 0);">吴十</span>，身份证号码<span style="text-decoration: underline; color: rgb(0, 0, 0);">990011223344556677</span>，现任职于我公司，职位为<span style="text-decoration: underline; color: rgb(0, 0, 0);">技术支持</span>。因个人原因，特向公司提出离职申请，离职时间为<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年10月31日</span>。望予批准。</p><p style="text-align: right;">申请人：<br>日期：2023年10月1日</p>',
                // 通知类
                'txtz': '<h2 style="text-align: center;">通知</h2><p>各位同事：</p><p>我公司定于<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年10月15日</span>召开全体员工大会，地点为公司大会议室，时间为上午10:00。请各位准时参加。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                'hytz': '<h2 style="text-align: center;">会议通知</h2><p>各位同事：</p><p>我公司定于<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年10月20日</span>召开部门会议，地点为公司会议室，时间为下午2:00。请各位准时参加。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                'fjtz': '<h2 style="text-align: center;">放假通知</h2><p>各位同事：</p><p>根据国家法定节假日安排，我公司定于<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年10月1日至2023年10月7日</span>放假，共计7天。请各位提前做好工作安排，节后正常上班。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                'mstz': '<h2 style="text-align: center;">面试通知</h2><p>尊敬的<span style="text-decoration: underline; color: rgb(0, 0, 0);">张三</span>：</p><p>感谢您对我公司的关注与支持。我公司诚邀您参加面试，面试时间为<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年10月10日</span>，地点为公司总部，联系人为<span style="text-decoration: underline; color: rgb(0, 0, 0);">李四</span>，联系电话为<span style="text-decoration: underline; color: rgb(0, 0, 0);">123-45678901</span>。请携带相关资料准时参加。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                'hdtz': '<h2 style="text-align: center;">活动通知</h2><p>各位同事：</p><p>我公司定于<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年10月25日</span>举办团队建设活动，地点为市郊拓展基地，时间为上午9:00至下午5:00。请各位积极参与，增强团队凝聚力。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                'rmtz': '<h2 style="text-align: center;">入职通知</h2><p>尊敬的<span style="text-decoration: underline; color: rgb(0, 0, 0);">李四</span>：</p><p>恭喜您通过我公司的招聘考核，现正式通知您于<span style="text-decoration: underline; color: rgb(0, 0, 0);">2023年10月15日</span>入职，职位为<span style="text-decoration: underline; color: rgb(0, 0, 0);">软件工程师</span>，请携带相关资料准时报道。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                'zbtz': '<h2 style="text-align: center;">中标通知</h2><p>尊敬的<span style="text-decoration: underline; color: rgb(0, 0, 0);">王五</span>：</p><p>感谢您对我公司的支持与信任。我公司很高兴地通知您，您所投标的项目已中标，项目名称为<span style="text-decoration: underline; color: rgb(0, 0, 0);">智慧城市建设</span>，合同金额为人民币<span style="text-decoration: underline; color: rgb(0, 0, 0);">500万元</span>。请尽快与我公司联系，办理相关手续。</p><p style="text-align: right;">公司名称：<br>日期：2023年10月1日</p>',
                
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
        // 选择模板
        selectChange(e) {
            console.log(e.target.value, this.selectedTemplate[e.target.value]);
            if(!this.selectedTemplate[e.target.value]) {
                return alert('该模板正在完善中，敬请期待！')
            }
            // console.log('选择的模板:', );
            // 根据选择的模板加载相应的内容
            // 这里可以根据实际需求进行内容的加载和设置
            this.setContent(this.selectedTemplate[e.target.value]);    
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
    margin-bottom: 10px;
    background-color: transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
