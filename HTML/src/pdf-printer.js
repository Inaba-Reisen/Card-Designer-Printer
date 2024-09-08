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