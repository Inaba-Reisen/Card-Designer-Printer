// リアルタイム編集部品
class RealtimeEditor {

    // 部品を取得
    static outputIframe = document.getElementById('output-iframe');

    static resetButton = document.getElementById('reset');

    static htmlTab = document.getElementById('html-tab');
    static cssTab = document.getElementById('css-tab');
    static cacheTab = document.getElementById('cache-tab');

    static htmlPanel = document.getElementById('html-panel');
    static cssPanel = document.getElementById('css-panel');
    static cachePanel = document.getElementById('cache-panel');

    static htmlEditor = document.getElementById('html-editor');
    static cssEditor = document.getElementById('css-editor');

    static cacheTable = document.getElementById('cache-table');
    static fileInput = document.getElementById('file-input');
    static importBtn = document.getElementById('import-btn');

    // イベント・バインディング
    static {
        // タブの切り替え
        this.htmlTab.addEventListener('click', () => {
            this.htmlTab.setAttribute('aria-selected', 'true');
            this.cssTab.setAttribute('aria-selected', 'false');
            this.cacheTab.setAttribute('aria-selected', 'false');
            this.htmlPanel.classList.remove('hidden');
            this.cssPanel.classList.add('hidden');
            this.cachePanel.classList.add('hidden');
        });
        this.cssTab.addEventListener('click', () => {
            this.htmlTab.setAttribute('aria-selected', 'false');
            this.cssTab.setAttribute('aria-selected', 'true');
            this.cacheTab.setAttribute('aria-selected', 'false');
            this.htmlPanel.classList.add('hidden');
            this.cssPanel.classList.remove('hidden');
            this.cachePanel.classList.add('hidden');
        });
        this.cacheTab.addEventListener('click', () => {
            this.htmlTab.setAttribute('aria-selected', 'false');
            this.cssTab.setAttribute('aria-selected', 'false');
            this.cacheTab.setAttribute('aria-selected', 'true');
            this.htmlPanel.classList.add('hidden');
            this.cssPanel.classList.add('hidden');
            this.cachePanel.classList.remove('hidden');
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

        // キャッシュ・テーブルの行をクリック
        this.cacheTable.addEventListener('click', this.rowClick);

        // インポート・ボタン
        this.fileInput.addEventListener('change', this.importJson.bind(this));
        this.importBtn.addEventListener('click', this.callFileInputChange.bind(this));
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

    // キャッシュ・テーブルの行をクリック
    static rowClick(event) {

        // 行の特定
        let row = event.target; // クリックされた要素のタグ名を取得
        // クリックされた要素が <td> か <button> または <span> であれば、親要素である <tr> を見つける
        while (row && row.tagName !== 'TR') {
            row = row.parentElement;
        }
        // 見つけた <tr> 要素から ID を取得
        if (row && row.tagName === 'TR') {
            const rowId = row.id;
            // console.log(rowId); // 行の ID をコンソールに出力
        } else {
            console.log('行が見つかりませんでした。');
        }

        // 動作の分岐
        if (event.target && event.target.tagName === 'BUTTON') {
            switch (event.target.action) {
                case 'export':
                    console.log(`${row.id} をエクスポート済み`);
                    break;
                case 'delete':
                    // テーブルから行を削除
                    row.parentElement.removeChild(row);
                    console.log(`${row.id} を削除済み`);
                    break;
                default:
                    break;
            }
        } else {
            console.log('do show');
        }
    }

    // インポート
    static importJson(event) {
        // ファイルが選択されているか確認
        if (event.target.files.length === 0) {
            alert('ファイルが選択されていません。');
            return;
        }

        // 最初に選択されたファイルを取得
        const file = event.target.files[0];

        // ファイルが.jsonファイルか確認
        if (!file.name.endsWith('.json')) {
            alert('JSONファイルを選択してください。');
            return;
        }

        // FileReaderを使用してファイルを読み込む
        const reader = new FileReader();

        reader.onload = (e) => {
            // ファイルの内容を取得
            const jsonContent = e.target.result;

            // JSON文字列をJavaScriptオブジェクトに変換する
            let jsonData;
            try {
                jsonData = JSON.parse(jsonContent);
                console.log('JSONデータ取得済み:', jsonData); // コンソールにJSONデータを表示
            } catch (error) {
                console.error('JSONの解析エラー:', error);
            }

            // 挿入先の要素を取得
            const table = this.cacheTable;

            // id 重複チェック
            if (document.getElementById(jsonData.id)) {
                // 重複している場合、エラーメッセージを表示する
                console.log(`${jsonData.id} は既に存在していますので、行を追加不可`);
                alert(`${jsonData.id} は既に存在していますので、再追加不可。`);

            } else {
                // 新しい行を作成
                const newRow = document.createElement('tr');
                // 新しい行にIDを設定
                newRow.id = jsonData.id;

                // 新しいセルを作成
                const cell1 = document.createElement('td');
                const titleSpan = document.createElement('span');
                titleSpan.textContent = jsonData.id;
                cell1.appendChild(titleSpan);

                const cell2 = document.createElement('td');
                const exportButton = document.createElement('button');
                exportButton.action = 'export';
                exportButton.className = 'button-style-base';
                exportButton.textContent = 'エクスポート';
                cell2.appendChild(exportButton);

                const cell3 = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.action = 'delete';
                deleteButton.className = 'button-style-base button-style-red';
                deleteButton.textContent = '削除';
                cell3.appendChild(deleteButton);

                // 行に新しいセルを追加
                newRow.appendChild(cell1);
                newRow.appendChild(cell2);
                newRow.appendChild(cell3);

                // 作成した行を追加
                table.appendChild(newRow);
                console.log('行を追加済み');
            }
        };

        // ファイルをテキストとして読み込む
        reader.readAsText(file);
    }
    static callFileInputChange() {

        // ボタンがクリックされたときにファイル選択ダイアログを開く
        this.fileInput.click();
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
                        font-family: 'Times New Roman', 'MS Mincho'; /* 明朝体のフォントファミリーを設定します。 */
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