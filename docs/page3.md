# 3.ログイン機能を持ったアプリを作る

## ゴール

- 認証前にアクセスするとログインページが表示されること
- 認証後にアクセスするとWelcomeページが表示されること

## 認証状態による画面の出し分け

- Google認証が済んでいるかどうかで画面の出し分けをするように修正します
- `src/App.js`を修正します

```jsx
// 省略

function App() {
  // ユーザ情報を格納する変数userとuserに値をセットする関数setUserを定義
  // useStateの引数で渡しているnullはuserの初期値
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // 認証が成功したタイミングで呼ばれる処理
    firebase.auth().onAuthStateChanged(user => {
      console.log(user.providerData);
      // ユーザ情報をセット
      setUser(user);
    });
  }, []);

  // userがnullかどうかで画面を出し分け
  // 条件式 ? trueの場合の戻り値 : falseの場合の戻り値
  return user ? (
    // ユーザに値が入っている(認証済み)状態であればWelcomeを表示
    <div>
      <h1>Welcome!</h1>
    </div>
  ) : (
    // ユーザに値が入っていない(認証未済み)状態であればログイン画面を表示
    <div>
      <h1>Hello</h1>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
}

export default App;
```

- ログアウト機能をまだ実装していないので一度ログインするとWelcomeしかでなくなります
- ブラウザをプライベートウィンドウで開くと未ログインの状態でアクセスできます

![private window](/images/3/3-1.png)

- うまくいっていればログインごWelcomeが表示されます

![login](/images/3/3-2.gif)

- `useState`によって定義したsetter(ここでは`setUser`)を使うと自動で画面の再評価が実行されます
    - つまり今回でいうと`setUser`を実行するとreturn文の`user ? ... : ...`の部分も再評価され画面の出し分けが実現できているというわけです

## ログアウト機能を追加する

- Welcome画面にSignOutボタンを設置してクリックしたらログアウトできるようにします
- `src/App.js`を修正します

```jsx
// 省略

function App() {
  const [user, setUser] = React.useState(null);

  // ログアウト用の関数を定義
  const signOut = () => {
    setUser(null);
    firebase.auth().signOut();
  };

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user);
    });
  }, []);

  return user ? (
    <div>
      <h1>Welcome!</h1>
      {/* SignOutボタンを設置しclickした時にsignOut関数が呼ばれるように設定 */}
      <button onClick={signOut}>SignOut</button>
    </div>
  ) : (
    <div>
      <h1>Hello</h1>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
}

export default App;
```

- SignOutボタンを推すとログアウトできるようになりました

![logout](/images/3/3-2.gif)

- ログインの時と同様で`setUser`によって`user`が更新されると、画面の再評価が走りログイン画面に書き換えられるという動きをしています

## Welcome画面にユーザ情報を表示する

- 最後にログイン後のWelcome画面にGoogleから取得したユーザ情報を表示してみます
- `src/App.js`を修正します

```jsx
// 省略

  return user ? (
    <div>
      <h1>Welcome!</h1>
      <div>
        <img src={user.photoURL} alt="user icon" width="60" height="60" />
        <p>名前: {user.displayName}</p>
        <p>メールアドレス: {user.email}</p>
        {/* || でつなげることでnullだった場合に表示する内容を設定できる */}
        <p>電話番号: {user.phoneNumber || '登録なし'}</p>
      </div>
      <button onClick={signOut}>SignOut</button>
    </div>
  ) : (
    <div>
      <h1>Hello</h1>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
}

export default App;
```

- 再度アクセスしてみるとユーザ情報が表示されているはずです

![show user info](/images/3/3-4.png)

- ここまでできれば完成です

## リファクタリング(任意)

- 動作としてはこれで完成ですが、Reactらしくリファクタリングしてみます
- 時間がない人は先に4章をやった方が面白いのでスキップして下さい

### コンポーネントを分割する

- 今のままでは表示するコンテンツの量が増えると`App.js`がどんどん膨らんでしまいます
- なのでログイン画面とWelcome画面を別のコンポーネントに分割してみます

