<template>
    <div id="app">
        <div class="tabs">
            <div
                 v-for="tab in tabs"
                 :key="tab.name"
                 :class="['tab', { active: tab.name === activeTab }]"
                 @click="activeTab = tab.name">
                {{ lang === 'zh' ? tab.label : tab.label_en }}
            </div>
        </div>
        <div class="tab-content">
            <Tinymce v-model="content" :height="900" v-if="activeTab === 'rich'" />
            <div v-else-if="activeTab === 'markdown'" class="markdown-box">
                <MarkdownEditor />
                    <!-- 这里可以放你的Markdown组件 -->
            </div>
            <div v-else-if="activeTab === 'ocr'" class="ocr-box">
                <h2>{{ lang === 'zh' ? 'OCR识别' : 'OCR Recognition' }}</h2>
                <!-- 这里可以放你的OCR组件 -->
            </div>
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
                { name: 'rich', label: '富文本编辑器', label_en: 'Rich Text Editor' },
                { name: 'markdown', label: 'Markdown编辑器', label_en: 'Markdown Editor' },
                { name: 'ocr', label: 'OCR识别', label_en: 'OCR Recognition' }
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
    background: #fff;
    border-bottom: 1px solid #eaeaea;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.tab {
    padding: 14px 32px;
    font-size: 16px;
    color: #666;
    cursor: pointer;
    transition: color 0.2s, border-bottom 0.2s;
    border-bottom: 2px solid transparent;
}

.tab.active {
    color: #409eff;
    border-bottom: 2px solid #409eff;
    background: #f7f8fa;
}

.tab-content {
    padding: 2vh 20vw;
    min-height: 70vh;
    background: #fff;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.markdown-box,
.json-box {
    text-align: center;
    color: #888;
}
</style>