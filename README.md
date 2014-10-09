# CSS Spec

CSSのテストライブラリ。アイデア段階。

## アイデア

ブロックやコンポーネントと呼ばれるような単位で、記述したCSSが期待通りに振る舞うかを検証する（一般的なプログラミングにおけるユニットテストの単位）。

例えば次のような`.header`モジュールのSCSSがあるとする。

```scss
/* app.scss */
.header {
  width: $content_width;
  height: $header_height;
  background-color: $color1;
  position: relative;

  .header__logo {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .header__text {
    position: absolute;
    top: 10px;
    left: 120px;
  }
}
```

これを検証するために次のようなHTMLとCSSを書く。

```css
/* header_spec.css */
.header {
  width: 600px;
  height: 120px;
  position: relative;
  background-color: #CCC;
}

.header__logo {
  position: absolute;
  top: 10px;
  left: 10px;
}

.header__text {
  position: absolute;
  top: 10px;
  left: 120px;
}
```

```html
<!-- header_spec.html -->
<div class="header">
  <img src="logo.png" alt="logo" class="header__logo">
  <div class="header__text">MY SITE</div>
</div>
```

テスト対象のCSS（`app.scss`をコンパイルした`app.css`）を読み込み、テストのためのHTML（`header_spec.html`）をレンダリング、そのHTMLの要素にテストのCSS（`header_spec.css`）に記述した値が最終的に適用されているかを検証する。

## 実装案

http://hokaccha.github.io/css-spec/spec-runner.html

## 解決すること

CSSが期待通りあたっているかどうかをCSSで検証するだけなので、無意味に思えるが、SCSSやStylusなどではextendやmixin、変数などを使いまくると期待通りのCSSになっているか確認するのが大変になる。

このツールはその問題を解決できるかもしれない。実際に期待するCSSを予め記載しておくことによって、共通な処理をmixinにしたり、extendにするなどしても結果が変わらないことが保証できる。これによってプログラムのリファクタリングにおけるユニットテストのような役割が期待できる。

また、HTMLとCSSをセットで確認するので、コードとレンダリング結果を表示すればスタイルガイドにもなって一石二鳥にできるかも。

## 問題点

* CSSは普通のプログラムと違って細かい数値の変更などが頻繁になるのでテストをメンテナンスするコストに対するリターンが見合わない可能性がある
* CSSで`%`や`auto`のように指定しても、JavaScriptで取得できるCSSの値はピクセルなどに変換された値なので、そのへんをうまいことやる必要がありそう
* ブロック単位を検証することを目的としているので、「このブロックをどこに置いても同じように振る舞う」という保証はできない（問題点というよりこのライブラリの責任の範囲外）
