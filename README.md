・導入ガイド(バックエンド)
[npm install]
まずこれで必要なパッケージをインストールする。
.envファイルはgitignoreに登録されているため手渡しする。配置するディレクトリは(Unichat_backend_system/)の直下に配置
.envファイルについては、config.jsにコメントで記載している

・Postmanについて
Postmanとは、簡単にPostやGetをしてAPIをテストすることができる便利なツール。
下記のサイトよりインストールする
https://www.postman.com/downloads/

各種設定したら、インポートボタンよりtoolsフォルダにある[UniCat_test.postman_collection.json]を読み込むと環境テストでつかっている命令が読み込める

・DBの設定
MongoDBを下記のサイトからインストールする
https://www.mongodb.com/try/download/community

インストール後アプリケーションを開いて、+ボタンよりnameを“UniChat”に設定する。URLはおそらく“mongodb://localhost:xxxxx/”となっていると思う。
環境によって変わると思うのでそれもとりあえず.envファイルの[DBURL]に書き込むようにすることにした。書き込む内容は以下のようにする
mongodb://localhost:xxxxx/UniChat

・サーバーの起動の仕方
[npm run dev]
ターミナルにて、ディレクトリをUnichat_backend_systemにした後、上記のコマンドでサーバーが起動する
すべての設定がうまくいっていると
Running
Database connected
と表示されるはず。以上で環境は自分と一緒になった


・現在の状況
とりあえず以下の機能がテスト的に実装されている
・アカウントの作成(PWの暗号化、トークンの発行、DBへの記録)
・ログイン(トークンでのログインとメアドとPWによるログイン)
・Post機能(これは今現在開発中の部分で、とりあえずトークンが有効な場合のみ入力された内容を投稿してDBに記録し閲覧できるAPIができてる)


各スクリプトファイルに今現在の状況と軽いコードの説明が書いてあるが、正直それらの説明は口頭でした方が早いと思うのでそうする。