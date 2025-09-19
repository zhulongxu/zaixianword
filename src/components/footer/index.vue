<template>
  <footer class="site-footer" role="contentinfo" aria-label="site footer">
    <div class="footer-inner">
      <div class="footer-col about" aria-label="about">
        <div class="brand">
          <div class="logo" aria-hidden="true">
            <!-- simple svg logo (black/white friendly) -->
            <svg viewBox="0 0 64 64" class="logo-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ZaixianWord">
              <circle cx="32" cy="32" r="30" fill="#0b0b0b"/>
              <g transform="translate(10,10)" fill="#fff">
                <path d="M6 6h28v6H6zM6 18h20v6H6zM6 30h28v6H6z"/>
              </g>
            </svg>
          </div>
          <div class="brand-text">
            <div class="title">ZaixianWord</div>
            <div class="tagline">{{ lang === 'zh' ? '在线文档与编辑器' : 'Online document & editor' }}</div>
          </div>
        </div>

        <p class="desc">
          {{ lang === 'zh'
            ? 'ZaixianWord 提供富文本、Markdown 与 OCR 等编辑工具，旨在帮助用户高效创作与导出文档。'
            : 'ZaixianWord provides rich text, Markdown and OCR tools to help users create and export documents efficiently.' }}
        </p>
      </div>

      <nav class="footer-col links" aria-label="useful links">
        <h4>{{ lang === 'zh' ? '常用链接' : 'Useful Links' }}</h4>
        <ul>
          <li><a href="#" @click.prevent="goHome">{{ lang === 'zh' ? '首页' : 'Home' }}</a></li>
          <li><a href="#editor">{{ lang === 'zh' ? '编辑器' : 'Editor' }}</a></li>
          <li><a href="#markdown">{{ lang === 'zh' ? 'Markdown 教程' : 'Markdown Guide' }}</a></li>
          <li><a href="#ocr">{{ lang === 'zh' ? 'OCR 识别' : 'OCR' }}</a></li>
        </ul>
      </nav>

      <div class="footer-col contact" aria-label="contact">
        <h4>{{ lang === 'zh' ? '联系我们' : 'Contact' }}</h4>
        <address>
          <div>{{ lang === 'zh' ? '邮箱' : 'Email' }}: <a href="mailto:hello@zaixianword.local">hello@zaixianword.local</a></div>
          <div>{{ lang === 'zh' ? '文档' : 'Docs' }}: <a href="#" target="_blank" rel="noopener">README</a></div>
        </address>

        <div class="social">
          <a class="social-btn" href="#" aria-label="github" title="GitHub" @click.prevent>
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.67 3.03 8.63 7.24 10.03.53.1.72-.23.72-.51 0-.25-.01-.92-.01-1.8-2.95.64-3.57-1.42-3.57-1.42-.48-1.23-1.17-1.56-1.17-1.56-.96-.66.07-.65.07-.65 1.06.08 1.62 1.09 1.62 1.09.94 1.61 2.47 1.15 3.07.88.09-.69.37-1.15.67-1.41-2.36-.27-4.84-1.18-4.84-5.24 0-1.16.41-2.11 1.09-2.86-.11-.27-.47-1.36.1-2.84 0 0 .88-.28 2.88 1.09a9.9 9.9 0 0 1 2.62-.35c.89 0 1.79.12 2.62.35 2-.37 2.88-1.09 2.88-1.09.57 1.48.21 2.57.1 2.84.68.75 1.09 1.7 1.09 2.86 0 4.07-2.49 4.97-4.86 5.23.38.33.72.98.72 1.98 0 1.43-.01 2.58-.01 2.93 0 .28.19.62.73.51C20 20.12 23 16.17 23 11.5 23 5.24 18.27.5 12 .5z"/></svg>
          </a>
          <a class="social-btn" href="#" aria-label="twitter" title="Twitter" @click.prevent>
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M22 5.92c-.63.28-1.3.47-2.01.56.72-.43 1.27-1.12 1.53-1.94-.67.4-1.41.69-2.2.85C18.84 4.5 17.9 4 16.85 4c-1.61 0-2.92 1.3-2.92 2.92 0 .23.02.45.07.67-2.43-.12-4.58-1.29-6.02-3.07-.25.42-.39.9-.39 1.42 0 .98.5 1.85 1.26 2.36-.47-.01-.91-.14-1.3-.36v.04c0 1.37.97 2.51 2.26 2.77-.23.06-.46.09-.7.09-.17 0-.34-.02-.5-.05.34 1.06 1.32 1.83 2.49 1.85-1 .78-2.25 1.25-3.61 1.25-.23 0-.45-.01-.67-.04 1.28.82 2.8 1.3 4.44 1.3 5.33 0 8.25-4.42 8.25-8.25v-.38c.57-.41 1.06-.92 1.45-1.51-.52.23-1.07.39-1.64.46z"/></svg>
          </a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="copyright">
        © {{ currentYear }} ZaixianWord. {{ lang === 'zh' ? '版权所有' : 'All rights reserved.' }}
      </div>
      <div class="policy">
        <a href="#privacy">{{ lang === 'zh' ? '隐私政策' : 'Privacy' }}</a>
        <span class="sep">•</span>
        <a href="#terms">{{ lang === 'zh' ? '使用条款' : 'Terms' }}</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
    name: 'AppFooter',
    data() {
        return {
            lang: '',
            openIndex: -1
        }
    },
    computed: {
        currentYear() {
            return new Date().getFullYear()
        }
    },
    created() {
        let l = (navigator.language || navigator.userLanguage || 'en').toLowerCase()
        this.lang = l.startsWith('zh') ? 'zh' : 'en'
    },
    methods: {
        goHome() {
            // prefer router if available
            if (this.$router) {
                this.$router.push({ path: '/' })
            } else {
                window.location.href = '/'
            }
        }
    }
}
</script>

