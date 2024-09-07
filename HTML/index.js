// ディフォルトのリソースを設定
var resource = resource_1;


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


// プルダウンリスト・セレクター
class BackgroundSelector {

    constructor(realtimeHtmlCssEditor) {
        // 部品を取得
        this.selector = document.getElementById('background-selector');
        // 初期設定
        this.updateResource(this.selector.value);
        // セレクトイベント
        this.selector.addEventListener('change', (event) => {
            // 選択された値を取得する
            this.updateResource(event.target.value);
        });
    }

    updateResource(option) {
        // 選択肢の値に基づいてレイアウトを設定
        switch (option) {
            case 'resource_1':
                resource = resource_1;
                break;
            case 'resource_2':
                resource = resource_2;
                break;
            default:
                resource = resource_1;
                break;
        }
        // リフレッシュ
        RealtimeHtmlCssEditor.refresh();
    }
}


// PDF印刷
class PdfPrinter {

    constructor(pageWidth, pageHeight) {

        // 画像の幅と高さを設定します
        this.pageWidth = pageWidth; // ページの幅を2.5インチに設定します
        this.pageHeight = pageHeight; // ページの高さを3.5インチに設定します

        // jsPDFのインスタンスを作成し、ページサイズを2.5 x 3.5インチに設定する
        const {
            jsPDF
        } = window.jspdf;
        this.pdf = new jsPDF({
            orientation: 'p', // ページの向きを縦向きに設定
            unit: 'in', // 単位をインチに設定
            format: [pageWidth, pageHeight] // ページサイズを2.5 x 3.5インチに設定
        });

        // iframe を取得する
        const iframe = document.getElementById('output-iframe');
        // iframe 内のドキュメント内容を取得する
        this.iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        // 各内容の格納プロパティ名を取得
        this.attrs = resource["attrs"];

        // 印刷ボタン押下イベント
        document.getElementById('export-button').addEventListener('click', () => {
            // 内容毎に PDF を出力
            for (let i = 0; i < resource["content"].length; i++) {
                this.printOne(i);
            }
        });
    }

    // 一件印刷
    printOne(i) {

        // 内容を置き換える
        this.attrs.forEach(attr => {
            const docElement = this.iframeDocument.getElementById(attr);
            docElement.textContent = resource["content"][i][attr];
        });

        // html2canvasを使用して、iframeの内容を画像として取得する
        html2canvas(this.iframeDocument.body, {
            scale: 2, // レンダリングのスケール比率。高解像度を確保
            useCORS: true // クロスオリジンリソースシェアリング (CORS) を許可する
        }).then(canvas => {
            // canvasを画像データURLに変換する
            const imgData = canvas.toDataURL('image/png', 1.00); // PNG形式で画像を取得し、品質を1.00に設定

            // PDFに画像を追加する
            // x, y は画像の位置、width, height は画像の幅と高さ
            this.pdf.addImage(imgData, 'JPEG', 0, 0, this.pageWidth, this.pageHeight);

            // PDFファイルを保存する
            this.pdf.save(`${resource["name"]} ${i + 1}.pdf`);
        });
    }
}

// 画面初期化
document.addEventListener('DOMContentLoaded', () => {

    RealtimeHtmlCssEditor.refresh();
    new BackgroundSelector();
    new PdfPrinter(2.5, 3.5);
});