#### Loginコンポーネントの作成

- `src`フォルダに`pages`ディレクトリを作成します
- 作成した`pages`の中に`Login.js`を作成します
- `src/pages/Login.js`は以下の内容を記述してください

```jsx
import React from 'react';
import firebase from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

// 引数でsignInを受け取る
function Login({ signIn }) {
  React.useEffect(() => {
    // Google認証が完了したら引数で受け取ったsignInを実行する
    firebase.auth().onAuthStateChanged(signIn);
  }, [signIn]);

  return (
    <div>
      <h1>Hello</h1>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
}

export default Login;
```

- ほとんど`App.js`から切り出したものです
- 引数で`signIn`という関数を受け取り認証後にそれを実行しています
    - ログイン済みかどうかの管理(=userが空かどうかの管理)は`App.js`で行うため`setUser`の処理はLoginコンポーネントの呼び出し元から渡すようにしています
- `src/App.js`でLoginコンポーネントを使うように修正します

```jsx
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

// Loginコンポーネントをimport
import Login from './pages/Login';

const config = {
  apiKey: 'AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  authDomain: 'fir-handson-oz.firebaseapp.com',
};

firebase.initializeApp(config);

// Login.jsの移動した部分を削除

function App() {
  const [user, setUser] = React.useState(null);

  const signOut = () => {
    setUser(null);
    firebase.auth().signOut();
  };

  return user ? (
    <div>
      <h1>Welcome!</h1>
      <div>
        <img src={user.photoURL} alt="user icon" width="60" height="60" />
        <p>名前: {user.displayName}</p>
        <p>メールアドレス: {user.email}</p>
        <p>電話番号: {user.phoneNumber || '登録なし'}</p>
      </div>
      <button onClick={signOut}>SignOut</button>
    </div>
  ) : (
    // Loginコンポーネントを使用
    <Login signIn={setUser} />
  );
}

export default App;
```

- この状態でこれまでと同じ動作をすることを確認してください
- 問題なければ次に進みます

#### Welcomeコンポーネントの作成

- 次にログイン後に表示するWelcomeコンポーネントを作成します
- `src/pages/Welcome.js`を作成し以下の内容を記述してください

```jsx
import React from 'react';

function Welcome({ user, signOut }) {
  return (
    <div>
      <h1>Welcome!</h1>
      <div>
        <img src={user.photoURL} alt="user icon" width="60" height="60" />
        <p>名前: {user.displayName}</p>
        <p>メールアドレス: {user.email}</p>
        <p>電話番号: {user.phoneNumber || '登録なし'}</p>
      </div>
      <button onClick={signOut}>SignOut</button>
    </div>
  );
}

export default Welcome;
```

- 画面に表示するユーザ情報である`user`とSignOutボタンを押した時に実行する`signOut`を引数で受け取っています
- `src/App.js`でWelcomeコンポーネントを使うように修正します

```jsx
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

import Login from './pages/Login';
// Welcomeコンポーネントをimport
import Welcome from './pages/Welcome';

const config = {
  apiKey: 'AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  authDomain: 'fir-handson-oz.firebaseapp.com',
};

firebase.initializeApp(config);

function App() {
  const [user, setUser] = React.useState(null);

  const signOut = () => {
    setUser(null);
    firebase.auth().signOut();
  };

  return user ? (
    // Welcomeコンポーネントを使用
    <Welcome user={user} signOut={signOut} />
  ) : (
    <Login signIn={setUser} />
  );
}

export default App;
```

- この状態でこれまでと同じ動作をすることを確認してください
- 問題なければリファクタリング完了です
- 責務ごとにコンポーネントを分割することで見通しがよくなりました
- 今後は各コンポーネントの中が複雑化したり、画面をまたいで使い回せる共通部品などがでてきたら更に細かくコンポーネント分割していくとよいです

## 補足

- 今回の構成ではログイン前と後の2画面でしたがそれ以上画面数が増えると今のやり方では実現が難しくなります
- そういった場合は[React Router](https://reacttraining.com/react-router/)という画面遷移を管理するライブラリを使うとよいです

