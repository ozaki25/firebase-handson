# Firebase Handson

## 使い方

### セットアップ

- vuepressをglobalにインストール

```bash
npm i -g vuepress
vuepress -V
# 0.14.4
```

### 雛形のクローン

```bash
git clone https://github.com/ozaki25/firebase-handson.git
cd vuepress_template
```

### 開発モード

- 開発モードで起動すると`localhost:8080`でプレビューできる

```bash
npm start # or yarn start
# open http://localhost:8080
```

- `docs`配下のmdファイルを修正すると自動でブラウザがリロードされる

### 本番モード

- ビルドすると`docs/.vuepress/dist`にhtml, css, jsが生成される

```bash
npm run build # or yarn build
```

- `docs/.vuepress/dist`配下をWebサーバ等にデプロイすればコンテンツを公開できる
- github pagesがお手軽で便利
    - 公式サイトで手順が紹介されている
    - [https://vuepress.vuejs.org/guide/deploy.html#github-pages](https://vuepress.vuejs.org/guide/deploy.html#github-pages)
- buildした成果物をローカルで動作確認するには`http-server`が便利

```bash
npm i -g http-server
http-server ./docs/.vuepress/dist
# open http://localhost:8080
```

### ファイルの配置

#### mdファイル

- `docs`配下に配置する
- 必要に応じてディレクトリをきることも可能

#### サイドメニューの設定

- `docs/.vuepress/config.js`に定義する
- サンプル参照
    - [/docs/.vuepress/config.js](./docs/.vuepress/config.js#L4)

#### 画像の配置

- 画像ファイルは`docs/.vuepress/public/`配下に配置することでmdファイルから使用することができる

```
// ここに画像があるとする
docs/.vuepress/public/images/logo.png
```

```md
// mdファイルからこのようにしてpublic配下のファイルを呼ぶことができる
![logo](/images/logo.png)
```

#### テーマの変更

- `docs/.vuepress/override.styl`でテーマカラーを変更することができる

```styl
// サンプル
$accentColor = #28A6CF
$textColor = #2c3e50
$borderColor = #eaecef
$codeBgColor = #282c34
```

### その他

- 公式サイトが充実しているのでそちらを参照
    - [https://vuepress.vuejs.org/](https://vuepress.vuejs.org/)
