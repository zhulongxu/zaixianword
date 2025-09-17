<template>
    <div class="components-container">
        <div class="editor-container">
            <markdown-editor v-model="content1" height="900px" :language="language"  />
        </div>

        <button style="margin-top:80px;" type="primary" icon="icon-document" @click="getHtml">
            Get HTML
        </button>
        <div v-html="html" />
    </div>
</template>

<script>
import MarkdownEditor from './MarkdownEditor/index.vue'

const content = `
**This is test**
* vue
* element
* webpack

`
export default {
    name: 'MarkdownDemo',
    components: { MarkdownEditor },
    data() {
        return {
            lang: (navigator.language || navigator.userLanguage).toLowerCase(),
            content1: content,
            html: '',
            languageTypeList: {
                'en': 'en_US',
                'zh': 'zh_CN',
                'es': 'es_ES'
            }
        }
    },
    computed: {
        language() {
            return this.languageTypeList[this.lang] || 'en_US'
        }
    },
    methods: {
        getHtml() {
            this.html = this.$refs.markdownEditor.getHtml()
            console.log(this.html)
        }
    }
}
</script>

<style scoped>
.editor-container {
    margin-bottom: 30px;
}

.tag-title {
    margin-bottom: 5px;
}
</style>
