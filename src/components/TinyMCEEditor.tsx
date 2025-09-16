import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import TurndownService from 'turndown';
import MarkdownIt from 'markdown-it';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface TinyMCEEditorProps {
    initialValue?: string;
    height?: number;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
    initialValue = '',
    height = 800
}) => {
    const editorRef = useRef<any>(null);
    const [content, setContent] = useState(initialValue);
    const [isMarkdownMode, setIsMarkdownMode] = useState(false);
    const [markdownContent, setMarkdownContent] = useState('');

    const turndownService = new TurndownService();
    const md = new MarkdownIt();

    // 导出为Word
    const exportToWord = async () => {
        try {
            const htmlContent = editorRef.current?.getContent() || content;
            const textContent = htmlContent.replace(/<[^>]*>/g, '');

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: textContent,
                                    font: 'Microsoft YaHei',
                                    size: 24
                                })
                            ]
                        })
                    ]
                }]
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, 'document.docx');
        } catch (error) {
            console.error('导出Word失败:', error);
            alert('导出Word失败，请检查内容格式');
        }
    };

    // 导出为Markdown
    const exportToMarkdown = () => {
        try {
            const htmlContent = editorRef.current?.getContent() || content;
            const markdown = turndownService.turndown(htmlContent);
            const blob = new Blob([markdown], { type: 'text/markdown' });
            saveAs(blob, 'document.md');
        } catch (error) {
            console.error('导出Markdown失败:', error);
            alert('导出Markdown失败');
        }
    };

    // 导出为PDF
    const exportToPDF = async () => {
        try {
            const { jsPDF } = await import('jspdf');
            const html2canvas = (await import('html2canvas')).default;

            const element = document.querySelector('.tox-edit-area iframe') as HTMLIFrameElement;
            if (element?.contentDocument?.body) {
                const canvas = await html2canvas(element.contentDocument.body);
                const imgData = canvas.toDataURL('image/png');

                const pdf = new jsPDF();
                const imgWidth = 210;
                const pageHeight = 295;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;

                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save('document.pdf');
            }
        } catch (error) {
            console.error('导出PDF失败:', error);
            alert('导出PDF失败');
        }
    };

    // TinyMCE配置 - 移除有问题的插件
    const editorConfig = {
        height: height,
        menubar: true,
        // 只使用稳定可用的插件
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'anchor',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
            'emoticons', 'codesample', 'pagebreak', 'nonbreaking', 'quickbars'
        ],
        // 紧凑的2行工具栏
        toolbar: [
            'code undo redo | cut copy paste | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify',
            'outdent indent | styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | table image media charmap emoticons pagebreak | insertdatetime preview | fullscreen | indent2em lineheight | templates | exportword exportmarkdown exportpdf'
        ],
        content_style: `
            body { 
                font-family: system-ui, Avenir, Helvetica, Arial, sans-serif; 
                font-size: 14px; 
                line-height: 1.6;
                margin: 1rem;
            }
            .indent2em { 
                text-indent: 2em; 
            }
        `,
        font_formats: [
            'Arial=arial,helvetica,sans-serif',
            'Times New Roman=times new roman,times,serif',
            'Courier New=courier new,courier,monospace',
            '微软雅黑=Microsoft YaHei',
            '宋体=SimSun',
            '黑体=SimHei'
        ].join('; '),
        fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
        image_advtab: true,
        image_uploadtab: true,
        file_picker_types: 'image',
        automatic_uploads: true,
        images_upload_handler: (blobInfo: any, success: any, failure: any) => {
            const reader = new FileReader();
            reader.onload = () => {
                success(reader.result);
            };
            reader.readAsDataURL(blobInfo.blob());
        },
        setup: (editor: any) => {
            // 添加首行缩进按钮
            editor.ui.registry.addButton('indent2em', {
                text: '首行缩进',
                onAction: () => {
                    editor.execCommand('mceToggleFormat', false, 'indent2em');
                }
            });

            // 添加模板功能 - 自定义实现
            editor.ui.registry.addMenuButton('templates', {
                text: '模板',
                fetch: (callback: any) => {
                    const items = [
                        {
                            type: 'menuitem',
                            text: '空白文档',
                            onAction: () => {
                                editor.setContent('<p>开始编辑您的文档...</p>');
                            }
                        },
                        {
                            type: 'menuitem',
                            text: '商务信函',
                            onAction: () => {
                                const template = `
                                    <p style="text-align: right;">[日期]</p>
                                    <p><br></p>
                                    <p>[收件人姓名]<br>
                                    [收件人职位]<br>
                                    [公司名称]<br>
                                    [地址]</p>
                                    <p><br></p>
                                    <p>尊敬的 [收件人姓名]：</p>
                                    <p class="indent2em">[正文内容...]</p>
                                    <p><br></p>
                                    <p>此致<br>
                                    敬礼！</p>
                                    <p><br></p>
                                    <p style="text-align: right;">[发件人姓名]<br>
                                    [职位]<br>
                                    [日期]</p>
                                `;
                                editor.setContent(template);
                            }
                        },
                        {
                            type: 'menuitem',
                            text: '工作报告',
                            onAction: () => {
                                const template = `
                                    <h1 style="text-align: center;">[报告标题]</h1>
                                    <p style="text-align: center;">报告人：[姓名] &nbsp;&nbsp;&nbsp;&nbsp; 日期：[日期]</p>
                                    <hr>
                                    <h2>一、工作概述</h2>
                                    <p class="indent2em">[工作概述内容...]</p>
                                    <h2>二、主要成果</h2>
                                    <ul>
                                        <li>[成果1]</li>
                                        <li>[成果2]</li>
                                        <li>[成果3]</li>
                                    </ul>
                                    <h2>三、存在问题</h2>
                                    <p class="indent2em">[问题描述...]</p>
                                    <h2>四、下一步计划</h2>
                                    <p class="indent2em">[计划内容...]</p>
                                `;
                                editor.setContent(template);
                            }
                        },
                        {
                            type: 'menuitem',
                            text: '会议纪要',
                            onAction: () => {
                                const template = `
                                    <h1 style="text-align: center;">会议纪要</h1>
                                    <p><strong>会议主题：</strong>[会议主题]</p>
                                    <p><strong>会议时间：</strong>[日期] [时间]</p>
                                    <p><strong>会议地点：</strong>[地点]</p>
                                    <p><strong>主持人：</strong>[主持人姓名]</p>
                                    <p><strong>参会人员：</strong>[参会人员列表]</p>
                                    <hr>
                                    <h2>会议议程</h2>
                                    <ol>
                                        <li>[议程1]</li>
                                        <li>[议程2]</li>
                                        <li>[议程3]</li>
                                    </ol>
                                    <h2>会议内容</h2>
                                    <p class="indent2em">[会议详细内容...]</p>
                                    <h2>决议事项</h2>
                                    <ul>
                                        <li>[决议1]</li>
                                        <li>[决议2]</li>
                                    </ul>
                                    <h2>待办事项</h2>
                                    <table border="1" style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <th>事项</th>
                                            <th>负责人</th>
                                            <th>完成时间</th>
                                        </tr>
                                        <tr>
                                            <td>[待办事项1]</td>
                                            <td>[负责人1]</td>
                                            <td>[时间1]</td>
                                        </tr>
                                    </table>
                                `;
                                editor.setContent(template);
                            }
                        }
                    ];
                    callback(items);
                }
            });

            // 添加导出Word按钮
            editor.ui.registry.addButton('exportword', {
                text: '导出Word',
                onAction: () => {
                    exportToWord();
                }
            });

            // 添加导出Markdown按钮
            editor.ui.registry.addButton('exportmarkdown', {
                text: '导出MD',
                onAction: () => {
                    exportToMarkdown();
                }
            });

            // 添加导出PDF按钮
            editor.ui.registry.addButton('exportpdf', {
                text: '导出PDF',
                onAction: () => {
                    exportToPDF();
                }
            });

            // 添加行高控制
            editor.ui.registry.addMenuButton('lineheight', {
                text: '行高',
                fetch: (callback: any) => {
                    const items = [
                        {
                            type: 'menuitem',
                            text: '单倍行距 (1.0)',
                            onAction: () => {
                                editor.execCommand('mceApplyFormat', false, {
                                    inline: 'span',
                                    styles: { 'line-height': '1.0' }
                                });
                            }
                        },
                        {
                            type: 'menuitem',
                            text: '1.5倍行距',
                            onAction: () => {
                                editor.execCommand('mceApplyFormat', false, {
                                    inline: 'span',
                                    styles: { 'line-height': '1.5' }
                                });
                            }
                        },
                        {
                            type: 'menuitem',
                            text: '双倍行距 (2.0)',
                            onAction: () => {
                                editor.execCommand('mceApplyFormat', false, {
                                    inline: 'span',
                                    styles: { 'line-height': '2.0' }
                                });
                            }
                        }
                    ];
                    callback(items);
                }
            });
        },
        formats: {
            indent2em: {
                block: 'p',
                classes: 'indent2em'
            }
        }
    };

    // 切换编辑模式
    const toggleMode = (val) => {
        if (isMarkdownMode) {
            // 从Markdown模式切换到富文本模式
            const htmlContent = md.render(markdownContent);
            setContent(htmlContent);
            if (editorRef.current) {
                editorRef.current.setContent(htmlContent);
            }
        } else {
            // 从富文本模式切换到Markdown模式
            const currentContent = editorRef.current?.getContent() || content;
            const markdown = turndownService.turndown(currentContent);
            setMarkdownContent(markdown);
        }
        setIsMarkdownMode(val)

    };

    // 处理内容变化
    const handleEditorChange = (newContent: string) => {
        setContent(newContent);
    };

    // 处理Markdown内容变化
    const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdownContent(e.target.value);
    };

    return (
        <div style={{ width: '100%' }}>
            {/* 模式切换按钮 */}
            <div style={{
                marginBottom: '15px',
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
            }}>
                <button
                    onClick={() => toggleMode(false)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                >
                    富文本编辑器
                </button>

                <button
                    onClick={() => toggleMode(true)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                >
                   Markdown编辑器
                </button>
               
            </div>

            {/* 编辑器区域 */}
            {isMarkdownMode ? (
                <div >
                    <div style={{ display: 'flex', gap: '15px', height: height }}>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Markdown 编辑</h4>
                            <textarea
                                value={markdownContent}
                                onChange={handleMarkdownChange}
                                style={{
                                    width: '100%',
                                    height: 'calc(100% - 40px)',
                                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                    fontSize: '14px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    padding: '15px',
                                    resize: 'none',
                                    lineHeight: '1.5',
                                    outline: 'none'
                                }}
                                placeholder="在这里输入Markdown内容..."
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>实时预览</h4>
                            <div
                                className="markdown-preview"
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    padding: '15px',
                                    height: 'calc(100% - 40px)',
                                    overflow: 'auto',
                                    backgroundColor: '#fafafa'
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: markdownContent ? md.render(markdownContent) : '<p style="color: #999;">预览区域</p>'
                                }}
                            />
                        </div>
                    </div>
                    <div style={{
                        marginTop: '15px',
                        display: 'flex',
                        gap: '10px',
                        padding: '10px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '6px'
                    }}>
                        <button onClick={exportToMarkdown}>导出 Markdown</button>
                        <button onClick={exportToWord}>导出 Word</button>
                        <button onClick={exportToPDF}>导出 PDF</button>
                    </div>
                </div>
            ) : (
                <Editor
                    apiKey="ku479bdrtp1z8ht83qnkqdn1zlpi3rtroh75e14onjiwm0c7"
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={content}
                    init={editorConfig}
                    onEditorChange={handleEditorChange}
                />
            )}
        </div>
    );
};

export default TinyMCEEditor;