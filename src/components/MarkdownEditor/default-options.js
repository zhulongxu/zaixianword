// doc: https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#ToastUIEditor
export default {
    minHeight: '200px',
    previewStyle: 'vertical',
    useCommandShortcut: true,
    useDefaultHTMLSanitizer: true,
    usageStatistics: true,
    hideModeSwitch: true,
    toolbarItems: [
        'heading', 'bold', 'italic', 'strike', 'divider', 'hr', 'quote',
        'divider', 'ul', 'ol', 'task', 'indent', 'outdent', 'divider',
        'table', 'image', 'link', 'divider', 'code', 'codeblock',
        // 自定义按钮（对象格式）
        // { type: 'button', options: { name: 'exportMd', className: 'tui-export-md', event: 'exportMd', tooltip: '导出 Markdown' } },
        // { type: 'button', options: { name: 'exportHtml', className: 'tui-export-html', event: 'exportHtml', tooltip: '导出 HTML' } }
    ]
}
