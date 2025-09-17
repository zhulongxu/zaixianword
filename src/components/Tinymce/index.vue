<template>
    <div :class="{ fullscreen: fullscreen }" class="tinymce-container" :style="{ width: containerWidth }">
        <textarea :id="tinymceId" class="tinymce-textarea" />
        <div class="editor-custom-btn-container">
            <!-- <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" /> -->

            <!-- <img class="tool-img" src="/save.svg" alt="" srcset=""> -->
            <img class="tool-img zhen" src="/zhen.svg" alt="11" srcset="">
            <img class="tool-img zhen" src="/print.svg" alt="11" srcset="">
            <img class="tool-img" src="/save.svg" alt="11" srcset="">
        </div>

        <!-- 上传word pdf 编辑 -->


        <div class="footer">
            <button>
                DOCX
                <img class="tool-img" src="/eword.svg" alt="" srcset="">
            </button>
            <button>
                PDF
                <img class="tool-img" src="/pdf.svg" alt="" srcset="">
            </button>
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
            }
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

.footer {
    display: flex;
    justify-content: start;
    border-top: 1px solid #eee;
    padding-top: 1vh;

    .tool-img {
        width: calc(15/1920 * 100vw);
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        cursor: pointer;
        background-color: #e3f2fd;
        width: calc(60/1920 * 100vw);
        height: calc(30/1920 * 100vw);
        border: none;
        border-radius: calc(4/1920 * 100vw);
    }
}

.tinymce-container {
    ::v-deep {
        .mce-fullscreen {
            z-index: 10000;
        }
    }
}

.zhen {
    margin-right: 0.5vw;
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
    /*z-index: 2005;*/

}

.editor-custom-save-container {
    position: absolute;
    right: 30vw;
    top: 3vh;
}

.editor-upload-btn {
    display: inline-block;
}
</style>
