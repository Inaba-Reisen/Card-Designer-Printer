// リアルタイム HTML/CSS 部品
class RealtimeHtmlCssEditor {

    // 部品を取得
    static outputIframe = document.getElementById('output-iframe');
    static resetButton = document.getElementById('reset');
    static htmlTab = document.getElementById('html-tab');
    static cssTab = document.getElementById('css-tab');
    static htmlPanel = document.getElementById('html-panel');
    static cssPanel = document.getElementById('css-panel');
    static htmlEditor = document.getElementById('html-editor');
    static cssEditor = document.getElementById('css-editor');

    // イベント・バインディング
    static {
        // タブの切り替え
        this.htmlTab.addEventListener('click', () => {
            this.htmlTab.setAttribute('aria-selected', 'true');
            this.cssTab.setAttribute('aria-selected', 'false');
            this.htmlPanel.classList.remove('hidden');
            this.cssPanel.classList.add('hidden');
        });
        this.cssTab.addEventListener('click', () => {
            this.htmlTab.setAttribute('aria-selected', 'false');
            this.cssTab.setAttribute('aria-selected', 'true');
            this.htmlPanel.classList.add('hidden');
            this.cssPanel.classList.remove('hidden');
        });

        // リアルタイム呼出
        this.htmlEditor.addEventListener('input', this.updateOutput.bind(this));
        this.cssEditor.addEventListener('input', this.updateOutput.bind(this));

        // リセット・ボタン (Reset Button)
        this.resetButton.addEventListener('click', () => {
            this.htmlEditor.value = '';
            this.cssEditor.value = '';
            this.updateOutput();
        });

        // テキストエリアのキーイベントリスナーを設定
        this.htmlEditor.addEventListener('keydown', this.validTabkey);
        this.cssEditor.addEventListener('keydown', this.validTabkey);
    }

    // キーイベント
    static validTabkey(event) {
        // Tabキーが押された場合
        if (event.key === 'Tab') {
            event.preventDefault(); // デフォルトのTabキーの動作をキャンセル
            const target = event.target;

            const start = target.selectionStart; // カーソルの開始位置
            const end = target.selectionEnd; // カーソルの終了位置

            // 現在のカーソル位置に制表符を挿入
            target.value = target.value.substring(0, start) + '\t' + target.value.substring(end);

            // カーソル位置を更新
            target.selectionStart = target.selectionEnd = start + 1;
        }
    }

    // 表示メソッド
    static updateOutput() {
        const htmlContent = this.htmlEditor.value;
        const cssContent = this.cssEditor.value;
        const doc = this.outputIframe.contentDocument || this.outputIframe.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html lang="jp">
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    /* ズレ防止のため、全てのディフォルト margin を無効化 */
                    * {
                        margin: 0;
                    }
                    /* 背景画像とスタイルの設定 */
                    body {
                        padding: 0;
                        background-image: url(${resource["layout"]["background"]});
                        background-size: cover; /* 背景画像がコンテナ全体に覆われるようにします */
                        background-position: center; /* 背景画像を中央に配置します */
                        background-repeat: no-repeat; /* 背景画像を繰り返さずに表示します */
                        height: 100vh; /* コンテナの高さをビューポートの高さに合わせます */
                        overflow-wrap: break-word; /* 長い文字列を改行させる */
                        overflow: hidden; /* スクロール無効化 */
                    }
                    ${cssContent}
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `);
        doc.close();
    }

    // リフレッシュ
    static refresh() {
        this.htmlEditor.value = resource["layout"]["html"];
        this.cssEditor.value = resource["layout"]["css"];
        this.updateOutput();
    }
}