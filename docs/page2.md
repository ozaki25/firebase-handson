# ReactでWebアプリを作る

## ゴール

- ReactとFirebaseでログイン機能を実装する

## Reactアプリの雛形作成

### 登場するライブラリ

- [Create React App](https://create-react-app.dev/)
    - Reactアプリの雛形を生成するライブラリ

### Create React Appでプロジェクトを生成する

- 任意のディレクトリで以下のコマンドを実行

```sh
npx create-react-app firebase-handson
```

- プロジェクトの生成が完了したら作成されたディレクトリに移動

```sh
cd firebase-handson
```

- アプリを起動してみる
    - 止めるときは`Ctl+c`

```sh
npm start
```

- [http://localhost:3000](http://localhost:3000)にアクセスすることで確認できる

![create react app](/images/2/2-1.png)

- 画面に表示された情報(HTMLなど)は`src/App.js`にかかれている

```jsx
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

## ReactからFirebaseにアクセスするためのセットアップ

### 登場するライブラリ

- [firebase](https://github.com/firebase/firebase-js-sdk)
    - FirebaseのJavaScript用SDK
- [firebaseui](https://github.com/firebase/firebaseui-web)
    - WebでFirebase Authenticationを簡単に使うためのライブラリ
    - SNS認証用のボタンの見た目や認証先との連携処理などを提供してくれる
- [react-firebaseui](https://github.com/firebase/firebaseui-web-react)
    - ReactでFirebaseUIを簡単に使うためのライブラリ
    - FirebaseUIを内包してる

### ライブラリのインストール

- Firebaseへアクセスするために必要なライブラリをインストールする

```sh
npm i firebase react-firebaseui
```

- インストールされたライブラリは`node_modules`配下に追加される
    - ライブラリが依存するライブラリも含まれるため明示的に追加していないライブラリも入っている
- 追加したライブラリは`package.json`の`dependencies`の項目に追記される
    - `node_modules`はサイズが大きすぎるのでリポジトリ管理しないのが一般的
    - `dependencies`に依存ライブラリが書かれているので、それを元にすることで`node_modules`の状態を再現できる

```json
  "dependencies": {
    "@testing-library/jest-dom": "^4.2.4",
    "@testing-library/react": "^9.3.2",
    "@testing-library/user-event": "^7.1.2",
    "firebase": "^7.7.0",
    "react": "^16.12.0",
    "react-dom": "^16.12.0",
    "react-firebaseui": "^4.1.0",
    "react-scripts": "3.3.0"
  },
```

### 不要なコードの削除

- この後`src/App.js`を修正していくことになりますが、ノイズを減らすために不要な情報を消しておきます
    - 以下の内容に書き換えておいて下さい

```jsx
import React from 'react';

function App() {
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
}

export default App;
```

- アプリを起動して画面に`Hello`と表示されていればOKです

### Firebaseにアクセスする設定の追加

- Firebaseにアクセスするためには自身で作成したFirebaseプロジェクトのキー情報などが必要になります
- FirebaseのWebコンソールを開いて「&#x2699;」->「プロジェクトの設定」を選択

![project settings link](/images/2/2-2.png)

- 「全般」タブの中の「プロジェクトID」と「ウェブAPIキー」の情報をこの後使います

![id and key](/images/2/2-3.png)

- `src/App.js`を以下のように修正します

```jsx
import React from 'react';
// firebaseのSDKをimport
import firebase from 'firebase/app';

const config = {
  // ウェブAPIキーの値
  apiKey: 'AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  // プロジェクトIDの値.firebaseapp.com
  authDomain: 'fir-handson-oz.firebaseapp.com',
};

// Firebase接続のための初期化処理
firebase.initializeApp(config);

// 以下省略
```

- これでFirebaseにアクセスするための設定ができました

### FirebaseUIの設定を追加

- FirebaseのAuthenticationの機能を使うにあたりFirebaseUIを使います
    - FirebaseUIを使わず全部自前で実装すると実装がけっこう大変
- 今回はFirebaseUIをReactで使うためのreact-firebaseuiを使っていきます
- `src/App.js`に設定を追加します

```jsx
import React from 'react';
import firebase from 'firebase/app';
// firebaseのauth機能をimport
import 'firebase/auth';
// react-firebaseuiが提供するSNS認証用のボタンコンポーネントをimport
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const config = {
  apiKey: 'AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  authDomain: 'fir-handson-oz.firebaseapp.com',
};

firebase.initializeApp(config);

// FirebaseUIの設定
const uiConfig = {
  // 認証画面の出し方を設定(popup/redirect)
  signInFlow: 'popup',
  // 認証成功後に表示するページのURL(今回は認証前と同じページに返すので省略でもOK)
  signInSuccessUrl: '/',
  // 連携したいサービスの情報を設定(今回はGoogleだけ使うので1つだけ設定)
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

function App() {
  return (
    <div>
      <h1>Hello</h1>
      {/* ボタンコンポーネントを配置し必要な情報も設定 */}
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
}

export default App;
```

- この状態で画面を開いてみるとGoogleボタンが表示されているはずです

![google button](/images/2/2-4.png)

- ちなみに今回はGoogleしか使いませんが、`signInOptions`に複数設定するとその分だけボタンが表示されます

```js
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  ],
```

![sns buttons](/images/2/2-5.png)
