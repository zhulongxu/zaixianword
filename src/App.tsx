import React from 'react'
import './App.css'
import TinyMCEEditor from './components/TinyMCEEditor'

function App() {
  return (
    <div className="App">
      <div style={{ padding: '20px' }}>
        {/* <h1>在线Word编辑器</h1> */}
        {/* <p>支持富文本编辑、Markdown模式和多种格式导出</p> */}
        <TinyMCEEditor 
          initialValue="<p>欢迎使用在线Word编辑器！</p>"
          height={600}
        />
      </div>
    </div>
  )
}

export default App
