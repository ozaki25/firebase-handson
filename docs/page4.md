# 4.作成したページを公開してみよう

## ゴール

- 3章までに作成したページが公開できていること
- 自分のスマホでアクセスしGoogle認証ができること

## Firebase Hosting

- せっかくWebアプリを作成したのでページを公開して自分のスマホからアクセスしてみます
- FirebaseはWebページを公開するHostingの機能も備えています

### 設定ファイルの作成

- アップロードに必要な設定ファイルを作成します
- プロジェクト直下(`package.json`などと同じ階層)に`firebase.json`を作成します

```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### アプリのビルド

- 今までは開発モード`npm start`で動かしていましたが、デプロイするためにビルドをします

```sh
npm run build
```

- 完了後`build`ディレクトリが作成されその中に成果物が配置されます

### デプロイする

- デプロイコマンドを実行するためのCLIをインストールします
    - これをいれると`firebase`コマンドが使えるようになる

```sh
npm install -g firebase-tools
```

- コマンドラインでFirebaseにログインします

```sh
firebase login
```

- 実行すると`? Allow Firebase to collect CLI usage and error reporting information?`と聞かれるので`y`を入力します
- そうするとWebページが開くのでGoogleアカウントにログインして下さい
- `✔  Success! Logged in as xxxxx@gmail.com`が表示されればOKです
- 最後にデプロイします

```sh
firebase deploy
```

- `✔  Deploy complete!`が出ればOKです
- `Hosting URL: https://プロジェクトID.firebaseapp.com`といった形でURLも表示されているはずです
    - このURLにアクセスし正常に動作することを確認しましょう

## スマホからアクセスしてみる

- PCから正常動作できたら自分のスマホにURLを打ち込んでGoogle認証できるか試してみましょう
