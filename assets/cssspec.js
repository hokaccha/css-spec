$(function() {
  // 結果描画用DOM
  var $result = $('#css_spec_result');

  $.getJSON('config.json').done(function(config) {

    // テスト対象のCSSを読み込む
    var $link = $('<link>').attr({
      rel: 'stylesheet',
      href: config.target
    }).appendTo('head');

    $link.on('load', function() {
      // specファイルを一続処理する
      (function loop() {
        var spec = config.specs.shift();
        if (!spec) return;

        $('<div>').addClass('specPath').text(spec).appendTo($result);

        var htmlPath = spec + '_spec.html';
        var cssPath = '../' + spec + '_spec.css';

        // spec用のHTMLを取ってきてDOMに追加
        $.get(htmlPath).done(function(html) {
          $('#css_spec_html').html(html);

          // iframeをつくってその中でspec用のCSSをパースしてpostMessageで返す
          var $iframe = $('<iframe>').attr({
            width: 0,
            height: 0,
            frameborder: 0,
            src: 'assets/iframe.html'
          });

          $iframe.on('load', function() {
            $iframe.get(0).contentWindow.postMessage({ cssPath: cssPath }, '*');
          });

          // iframeから返ってくる結果を描画する
          window.addEventListener('message', function handler(e) {
            window.removeEventListener('message', handler);
            Object.keys(e.data).forEach(function(k) {
              var item = e.data[k];
              var $el = $(item.selector);
              $('<div>').addClass('selector').text(item.selector).appendTo($result);
              Object.keys(item.styles).forEach(function(prop) {
                var expected = item.styles[prop];
                var actual = $el.css(prop);
                if (actual === expected) {
                  $('<div>').addClass('ok').text(prop + ': ' + expected + ';').appendTo($result);
                }
                else {
                  $('<div>').addClass('ng').text(prop + ': ' + expected + ';  actual: ' + actual).appendTo($result);
                }
              });
            });
            loop();
          });

          $('body').append($iframe);
        });
      })();
    });
  });
});