<style scoped>
.site-footer {
    background: linear-gradient(180deg, #ffffff, #f4f6f9);
    color: #233039;
    padding: 32px 16px 20px;
    border-top: 1px solid rgba(35, 48, 57, 0.06);
    font-size: 14px;
    margin-top: 10px;
}

.footer-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr;
    gap: 20px;
    align-items: start;
}

.brand {
    display: flex;
    gap: 12px;
    align-items: center;
}

.logo-svg {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    transition: transform .4s ease;
}

.logo-svg:hover {
    transform: rotate(12deg) scale(1.02);
}

.brand-text .title {
    font-weight: 700;
    color: #0b0b0b;
    font-size: 16px;
}

.brand-text .tagline {
    font-size: 12px;
    color: #6b7280;
}

.desc {
    margin-top: 12px;
    color: #415057;
    line-height: 1.6;
    max-width: 44ch;
}

/* links */
.footer-col h4 {
    margin: 0 0 10px;
    font-size: 15px;
    color: #0b0b0b;
}

.footer-col ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-col a {
    color: #0b68d8;
    text-decoration: none;
}

.footer-col a:hover {
    text-decoration: underline;
}

/* contact & social */
.contact address {
    font-style: normal;
    color: #415057;
    line-height: 1.6;
}

.social {
    margin-top: 10px;
    display: flex;
    gap: 8px;
}

.social-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: #fff;
    color: #0b0b0b;
    box-shadow: 0 4px 10px rgba(11, 11, 11, 0.06);
    transition: transform .18s ease, box-shadow .18s ease;
}

.social-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px rgba(11, 11, 11, 0.08);
}

.social-btn svg {
    width: 18px;
    height: 18px;
}

/* bottom bar */
.footer-bottom {
    max-width: 1100px;
    margin: 18px auto 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding-top: 18px;
    border-top: 1px solid rgba(35, 48, 57, 0.04);
}

.policy a {
    color: #556;
    text-decoration: none;
    margin: 0 6px;
}

.policy a:hover {
    text-decoration: underline;
    color: #0b68d8;
}

.sep {
    color: #c8ccd0;
    margin: 0 6px;
}

