// ディフォルトのリソースを設定
var resource = resource_1;

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

// 画面初期化
document.addEventListener('DOMContentLoaded', () => {

    RealtimeHtmlCssEditor.refresh();
    new BackgroundSelector();
    new PdfPrinter(2.5, 3.5);
});