/* responsive */
@media (max-width: 900px) {
    .footer-inner {
        grid-template-columns: 1fr;
    }

    .footer-bottom {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}
</style>
```// filepath: d:\mycodes\zaixianword\worddemo\src\components\footer\index.vue
// ...existing code...
<template>
    <footer class="site-footer" role="contentinfo" aria-label="site footer">
        <div class="footer-inner">
            <div class="footer-col about" aria-label="about">
                <div class="brand">
                    <div class="logo" aria-hidden="true">
                        <!-- simple svg logo (black/white friendly) -->
                        <svg viewBox="0 0 64 64" class="logo-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ZaixianWord">
                            <circle cx="32" cy="32" r="30" fill="#0b0b0b" />
                            <g transform="translate(10,10)" fill="#fff">
                                <path d="M6 6h28v6H6zM6 18h20v6H6zM6 30h28v6H6z" />
                            </g>
                        </svg>
                    </div>
                    <div class="brand-text">
                        <div class="title">ZaixianWord</div>
                        <div class="tagline">{{ lang === 'zh' ? '在线文档与编辑器' : 'Online document & editor' }}</div>
                    </div>
                </div>

                <p class="desc">
                    {{ lang === 'zh'
                        ? 'ZaixianWord 提供富文本、Markdown 与 OCR 等编辑工具，旨在帮助用户高效创作与导出文档。'
                        : 'ZaixianWord provides rich text, Markdown and OCR tools to help users create and export documents efficiently.' }}
                </p>
            </div>

            <nav class="footer-col links" aria-label="useful links">
                <h4>{{ lang === 'zh' ? '常用链接' : 'Useful Links' }}</h4>
                <ul>
                    <li><a href="#" @click.prevent="goHome">{{ lang === 'zh' ? '首页' : 'Home' }}</a></li>
                    <li><a href="#editor">{{ lang === 'zh' ? '编辑器' : 'Editor' }}</a></li>
                    <li><a href="#markdown">{{ lang === 'zh' ? 'Markdown 教程' : 'Markdown Guide' }}</a></li>
                    <li><a href="#ocr">{{ lang === 'zh' ? 'OCR 识别' : 'OCR' }}</a></li>
                </ul>
            </nav>

            <div class="footer-col contact" aria-label="contact">
                <h4>{{ lang === 'zh' ? '联系我们' : 'Contact' }}</h4>
                <address>
                    <div>{{ lang === 'zh' ? '邮箱' : 'Email' }}: <a href="mailto:hello@zaixianword.local">hello@zaixianword.local</a></div>
                    <div>{{ lang === 'zh' ? '文档' : 'Docs' }}: <a href="#" target="_blank" rel="noopener">README</a></div>
                </address>

                <div class="social">
                    <a class="social-btn" href="#" aria-label="github" title="GitHub" @click.prevent>
                        <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.67 3.03 8.63 7.24 10.03.53.1.72-.23.72-.51 0-.25-.01-.92-.01-1.8-2.95.64-3.57-1.42-3.57-1.42-.48-1.23-1.17-1.56-1.17-1.56-.96-.66.07-.65.07-.65 1.06.08 1.62 1.09 1.62 1.09.94 1.61 2.47 1.15 3.07.88.09-.69.37-1.15.67-1.41-2.36-.27-4.84-1.18-4.84-5.24 0-1.16.41-2.11 1.09-2.86-.11-.27-.47-1.36.1-2.84 0 0 .88-.28 2.88 1.09a9.9 9.9 0 0 1 2.62-.35c.89 0 1.79.12 2.62.35 2-.37 2.88-1.09 2.88-1.09.57 1.48.21 2.57.1 2.84.68.75 1.09 1.7 1.09 2.86 0 4.07-2.49 4.97-4.86 5.23.38.33.72.98.72 1.98 0 1.43-.01 2.58-.01 2.93 0 .28.19.62.73.51C20 20.12 23 16.17 23 11.5 23 5.24 18.27.5 12 .5z" />
                        </svg>
                    </a>
                    <a class="social-btn" href="#" aria-label="twitter" title="Twitter" @click.prevent>
                        <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22 5.92c-.63.28-1.3.47-2.01.56.72-.43 1.27-1.12 1.53-1.94-.67.4-1.41.69-2.2.85C18.84 4.5 17.9 4 16.85 4c-1.61 0-2.92 1.3-2.92 2.92 0 .23.02.45.07.67-2.43-.12-4.58-1.29-6.02-3.07-.25.42-.39.9-.39 1.42 0 .98.5 1.85 1.26 2.36-.47-.01-.91-.14-1.3-.36v.04c0 1.37.97 2.51 2.26 2.77-.23.06-.46.09-.7.09-.17 0-.34-.02-.5-.05.34 1.06 1.32 1.83 2.49 1.85-1 .78-2.25 1.25-3.61 1.25-.23 0-.45-.01-.67-.04 1.28.82 2.8 1.3 4.44 1.3 5.33 0 8.25-4.42 8.25-8.25v-.38c.57-.41 1.06-.92 1.45-1.51-.52.23-1.07.39-1.64.46z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="copyright">
                © {{ currentYear }} ZaixianWord. {{ lang === 'zh' ? '版权所有' : 'All rights reserved.' }}
            </div>
            <div class="policy">
                <a href="#privacy">{{ lang === 'zh' ? '隐私政策' : 'Privacy' }}</a>
                <span class="sep">•</span>
                <a href="#terms">{{ lang === 'zh' ? '使用条款' : 'Terms' }}</a>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      lang: '',
      openIndex: -1
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  },
  created() {
    let l = (navigator.language || navigator.userLanguage || 'en').toLowerCase()
    this.lang = l.startsWith('zh') ? 'zh' : 'en'
  },
  methods: {
    goHome() {
      // prefer router if available
      if (this.$router) {
        this.$router.push({ path: '/' })
      } else {
        window.location.href = '/'
      }
    }
  }
}
</script>

<style scoped>
.site-footer {
    background: linear-gradient(180deg, #ffffff, #f4f6f9);
    color: #233039;
    padding: 32px 16px 20px;
    border-top: 1px solid rgba(35, 48, 57, 0.06);
    font-size: 14px;
}

.footer-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr;
    gap: 20px;
    align-items: start;
}

.brand {
    display: flex;
    gap: 12px;
    align-items: center;
}

.logo-svg {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    transition: transform .4s ease;
}

.logo-svg:hover {
    transform: rotate(12deg) scale(1.02);
}

.brand-text .title {
    font-weight: 700;
    color: #0b0b0b;
    font-size: 16px;
}

.brand-text .tagline {
    font-size: 12px;
    color: #6b7280;
}

.desc {
    margin-top: 12px;
    color: #415057;
    line-height: 1.6;
    max-width: 44ch;
}

/* links */
.footer-col h4 {
    margin: 0 0 10px;
    font-size: 15px;
    color: #0b0b0b;
}

.footer-col ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-col a {
    color: #0b68d8;
    text-decoration: none;
}

.footer-col a:hover {
    text-decoration: underline;
}

/* contact & social */
.contact address {
    font-style: normal;
    color: #415057;
    line-height: 1.6;
}

.social {
    margin-top: 10px;
    display: flex;
    gap: 8px;
}

.social-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: #fff;
    color: #0b0b0b;
    box-shadow: 0 4px 10px rgba(11, 11, 11, 0.06);
    transition: transform .18s ease, box-shadow .18s ease;
}

.social-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px rgba(11, 11, 11, 0.08);
}

.social-btn svg {
    width: 18px;
    height: 18px;
}

/* bottom bar */
.footer-bottom {
    max-width: 1100px;
    margin: 18px auto 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding-top: 18px;
    border-top: 1px solid rgba(35, 48, 57, 0.04);
}

.policy a {
    color: #556;
    text-decoration: none;
    margin: 0 6px;
}

.policy a:hover {
    text-decoration: underline;
    color: #0b68d8;
}

.sep {
    color: #c8ccd0;
    margin: 0 6px;
}

/* responsive */
@media (max-width: 900px) {
    .footer-inner {
        grid-template-columns: 1fr;
    }

    .footer-bottom {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}
</style>